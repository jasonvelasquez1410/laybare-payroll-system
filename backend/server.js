const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const { parseNGTecoFile } = require('./parser');
const { processDailyAttendance } = require('./engine');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Set up file upload destination (Memory storage for Vercel)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Database on startup
db.initDb().then(() => {
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// API Routes

// 1. Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM employees ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add an employee
app.post('/api/employees', async (req, res) => {
  const { id, name, branch, rate, taxStatus } = req.body;
  try {
    await db.query(
      'INSERT INTO employees (id, name, branch, rate, tax_status) VALUES ($1, $2, $3, $4, $5)',
      [id, name, branch, rate || 0, taxStatus || 'S']
    );
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Upload and Ingest NGTeco spreadsheet
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const { payPeriod, records } = parseNGTecoFile(req.file.buffer);

    const results = [];
    
    // Begin transaction-like operations for each record
    for (const record of records) {
      // Check if employee exists, if not, create them with default rate
      const empCheck = await db.query('SELECT id FROM employees WHERE id = $1', [record.employeeId]);
      if (empCheck.length === 0) {
        await db.query(
          'INSERT INTO employees (id, name, branch, rate, tax_status) VALUES ($1, $2, $3, $4, $5)',
          [record.employeeId, record.employeeName, 'Branch X', 570, 'S']
        );
      }

      // Save raw punches if not already saved
      if (record.in) {
        const rawCheckIn = await db.query(
          'SELECT id FROM raw_punches WHERE employee_id = $1 AND punch_time = $2 AND punch_type = $3',
          [record.employeeId, `${record.date} ${record.in}`, 'IN']
        );
        if (rawCheckIn.length === 0) {
          await db.query(
            'INSERT INTO raw_punches (employee_id, punch_time, punch_type, source) VALUES ($1, $2, $3, $4)',
            [record.employeeId, `${record.date} ${record.in}`, 'IN', 'Manual Upload']
          );
        }
      }

      if (record.out) {
        const rawCheckOut = await db.query(
          'SELECT id FROM raw_punches WHERE employee_id = $1 AND punch_time = $2 AND punch_type = $3',
          [record.employeeId, `${record.date} ${record.out}`, 'OUT']
        );
        if (rawCheckOut.length === 0) {
          await db.query(
            'INSERT INTO raw_punches (employee_id, punch_time, punch_type, source) VALUES ($1, $2, $3, $4)',
            [record.employeeId, `${record.date} ${record.out}`, 'OUT', 'Manual Upload']
          );
        }
      }

      // Run Rules Engine
      const calculation = processDailyAttendance(record.date, record.in, record.out, record.note);

      // Check if daily_attendance record exists for this employee and date
      const attendanceCheck = await db.query(
        'SELECT id FROM daily_attendance WHERE employee_id = $1 AND date = $2',
        [record.employeeId, record.date]
      );

      if (attendanceCheck.length > 0) {
        // Update existing record
        await db.query(
          `UPDATE daily_attendance 
           SET calculated_in = $1, calculated_out = $2, regular_hours = $3, 
               late_minutes = $4, undertime_minutes = $5, ot_hours = $6, 
               nd_hours = $7, status = $8, notes = $9 
           WHERE employee_id = $10 AND date = $11`,
          [
            calculation.calculatedIn, calculation.calculatedOut, calculation.regularHours,
            calculation.lateMinutes, calculation.undertimeMinutes, calculation.otHours,
            calculation.ndHours, calculation.status, calculation.notes,
            record.employeeId, record.date
          ]
        );
      } else {
        // Insert new record
        await db.query(
          `INSERT INTO daily_attendance 
           (employee_id, date, calculated_in, calculated_out, regular_hours, 
            late_minutes, undertime_minutes, ot_hours, nd_hours, status, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            record.employeeId, record.date, calculation.calculatedIn, calculation.calculatedOut,
            calculation.regularHours, calculation.lateMinutes, calculation.undertimeMinutes,
            calculation.otHours, calculation.ndHours, calculation.status, calculation.notes
          ]
        );
      }

      results.push({
        employeeId: record.employeeId,
        name: record.employeeName,
        date: record.date,
        ...calculation
      });
    }

    res.json({
      message: 'Ingestion completed successfully.',
      payPeriod,
      recordsIngested: results.length,
      preview: results.slice(0, 10) // Send first 10 for quick preview
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Parsing failed: ${err.message}` });
  }
});

// 4. Get attendance records with filters (date range, status, employee)
app.get('/api/attendance', async (req, res) => {
  const { startDate, endDate, status, employeeId } = req.query;
  let sql = `
    SELECT d.*, e.name as employee_name, e.branch, e.rate
    FROM daily_attendance d
    JOIN employees e ON d.employee_id = e.id
    WHERE 1=1
  `;
  const params = [];
  let paramCount = 1;

  if (startDate) {
    sql += ` AND d.date >= $${paramCount}`;
    params.push(startDate);
    paramCount++;
  }
  if (endDate) {
    sql += ` AND d.date <= $${paramCount}`;
    params.push(endDate);
    paramCount++;
  }
  if (status) {
    sql += ` AND d.status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }
  if (employeeId) {
    sql += ` AND d.employee_id = $${paramCount}`;
    params.push(employeeId);
    paramCount++;
  }

  sql += ' ORDER BY d.date DESC, e.name ASC';

  try {
    const rows = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Flagged anomalies (Exception Dashboard)
app.get('/api/exceptions', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT d.*, e.name as employee_name, e.branch 
      FROM daily_attendance d
      JOIN employees e ON d.employee_id = e.id
      WHERE d.status = 'Flagged'
      ORDER BY d.date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Update/Override exception punch times
app.post('/api/exceptions/override', async (req, res) => {
  const { employeeId, date, calculatedIn, calculatedOut, status, notes } = req.body;

  try {
    // If customized in/out are supplied, re-run rules engine calculation
    let calculation = {
      calculatedIn,
      calculatedOut,
      regularHours: 0,
      lateMinutes: 0,
      undertimeMinutes: 0,
      otHours: 0,
      ndHours: 0,
      status: status || 'Approved',
      notes: notes || 'Override approved'
    };

    if (calculatedIn && calculatedOut) {
      calculation = processDailyAttendance(date, calculatedIn, calculatedOut, notes || 'HR Override');
      if (status) calculation.status = status; // override calculated status if explicitly requested
    }

    await db.query(
      `UPDATE daily_attendance 
       SET calculated_in = $1, calculated_out = $2, regular_hours = $3, 
           late_minutes = $4, undertime_minutes = $5, ot_hours = $6, 
           nd_hours = $7, status = $8, notes = $9 
       WHERE employee_id = $10 AND date = $11`,
      [
        calculation.calculatedIn, calculation.calculatedOut, calculation.regularHours,
        calculation.lateMinutes, calculation.undertimeMinutes, calculation.otHours,
        calculation.ndHours, calculation.status, calculation.notes,
        employeeId, date
      ]
    );

    res.json({ message: 'Attendance overridden and re-calculated successfully.', updated: calculation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Tardiness modules (Grouped tardiness)
app.get('/api/tardiness', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT e.id as employee_id, e.name as employee_name, e.branch,
             count(case when d.late_minutes > 0 then 1 end) as late_count,
             sum(d.late_minutes) as total_late_minutes
      FROM employees e
      LEFT JOIN daily_attendance d ON e.id = d.employee_id
      GROUP BY e.id, e.name, e.branch
      ORDER BY late_count DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Generate Gross-to-Net Payroll for a given date range
app.get('/api/payroll', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required.' });
  }

  try {
    // Get all attendance logs for period
    const attendanceLogs = await db.query(`
      SELECT d.*, e.name as employee_name, e.branch, e.rate, e.tax_status
      FROM daily_attendance d
      JOIN employees e ON d.employee_id = e.id
      WHERE d.date >= $1 AND d.date <= $2
    `, [startDate, endDate]);

    // Group logs by employee
    const payrollByEmployee = {};

    for (const log of attendanceLogs) {
      if (!payrollByEmployee[log.employee_id]) {
        payrollByEmployee[log.employee_id] = {
          employeeId: log.employee_id,
          employeeName: log.employee_name,
          branch: log.branch,
          dailyRate: log.rate,
          taxStatus: log.tax_status,
          daysPresent: 0,
          daysAbsent: 0,
          totalLateMins: 0,
          totalUndertimeMins: 0,
          totalOtHours: 0,
          totalNdHours: 0,
          regularHoursWorked: 0
        };
      }

      const emp = payrollByEmployee[log.employee_id];
      if (log.status === 'Present' || log.status === 'Approved' || log.status === 'Flagged') {
        emp.daysPresent += 1;
        emp.totalLateMins += log.late_minutes || 0;
        emp.totalUndertimeMins += log.undertime_minutes || 0;
        emp.totalOtHours += log.ot_hours || 0;
        emp.totalNdHours += log.nd_hours || 0;
        emp.regularHoursWorked += log.regular_hours || 0;
      } else if (log.status === 'Absent') {
        emp.daysAbsent += 1;
      }
    }

    // Perform gross-to-net calculations
    const payrollSummary = Object.values(payrollByEmployee).map(emp => {
      const hourlyRate = emp.dailyRate / 8;
      
      // Basic Pay = Daily Rate * Days Present
      const basicPay = Number((emp.dailyRate * emp.daysPresent).toFixed(2));
      
      // OT Pay (1.25 multiplier)
      const otPay = Number((emp.totalOtHours * hourlyRate * 1.25).toFixed(2));
      
      // Night Differential Pay (10% premium, multiplier 0.10)
      const ndPay = Number((emp.totalNdHours * hourlyRate * 0.10).toFixed(2));
      
      // Deductions for Lates & Undertimes
      const lateDeduction = Number((emp.totalLateMins * (hourlyRate / 60)).toFixed(2));
      const undertimeDeduction = Number((emp.totalUndertimeMins * (hourlyRate / 60)).toFixed(2));
      const totalTardinessDeduction = Number((lateDeduction + undertimeDeduction).toFixed(2));

      // Gross Pay
      const grossPay = Number((basicPay + otPay + ndPay - totalTardinessDeduction).toFixed(2));

      // Government Deductions (Simplified Ph standard model)
      // SSS (approx 4.5%), PhilHealth (approx 2%), Pag-IBIG (flat 100)
      const sss = grossPay > 0 ? Number((grossPay * 0.045).toFixed(2)) : 0;
      const philhealth = grossPay > 0 ? Number((grossPay * 0.02).toFixed(2)) : 0;
      const pagibig = grossPay > 0 ? 100.00 : 0;

      // Withholding Tax (simplified: 10% on gross taxable income exceeding PHP 10,000 per semi-monthly, or 5% of gross if > 5000)
      let tax = 0;
      const taxableIncome = grossPay - (sss + philhealth + pagibig);
      if (taxableIncome > 10000) {
        tax = Number((taxableIncome * 0.10).toFixed(2));
      } else if (taxableIncome > 5000) {
        tax = Number((taxableIncome * 0.05).toFixed(2));
      }

      const totalDeductions = Number((sss + philhealth + pagibig + tax).toFixed(2));
      const netPay = Number((grossPay - totalDeductions).toFixed(2));

      return {
        ...emp,
        calculations: {
          basicPay,
          otPay,
          ndPay,
          lateDeduction,
          undertimeDeduction,
          totalTardinessDeduction,
          grossPay,
          deductions: {
            sss,
            philhealth,
            pagibig,
            tax,
            totalDeductions
          },
          netPay
        }
      };
    });

    res.json(payrollSummary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

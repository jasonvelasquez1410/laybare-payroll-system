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
// --- ALRAJJ LEGACY ERP - ACCOUNTING & FINANCIAL MANAGEMENT MODULE APIS ---

// Initial in-memory accounting data store for Vercel Serverless / SQLite persistence
let accountingData = {
  bankBalances: {
    bpiBizLink: 1428500.00,
    pettyCashCentrioWaxing: 25000.00,
    pettyCashPassionNails: 20000.00,
    pettyCashLimketkai: 25000.00,
    pettyCashSmDowntown: 20000.00,
  },
  journalEntries: [
    {
      id: 'JE-2026-0801',
      date: '2026-07-31',
      reference: 'PAYROLL-2026-07-B',
      type: 'Payroll Auto-Posting',
      description: 'Semi-Monthly Payroll Disbursement & Statutory Accruals (July 16-31, 2026)',
      branch: 'Consolidated',
      postedBy: 'Kristene (HR/Accounting)',
      status: 'Posted',
      lines: [
        { accountCode: '6010', accountName: 'Salaries & Wages Expense', debit: 68400.00, credit: 0 },
        { accountCode: '2020', accountName: 'Accrued Payroll Payable (BPI BizLink)', debit: 0, credit: 59350.00 },
        { accountCode: '2030', accountName: 'SSS Premiums Payable', debit: 0, credit: 3850.00 },
        { accountCode: '2031', accountName: 'PhilHealth Premiums Payable', debit: 0, credit: 1800.00 },
        { accountCode: '2032', accountName: 'Pag-IBIG Premiums Payable', debit: 0, credit: 800.00 },
        { accountCode: '2040', accountName: 'BIR Withholding Tax Payable (1601-C)', debit: 0, credit: 2600.00 }
      ]
    },
    {
      id: 'JE-2026-0802',
      date: '2026-08-01',
      reference: 'PO-2026-042',
      type: 'AP Supplier Invoice',
      description: 'Organic Cold Wax & Spatula Batch Delivery from Organic Honey Wax Imports',
      branch: 'Centrio Mall (Waxing)',
      postedBy: '3-Way PO Match Engine',
      status: 'Posted',
      lines: [
        { accountCode: '1040', accountName: 'Consumable Inventory - Wax Supplies', debit: 38500.00, credit: 0 },
        { accountCode: '2010', accountName: 'Accounts Payable - Trade Suppliers', debit: 0, credit: 38500.00 }
      ]
    },
    {
      id: 'JE-2026-0803',
      date: '2026-08-02',
      reference: 'POS-2026-0802-CEN',
      type: 'Daily POS Sales Closing',
      description: 'Daily Salon Point of Sale Collections (Cash, Maya QR, GCash, Card)',
      branch: 'Centrio Mall (Waxing)',
      postedBy: 'POS Auto-Reconcile',
      status: 'Posted',
      lines: [
        { accountCode: '1010', accountName: 'Cash in Register Drawer', debit: 24500.00, credit: 0 },
        { accountCode: '1015', accountName: 'Digital Wallets Clearing (Maya/GCash)', debit: 18200.00, credit: 0 },
        { accountCode: '4010', accountName: 'Waxing Service Revenue', debit: 0, credit: 36200.00 },
        { accountCode: '4030', accountName: 'Retail Product Sales (Balms & Scrubs)', debit: 0, credit: 6500.00 }
      ]
    },
    {
      id: 'JE-2026-0804',
      date: '2026-08-03',
      reference: 'EXP-RENT-2026-08',
      type: 'Commercial Lease',
      description: 'Ayala Centrio Mall Branch Space Lease & CUSA Dues for August 2026',
      branch: 'Centrio Mall (Waxing)',
      postedBy: 'Kristene (Accounting)',
      status: 'Posted',
      lines: [
        { accountCode: '6020', accountName: 'Store Rental & CUSA Expense', debit: 85000.00, credit: 0 },
        { accountCode: '1020', accountName: 'Cash in Bank - BPI BizLink Master', debit: 0, credit: 80750.00 },
        { accountCode: '2042', accountName: 'BIR Expanded Withholding Tax Payable (0619-E 5%)', debit: 0, credit: 4250.00 }
      ]
    }
  ],
  apInvoices: [
    {
      id: 'INV-2026-0101',
      poNumber: 'PO-2026-042',
      vendor: 'Organic Honey Wax Imports Inc.',
      branch: 'Centrio Mall (Waxing)',
      invoiceDate: '2026-08-01',
      dueDate: '2026-08-31',
      amount: 38500.00,
      status: 'Pending Approval',
      category: 'Wax Consumables',
      paymentTerms: 'Net 30',
      description: '500kg Organic Honey Wax + 2,000 Wooden Applicator Strips'
    },
    {
      id: 'INV-2026-0102',
      poNumber: 'PO-2026-043',
      vendor: 'OPI & Premium Gel Lacquers Ph',
      branch: 'Passion Nails (Centrio)',
      invoiceDate: '2026-08-03',
      dueDate: '2026-09-02',
      amount: 24800.00,
      status: 'Approved for Payment',
      category: 'Nail Supplies',
      paymentTerms: 'Net 30',
      description: 'Seasonal Gel Polish Sets, UV Top Coats & Acrylic Powders'
    },
    {
      id: 'INV-2026-0103',
      poNumber: 'LEASE-AYALA-08',
      vendor: 'Ayala Land Inc. (Centrio Mall Administration)',
      branch: 'Centrio Mall (Waxing & Nails)',
      invoiceDate: '2026-08-01',
      dueDate: '2026-08-15',
      amount: 125000.00,
      status: 'Scheduled BPI BizLink',
      category: 'Store Lease & CUSA',
      paymentTerms: 'Due upon Receipt',
      description: 'Space Rental 2nd Level Centrio Mall + Common Area Charges'
    },
    {
      id: 'INV-2026-0104',
      poNumber: 'PO-2026-039',
      vendor: 'Medisupply Hygienic Products Corp.',
      branch: 'SM Downtown Premier',
      invoiceDate: '2026-07-20',
      dueDate: '2026-08-19',
      amount: 16400.00,
      status: 'Paid',
      category: 'PPE & Sanitizers',
      paymentTerms: 'Net 30',
      description: 'Nitrile Gloves, Bed Liner Rolls, Antiseptic Cleaners'
    }
  ],
  posReconciliations: [
    {
      id: 'POS-REC-2026-0807-CEN',
      date: '2026-08-07',
      branch: 'Centrio Mall (Waxing)',
      shiftSupervisor: 'Cherimar Concigo',
      openingFloat: 5000.00,
      cashSales: 18450.00,
      mayaQrSales: 7800.00,
      gcashQrSales: 9200.00,
      cardTerminalSales: 11400.00,
      pettyCashExpenses: 450.00,
      expectedCashInDrawer: 23000.00,
      actualCashCounted: 23000.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'Perfect match. Petty cash was ₱450 for branch water refill.'
    },
    {
      id: 'POS-REC-2026-0807-PAS',
      date: '2026-08-07',
      branch: 'Passion Nails (Centrio)',
      shiftSupervisor: 'Cherry Rose Paculanang',
      openingFloat: 3000.00,
      cashSales: 14200.00,
      mayaQrSales: 5400.00,
      gcashQrSales: 6800.00,
      cardTerminalSales: 8900.00,
      pettyCashExpenses: 200.00,
      expectedCashInDrawer: 17000.00,
      actualCashCounted: 17000.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'Evening count verified by Manager.'
    },
    {
      id: 'POS-REC-2026-0807-KET',
      date: '2026-08-07',
      branch: 'Limketkai Mall',
      shiftSupervisor: 'Kristene HR',
      openingFloat: 5000.00,
      cashSales: 12800.00,
      mayaQrSales: 4100.00,
      gcashQrSales: 5300.00,
      cardTerminalSales: 6700.00,
      pettyCashExpenses: 150.00,
      expectedCashInDrawer: 17650.00,
      actualCashCounted: 17650.00,
      variance: 0.00,
      status: 'Reconciled & Balanced',
      auditNotes: 'All client receipts and digital transaction slips intact.'
    }
  ]
};

// 9. Accounting Summary & Executive KPIs
app.get('/api/accounting/summary', async (req, res) => {
  try {
    const summary = {
      cashAndEquivalents: {
        bpiBizLink: accountingData.bankBalances.bpiBizLink,
        pettyCashTotal: (
          accountingData.bankBalances.pettyCashCentrioWaxing +
          accountingData.bankBalances.pettyCashPassionNails +
          accountingData.bankBalances.pettyCashLimketkai +
          accountingData.bankBalances.pettyCashSmDowntown
        ),
        totalLiquidity: accountingData.bankBalances.bpiBizLink + 90000.00,
        branchFloats: [
          { branch: 'Centrio Mall (Waxing)', amount: accountingData.bankBalances.pettyCashCentrioWaxing },
          { branch: 'Passion Nails (Centrio)', amount: accountingData.bankBalances.pettyCashPassionNails },
          { branch: 'Limketkai Mall', amount: accountingData.bankBalances.pettyCashLimketkai },
          { branch: 'SM Downtown Premier', amount: accountingData.bankBalances.pettyCashSmDowntown }
        ]
      },
      performanceMTD: {
        grossRevenue: 1284650.00,
        cogs: 248300.00,
        grossProfit: 1036350.00,
        grossProfitMargin: 80.67,
        totalOpex: 582400.00,
        netOperatingIncome: 453950.00,
        netProfitMargin: 35.33,
        payrollCostMTD: 184500.00,
        mallLeasesMTD: 295000.00
      },
      pendingLiabilities: {
        accountsPayable: accountingData.apInvoices
          .filter(i => i.status !== 'Paid')
          .reduce((acc, curr) => acc + curr.amount, 0),
        accruedPayroll: 59350.00,
        statutoryTaxPayables: 64850.00
      },
      branchRevenueBreakdown: [
        { branch: 'Centrio Mall (Waxing)', revenue: 542100.00, share: 42.2 },
        { branch: 'Passion Nails (Centrio)', revenue: 318400.00, share: 24.8 },
        { branch: 'Limketkai Mall', revenue: 264150.00, share: 20.6 },
        { branch: 'SM Downtown Premier', revenue: 160000.00, share: 12.4 }
      ]
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Multi-Branch Profit & Loss Statement
app.get('/api/accounting/pl', async (req, res) => {
  try {
    const plData = {
      period: 'Month of August 2026 (MTD)',
      currency: 'PHP (₱)',
      branches: [
        {
          id: 'consolidated',
          name: 'ALRAJJ LEGACY Consolidated',
          revenue: {
            waxingServices: 792400.00,
            nailServices: 348250.00,
            retailProducts: 144000.00,
            totalRevenue: 1284650.00
          },
          cogs: {
            waxConsumables: 124500.00,
            nailGelsAndLacquers: 68400.00,
            ppeAndSanitizers: 32400.00,
            packagingAndBags: 23000.00,
            totalCogs: 248300.00
          },
          grossProfit: 1036350.00,
          grossMarginPct: 80.67,
          operatingExpenses: {
            salariesAndWages: 184500.00,
            storeRentsAndCusa: 295000.00,
            electricityAndWater: 48200.00,
            marketingAndLoyalty: 18500.00,
            maintenanceAndSanitation: 14200.00,
            depreciationEquipment: 22000.00,
            totalOpex: 582400.00
          },
          netOperatingIncome: 453950.00,
          netMarginPct: 35.33
        },
        {
          id: 'centrio-waxing',
          name: 'Centrio Mall (Waxing Salon)',
          revenue: {
            waxingServices: 462100.00,
            nailServices: 0.00,
            retailProducts: 80000.00,
            totalRevenue: 542100.00
          },
          cogs: {
            waxConsumables: 72500.00,
            nailGelsAndLacquers: 0.00,
            ppeAndSanitizers: 15400.00,
            packagingAndBags: 12000.00,
            totalCogs: 99900.00
          },
          grossProfit: 442200.00,
          grossMarginPct: 81.57,
          operatingExpenses: {
            salariesAndWages: 74200.00,
            storeRentsAndCusa: 110000.00,
            electricityAndWater: 19500.00,
            marketingAndLoyalty: 7500.00,
            maintenanceAndSanitation: 5800.00,
            depreciationEquipment: 8000.00,
            totalOpex: 225000.00
          },
          netOperatingIncome: 217200.00,
          netMarginPct: 40.07
        },
        {
          id: 'centrio-nails',
          name: 'Passion Nails (Centrio Mall)',
          revenue: {
            waxingServices: 0.00,
            nailServices: 284400.00,
            retailProducts: 34000.00,
            totalRevenue: 318400.00
          },
          cogs: {
            waxConsumables: 0.00,
            nailGelsAndLacquers: 52400.00,
            ppeAndSanitizers: 7500.00,
            packagingAndBags: 4500.00,
            totalCogs: 64400.00
          },
          grossProfit: 254000.00,
          grossMarginPct: 79.77,
          operatingExpenses: {
            salariesAndWages: 48500.00,
            storeRentsAndCusa: 75000.00,
            electricityAndWater: 12200.00,
            marketingAndLoyalty: 4500.00,
            maintenanceAndSanitation: 3800.00,
            depreciationEquipment: 6000.00,
            totalOpex: 150000.00
          },
          netOperatingIncome: 104000.00,
          netMarginPct: 32.66
        },
        {
          id: 'limketkai',
          name: 'Limketkai Mall Branch',
          revenue: {
            waxingServices: 210300.00,
            nailServices: 38850.00,
            retailProducts: 15000.00,
            totalRevenue: 264150.00
          },
          cogs: {
            waxConsumables: 34000.00,
            nailGelsAndLacquers: 9500.00,
            ppeAndSanitizers: 5500.00,
            packagingAndBags: 3800.00,
            totalCogs: 52800.00
          },
          grossProfit: 211350.00,
          grossMarginPct: 80.01,
          operatingExpenses: {
            salariesAndWages: 36800.00,
            storeRentsAndCusa: 65000.00,
            electricityAndWater: 9500.00,
            marketingAndLoyalty: 3800.00,
            maintenanceAndSanitation: 2800.00,
            depreciationEquipment: 4500.00,
            totalOpex: 122400.00
          },
          netOperatingIncome: 88950.00,
          netMarginPct: 33.67
        },
        {
          id: 'sm-downtown',
          name: 'SM Downtown Premier Branch',
          revenue: {
            waxingServices: 120000.00,
            nailServices: 25000.00,
            retailProducts: 15000.00,
            totalRevenue: 160000.00
          },
          cogs: {
            waxConsumables: 18000.00,
            nailGelsAndLacquers: 6500.00,
            ppeAndSanitizers: 4000.00,
            packagingAndBags: 2700.00,
            totalCogs: 31200.00
          },
          grossProfit: 128800.00,
          grossMarginPct: 80.50,
          operatingExpenses: {
            salariesAndWages: 25000.00,
            storeRentsAndCusa: 45000.00,
            electricityAndWater: 7000.00,
            marketingAndLoyalty: 2700.00,
            maintenanceAndSanitation: 1800.00,
            depreciationEquipment: 3500.00,
            totalOpex: 85000.00
          },
          netOperatingIncome: 43800.00,
          netMarginPct: 27.38
        }
      ]
    };
    res.json(plData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Balance Sheet Statement
app.get('/api/accounting/balance-sheet', async (req, res) => {
  try {
    const balanceSheet = {
      asOfDate: 'As of August 31, 2026',
      currency: 'PHP (₱)',
      assets: {
        currentAssets: {
          cashAndCashEquivalents: 1518500.00,
          accountsReceivable: 48200.00,
          consumableInventory: 185400.00,
          retailProductsInventory: 94600.00,
          prepaidMallLeaseDeposits: 380000.00,
          totalCurrentAssets: 2226700.00
        },
        nonCurrentAssets: {
          salonFixturesAndEquipment: 1450000.00,
          nailStationsAndSpaChairs: 680000.00,
          itAndBiometricHardware: 185000.00,
          accumulatedDepreciation: -420000.00,
          totalNonCurrentAssets: 1895000.00
        },
        totalAssets: 4121700.00
      },
      liabilities: {
        currentLiabilities: {
          accountsPayableVendors: 188300.00,
          accruedPayrollPayable: 59350.00,
          sssPhilhealthPagibigPayables: 24200.00,
          birWithholdingAndVatPayable: 40650.00,
          totalCurrentLiabilities: 312500.00
        },
        longTermLiabilities: {
          equipmentFinancingLoan: 250000.00,
          totalLongTermLiabilities: 250000.00
        },
        totalLiabilities: 562500.00
      },
      equity: {
        ownerContributedCapital: 2500000.00,
        retainedEarningsPrior: 605250.00,
        currentPeriodNetIncome: 453950.00,
        totalEquity: 3559200.00
      },
      totalLiabilitiesAndEquity: 4121700.00,
      isBalanced: true
    };
    res.json(balanceSheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. General Ledger Journal Entries
app.get('/api/accounting/journal-entries', async (req, res) => {
  try {
    res.json(accountingData.journalEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Create New Journal Entry (With Debit == Credit enforcement)
app.post('/api/accounting/journal-entries', async (req, res) => {
  const { date, reference, description, branch, postedBy, lines } = req.body;
  if (!lines || !Array.isArray(lines) || lines.length < 2) {
    return res.status(400).json({ error: 'Journal entry must contain at least 2 lines.' });
  }

  const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return res.status(400).json({
      error: `Out of balance: Total Debits (₱${totalDebit.toFixed(2)}) must equal Total Credits (₱${totalCredit.toFixed(2)})`
    });
  }

  const newEntry = {
    id: `JE-2026-${String(accountingData.journalEntries.length + 805).padStart(4, '0')}`,
    date: date || new Date().toISOString().split('T')[0],
    reference: reference || 'MANUAL-JE',
    type: 'Manual Journal Entry',
    description: description || 'General Ledger adjustment entry',
    branch: branch || 'Consolidated',
    postedBy: postedBy || 'Accounting Department',
    status: 'Posted',
    lines: lines.map(l => ({
      accountCode: l.accountCode,
      accountName: l.accountName,
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0
    }))
  };

  accountingData.journalEntries.unshift(newEntry);
  res.status(201).json({ message: 'Journal entry posted successfully to General Ledger', entry: newEntry });
});

// 14. Accounts Payable Invoices
app.get('/api/accounting/invoices', async (req, res) => {
  try {
    res.json(accountingData.apInvoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Pay Supplier Invoice via BPI BizLink
app.post('/api/accounting/invoices/pay', async (req, res) => {
  const { invoiceId, paymentMethod, referenceNumber } = req.body;
  const invoice = accountingData.apInvoices.find(i => i.id === invoiceId);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found.' });
  }

  invoice.status = 'Paid';
  invoice.paidAt = new Date().toISOString();
  invoice.paymentReference = referenceNumber || `BPI-BIZLINK-${Date.now().toString().slice(-6)}`;

  // Deduct from BPI Bank balance
  accountingData.bankBalances.bpiBizLink -= invoice.amount;

  // Auto-create GL Journal Entry for payment
  const paymentJe = {
    id: `JE-2026-${String(accountingData.journalEntries.length + 805).padStart(4, '0')}`,
    date: new Date().toISOString().split('T')[0],
    reference: invoice.paymentReference,
    type: 'AP BPI Disbursement',
    description: `Supplier settlement: ${invoice.vendor} (${invoice.description})`,
    branch: invoice.branch,
    postedBy: 'BPI BizLink Auto-Sync',
    status: 'Posted',
    lines: [
      { accountCode: '2010', accountName: 'Accounts Payable - Trade Suppliers', debit: invoice.amount, credit: 0 },
      { accountCode: '1020', accountName: 'Cash in Bank - BPI BizLink Master', debit: 0, credit: invoice.amount }
    ]
  };
  accountingData.journalEntries.unshift(paymentJe);

  res.json({
    message: `Invoice ${invoice.id} settled via BPI BizLink. General Ledger entry posted.`,
    invoice,
    journalEntry: paymentJe
  });
});

// 16. Daily POS Reconciliations
app.get('/api/accounting/pos-reconciliation', async (req, res) => {
  try {
    res.json(accountingData.posReconciliations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 17. Save Daily POS Cash Audit
app.post('/api/accounting/pos-reconciliation', async (req, res) => {
  const record = req.body;
  const newRec = {
    id: `POS-REC-2026-${Date.now().toString().slice(-6)}`,
    date: record.date || new Date().toISOString().split('T')[0],
    branch: record.branch,
    shiftSupervisor: record.shiftSupervisor,
    openingFloat: Number(record.openingFloat) || 0,
    cashSales: Number(record.cashSales) || 0,
    mayaQrSales: Number(record.mayaQrSales) || 0,
    gcashQrSales: Number(record.gcashQrSales) || 0,
    cardTerminalSales: Number(record.cardTerminalSales) || 0,
    pettyCashExpenses: Number(record.pettyCashExpenses) || 0,
    expectedCashInDrawer: Number(record.expectedCashInDrawer) || 0,
    actualCashCounted: Number(record.actualCashCounted) || 0,
    variance: Number(record.variance) || 0,
    status: Math.abs(Number(record.variance) || 0) === 0 ? 'Reconciled & Balanced' : 'Variance Flagged',
    auditNotes: record.auditNotes || 'Daily cash count submitted by branch shift supervisor.'
  };

  accountingData.posReconciliations.unshift(newRec);
  res.status(201).json({ message: 'POS Cash Reconciliation recorded.', record: newRec });
});

// 18. Philippine BIR & Statutory Tax Compliance Hub
app.get('/api/accounting/tax-summary', async (req, res) => {
  try {
    const taxData = {
      reportingMonth: 'August 2026',
      tin: '009-847-192-000',
      registeredEntity: 'ALRAJJ LEGACY Fortified Business Corp.',
      forms: [
        {
          formCode: 'BIR Form 1601-C',
          title: 'Monthly Remittance Return of Income Taxes Withheld on Compensation',
          dueDate: 'September 10, 2026',
          taxableBase: 184500.00,
          taxDue: 9225.00,
          status: 'Ready for Filing',
          source: 'Biometric Payroll Module'
        },
        {
          formCode: 'BIR Form 2550Q',
          title: 'Quarterly Value-Added Tax Return (Q3 2026)',
          dueDate: 'October 25, 2026',
          taxableBase: 1284650.00,
          taxDue: 35820.00,
          status: 'In Computation',
          source: 'Point of Sale & General Ledger'
        },
        {
          formCode: 'BIR Form 0619-E',
          title: 'Monthly Remittance Form for Expanded Withholding Tax (Rent & Services)',
          dueDate: 'September 10, 2026',
          taxableBase: 295000.00,
          taxDue: 14750.00,
          status: 'Ready for Filing',
          source: 'Commercial Mall Leases & AP Module'
        },
        {
          formCode: 'SSS / PhilHealth / HDMF',
          title: 'Monthly Statutory Contribution Remittances (MCR & Electronic RF-1)',
          dueDate: 'September 15, 2026',
          taxableBase: 184500.00,
          taxDue: 24200.00,
          status: 'BPI BizLink Scheduled',
          source: 'HR Payroll Master'
        }
      ]
    };
    res.json(taxData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export app for Vercel Serverless Functions
module.exports = app;

// Start Express Server only if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}


const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

let sqlite3 = null;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (err) {
  console.warn('sqlite3 native module not available. Falling back to in-memory database mode for Vercel Serverless environment.');
}

let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

// In-Memory Database fallback store
const inMemoryDb = {
  employees: [
    { id: 33, name: 'Justine Ann Atay', branch: 'Manila', rate: 600, tax_status: 'S' },
    { id: 34, name: 'Cherimar Concigo', branch: 'Manila', rate: 650, tax_status: 'S' },
    { id: 35, name: 'Kristene HR', branch: 'HQ', rate: 800, tax_status: 'S' },
    { id: 36, name: 'John Doe', branch: 'Cebu', rate: 550, tax_status: 'ME' }
  ],
  raw_punches: [],
  daily_attendance: []
};

// Determine DB type based on config
if (process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER)) {
  dbType = 'postgres';
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });
  console.log('Using PostgreSQL database.');
} else if (sqlite3) {
  dbType = 'sqlite';
  // On Vercel, use the writeable /tmp directory to avoid read-only filesystem errors
  const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'payroll.db')
    : path.join(__dirname, 'payroll.db');
  sqliteDb = new sqlite3.Database(dbPath);
  console.log(`Using SQLite database at: ${dbPath}`);
} else {
  dbType = 'memory';
  console.log('Using In-Memory Database store fallback.');
}

// In-Memory Query Emulator
function runInMemoryQuery(text, params) {
  const queryNormalized = text.trim().replace(/\s+/g, ' ').toLowerCase();

  // 1. SELECT count(*) as count FROM employees
  if (queryNormalized.includes('select count(*) as count from employees')) {
    return Promise.resolve([{ count: inMemoryDb.employees.length }]);
  }

  // 2. SELECT * FROM employees ORDER BY name
  if (queryNormalized.includes('select * from employees order by name')) {
    const list = [...inMemoryDb.employees].sort((a, b) => a.name.localeCompare(b.name));
    return Promise.resolve(list);
  }

  // 3. SELECT id FROM employees WHERE id = $1
  if (queryNormalized.includes('select id from employees where id =')) {
    const id = parseInt(params[0], 10);
    const found = inMemoryDb.employees.find(e => e.id === id);
    return Promise.resolve(found ? [{ id: found.id }] : []);
  }

  // 4. INSERT INTO employees (id, name, branch, rate, tax_status) VALUES ($1, $2, $3, $4, $5)
  if (queryNormalized.includes('insert into employees')) {
    const [id, name, branch, rate, tax_status] = params;
    const idx = inMemoryDb.employees.findIndex(e => e.id === parseInt(id, 10));
    const newEmp = { id: parseInt(id, 10), name, branch, rate: Number(rate), tax_status };
    if (idx >= 0) {
      inMemoryDb.employees[idx] = newEmp;
    } else {
      inMemoryDb.employees.push(newEmp);
    }
    return Promise.resolve({ insertId: id });
  }

  // 5. SELECT id FROM raw_punches WHERE employee_id = $1 AND punch_time = $2 AND punch_type = $3
  if (queryNormalized.includes('select id from raw_punches where employee_id =')) {
    const [empId, time, type] = params;
    const found = inMemoryDb.raw_punches.find(p => p.employee_id === parseInt(empId, 10) && p.punch_time === time && p.punch_type === type);
    return Promise.resolve(found ? [{ id: found.id }] : []);
  }

  // 6. INSERT INTO raw_punches (employee_id, punch_time, punch_type, source) VALUES ($1, $2, $3, $4)
  if (queryNormalized.includes('insert into raw_punches')) {
    const [employee_id, punch_time, punch_type, source] = params;
    const newPunch = {
      id: inMemoryDb.raw_punches.length + 1,
      employee_id: parseInt(employee_id, 10),
      punch_time,
      punch_type,
      source
    };
    inMemoryDb.raw_punches.push(newPunch);
    return Promise.resolve({ insertId: newPunch.id });
  }

  // 7. SELECT id FROM daily_attendance WHERE employee_id = $1 AND date = $2
  if (queryNormalized.includes('select id from daily_attendance where employee_id =')) {
    const [empId, date] = params;
    const found = inMemoryDb.daily_attendance.find(a => a.employee_id === parseInt(empId, 10) && a.date === date);
    return Promise.resolve(found ? [{ id: found.id }] : []);
  }

  // 8. UPDATE daily_attendance SET calculated_in = $1, calculated_out = $2 ... WHERE employee_id = $10 AND date = $11
  if (queryNormalized.includes('update daily_attendance')) {
    const [calculated_in, calculated_out, regular_hours, late_minutes, undertime_minutes, ot_hours, nd_hours, status, notes, empId, date] = params;
    const record = inMemoryDb.daily_attendance.find(a => a.employee_id === parseInt(empId, 10) && a.date === date);
    if (record) {
      record.calculated_in = calculated_in;
      record.calculated_out = calculated_out;
      record.regular_hours = Number(regular_hours);
      record.late_minutes = parseInt(late_minutes, 10);
      record.undertime_minutes = parseInt(undertime_minutes, 10);
      record.ot_hours = Number(ot_hours);
      record.nd_hours = Number(nd_hours);
      record.status = status;
      record.notes = notes;
    }
    return Promise.resolve({ affectedRows: record ? 1 : 0 });
  }

  // 9. INSERT INTO daily_attendance (employee_id, date, calculated_in, calculated_out, regular_hours, late_minutes, undertime_minutes, ot_hours, nd_hours, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  if (queryNormalized.includes('insert into daily_attendance')) {
    const [employee_id, date, calculated_in, calculated_out, regular_hours, late_minutes, undertime_minutes, ot_hours, nd_hours, status, notes] = params;
    const newAtt = {
      id: inMemoryDb.daily_attendance.length + 1,
      employee_id: parseInt(employee_id, 10),
      date,
      calculated_in,
      calculated_out,
      regular_hours: Number(regular_hours),
      late_minutes: parseInt(late_minutes, 10),
      undertime_minutes: parseInt(undertime_minutes, 10),
      ot_hours: Number(ot_hours),
      nd_hours: Number(nd_hours),
      status,
      notes
    };
    inMemoryDb.daily_attendance.push(newAtt);
    return Promise.resolve({ insertId: newAtt.id });
  }

  // 10. SELECT d.*, e.name as employee_name, e.branch, e.rate, e.tax_status FROM daily_attendance d JOIN employees e ON d.employee_id = e.id WHERE ...
  if (queryNormalized.includes('from daily_attendance d join employees e')) {
    let joined = inMemoryDb.daily_attendance.map(a => {
      const e = inMemoryDb.employees.find(emp => emp.id === a.employee_id) || {};
      return {
        ...a,
        employee_name: e.name || 'Unknown',
        branch: e.branch || 'Unknown',
        rate: e.rate || 0,
        tax_status: e.tax_status || 'S'
      };
    });

    if (queryNormalized.includes("d.status = 'flagged'")) {
      joined = joined.filter(row => row.status === 'Flagged');
    }

    if (queryNormalized.includes('d.date >= $1') && queryNormalized.includes('d.date <= $2')) {
      const [start, end] = params;
      joined = joined.filter(row => row.date >= start && row.date <= end);
    } else {
      let paramIdx = 0;
      if (queryNormalized.includes('d.date >= $')) {
        const start = params[paramIdx++];
        joined = joined.filter(row => row.date >= start);
      }
      if (queryNormalized.includes('d.date <= $')) {
        const end = params[paramIdx++];
        joined = joined.filter(row => row.date <= end);
      }
      if (queryNormalized.includes('d.status = $')) {
        const stat = params[paramIdx++];
        joined = joined.filter(row => row.status === stat);
      }
      if (queryNormalized.includes('d.employee_id = $')) {
        const empId = parseInt(params[paramIdx++], 10);
        joined = joined.filter(row => row.employee_id === empId);
      }
    }

    joined.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return a.employee_name.localeCompare(b.employee_name);
    });

    return Promise.resolve(joined);
  }

  // 11. SELECT e.id as employee_id, count(case when d.late_minutes > 0 then 1 end)...
  if (queryNormalized.includes('count(case when d.late_minutes > 0 then 1 end)')) {
    const list = inMemoryDb.employees.map(e => {
      const atts = inMemoryDb.daily_attendance.filter(a => a.employee_id === e.id);
      const lates = atts.filter(a => (a.late_minutes || 0) > 0);
      const totalLate = atts.reduce((sum, a) => sum + (a.late_minutes || 0), 0);
      return {
        employee_id: e.id,
        employee_name: e.name,
        branch: e.branch,
        late_count: lates.length,
        total_late_minutes: totalLate
      };
    });

    list.sort((a, b) => b.late_count - a.late_count);
    return Promise.resolve(list);
  }

  console.warn('Unhandled in-memory query:', text);
  return Promise.resolve([]);
}

// Helper to execute query
function query(text, params = []) {
  if (dbType === 'postgres') {
    return pgPool.query(text, params).then(res => res.rows);
  } else if (dbType === 'sqlite' && sqliteDb) {
    return new Promise((resolve, reject) => {
      let sqliteText = text;
      let paramCount = 1;
      while (sqliteText.includes(`$${paramCount}`)) {
        sqliteText = sqliteText.replace(`$${paramCount}`, '?');
        paramCount++;
      }

      const isSelect = sqliteText.trim().toLowerCase().startsWith('select');
      if (isSelect) {
        sqliteDb.all(sqliteText, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      } else {
        sqliteDb.run(sqliteText, params, function (err) {
          if (err) reject(err);
          else resolve({ insertId: this.lastID, affectedRows: this.changes });
        });
      }
    });
  } else {
    // Memory fallback
    return runInMemoryQuery(text, params);
  }
}

// Initialize tables
async function initDb() {
  if (dbType === 'memory') {
    console.log('In-memory database initialized with mock records.');
    return Promise.resolve();
  }

  const schemaSql = `
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      branch TEXT,
      rate REAL DEFAULT 0,
      tax_status TEXT DEFAULT 'S'
    );

    CREATE TABLE IF NOT EXISTS raw_punches (
      id INTEGER PRIMARY KEY ${dbType === 'postgres' ? 'GENERATED ALWAYS AS IDENTITY' : 'AUTOINCREMENT'},
      employee_id INTEGER NOT NULL,
      punch_time TEXT NOT NULL,
      punch_type TEXT NOT NULL,
      source TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_attendance (
      id INTEGER PRIMARY KEY ${dbType === 'postgres' ? 'GENERATED ALWAYS AS IDENTITY' : 'AUTOINCREMENT'},
      employee_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      calculated_in TEXT,
      calculated_out TEXT,
      regular_hours REAL DEFAULT 0,
      late_minutes INTEGER DEFAULT 0,
      undertime_minutes INTEGER DEFAULT 0,
      ot_hours REAL DEFAULT 0,
      nd_hours REAL DEFAULT 0,
      status TEXT,
      notes TEXT,
      UNIQUE(employee_id, date)
    );
  `;

  if (dbType === 'postgres') {
    await pgPool.query(schemaSql);
  } else if (dbType === 'sqlite' && sqliteDb) {
    await new Promise((resolve, reject) => {
      sqliteDb.exec(schemaSql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Populate mock employees if table is empty
  const employees = await query('SELECT count(*) as count FROM employees');
  const count = dbType === 'postgres' ? parseInt(employees[0].count) : employees[0].count;
  if (count === 0) {
    console.log('Populating initial mock employees...');
    const mockEmployees = [
      [33, 'Justine Ann Atay', 'Manila', 600, 'S'],
      [34, 'Cherimar Concigo', 'Manila', 650, 'S'],
      [35, 'Kristene HR', 'HQ', 800, 'S'],
      [36, 'John Doe', 'Cebu', 550, 'ME']
    ];
    for (const emp of mockEmployees) {
      await query('INSERT INTO employees (id, name, branch, rate, tax_status) VALUES ($1, $2, $3, $4, $5)', emp);
    }
  }
}

module.exports = {
  query,
  initDb,
  dbType
};

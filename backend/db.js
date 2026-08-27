const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dbType = 'sqlite';
let pgPool = null;
let sqliteDb = null;

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
} else {
  dbType = 'sqlite';
  // On Vercel, use the writeable /tmp directory to avoid read-only filesystem errors
  const dbPath = process.env.VERCEL
    ? path.join('/tmp', 'payroll.db')
    : path.join(__dirname, 'payroll.db');
  sqliteDb = new sqlite3.Database(dbPath);
  console.log(`Using SQLite database at: ${dbPath}`);
}

// Helper to execute query
function query(text, params = []) {
  if (dbType === 'postgres') {
    return pgPool.query(text, params).then(res => res.rows);
  } else {
    return new Promise((resolve, reject) => {
      // Replace $1, $2 with ?, ? for SQLite compatibility
      let sqliteText = text;
      let paramCount = 1;
      while (sqliteText.includes(`$${paramCount}`)) {
        sqliteText = sqliteText.replace(`$${paramCount}`, '?');
        paramCount++;
      }

      // If it's a SELECT, use .all; otherwise run .run
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
  }
}

// Initialize tables
async function initDb() {
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
  } else {
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

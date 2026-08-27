# Laybare Payroll System - Project Documentation & Roadmap

This file documents the system architecture, implementation details, current progress, and planned next steps to easily resume development after a laptop restart.

---

## 1. System Overview
The **Laybare Payroll System** is a custom web application designed to automate payroll calculations by parsing NGTeco biometric timeclock Excel reports. It calculates daily attendance metrics (regular hours, late minutes, undertime, overtime, night differential) and compiles them into payroll reports based on employee rates and tax statuses.

---

## 2. Technology Stack
*   **Frontend**: React (Vite), TailwindCSS, PostCSS
*   **Backend**: Node.js, Express, Multer (file uploading), XLSX (Excel parser)
*   **Database**: Dual-mode support:
    *   **SQLite** (Development, local file: `backend/payroll.db`)
    *   **PostgreSQL** (Production/Cloud, configured via `DATABASE_URL` / env variables)

---

## 3. Database Schema

### `employees`
*   `id` (INTEGER, Primary Key) - Biometric Device ID
*   `name` (TEXT) - Full Name
*   `branch` (TEXT) - Designated Branch
*   `rate` (REAL) - Hourly or Daily Rate
*   `tax_status` (TEXT) - Tax Status code (e.g., 'S' for Single)

### `raw_punches`
*   `id` (INTEGER, Auto-increment)
*   `employee_id` (INTEGER)
*   `punch_time` (TEXT) - Timestamp string
*   `punch_type` (TEXT) - 'IN' / 'OUT'
*   `source` (TEXT) - E.g., 'Manual Upload'

### `daily_attendance`
*   `id` (INTEGER, Auto-increment)
*   `employee_id` (INTEGER)
*   `date` (TEXT) - YYYY-MM-DD
*   `calculated_in` (TEXT) - Time of first punch
*   `calculated_out` (TEXT) - Time of last punch
*   `regular_hours` (REAL) - Work hours (max 8.0, minus 1 hour unpaid lunch)
*   `late_minutes` (INTEGER) - Late time (includes a 5-minute grace period)
*   `undertime_minutes` (INTEGER) - Minutes left early before shift end
*   `ot_hours` (REAL) - Hours worked beyond the standard 8-hour shift
*   `nd_hours` (REAL) - Night differential hours worked between 10:00 PM and 6:00 AM
*   `status` (TEXT) - 'Present', 'Absent', 'Rest Day', 'Flagged' (Missing IN/OUT or error)
*   `notes` (TEXT) - Contextual messages (e.g., 'Missing IN')

---

## 4. Current Implementation Status

### Backend (`/backend`)
- [x] **Database Initialization** (`db.js`): Setup script to automatically create SQLite/PostgreSQL schemas and seed initial mock employees.
- [x] **NGTeco Excel Parser** (`parser.js`): Reads sheets, identifies Pay Periods, matches employee names/IDs using regex (e.g., `Name (ID)`), and collects chronological check-in/out raw records.
- [x] **Calculation Rules Engine** (`engine.js`): 
    - Standard shift: 9:00 AM to 6:00 PM.
    - 5-minute grace period for lates.
    - Undertime mapping. Capped at 8 hours regular time, overage calculated as OT.
    - Overnight shift calculation handling.
    - Double night-differential calculation (late night 10 PM - 12 AM and early morning 12 AM - 6 AM).
- [x] **API Server** (`server.js`):
    - `GET /api/employees` - Lists all employees.
    - `POST /api/employees` - Registers a new employee.
    - `POST /api/upload` - Handles file upload, parsing, processing, database population, and daily attendance ingestion.

### Frontend (`/frontend`)
- [x] React & Vite build setup.
- [x] CSS styling structure configured (Tailwind & vanilla PostCSS).

---

## 5. Next Steps (To Proceed After Restart)

### Completed Tasks
- [x] **Frontend Layout & Dashboards**: Built responsive drag-and-drop dashboard, employee lists, attendance logs.
- [x] **Attendance Anomalies / Corrections**: Created views for reviewing "Flagged" status days, enabled managers to manually modify punches with automatic recalculation.
- [x] **Payroll Calculation Features**: Calculated gross pay, standard deductions (SSS/PhilHealth/PagIBIG/Tax), and generated payslips.
- [x] **Tests and Validation**: Verified rules engine for daily attendance and UI flows.
- [x] **Vercel Compatibility**: Updated backend parser (`multer.memoryStorage()`) to read uploaded `.xls` files directly from memory since Vercel Serverless functions have a read-only filesystem.
- [x] **Git Initialization**: Created `.gitignore` and initialized local Git repository.

### Pending Deployment Tasks

1.  **GitHub Repository Linkage**:
    *   Create a new empty repository on [GitHub](https://github.com/new).
    *   Provide the Git URL to the AI assistant (or run `git remote add origin <URL>` and `git push -u origin main`).
2.  **Cloud Database Setup (PostgreSQL)**:
    *   Local SQLite (`payroll.db`) will not persist on Vercel. 
    *   Create a free PostgreSQL database using [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
    *   Copy the Postgres Connection String (e.g., `postgresql://...`).
3.  **Vercel Deployment**:
    *   Set up the `DATABASE_URL` environment variable on Vercel using the provided connection string.
    *   Deploy the frontend and backend to Vercel via GitHub integration.

---

## 6. Business Proposal Details (Drafted Aug 2026)
*   **Client:** Ms. Jehan Abedin, General Manager, ALRAJJ LEGACY Fortified Business Corp.
*   **Locations Scope:** Centrio (Waxing Salon, Passion Nails), Ketkai, and SM Downtown. (Iligan excluded as it is not yet operational).
*   **Total Cost:** PHP 85,000.00
*   **Payment Terms:**
    *   30% Downpayment (PHP 25,500)
    *   30% Milestone 1 (PHP 25,500)
    *   20% Milestone 2 (PHP 17,000) upon UAT
    *   20% Final Turnover (PHP 17,000)
*   **Maintenance & Retainer:** Year 1 is FREE. Year 2 onwards is PHP 1,500.00 / month.
*   *Note: Full proposal exported as `Payroll_System_Proposal.doc` in the project root.*

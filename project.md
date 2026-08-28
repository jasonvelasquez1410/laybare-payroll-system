# LAYBARE HRMS & Biometric Payroll System

> **Project Memory & State Context Document**  
> *Last Updated: August 29, 2026*  
> *Repository*: `jasonvelasquez1410/laybare-payroll-system` (Branch: `main`)

---

## 1. Project Overview
**LAYBARE HRMS** is an automated Biometric Attendance, Compliance Monitoring, and Semi-Monthly Payroll System designed for Lay Bare waxing salon branches. It ingests offline punch logs from NGTeco biometric devices, detects attendance anomalies (missing punches, pairing errors), tracks chronic tardiness (triggering automated Notice to Explain / NTE letters), and calculates gross-to-net payroll with Philippine statutory deductions (SSS, PhilHealth, Pag-IBIG, Withholding Tax).

---

## 2. Standing User Directives & Rules
1. **Auto-Push to Git**: Automatically commit and push all code changes and project updates directly to GitHub `origin/main` whenever modifications are made.
2. **Design Theme**: Follow the **Behance HRMS Dashboard Layout** (Left navigation sidebar, top greeting header, 4 quick KPI pills, donut analytics, clock-in feed, and rounded card tables) combined with the official **Lay Bare Logo Color Palette**.
3. **Light Mode**: The default theme is light, bright, and clean with warm ivory/slate-cream surfaces and soft borders.

---

## 3. Brand Identity & Color Theme
The UI uses the exact palette derived from the official **Lay Bare logo** and brand assets:

| Color Role | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Lay Bare Green** | `#77BC2E` / `#6DB027` | Primary buttons (`+ Add Employee`, `Compute Payroll`), active sidebar highlights, on-time indicators |
| **Warm Chocolate Brown** | `#4A2E1B` | Primary headings, brand title, user avatar backgrounds, card title accents |
| **Floral Soft Pink** | `#E89BB9` / `#D47098` | Disciplinary flags, late alerts, exception badges, donut chart slices |
| **Floral Lilac / Lavender**| `#B58EBE` / `#9C72A8` | Tardiness bars, rest day tags, secondary analytics |
| **Light Canvas** | `#F7F8FA` | Crisp, modern HRMS page background |
| **Card Surface** | `#FFFFFF` | Pure white rounded cards (`rounded-3xl` / `rounded-2xl`) with `#EAE8E2` borders |
| **Body Text** | `#2D2520` / `#5A534E` | High readability dark chocolate-charcoal typography |

---

## 4. Architecture & Key Features

### A. Left Sidebar Navigation
- **Branding Header**: Lay Bare Logo (`/logo.png.jpg`) + `LAYBARE HRMS` tag.
- **Search Menu**: Real-time menu filter.
- **Sections**:
  - **Overview**: `General Dashboard`, `Accounting & Payroll`
  - **Workforce Management**: `Exceptions & Flags` (with live counter), `Tardiness & NTE`, `Biometric Ingestion`
  - **Employee Management**: `Staff Directory` (+ Add Employee modal)
- **User Footer**: Profile card (`Kristene HR Manager`) with live status.

### B. Top App Bar & KPI Highlights
- **Greeting & Date**: *"Welcome back, Kristene"* with dynamic date badge and payroll cutoff range selector (`2026-07-16` to `2026-07-31`).
- **4 Top Highlight Cards**:
  1. `Missed Out / Flags` (Floral Pink icon)
  2. `Active Salon Staff` (Lay Bare Green icon)
  3. `Total Late Minutes` (Floral Lilac icon)
  4. `Avg. Work Shift` (Chocolate Brown icon)

### C. Core Modules
1. **General Dashboard**:
   - **Attendance Donut Widget**: 88% Present circular gauge with color-coded breakdown (Present in Green, Exceptions in Pink, Rest Day in Lilac).
   - **Recent Clock-In Feed**: Real-time biometric punch ledger with branch tags and status tags (`On Time`, `Late (21m)`, `Missing OUT`).
   - **Attendance Volume Line Chart**: Daily headcount trends over the cutoff.
   - **Tardiness Bar Chart**: Top late minutes accumulated per employee.
   - **Master Timesheets Table**: Filterable by employee and status (`Present`, `Flagged`, `Rest Day`, `Approved`) with search support.
2. **Biometric Upload Portal (`upload`)**:
   - Drag-and-drop zone accepting `.xls` / `.xlsx` exports from NGTeco biometric machines.
   - Parses punches and syncs logs into database/state.
3. **Exceptions & Overrides Dashboard (`exceptions`)**:
   - Lists unpaired clock-ins/outs with warning details.
   - HR Adjustment side-drawer to input corrected Clock-In / Clock-Out and save override notes.
4. **Tardiness & NTE Generator (`tardiness`)**:
   - Monitors employees exceeding the 3-late threshold.
   - Built-in **Notice to Explain (NTE)** letter generator with official printable template.
5. **Accounting & Semi-Monthly Payroll (`payroll`)**:
   - Calculates Basic Pay, Overtime, Night Differential, Tardiness Deductions, Gross Pay, Statutory Deductions (SSS, PhilHealth, Pag-IBIG, Tax), and Net Take-Home Salary.
   - **Printable Itemized Payslip Modal** for each worker.

---

## 5. Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, ECharts (`echarts-for-react`), Lucide React icons, Axios.
- **Backend**: Node.js / Express (`backend/server.js`), SQLite / Memory storage, XLSX parser (`xlsx`).
- **Deployment**: Vercel frontend / Local Vite dev server (`http://localhost:5173`).

---

## 6. Directory Structure
```
LAYBARE-payroll-system/
├── frontend/
│   ├── public/
│   │   └── logo.png.jpg          <-- Official Lay Bare Logo
│   ├── src/
│   │   ├── App.jsx               <-- Main Dashboard (HRMS Sidebar + Lay Bare Palette)
│   │   ├── index.css             <-- Tailwind v4 & Design Tokens
│   │   └── main.jsx              <-- Entry Point
│   ├── index.html                <-- HTML with Plus Jakarta Sans & Outfit fonts
│   └── package.json
├── backend/
│   ├── server.js                 <-- Express API & Calculation logic
│   └── package.json
├── project.md                    <-- This state & context file
└── README.md
```

---

## 7. How to Resume Work After Restart
1. Start frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Start backend API server:
   ```bash
   cd backend
   npm run dev # or node server.js
   ```
3. All code modifications will continue to follow the Lay Bare color scheme and auto-commit & push to GitHub `main`.

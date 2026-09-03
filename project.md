# LAYBARE HRMS & Biometric Payroll System

> **Project Memory & State Context Document**  
> *Last Updated: August 29, 2026*  
> *Repository*: `jasonvelasquez1410/laybare-payroll-system` (Branch: `main`)  
> *Primary Maintainer / Developer*: Antigravity AI & Jason Velasquez

---

## 1. Project Overview & Business Logic
**LAYBARE HRMS** is an automated Biometric Attendance, Compliance Monitoring, and Semi-Monthly Payroll System tailored specifically for Lay Bare waxing salon branches. 

### Key Capabilities:
- **Biometric Punch Ingestion**: Parses offline biometric machine logs (`.xls` / `.xlsx` exported from NGTeco time clocks).
- **Anomaly & Exception Engine**: Flags unpaired clock-ins/clock-outs, missing punches, paired shifts across midnight, and manual HR time adjustments.
- **Tardiness & Compliance Monitoring**: Detects recurring lateness; automatically flags employees reaching or exceeding 3 late instances in a cutoff and generates a compliant **Notice to Explain (NTE)** letter with 5-day response timeline.
- **Philippine Statutory Payroll Calculation**: Computes Semi-Monthly gross-to-net pay including:
  - Basic Salary, Overtime Pay, Night Differential, Holiday Pay
  - Tardiness / Absenteeism deductions
  - Statutory Deductions: SSS Contribution, PhilHealth, Pag-IBIG HDMF, and BIR Withholding Tax
  - Automated printable itemized employee payslip modal.

---

## 2. Standing User Directives & Rules
1. **Auto-Push to Git**: Automatically stage, commit, and push all code changes and project updates directly to GitHub `origin/main` whenever modifications are made.
2. **Design Theme**: Strictly adhere to the **Behance HRMS Modern Dashboard Layout** (Left-anchored vertical sidebar, top greeting & date header, 4 quick KPI summary cards, circular donut analytics gauge, biometric clock-in feed, and rounded card tables) combined with the official **Lay Bare Logo Color Palette**.
3. **Default Light Mode**: The application defaults to an ultra-clean, warm ivory/slate-cream modern light theme with high contrast, legible typography, and soft borders.

---

## 3. Brand Identity & Color Theme
The UI uses the exact palette derived from the official **Lay Bare logo** and brand assets:

| Color Role | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| **Lay Bare Green** | `#77BC2E` / `#6DB027` | Primary buttons (`+ Add Employee`, `Compute Payroll`), active sidebar highlights, on-time badges, accent icons |
| **Warm Chocolate Brown** | `#4A2E1B` | Primary headings, brand title, user avatar backgrounds, card title accents |
| **Floral Soft Pink** | `#E89BB9` / `#D47098` | Disciplinary flags, late alerts, exception badges, donut chart slices |
| **Floral Lilac / Lavender**| `#B58EBE` / `#9C72A8` | Tardiness bars, rest day tags, secondary analytics |
| **Light Canvas** | `#F7F8FA` | Crisp, modern HRMS page background |
| **Card Surface** | `#FFFFFF` | Pure white rounded cards (`rounded-3xl` / `rounded-2xl`) with `#EAE8E2` borders |
| **Body Text** | `#2D2520` / `#5A534E` | High readability dark chocolate-charcoal typography |

---

## 4. Architecture & Key Modules

### A. Left Navigation Sidebar
- **Branding Header**: Official ALRAJJ LEGACY Logo (`/alrajj-icon.png` & `/alrajj-logo.png`) + `ALRAJJ LEGACY HRMS` tag.
- **Search Menu**: Real-time interactive menu search filter.
- **Categorized Sections**:
  - **Overview**: `General Dashboard`, `Accounting & Payroll`
  - **Workforce Management**: `Exceptions & Flags` (with dynamic counter), `Tardiness & NTE`, `Biometric Ingestion`
  - **Employee Management**: `Staff Directory` (+ Add Employee modal)
- **User Footer**: Profile card (`Kristene HR Manager`) with live active status.

### B. Top App Bar & KPI Highlights
- **Greeting & Cutoff**: *"Welcome back, Kristene"* with dynamic date badge and payroll cutoff range selector (`2026-07-16` to `2026-07-31`).
- **4 Top Highlight Cards**:
  1. `Missed Out / Flags` (Floral Pink icon)
  2. `Active Salon Staff` (Lay Bare Green icon)
  3. `Total Late Minutes` (Floral Lilac icon)
  4. `Avg. Work Shift` (Chocolate Brown icon)

### C. Core Functional Views
1. **General Dashboard (`dashboard`)**:
   - **Attendance Donut Widget**: 88% Present circular gauge with color-coded breakdown (Present in Green, Exceptions in Pink, Rest Day in Lilac).
   - **Recent Clock-In Feed**: Real-time biometric punch ledger with branch tags and status tags (`On Time`, `Late (21m)`, `Missing OUT`).
   - **Attendance Volume Line Chart**: Daily headcount trends over the cutoff.
   - **Tardiness Bar Chart**: Top late minutes accumulated per employee.
   - **Master Timesheets Table**: Filterable by employee and status (`Present`, `Flagged`, `Rest Day`, `Approved`) with search support.
2. **Biometric Ingestion Portal (`upload`)**:
   - Drag-and-drop zone accepting `.xls` / `.xlsx` exports from NGTeco biometric machines.
   - Automatic punch log validation and synchronization.
3. **Exceptions & Overrides Dashboard (`exceptions`)**:
   - Unpaired clock-ins/outs with warning details.
   - HR Adjustment side-drawer to input corrected Clock-In / Clock-Out and save override notes.
4. **Tardiness & NTE Generator (`tardiness`)**:
   - Monitors employees exceeding the 3-late threshold.
   - Built-in **Notice to Explain (NTE)** letter generator with official printable template.
5. **Accounting & Semi-Monthly Payroll (`payroll`)**:
   - Calculates Basic Pay, Overtime, Night Differential, Tardiness Deductions, Gross Pay, Statutory Deductions (SSS, PhilHealth, Pag-IBIG, Tax), and Net Take-Home Salary.
   - **Printable Itemized Payslip Modal** for each worker.

---

## 5. Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, ECharts (`echarts-for-react`), Lucide React icons, Axios, Plus Jakarta Sans & Outfit fonts.
- **Backend**: Node.js / Express (`backend/server.js`), SQLite / Memory storage, XLSX parser (`xlsx`), CORS.
- **Deployment**: Vercel frontend / Local Vite dev server.

---

## 6. Directory Structure
```
LAYBARE-payroll-system/
├── frontend/
│   ├── public/
│   │   ├── alrajj-logo.png       <-- Official ALRAJJ LEGACY Logo
│   │   ├── alrajj-icon.png       <-- Star Emblem Icon / Favicon
│   │   └── logo.png.jpg          <-- Logo compatibility asset
│   ├── src/
│   │   ├── App.jsx               <-- Main Dashboard (HRMS Sidebar + Lay Bare Palette)
│   │   ├── index.css             <-- Tailwind v4 & Design Tokens
│   │   └── main.jsx              <-- Entry Point
│   ├── index.html                <-- HTML with Plus Jakarta Sans & Outfit fonts
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js                 <-- Express API & Calculation logic
│   └── package.json
├── project.md                    <-- This state & context file
├── package.json                  <-- Root workspaces configuration
└── README.md
```

---

## 7. How to Resume Work After Laptop Restart

### Step 1: Open Terminal in Project Root
```bash
cd "c:\Users\ACER\Documents\Programming Folder Rep\LAYBARE-payroll-system"
```

### Step 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```
*(Runs on `http://localhost:5173` or specified Vite port)*

### Step 3: Start Backend API Server (in a separate terminal)
```bash
cd "c:\Users\ACER\Documents\Programming Folder Rep\LAYBARE-payroll-system\backend"
node server.js
```
*(Runs on `http://localhost:5000`)*

### Step 4: Continue Coding with Antigravity
When you restart your session with Antigravity, the AI will immediately read `project.md` and continue right where we left off!

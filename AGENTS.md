# AGENTS.md - ALRAJJ LEGACY HRMS & Biometric Payroll System

> **Persistent AI Context & Operating Rules**  
> **Last Updated**: September 4, 2026  
> **Primary Live Production URL**: [https://alrajj-legacy.vercel.app](https://alrajj-legacy.vercel.app)  
> **Client / Company**: ALRAJJ LEGACY Fortified Business Corp.  
> **Target Branches**: Centrio Mall (Waxing Salon & Passion Nails), Limketkai (Ketkai), SM Downtown  
> **Client Lead**: Ms. Jehan Abedin, General Manager  
> **Presenter / Developer**: Jason Velasquez & SETHCON Technologies  

---

## 📌 Standing Directives & Behavioral Rules
1. **Auto-Push to Git**: Automatically stage, commit, and push all code changes and project updates directly to GitHub `origin/main` whenever modifications are made.
2. **Company Branding & Logo**:
   - Company Name: **ALRAJJ LEGACY Fortified Business Corp.**
   - Vercel Production Domain: **`https://alrajj-legacy.vercel.app`**
   - Official Assets: `/alrajj-logo.png` and `/alrajj-icon.png` (stored in `frontend/public/`).
   - UI Theme: Warm ivory/slate-cream modern light theme with Behance HRMS layout, Lay Bare Green `#77BC2E`, Warm Chocolate `#4A2E1B`, Soft Pink `#E89BB9`, and Lilac `#B58EBE`.

---

## 🎬 The 5-Minute Tuesday Live Demo Guide (Quick Memory)

For any Tuesday demonstration with Ms. Jehan Abedin and leadership, use this 4-act flow on **`https://alrajj-legacy.vercel.app`**:

### Act 1: Executive Dashboard (1 Minute)
- **What to show**: Top greeting (*"Welcome back, Kristene"*), cutoff badge (`2026-07-16 ~ 2026-07-31`), 4 KPI summary cards (Active Staff, Total Late Mins, Avg Shift, Flags), and the circular **88% Attendance Donut Chart**.
- **Talking Point**: *"Ms. Jehan, the moment leadership logs in, you get a real-time pulse of attendance across Centrio, Ketkai, and SM Downtown without opening a single spreadsheet."*

### Act 2: Biometric Ingestion (1 Minute)
- **What to show**: Click **"Biometric Ingestion"** in the left menu. Show the drag-and-drop zone that takes raw `.xls` / `.xlsx` exports from **NGTeco** time clocks.
- **Talking Point**: *"No manual data entry. HR simply exports the raw log file from the biometric device at the end of the cutoff, drops it here, and the system matches staff, shifts, and timestamps in seconds."*

### Act 3: Exceptions, Overrides & Automated NTE (1.5 Minutes)
- **What to show**:
  1. Click **"Exceptions & Flags"** &rarr; point out Cherimar Concigo's missing punch &rarr; click **"Resolve"** &rarr; set time to `18:00` with an audit note &rarr; save.
  2. Click **"Tardiness & NTE"** &rarr; show the late frequency tracker &rarr; click **"Generate Notice to Explain (NTE)"** to show the formal DOLE-compliant letter with employee details and 5-day response timeline.
- **Talking Point**: *"When staff forget to punch out, HR resolves it in 5 seconds with an audit log. Repeat tardiness is tracked automatically, generating formal Notice to Explain letters with zero manual paperwork."*

### Act 4: 1-Click Payroll & Itemized Payslips (1.5 Minutes)
- **What to show**: Click **"Accounting & Payroll"** &rarr; click green **"Compute Payroll"** &rarr; view gross-to-net pay &rarr; click **"View Payslip"** (printer icon) to display the official printable payslip complete with the ALRAJJ LEGACY logo.
- **Talking Point**: *"What used to take 2 full days of manual math is now computed in 1 second—complete with SSS, PhilHealth, Pag-IBIG statutory deductions and official printable payslips."*

---

## 📁 Presentation Assets in the Repository

1. **Native Microsoft PowerPoint Presentation**:
   - [`ALRAJJ_LEGACY_Payroll_Demo_Presentation.pptx`](file:///c:/Users/USER/Documents/Programming%20Folder%20Rep/LAYBARE-payroll-system/ALRAJJ_LEGACY_Payroll_Demo_Presentation.pptx)
   - 7 custom-designed 16:9 slides in ALRAJJ LEGACY corporate styling. Double-click to open in PowerPoint and press `F5` to present.

2. **Interactive Web Presentation Deck**:
   - [`presentation_deck.html`](file:///c:/Users/USER/Documents/Programming%20Folder%20Rep/LAYBARE-payroll-system/presentation_deck.html)
   - Browser-based presentation with keyboard navigation (`Left`/`Right` arrow keys), speaker notes, and a direct button to launch the live demo.

3. **Detailed Step-by-Step Demo Script**:
   - [`TUESDAY_DEMO_SCRIPT_AND_GUIDE.md`](file:///c:/Users/USER/Documents/Programming%20Folder%20Rep/LAYBARE-payroll-system/TUESDAY_DEMO_SCRIPT_AND_GUIDE.md)
   - Full verbatim speaking script, timing guide, and objection-handling notes.

4. **PowerPoint Generator Script**:
   - [`generate_presentation.ps1`](file:///c:/Users/USER/Documents/Programming%20Folder%20Rep/LAYBARE-payroll-system/generate_presentation.ps1)
   - PowerShell script using PowerPoint COM automation to re-build or update the `.pptx` deck at any time.

---

## 💻 Tech Stack & Architecture
- **Frontend**: React 19, Vite, Tailwind CSS v4, ECharts, Lucide React icons, Plus Jakarta Sans & Outfit fonts.
- **Backend**: Node.js / Express (`backend/server.js`), XLSX parser (`xlsx`), SQLite/In-memory store.
- **Hosting**: Vercel (`https://alrajj-legacy.vercel.app`).

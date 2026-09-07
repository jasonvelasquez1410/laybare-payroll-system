# PowerShell Automation Script for ALRAJJ LEGACY Presentation
# Updated with SETHCON Profile, CRM, PO-to-Accounting, and 5-Step BPI Disbursement Pipeline
$pptApp = $null
try {
    Write-Host "Initializing Microsoft PowerPoint COM Automation..."
    $pptApp = New-Object -ComObject PowerPoint.Application
    $pptApp.Visible = 1
    $presentation = $pptApp.Presentations.Add(1)

    # 16:9 Widescreen dimensions (960 x 540 pt)
    $presentation.PageSetup.SlideWidth = 960
    $presentation.PageSetup.SlideHeight = 540

    # Color Constants (BGR format for Office COM)
    # RGB(3, 17, 52) -> Navy: 3412227
    $COLOR_NAVY   = 3412227
    # RGB(212, 175, 55) -> Gold: 3649492
    $COLOR_GOLD   = 3649492
    # RGB(119, 188, 46) -> Green: 3062903
    $COLOR_GREEN  = 3062903
    # RGB(30, 41, 59) -> Dark Slate: 3877150
    $COLOR_DARK   = 3877150
    # RGB(255, 255, 255) -> White
    $COLOR_WHITE  = 16777215
    # RGB(248, 249, 250) -> Light Canvas
    $COLOR_BG     = 16448248
    # RGB(220, 225, 230) -> Border
    $COLOR_BORDER = 15132396
    # RGB(15, 30, 75) -> Darker Navy card
    $COLOR_NAVY_CARD = 4922895

    function Add-Box($slide, $left, $top, $width, $height, $bgColor, $borderColor) {
        $shape = $slide.Shapes.AddShape(1, $left, $top, $width, $height) # 1 = msoShapeRectangle
        $shape.Fill.Solid()
        $shape.Fill.ForeColor.RGB = $bgColor
        if ($borderColor) {
            $shape.Line.Visible = 1
            $shape.Line.ForeColor.RGB = $borderColor
            $shape.Line.Weight = 1.5
        } else {
            $shape.Line.Visible = 0
        }
        return $shape
    }

    # ==========================================
    # SLIDE 1: Title Slide (Cover)
    # ==========================================
    $s1 = $presentation.Slides.Add(1, 12)
    Add-Box $s1 0 0 960 540 $COLOR_NAVY $null
    Add-Box $s1 70 110 8 300 $COLOR_GOLD $null

    $t1 = $s1.Shapes.AddTextbox(1, 100, 100, 790, 70)
    $t1.TextFrame.WordWrap = 1
    $r1 = $t1.TextFrame.TextRange
    $r1.Text = "ALRAJJ LEGACY"
    $r1.Font.Name = "Arial"
    $r1.Font.Size = 44
    $r1.Font.Bold = 1
    $r1.Font.Color.RGB = $COLOR_GOLD

    $t1b = $s1.Shapes.AddTextbox(1, 100, 170, 790, 80)
    $t1b.TextFrame.WordWrap = 1
    $r1b = $t1b.TextFrame.TextRange
    $r1b.Text = "Smart Biometric Attendance, BPI Payroll & Enterprise Solutions`r`nExecutive Demonstration for Salon Leadership"
    $r1b.Font.Name = "Arial"
    $r1b.Font.Size = 20
    $r1b.Font.Bold = 1
    $r1b.Font.Color.RGB = $COLOR_WHITE

    $t1c = $s1.Shapes.AddTextbox(1, 100, 270, 790, 130)
    $t1c.TextFrame.WordWrap = 1
    $r1c = $t1c.TextFrame.TextRange
    $r1c.Text = "Target Deployment: Centrio (Waxing & Nails), Ketkai, SM Downtown`r`nLive Application URL: https://alrajj-legacy.vercel.app`r`nPrepared for: Ms. Jehan Abedin, General Manager`r`nPresented by: Jason Velasquez (VP) & SETHCON Technologies Inc."
    $r1c.Font.Name = "Arial"
    $r1c.Font.Size = 13
    $r1c.Font.Color.RGB = 13816530

    # ==========================================
    # SLIDE 2: SETHCON Profile & Enterprise Ecosystem
    # ==========================================
    $s2 = $presentation.Slides.Add(2, 12)
    Add-Box $s2 0 0 960 540 $COLOR_BG $null

    $h2 = $s2.Shapes.AddTextbox(1, 50, 35, 860, 45)
    $h2.TextFrame.TextRange.Text = "Technology Partner Profile: SETHCON Technologies Inc."
    $h2.TextFrame.TextRange.Font.Name = "Arial"
    $h2.TextFrame.TextRange.Font.Size = 24
    $h2.TextFrame.TextRange.Font.Bold = 1
    $h2.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    $sub2 = $s2.Shapes.AddTextbox(1, 50, 75, 860, 25)
    $sub2.TextFrame.TextRange.Text = "End-to-End Solutions for Retail, Salons & Multi-Branch Enterprise"
    $sub2.TextFrame.TextRange.Font.Name = "Arial"
    $sub2.TextFrame.TextRange.Font.Size = 13
    $sub2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # 4 Columns
    Add-Box $s2 50 110 200 370 $COLOR_WHITE $COLOR_BORDER
    $sp1 = $s2.Shapes.AddTextbox(1, 60, 120, 180, 350)
    $sp1.TextFrame.WordWrap = 1
    $sp1.TextFrame.TextRange.Text = "OFFICIAL PROFILE`r`n`r`n* Systems Engineering & Custom Architecture.`r`n`r`n* Custom Biometric HRMS & Payroll for Lay Bare branches.`r`n`r`n* Official Company Profile:`r`n  https://drive.google.com/file/d/12qG_EbC35yH9k9Bl0uDCGp7shh1mfQ0B/view?usp=sharing"
    $sp1.TextFrame.TextRange.Font.Name = "Arial"
    $sp1.TextFrame.TextRange.Font.Size = 12
    $sp1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s2 265 110 200 370 $COLOR_WHITE $COLOR_BORDER
    $sp2 = $s2.Shapes.AddTextbox(1, 275, 120, 180, 350)
    $sp2.TextFrame.WordWrap = 1
    $sp2.TextFrame.TextRange.Text = "SALON CRM & LOYALTY`r`n`r`n* Complete Customer History & technician notes.`r`n`r`n* Online Booking & SMS confirmations.`r`n`r`n* Loyalty packages & multi-branch redemptions.`r`n`r`n* Technician commission tracking."
    $sp2.TextFrame.TextRange.Font.Name = "Arial"
    $sp2.TextFrame.TextRange.Font.Size = 12
    $sp2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s2 480 110 215 370 $COLOR_WHITE $COLOR_BORDER
    $sp3 = $s2.Shapes.AddTextbox(1, 490, 120, 195, 350)
    $sp3.TextFrame.WordWrap = 1
    $sp3.TextFrame.TextRange.Text = "PO TO ACCOUNTING`r`n`r`n* 5-Step Procurement:`r`n  1. Store Requisition`r`n  2. Vendor RFQ / Quotes`r`n  3. PO Approval`r`n  4. Goods Receiving`r`n  5. 3-Way Match directly to Accounting AP & Ledger."
    $sp3.TextFrame.TextRange.Font.Name = "Arial"
    $sp3.TextFrame.TextRange.Font.Size = 12
    $sp3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s2 710 110 200 370 $COLOR_WHITE $COLOR_BORDER
    $sp4 = $s2.Shapes.AddTextbox(1, 720, 120, 180, 350)
    $sp4.TextFrame.WordWrap = 1
    $sp4.TextFrame.TextRange.Text = "POS & INVENTORY`r`n`r`n* Live multi-branch revenue tracking.`r`n`r`n* Stock depletion & automatic reorder alerts.`r`n`r`n* Centralized price & service catalog.`r`n`r`n* Shrinkage & loss prevention."
    $sp4.TextFrame.TextRange.Font.Name = "Arial"
    $sp4.TextFrame.TextRange.Font.Size = 12
    $sp4.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 3: The Problem (2-Day Bottleneck)
    # ==========================================
    $s3 = $presentation.Slides.Add(3, 12)
    Add-Box $s3 0 0 960 540 $COLOR_BG $null

    $h3 = $s3.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h3.TextFrame.TextRange.Text = "The Current Reality: The 2-Day Payroll Bottleneck"
    $h3.TextFrame.TextRange.Font.Name = "Arial"
    $h3.TextFrame.TextRange.Font.Size = 25
    $h3.TextFrame.TextRange.Font.Bold = 1
    $h3.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    # Problem 1
    Add-Box $s3 50 110 270 360 $COLOR_WHITE $COLOR_BORDER
    $p1 = $s3.Shapes.AddTextbox(1, 65, 125, 240, 330)
    $p1.TextFrame.WordWrap = 1
    $p1.TextFrame.TextRange.Text = "TIME CONSUMING`r`n`r`n* Takes 2 whole working days per cutoff to compute hours by hand.`r`n`r`n* HR spends 16+ hours per month cross-referencing raw timesheets.`r`n`r`n* Delays payroll release and pulls management away from core salon operations."
    $p1.TextFrame.TextRange.Font.Name = "Arial"
    $p1.TextFrame.TextRange.Font.Size = 13
    $p1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Problem 2
    Add-Box $s3 345 110 270 360 $COLOR_WHITE $COLOR_BORDER
    $p2 = $s3.Shapes.AddTextbox(1, 360, 125, 240, 330)
    $p2.TextFrame.WordWrap = 1
    $p2.TextFrame.TextRange.Text = "PRONE TO ERRORS`r`n`r`n* Manual math for:`r`n  - 5-min grace periods`r`n  - 10-min tardiness deductions`r`n  - Overtime and Night Diffs`r`n  - SSS, PhilHealth, Pag-IBIG`r`n`r`n* Mathematical errors cause salary disputes and awkward payroll adjustments."
    $p2.TextFrame.TextRange.Font.Name = "Arial"
    $p2.TextFrame.TextRange.Font.Size = 13
    $p2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Problem 3
    Add-Box $s3 640 110 270 360 $COLOR_WHITE $COLOR_BORDER
    $p3 = $s3.Shapes.AddTextbox(1, 655, 125, 240, 330)
    $p3.TextFrame.WordWrap = 1
    $p3.TextFrame.TextRange.Text = "SCATTERED RECORDS`r`n`r`n* Biometric files scattered across USB sticks and loose Excel files.`r`n`r`n* No automated tracking of missing OUT punches or shift anomalies.`r`n`r`n* Habitual tardiness goes untracked without formal Notice to Explain (NTE) compliance."
    $p3.TextFrame.TextRange.Font.Name = "Arial"
    $p3.TextFrame.TextRange.Font.Size = 13
    $p3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 4: The Solution (From 2 Days to 5 Minutes)
    # ==========================================
    $s4 = $presentation.Slides.Add(4, 12)
    Add-Box $s4 0 0 960 540 $COLOR_NAVY $null

    $h4 = $s4.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h4.TextFrame.TextRange.Text = "The Solution: Custom Smart Biometric HRMS"
    $h4.TextFrame.TextRange.Font.Name = "Arial"
    $h4.TextFrame.TextRange.Font.Size = 25
    $h4.TextFrame.TextRange.Font.Bold = 1
    $h4.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    $sub4 = $s4.Shapes.AddTextbox(1, 50, 90, 860, 30)
    $sub4.TextFrame.TextRange.Text = "Transforms 2 Days of Manual Math into a 5-Minute Automated Workflow"
    $sub4.TextFrame.TextRange.Font.Name = "Arial"
    $sub4.TextFrame.TextRange.Font.Size = 14
    $sub4.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # 4 Pillar Boxes
    Add-Box $s4 50 135 200 345 $COLOR_NAVY_CARD $null
    $pt1 = $s4.Shapes.AddTextbox(1, 65, 150, 170, 315)
    $pt1.TextFrame.WordWrap = 1
    $pt1.TextFrame.TextRange.Text = "1. NGTeco Ingestion`r`n`r`nDrag and drop raw Excel files exported directly from branch biometric clocks.`r`n`r`nInstant automatic punch log recognition and shift pairing."
    $pt1.TextFrame.TextRange.Font.Name = "Arial"
    $pt1.TextFrame.TextRange.Font.Size = 12
    $pt1.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s4 270 135 200 345 $COLOR_NAVY_CARD $null
    $pt2 = $s4.Shapes.AddTextbox(1, 285, 150, 170, 315)
    $pt2.TextFrame.WordWrap = 1
    $pt2.TextFrame.TextRange.Text = "2. Anomaly Engine`r`n`r`nAutomatically flags missed clock-outs, unpaired shifts, and late arrivals.`r`n`r`nHR resolves exceptions in seconds with complete audit notes."
    $pt2.TextFrame.TextRange.Font.Name = "Arial"
    $pt2.TextFrame.TextRange.Font.Size = 12
    $pt2.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s4 490 135 200 345 $COLOR_NAVY_CARD $null
    $pt3 = $s4.Shapes.AddTextbox(1, 505, 150, 170, 315)
    $pt3.TextFrame.WordWrap = 1
    $pt3.TextFrame.TextRange.Text = "3. Automated NTE`r`n`r`nEnforces 5-min grace and 10-min deduction rules.`r`n`r`nAutomatically detects 3+ late staff and generates ready-to-print Notice to Explain letters."
    $pt3.TextFrame.TextRange.Font.Name = "Arial"
    $pt3.TextFrame.TextRange.Font.Size = 12
    $pt3.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s4 710 135 200 345 $COLOR_NAVY_CARD $null
    $pt4 = $s4.Shapes.AddTextbox(1, 725, 150, 170, 315)
    $pt4.TextFrame.WordWrap = 1
    $pt4.TextFrame.TextRange.Text = "4. 1-Click Gross-to-Net`r`n`r`nComputes Basic Pay, Overtime, Night Diff, SSS, PhilHealth, Pag-IBIG in 1 second.`r`n`r`nGenerates printable itemized payslips with your company logo."
    $pt4.TextFrame.TextRange.Font.Name = "Arial"
    $pt4.TextFrame.TextRange.Font.Size = 12
    $pt4.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # ==========================================
    # SLIDE 5: Multi-Branch Scope
    # ==========================================
    $s5 = $presentation.Slides.Add(5, 12)
    Add-Box $s5 0 0 960 540 $COLOR_BG $null

    $h5 = $s5.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h5.TextFrame.TextRange.Text = "One Centralized Hub for All Salon Branch Operations"
    $h5.TextFrame.TextRange.Font.Name = "Arial"
    $h5.TextFrame.TextRange.Font.Size = 25
    $h5.TextFrame.TextRange.Font.Bold = 1
    $h5.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    # Left: Active Locations
    Add-Box $s5 50 110 410 360 $COLOR_WHITE $COLOR_BORDER
    $b5a = $s5.Shapes.AddTextbox(1, 70, 125, 370, 330)
    $b5a.TextFrame.WordWrap = 1
    $b5a.TextFrame.TextRange.Text = "CURRENT ACTIVE LOCATIONS`r`n`r`n1. Centrio Mall Branch`r`n   - Waxing Salon operations`r`n   - Passion Nails division`r`n`r`n2. Limketkai Mall (Ketkai) Branch`r`n   - Dedicated salon technicians and desk staff`r`n`r`n3. SM Downtown Branch`r`n   - High-traffic mall operations`r`n`r`n*Future-Ready Architecture:*`r`nSeamlessly accommodates new branches (such as Iligan) whenever ready without restructuring."
    $b5a.TextFrame.TextRange.Font.Name = "Arial"
    $b5a.TextFrame.TextRange.Font.Size = 13
    $b5a.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Right: Live Web Advantage
    Add-Box $s5 490 110 420 360 $COLOR_WHITE $COLOR_BORDER
    $b5b = $s5.Shapes.AddTextbox(1, 510, 125, 380, 330)
    $b5b.TextFrame.WordWrap = 1
    $b5b.TextFrame.TextRange.Text = "CLOUD CONVENIENCE & VISIBILITY`r`n`r`n* Accessible 24/7 at: https://alrajj-legacy.vercel.app`r`n`r`n* No Software to Install:`r`n  Runs smoothly on any browser (Chrome, Edge, Safari, Mobile).`r`n`r`n* Executive Oversight:`r`n  General Manager and HR can inspect real-time attendance, exceptions, and payroll figures from any device, anywhere.`r`n`r`n* Bank-grade data handling and secure cloud backups."
    $b5b.TextFrame.TextRange.Font.Name = "Arial"
    $b5b.TextFrame.TextRange.Font.Size = 13
    $b5b.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 6: End-to-End Payroll & BPI ATM Disbursement Pipeline
    # ==========================================
    $s6 = $presentation.Slides.Add(6, 12)
    Add-Box $s6 0 0 960 540 $COLOR_NAVY $null

    $h6 = $s6.Shapes.AddTextbox(1, 50, 35, 860, 45)
    $h6.TextFrame.TextRange.Text = "End-to-End Payroll & BPI ATM Disbursement Pipeline"
    $h6.TextFrame.TextRange.Font.Name = "Arial"
    $h6.TextFrame.TextRange.Font.Size = 24
    $h6.TextFrame.TextRange.Font.Bold = 1
    $h6.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    $sub6 = $s6.Shapes.AddTextbox(1, 50, 80, 860, 25)
    $sub6.TextFrame.TextRange.Text = "A 5-Stage Closed Loop: From Raw Punches to Employee ATM Crediting"
    $sub6.TextFrame.TextRange.Font.Name = "Arial"
    $sub6.TextFrame.TextRange.Font.Size = 13
    $sub6.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # 5 Process Columns
    Add-Box $s6 50 120 160 360 $COLOR_NAVY_CARD $null
    $st1 = $s6.Shapes.AddTextbox(1, 60, 135, 140, 330)
    $st1.TextFrame.WordWrap = 1
    $st1.TextFrame.TextRange.Text = "STEP 1`r`nHR INGESTION`r`n`r`n* Drag & drop NGTeco file.`r`n* Resolve exceptions in 5s.`r`n* Compute gross-to-net in 1 second."
    $st1.TextFrame.TextRange.Font.Name = "Arial"
    $st1.TextFrame.TextRange.Font.Size = 11
    $st1.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s6 225 120 160 360 $COLOR_NAVY_CARD $null
    $st2 = $s6.Shapes.AddTextbox(1, 235, 135, 140, 330)
    $st2.TextFrame.WordWrap = 1
    $st2.TextFrame.TextRange.Text = "STEP 2`r`nACCOUNTING DEPT`r`n`r`n* Forwarded from HR.`r`n* Accounting audits deductions (SSS/PhilHealth/PagIBIG).`r`n* Approves ledger."
    $st2.TextFrame.TextRange.Font.Name = "Arial"
    $st2.TextFrame.TextRange.Font.Size = 11
    $st2.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s6 400 120 160 360 $COLOR_NAVY_CARD $null
    $st3 = $s6.Shapes.AddTextbox(1, 410, 135, 140, 330)
    $st3.TextFrame.WordWrap = 1
    $st3.TextFrame.TextRange.Text = "STEP 3`r`nBPI BIZLINK`r`n`r`n* System generates BPI Corporate Batch CSV/TXT file.`r`n* Auto-formats account numbers and net pays."
    $st3.TextFrame.TextRange.Font.Name = "Arial"
    $st3.TextFrame.TextRange.Font.Size = 11
    $st3.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s6 575 120 160 360 $COLOR_NAVY_CARD $null
    $st4 = $s6.Shapes.AddTextbox(1, 585, 135, 140, 330)
    $st4.TextFrame.WordWrap = 1
    $st4.TextFrame.TextRange.Text = "STEP 4`r`nMD APPROVAL`r`n`r`n* Managing Director (Ms. Jehan Abedin) final authorization.`r`n* Authorizes BPI BizLink online batch."
    $st4.TextFrame.TextRange.Font.Name = "Arial"
    $st4.TextFrame.TextRange.Font.Size = 11
    $st4.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s6 750 120 160 360 $COLOR_NAVY_CARD $null
    $st5 = $s6.Shapes.AddTextbox(1, 760, 135, 140, 330)
    $st5.TextFrame.WordWrap = 1
    $st5.TextFrame.TextRange.Text = "STEP 5`r`nATM & PAYSLIPS`r`n`r`n* Salary available in employee ATM accounts.`r`n* Official printable payslips released with ALRAJJ logo."
    $st5.TextFrame.TextRange.Font.Name = "Arial"
    $st5.TextFrame.TextRange.Font.Size = 11
    $st5.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # ==========================================
    # SLIDE 7: The Tuesday Demo Flow
    # ==========================================
    $s7 = $presentation.Slides.Add(7, 12)
    Add-Box $s7 0 0 960 540 $COLOR_BG $null

    $h7 = $s7.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h7.TextFrame.TextRange.Text = "The 5-Minute Live Demo Flow (For Tuesday)"
    $h7.TextFrame.TextRange.Font.Name = "Arial"
    $h7.TextFrame.TextRange.Font.Size = 25
    $h7.TextFrame.TextRange.Font.Bold = 1
    $h7.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    # 4 Steps
    Add-Box $s7 50 120 200 360 $COLOR_WHITE $COLOR_BORDER
    $d1 = $s7.Shapes.AddTextbox(1, 65, 135, 170, 330)
    $d1.TextFrame.WordWrap = 1
    $d1.TextFrame.TextRange.Text = "STEP 1: EXECUTIVE PULSE`r`n(1 Minute)`r`n`r`n* Open alrajj-legacy.vercel.app`r`n* Show the modern Dashboard`r`n* Point out 4 Quick KPIs:`r`n  - Active Staff`r`n  - Late Minutes`r`n  - Avg Shift Hours`r`n  - Missed Out / Flags`r`n* Show the 88% Attendance Donut chart."
    $d1.TextFrame.TextRange.Font.Name = "Arial"
    $d1.TextFrame.TextRange.Font.Size = 12
    $d1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s7 270 120 200 360 $COLOR_WHITE $COLOR_BORDER
    $d2 = $s7.Shapes.AddTextbox(1, 285, 135, 170, 330)
    $d2.TextFrame.WordWrap = 1
    $d2.TextFrame.TextRange.Text = "STEP 2: BIOMETRIC UPLOAD`r`n(1 Minute)`r`n`r`n* Click 'Biometric Ingestion'`r`n* Show the upload area for NGTeco Excel files.`r`n* Explain: 'No manual data entry. The system ingests all raw punches and automatically matches employee shifts.'"
    $d2.TextFrame.TextRange.Font.Name = "Arial"
    $d2.TextFrame.TextRange.Font.Size = 12
    $d2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s7 490 120 200 360 $COLOR_WHITE $COLOR_BORDER
    $d3 = $s7.Shapes.AddTextbox(1, 505, 135, 170, 330)
    $d3.TextFrame.WordWrap = 1
    $d3.TextFrame.TextRange.Text = "STEP 3: EXCEPTIONS & NTE`r`n(1.5 Minutes)`r`n`r`n* Click 'Exceptions & Flags'`r`n* Show how missing OUT punches are highlighted.`r`n* Click 'Resolve' and adjust shift in 5 seconds.`r`n* Click 'Tardiness & NTE' to display auto-generated Notice to Explain letter."
    $d3.TextFrame.TextRange.Font.Name = "Arial"
    $d3.TextFrame.TextRange.Font.Size = 12
    $d3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s7 710 120 200 360 $COLOR_WHITE $COLOR_BORDER
    $d4 = $s7.Shapes.AddTextbox(1, 725, 135, 170, 330)
    $d4.TextFrame.WordWrap = 1
    $d4.TextFrame.TextRange.Text = "STEP 4: 1-CLICK PAYROLL`r`n(1.5 Minutes)`r`n`r`n* Click 'Accounting & Payroll'`r`n* Click 'Compute Payroll'`r`n* Show 5-step BPI disbursement pipeline.`r`n* Generate BPI BizLink Batch CSV.`r`n* Open an Itemized Payslip with ALRAJJ logo ready to print."
    $d4.TextFrame.TextRange.Font.Name = "Arial"
    $d4.TextFrame.TextRange.Font.Size = 12
    $d4.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 8: ROI & Business Value
    # ==========================================
    $s8 = $presentation.Slides.Add(8, 12)
    Add-Box $s8 0 0 960 540 $COLOR_BG $null

    $h8 = $s8.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h8.TextFrame.TextRange.Text = "Tangible Business Value & ROI for Leadership"
    $h8.TextFrame.TextRange.Font.Name = "Arial"
    $h8.TextFrame.TextRange.Font.Size = 25
    $h8.TextFrame.TextRange.Font.Bold = 1
    $h8.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    Add-Box $s8 50 110 410 160 $COLOR_WHITE $COLOR_BORDER
    $r1 = $s8.Shapes.AddTextbox(1, 70, 120, 370, 140)
    $r1.TextFrame.WordWrap = 1
    $r1.TextFrame.TextRange.Text = "95% TIME REDUCTION`r`n`r`nCuts payroll computation from 16 hours (2 working days) down to just 5 minutes per cutoff.`r`nSaves over 380 management hours annually."
    $r1.TextFrame.TextRange.Font.Name = "Arial"
    $r1.TextFrame.TextRange.Font.Size = 13
    $r1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s8 490 110 420 160 $COLOR_WHITE $COLOR_BORDER
    $r2 = $s8.Shapes.AddTextbox(1, 510, 120, 380, 140)
    $r2.TextFrame.WordWrap = 1
    $r2.TextFrame.TextRange.Text = "ZERO MATHEMATICAL ERRORS`r`n`r`nStandardized, automated deductions eliminate over/under-payments, tax mismatches, and employee compensation grievances."
    $r2.TextFrame.TextRange.Font.Name = "Arial"
    $r2.TextFrame.TextRange.Font.Size = 13
    $r2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s8 50 290 410 170 $COLOR_WHITE $COLOR_BORDER
    $r3 = $s8.Shapes.AddTextbox(1, 70, 300, 370, 150)
    $r3.TextFrame.WordWrap = 1
    $r3.TextFrame.TextRange.Text = "LABOR COMPLIANCE PROTECTION`r`n`r`nAutomatic tracking of habitual tardiness with generated 5-day Notice to Explain (NTE) documents protects the company with strict DOLE compliance."
    $r3.TextFrame.TextRange.Font.Name = "Arial"
    $r3.TextFrame.TextRange.Font.Size = 13
    $r3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s8 490 290 420 170 $COLOR_WHITE $COLOR_BORDER
    $r4 = $s8.Shapes.AddTextbox(1, 510, 300, 380, 150)
    $r4.TextFrame.WordWrap = 1
    $r4.TextFrame.TextRange.Text = "FULL EXECUTIVE TRANSPARENCY`r`n`r`nGeneral Manager can review branch attendance health, overtime spend, and branch performance in real time from any smartphone or laptop."
    $r4.TextFrame.TextRange.Font.Name = "Arial"
    $r4.TextFrame.TextRange.Font.Size = 13
    $r4.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 9: Implementation Roadmap & Next Steps
    # ==========================================
    $s9 = $presentation.Slides.Add(9, 12)
    Add-Box $s9 0 0 960 540 $COLOR_NAVY $null

    $h9 = $s9.Shapes.AddTextbox(1, 50, 40, 860, 50)
    $h9.TextFrame.TextRange.Text = "Implementation Roadmap & Next Steps"
    $h9.TextFrame.TextRange.Font.Name = "Arial"
    $h9.TextFrame.TextRange.Font.Size = 25
    $h9.TextFrame.TextRange.Font.Bold = 1
    $h9.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    # Left Box
    Add-Box $s9 50 110 500 360 $COLOR_NAVY_CARD $null
    $t9a = $s9.Shapes.AddTextbox(1, 70, 125, 460, 330)
    $t9a.TextFrame.WordWrap = 1
    $t9a.TextFrame.TextRange.Text = "MILESTONE ROADMAP`r`n`r`n* Milestone 1: Core System & UI (COMPLETE & LIVE)`r`n  - Live at https://alrajj-legacy.vercel.app`r`n`r`n* Milestone 2: User Acceptance Testing (UAT)`r`n  - Test with actual NGTeco logs from Centrio, Ketkai, SM Downtown`r`n`r`n* Milestone 3: Live Hand-off & Staff Training`r`n  - Quick 30-min onboarding for HR team`r`n`r`n* Full 12 Months Support: FREE comprehensive maintenance`r`n* Year 2+: Highly affordable PHP 1,500/mo cloud retainer"
    $t9a.TextFrame.TextRange.Font.Name = "Arial"
    $t9a.TextFrame.TextRange.Font.Size = 13
    $t9a.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # Right Box
    Add-Box $s9 570 110 340 360 $COLOR_WHITE $COLOR_BORDER
    $t9b = $s9.Shapes.AddTextbox(1, 590, 125, 300, 330)
    $t9b.TextFrame.WordWrap = 1
    $t9b.TextFrame.TextRange.Text = "READY FOR TUESDAY`r`n`r`nImmediate Action Items:`r`n`r`n1. Gather 1 actual biometric export from each of the 3 branches.`r`n`r`n2. Conduct the 5-minute live demo on alrajj-legacy.vercel.app.`r`n`r`n3. Sign off on UAT schedule.`r`n`r`n`r`nThank you!`r`nALRAJJ LEGACY Fortified Business Corp.`r`nSETHCON Technologies Inc."
    $t9b.TextFrame.TextRange.Font.Name = "Arial"
    $t9b.TextFrame.TextRange.Font.Size = 13
    $t9b.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Save presentation
    $outputPath = "c:\Users\USER\Documents\Programming Folder Rep\LAYBARE-payroll-system\ALRAJJ_LEGACY_Payroll_Demo_Presentation.pptx"
    $presentation.SaveAs($outputPath)
    $presentation.Close()
    Write-Host "SUCCESS: Presentation saved at $outputPath"
}
catch {
    Write-Error $_.Exception.Message
}
finally {
    if ($pptApp) {
        $pptApp.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($pptApp) | Out-Null
    }
}

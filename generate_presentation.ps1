# PowerShell Automation Script for ALRAJJ LEGACY Presentation
$pptApp = $null
try {
    Write-Host "Initializing Microsoft PowerPoint..."
    $pptApp = New-Object -ComObject PowerPoint.Application
    $pptApp.Visible = 1
    $presentation = $pptApp.Presentations.Add(1)

    # 16:9 Widescreen dimensions
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
    # SLIDE 1: Title Slide
    # ==========================================
    $s1 = $presentation.Slides.Add(1, 12)
    Add-Box $s1 0 0 960 540 $COLOR_NAVY $null

    # Gold accent bar
    Add-Box $s1 80 120 8 280 $COLOR_GOLD $null

    $t1 = $s1.Shapes.AddTextbox(1, 110, 110, 780, 70)
    $t1.TextFrame.WordWrap = 1
    $r1 = $t1.TextFrame.TextRange
    $r1.Text = "ALRAJJ LEGACY"
    $r1.Font.Name = "Arial"
    $r1.Font.Size = 46
    $r1.Font.Bold = 1
    $r1.Font.Color.RGB = $COLOR_GOLD

    $t1b = $s1.Shapes.AddTextbox(1, 110, 180, 780, 80)
    $t1b.TextFrame.WordWrap = 1
    $r1b = $t1b.TextFrame.TextRange
    $r1b.Text = "Smart Biometric Attendance & Automated Payroll System`r`nExecutive Demonstration for Salon Leadership"
    $r1b.Font.Name = "Arial"
    $r1b.Font.Size = 22
    $r1b.Font.Bold = 1
    $r1b.Font.Color.RGB = $COLOR_WHITE

    $t1c = $s1.Shapes.AddTextbox(1, 110, 280, 780, 120)
    $t1c.TextFrame.WordWrap = 1
    $r1c = $t1c.TextFrame.TextRange
    $r1c.Text = "Target Deployment: Centrio (Waxing & Nails), Ketkai, SM Downtown`r`nLive Application URL: https://alrajj-legacy.vercel.app`r`nPrepared for: Ms. Jehan Abedin, General Manager`r`nPresentation Date: Tuesday Demo"
    $r1c.Font.Name = "Arial"
    $r1c.Font.Size = 14
    $r1c.Font.Color.RGB = 13816530

    # ==========================================
    # SLIDE 2: The Core Problem: The 2-Day Payroll Bottleneck
    # ==========================================
    $s2 = $presentation.Slides.Add(2, 12)
    Add-Box $s2 0 0 960 540 $COLOR_BG $null

    $h2 = $s2.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h2.TextFrame.TextRange.Text = "The Current Reality: The 2-Day Payroll Bottleneck"
    $h2.TextFrame.TextRange.Font.Name = "Arial"
    $h2.TextFrame.TextRange.Font.Size = 26
    $h2.TextFrame.TextRange.Font.Bold = 1
    $h2.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    # Problem 1
    Add-Box $s2 60 110 260 360 $COLOR_WHITE $COLOR_BORDER
    $p1 = $s2.Shapes.AddTextbox(1, 75, 125, 230, 330)
    $p1.TextFrame.WordWrap = 1
    $p1.TextFrame.TextRange.Text = "TIME CONSUMING`r`n`r`n* Takes 2 whole working days per cutoff to compute hours by hand.`r`n`r`n* HR spends 16+ hours per month cross-referencing raw timesheets.`r`n`r`n* Delays payroll release and pulls management away from core salon operations."
    $p1.TextFrame.TextRange.Font.Name = "Arial"
    $p1.TextFrame.TextRange.Font.Size = 13
    $p1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Problem 2
    Add-Box $s2 350 110 260 360 $COLOR_WHITE $COLOR_BORDER
    $p2 = $s2.Shapes.AddTextbox(1, 365, 125, 230, 330)
    $p2.TextFrame.WordWrap = 1
    $p2.TextFrame.TextRange.Text = "PRONE TO ERRORS`r`n`r`n* Manual math for:`r`n  - 5-min grace periods`r`n  - 10-min tardiness deductions`r`n  - Overtime and Night Diffs`r`n  - SSS, PhilHealth, Pag-IBIG`r`n`r`n* Mathematical errors cause salary disputes and awkward payroll adjustments."
    $p2.TextFrame.TextRange.Font.Name = "Arial"
    $p2.TextFrame.TextRange.Font.Size = 13
    $p2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Problem 3
    Add-Box $s2 640 110 260 360 $COLOR_WHITE $COLOR_BORDER
    $p3 = $s2.Shapes.AddTextbox(1, 655, 125, 230, 330)
    $p3.TextFrame.WordWrap = 1
    $p3.TextFrame.TextRange.Text = "SCATTERED RECORDS`r`n`r`n* Biometric files scattered across USB sticks and loose Excel files.`r`n`r`n* No automated tracking of missing OUT punches or shift anomalies.`r`n`r`n* Habitual tardiness goes untracked without formal Notice to Explain (NTE) compliance."
    $p3.TextFrame.TextRange.Font.Name = "Arial"
    $p3.TextFrame.TextRange.Font.Size = 13
    $p3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 3: The Solution: From 2 Days to 5 Minutes
    # ==========================================
    $s3 = $presentation.Slides.Add(3, 12)
    Add-Box $s3 0 0 960 540 $COLOR_NAVY $null

    $h3 = $s3.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h3.TextFrame.TextRange.Text = "The Solution: Custom Smart Biometric HRMS"
    $h3.TextFrame.TextRange.Font.Name = "Arial"
    $h3.TextFrame.TextRange.Font.Size = 26
    $h3.TextFrame.TextRange.Font.Bold = 1
    $h3.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    $sub3 = $s3.Shapes.AddTextbox(1, 60, 90, 840, 30)
    $sub3.TextFrame.TextRange.Text = "Transforms 2 Days of Manual Math into a 5-Minute Automated Workflow"
    $sub3.TextFrame.TextRange.Font.Name = "Arial"
    $sub3.TextFrame.TextRange.Font.Size = 15
    $sub3.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # 4 Pillar Boxes
    $pil1 = Add-Box $s3 60 140 195 330 $COLOR_NAVY_CARD $null
    $pt1 = $s3.Shapes.AddTextbox(1, 75, 155, 165, 300)
    $pt1.TextFrame.WordWrap = 1
    $pt1.TextFrame.TextRange.Text = "1. NGTeco Ingestion`r`n`r`nDrag and drop raw Excel files exported directly from your branch biometric clocks.`r`n`r`nInstant automatic punch log recognition and shift pairing."
    $pt1.TextFrame.TextRange.Font.Name = "Arial"
    $pt1.TextFrame.TextRange.Font.Size = 13
    $pt1.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    $pil2 = Add-Box $s3 275 140 195 330 $COLOR_NAVY_CARD $null
    $pt2 = $s3.Shapes.AddTextbox(1, 290, 155, 165, 300)
    $pt2.TextFrame.WordWrap = 1
    $pt2.TextFrame.TextRange.Text = "2. Anomaly Engine`r`n`r`nAutomatically flags missed clock-outs, unpaired shifts, and late arrivals.`r`n`r`nHR resolves exceptions in seconds with complete audit notes."
    $pt2.TextFrame.TextRange.Font.Name = "Arial"
    $pt2.TextFrame.TextRange.Font.Size = 13
    $pt2.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    $pil3 = Add-Box $s3 490 140 195 330 $COLOR_NAVY_CARD $null
    $pt3 = $s3.Shapes.AddTextbox(1, 505, 155, 165, 300)
    $pt3.TextFrame.WordWrap = 1
    $pt3.TextFrame.TextRange.Text = "3. Automated NTE`r`n`r`nEnforces your 5-min grace and 10-min deduction rules.`r`n`r`nAutomatically detects 3+ late staff and generates ready-to-print Notice to Explain letters."
    $pt3.TextFrame.TextRange.Font.Name = "Arial"
    $pt3.TextFrame.TextRange.Font.Size = 13
    $pt3.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    $pil4 = Add-Box $s3 705 140 195 330 $COLOR_NAVY_CARD $null
    $pt4 = $s3.Shapes.AddTextbox(1, 720, 155, 165, 300)
    $pt4.TextFrame.WordWrap = 1
    $pt4.TextFrame.TextRange.Text = "4. 1-Click Payroll`r`n`r`nComputes Basic Pay, Overtime, Night Diff, SSS, PhilHealth, Pag-IBIG, and Net Pay.`r`n`r`nGenerates printable itemized payslips with your company logo."
    $pt4.TextFrame.TextRange.Font.Name = "Arial"
    $pt4.TextFrame.TextRange.Font.Size = 13
    $pt4.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # ==========================================
    # SLIDE 4: Operational Scope & Multi-Branch Centralization
    # ==========================================
    $s4 = $presentation.Slides.Add(4, 12)
    Add-Box $s4 0 0 960 540 $COLOR_BG $null

    $h4 = $s4.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h4.TextFrame.TextRange.Text = "One Centralized Hub for All Branch Operations"
    $h4.TextFrame.TextRange.Font.Name = "Arial"
    $h4.TextFrame.TextRange.Font.Size = 26
    $h4.TextFrame.TextRange.Font.Bold = 1
    $h4.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    # Left: Active Locations
    Add-Box $s4 60 110 395 360 $COLOR_WHITE $COLOR_BORDER
    $b4a = $s4.Shapes.AddTextbox(1, 80, 125, 355, 330)
    $b4a.TextFrame.WordWrap = 1
    $b4a.TextFrame.TextRange.Text = "CURRENT ACTIVE LOCATIONS`r`n`r`n1. Centrio Mall Branch`r`n   - Waxing Salon operations`r`n   - Passion Nails division`r`n`r`n2. Limketkai Mall (Ketkai) Branch`r`n   - Dedicated salon technicians and desk staff`r`n`r`n3. SM Downtown Branch`r`n   - High-traffic mall operations`r`n`r`n*Future-Ready Architecture:*`r`nSeamlessly accommodates new branches (such as Iligan) whenever ready without restructuring."
    $b4a.TextFrame.TextRange.Font.Name = "Arial"
    $b4a.TextFrame.TextRange.Font.Size = 13
    $b4a.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # Right: Live Web Advantage
    Add-Box $s4 495 110 405 360 $COLOR_WHITE $COLOR_BORDER
    $b4b = $s4.Shapes.AddTextbox(1, 515, 125, 365, 330)
    $b4b.TextFrame.WordWrap = 1
    $b4b.TextFrame.TextRange.Text = "CLOUD CONVENIENCE & VISIBILITY`r`n`r`n* Accessible 24/7 at: https://alrajj-legacy.vercel.app`r`n`r`n* No Software to Install:`r`n  Runs smoothly on any browser (Chrome, Edge, Safari, Mobile).`r`n`r`n* Executive Oversight:`r`n  General Manager and HR can inspect real-time attendance, exceptions, and payroll figures from any device, anywhere.`r`n`r`n* Bank-grade data handling and secure cloud backups."
    $b4b.TextFrame.TextRange.Font.Name = "Arial"
    $b4b.TextFrame.TextRange.Font.Size = 13
    $b4b.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 5: The Tuesday Demo Flow (Step-by-Step)
    # ==========================================
    $s5 = $presentation.Slides.Add(5, 12)
    Add-Box $s5 0 0 960 540 $COLOR_NAVY $null

    $h5 = $s5.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h5.TextFrame.TextRange.Text = "The 5-Minute Live Demo Flow (For Tuesday)"
    $h5.TextFrame.TextRange.Font.Name = "Arial"
    $h5.TextFrame.TextRange.Font.Size = 26
    $h5.TextFrame.TextRange.Font.Bold = 1
    $h5.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    $sub5 = $s5.Shapes.AddTextbox(1, 60, 90, 840, 30)
    $sub5.TextFrame.TextRange.Text = "A crisp, simple narrative showing how raw time logs become finalized payslips"
    $sub5.TextFrame.TextRange.Font.Name = "Arial"
    $sub5.TextFrame.TextRange.Font.Size = 14
    $sub5.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # 4 Steps
    Add-Box $s5 60 135 195 345 $COLOR_NAVY_CARD $null
    $d1 = $s5.Shapes.AddTextbox(1, 75, 145, 165, 325)
    $d1.TextFrame.WordWrap = 1
    $d1.TextFrame.TextRange.Text = "STEP 1: EXECUTIVE PULSE`r`n(1 Minute)`r`n`r`n* Open alrajj-legacy.vercel.app`r`n* Show the modern Dashboard`r`n* Point out 4 Quick KPIs:`r`n  - Active Staff`r`n  - Late Minutes`r`n  - Avg Shift Hours`r`n  - Missed Out / Flags`r`n* Point out the 88% Attendance Donut chart."
    $d1.TextFrame.TextRange.Font.Name = "Arial"
    $d1.TextFrame.TextRange.Font.Size = 12
    $d1.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s5 275 135 195 345 $COLOR_NAVY_CARD $null
    $d2 = $s5.Shapes.AddTextbox(1, 290, 145, 165, 325)
    $d2.TextFrame.WordWrap = 1
    $d2.TextFrame.TextRange.Text = "STEP 2: BIOMETRIC UPLOAD`r`n(1 Minute)`r`n`r`n* Click 'Biometric Ingestion'`r`n* Show the upload area for NGTeco Excel files.`r`n* Explain: 'No manual data entry. The system ingests all raw punches and automatically matches employee shifts.'"
    $d2.TextFrame.TextRange.Font.Name = "Arial"
    $d2.TextFrame.TextRange.Font.Size = 12
    $d2.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s5 490 135 195 345 $COLOR_NAVY_CARD $null
    $d3 = $s5.Shapes.AddTextbox(1, 505, 145, 165, 325)
    $d3.TextFrame.WordWrap = 1
    $d3.TextFrame.TextRange.Text = "STEP 3: EXCEPTIONS & NTE`r`n(1.5 Minutes)`r`n`r`n* Click 'Exceptions & Flags'`r`n* Show how missing OUT punches are highlighted.`r`n* Click 'Resolve' and adjust shift in 5 seconds.`r`n* Click 'Tardiness & NTE' to display auto-generated Notice to Explain letter."
    $d3.TextFrame.TextRange.Font.Name = "Arial"
    $d3.TextFrame.TextRange.Font.Size = 12
    $d3.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    Add-Box $s5 705 135 195 345 $COLOR_NAVY_CARD $null
    $d4 = $s5.Shapes.AddTextbox(1, 720, 145, 165, 325)
    $d4.TextFrame.WordWrap = 1
    $d4.TextFrame.TextRange.Text = "STEP 4: 1-CLICK PAYROLL`r`n(1.5 Minutes)`r`n`r`n* Click 'Accounting & Payroll'`r`n* Click 'Compute Payroll'`r`n* Watch gross-to-net pay appear in 1 second.`r`n* Open an Itemized Payslip with ALRAJJ LEGACY header, ready to print or PDF."
    $d4.TextFrame.TextRange.Font.Name = "Arial"
    $d4.TextFrame.TextRange.Font.Size = 12
    $d4.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # ==========================================
    # SLIDE 6: Measurable Business ROI
    # ==========================================
    $s6 = $presentation.Slides.Add(6, 12)
    Add-Box $s6 0 0 960 540 $COLOR_BG $null

    $h6 = $s6.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h6.TextFrame.TextRange.Text = "Tangible Business Value & ROI for Leadership"
    $h6.TextFrame.TextRange.Font.Name = "Arial"
    $h6.TextFrame.TextRange.Font.Size = 26
    $h6.TextFrame.TextRange.Font.Bold = 1
    $h6.TextFrame.TextRange.Font.Color.RGB = $COLOR_NAVY

    Add-Box $s6 60 110 395 160 $COLOR_WHITE $COLOR_BORDER
    $r1 = $s6.Shapes.AddTextbox(1, 80, 120, 355, 140)
    $r1.TextFrame.WordWrap = 1
    $r1.TextFrame.TextRange.Text = "95% TIME REDUCTION`r`n`r`nCuts payroll computation from 16 hours (2 working days) down to just 5 minutes per cutoff.`r`nSaves over 380 management hours annually."
    $r1.TextFrame.TextRange.Font.Name = "Arial"
    $r1.TextFrame.TextRange.Font.Size = 13
    $r1.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s6 495 110 405 160 $COLOR_WHITE $COLOR_BORDER
    $r2 = $s6.Shapes.AddTextbox(1, 515, 120, 365, 140)
    $r2.TextFrame.WordWrap = 1
    $r2.TextFrame.TextRange.Text = "ZERO MATHEMATICAL ERRORS`r`n`r`nStandardized, automated deductions eliminate over/under-payments, tax mismatches, and employee compensation grievances."
    $r2.TextFrame.TextRange.Font.Name = "Arial"
    $r2.TextFrame.TextRange.Font.Size = 13
    $r2.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s6 60 290 395 170 $COLOR_WHITE $COLOR_BORDER
    $r3 = $s6.Shapes.AddTextbox(1, 80, 300, 355, 150)
    $r3.TextFrame.WordWrap = 1
    $r3.TextFrame.TextRange.Text = "LABOR COMPLIANCE PROTECTION`r`n`r`nAutomatic tracking of habitual tardiness with generated 5-day Notice to Explain (NTE) documents protects the company with strict DOLE compliance."
    $r3.TextFrame.TextRange.Font.Name = "Arial"
    $r3.TextFrame.TextRange.Font.Size = 13
    $r3.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    Add-Box $s6 495 290 405 170 $COLOR_WHITE $COLOR_BORDER
    $r4 = $s6.Shapes.AddTextbox(1, 515, 300, 365, 150)
    $r4.TextFrame.WordWrap = 1
    $r4.TextFrame.TextRange.Text = "FULL EXECUTIVE TRANSPARENCY`r`n`r`nGeneral Manager can review branch attendance health, overtime spend, and branch performance in real time from any smartphone or laptop."
    $r4.TextFrame.TextRange.Font.Name = "Arial"
    $r4.TextFrame.TextRange.Font.Size = 13
    $r4.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

    # ==========================================
    # SLIDE 7: Roadmap, Next Steps & Q&A
    # ==========================================
    $s7 = $presentation.Slides.Add(7, 12)
    Add-Box $s7 0 0 960 540 $COLOR_NAVY $null

    $h7 = $s7.Shapes.AddTextbox(1, 60, 40, 840, 50)
    $h7.TextFrame.TextRange.Text = "Implementation Roadmap & Next Steps"
    $h7.TextFrame.TextRange.Font.Name = "Arial"
    $h7.TextFrame.TextRange.Font.Size = 26
    $h7.TextFrame.TextRange.Font.Bold = 1
    $h7.TextFrame.TextRange.Font.Color.RGB = $COLOR_GOLD

    # Left Box
    Add-Box $s7 60 110 490 360 $COLOR_NAVY_CARD $null
    $t7a = $s7.Shapes.AddTextbox(1, 80, 125, 450, 330)
    $t7a.TextFrame.WordWrap = 1
    $t7a.TextFrame.TextRange.Text = "MILESTONE ROADMAP`r`n`r`n* Milestone 1: Core System & UI (COMPLETE & LIVE)`r`n  - Live at https://alrajj-legacy.vercel.app`r`n`r`n* Milestone 2: User Acceptance Testing (UAT)`r`n  - Test with actual NGTeco logs from Centrio, Ketkai, SM Downtown`r`n`r`n* Milestone 3: Live Hand-off & Staff Training`r`n  - Quick 30-min onboarding for HR team`r`n`r`n* Full 12 Months Support: FREE comprehensive maintenance`r`n* Year 2+: Highly affordable PHP 1,500/mo cloud retainer"
    $t7a.TextFrame.TextRange.Font.Name = "Arial"
    $t7a.TextFrame.TextRange.Font.Size = 13
    $t7a.TextFrame.TextRange.Font.Color.RGB = $COLOR_WHITE

    # Right Box
    Add-Box $s7 575 110 325 360 $COLOR_WHITE $COLOR_BORDER
    $t7b = $s7.Shapes.AddTextbox(1, 595, 125, 285, 330)
    $t7b.TextFrame.WordWrap = 1
    $t7b.TextFrame.TextRange.Text = "READY FOR TUESDAY`r`n`r`nImmediate Action Items:`r`n`r`n1. Gather 1 actual biometric export from each of the 3 branches.`r`n`r`n2. Conduct the 5-minute live demo on alrajj-legacy.vercel.app.`r`n`r`n3. Sign off on UAT schedule.`r`n`r`n`r`nThank you!`r`nALRAJJ LEGACY Fortified Business Corp."
    $t7b.TextFrame.TextRange.Font.Name = "Arial"
    $t7b.TextFrame.TextRange.Font.Size = 13
    $t7b.TextFrame.TextRange.Font.Color.RGB = $COLOR_DARK

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

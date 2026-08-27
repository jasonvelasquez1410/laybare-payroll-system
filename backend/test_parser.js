const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { parseNGTecoFile } = require('./parser');
const { processDailyAttendance } = require('./engine');

// Create a mock NGTeco Excel file
function createMockExcel() {
  const data = [
    ['Pay Period', '2026-07-16~2026-07-31'],
    [],
    ['Employee : Justine Ann Atay(33)'],
    ['Date', 'IN', 'OUT', 'Work Time', 'Daily Total', 'Note'],
    ['THU 2026-07-16', '09:21', '20:07', '10:45', '10:45', ''],
    ['FRI 2026-07-17', '09:04', '18:00', '08:56', '08:56', ''],
    ['SAT 2026-07-18', '', '', '', '', ''], // Rest day/Absent
    [],
    ['Employee : Cherimar Concigo(34)'],
    ['Date', 'IN', 'OUT', 'Work Time', 'Daily Total', 'Note'],
    ['THU 2026-07-16', '21:24', '', '09:19', '09:19', 'Missing OUT'],
    ['FRI 2026-07-17', '09:12', '17:30', '08:18', '08:18', '']
  ];

  const ws = xlsx.utils.aoa_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'TimeReport');

  const testFile = path.join(__dirname, 'mock_report.xls');
  xlsx.writeFile(wb, testFile);
  console.log(`Mock NGTeco report written to: ${testFile}`);
  return testFile;
}

function runTests() {
  console.log('--- Starting Backend Verification Tests ---');
  const testFile = createMockExcel();

  try {
    const fileBuffer = fs.readFileSync(testFile);
    const { payPeriod, records } = parseNGTecoFile(fileBuffer);
    console.log(`Parsed Pay Period: ${payPeriod}`);
    console.log(`Parsed ${records.length} records.`);

    // Assertions
    if (payPeriod !== '2026-07-16~2026-07-31') {
      throw new Error(`Unexpected pay period: ${payPeriod}`);
    }

    if (records.length !== 5) {
      throw new Error(`Expected 5 records, got ${records.length}`);
    }

    console.log('\n--- Testing Engine Rules ---\n');

    // Test 1: Justine Ann Atay (33) on 2026-07-16
    // IN: 09:21 (Late by 21 mins), OUT: 20:07. Total work: 10:46 minus 1 hr lunch = 9.77 hrs (Regular 8.0, OT 1.77)
    const rec1 = records.find(r => r.employeeId === 33 && r.date === '2026-07-16');
    const calc1 = processDailyAttendance(rec1.date, rec1.in, rec1.out, rec1.note);
    console.log('Test 1 (Late & OT):', calc1);
    if (calc1.lateMinutes !== 21 || calc1.otHours <= 0) {
      throw new Error('Test 1 failed calculation rules.');
    }

    // Test 2: Justine Ann Atay (33) on 2026-07-17
    // IN: 09:04 (Late <= 5 mins grace -> 0 mins late), OUT: 18:00
    const rec2 = records.find(r => r.employeeId === 33 && r.date === '2026-07-17');
    const calc2 = processDailyAttendance(rec2.date, rec2.in, rec2.out, rec2.note);
    console.log('Test 2 (Grace Period):', calc2);
    if (calc2.lateMinutes !== 0) {
      throw new Error('Test 2 failed grace period rules.');
    }

    // Test 3: Cherimar Concigo (34) on 2026-07-16
    // IN: 21:24, OUT: missing. Status should be Flagged with Missing OUT
    const rec3 = records.find(r => r.employeeId === 34 && r.date === '2026-07-16');
    const calc3 = processDailyAttendance(rec3.date, rec3.in, rec3.out, rec3.note);
    console.log('Test 3 (Anomaly Missing OUT):', calc3);
    if (calc3.status !== 'Flagged' || !calc3.notes.includes('Missing OUT')) {
      throw new Error('Test 3 failed anomaly detection rules.');
    }

    // Test 4: Cherimar Concigo (34) on 2026-07-17
    // IN: 09:12 (Late by 12 mins), OUT: 17:30 (Undertime by 30 mins)
    const rec4 = records.find(r => r.employeeId === 34 && r.date === '2026-07-17');
    const calc4 = processDailyAttendance(rec4.date, rec4.in, rec4.out, rec4.note);
    console.log('Test 4 (Undertime):', calc4);
    if (calc4.lateMinutes !== 12 || calc4.undertimeMinutes !== 30) {
      throw new Error('Test 4 failed undertime calculation rules.');
    }

    console.log('\nALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ✓');

  } catch (err) {
    console.error('TESTING FAILED WITH ERROR:', err);
    process.exit(1);
  } finally {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
      console.log('Temporary mock report file deleted.');
    }
  }
}

runTests();

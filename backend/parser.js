const xlsx = require('xlsx');

function parseNGTecoFile(fileBuffer) {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let currentEmployee = null;
  let currentPayPeriod = '';
  const parsedRecords = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Check cells for "Pay Period" or "Employee" indicator
    let payPeriodFound = false;
    let employeeFound = false;
    let cellWithEmployee = '';

    for (let colIdx = 0; colIdx < Math.min(row.length, 5); colIdx++) {
      const cellVal = String(row[colIdx] || '').trim();
      if (cellVal.includes('Pay Period')) {
        payPeriodFound = true;
        // The value might be in the next cell
        currentPayPeriod = String(row[colIdx + 1] || '').trim();
        break;
      }
      if (cellVal.includes('Employee')) {
        employeeFound = true;
        // Take the cell itself or the next cell containing the name and ID
        cellWithEmployee = cellVal + ' ' + String(row[colIdx + 1] || '').trim();
        break;
      }
    }

    if (payPeriodFound) continue;

    if (employeeFound) {
      // Regex to extract Name and ID, e.g. "Justine Ann Atay(33)"
      const regex = /([^(]+)\((\d+)\)/;
      const match = cellWithEmployee.match(regex);
      if (match) {
        let name = match[1].replace('Employee', '').replace(':', '').trim();
        const id = parseInt(match[2], 10);
        currentEmployee = { name, id };
      }
      continue;
    }

    // Check if it is a punch row starting with a date pattern, e.g. "THU 2026-07-16"
    const cell0Str = String(row[0] || '').trim();
    const dateRegex = /\d{4}-\d{2}-\d{2}/;
    const dateMatch = cell0Str.match(dateRegex);

    if (dateMatch && currentEmployee) {
      const dateStr = dateMatch[0];
      const inVal = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : '';
      const outVal = row[2] !== undefined && row[2] !== null ? String(row[2]).trim() : '';
      const noteVal = row[5] !== undefined && row[5] !== null ? String(row[5]).trim() : '';

      parsedRecords.push({
        employeeId: currentEmployee.id,
        employeeName: currentEmployee.name,
        date: dateStr,
        in: inVal,
        out: outVal,
        note: noteVal
      });
    }
  }

  return { payPeriod: currentPayPeriod, records: parsedRecords };
}

module.exports = {
  parseNGTecoFile
};

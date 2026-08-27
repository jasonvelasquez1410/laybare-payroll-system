// Rules Engine for Payroll Calculations

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  const hrs = parseInt(parts[0], 10);
  const mins = parseInt(parts[1], 10);
  if (isNaN(hrs) || isNaN(mins)) return null;
  return hrs * 60 + mins;
}

function processDailyAttendance(dateStr, inStr, outStr, deviceNote = '') {
  const result = {
    calculatedIn: inStr || null,
    calculatedOut: outStr || null,
    regularHours: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
    otHours: 0,
    ndHours: 0,
    status: 'Present',
    notes: deviceNote || ''
  };

  // Determine weekday
  const dateObj = new Date(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Case 1: Both blank
  if (!inStr && !outStr) {
    if (isWeekend) {
      result.status = 'Rest Day';
    } else {
      result.status = 'Absent';
    }
    return result;
  }

  // Case 2: Missing punch (Anomaly)
  if (!inStr || !outStr) {
    result.status = 'Flagged';
    result.notes = !inStr ? 'Missing IN' : 'Missing OUT';
    if (deviceNote) result.notes += ` (${deviceNote})`;
    return result;
  }

  // Case 3: Both punches present
  const inMins = timeToMinutes(inStr);
  const outMins = timeToMinutes(outStr);

  if (inMins === null || outMins === null) {
    result.status = 'Flagged';
    result.notes = 'Invalid punch times';
    return result;
  }

  // Handle overnight shift if OUT is earlier than IN (e.g. IN 21:00, OUT 06:00)
  let actualOutMins = outMins;
  if (outMins < inMins) {
    actualOutMins = outMins + 1440; // add 24 hours
  }

  // Shift settings: Standard 9:00 AM to 6:00 PM (8 working hours + 1 hour lunch)
  const shiftStart = 9 * 60; // 540
  const shiftEnd = 18 * 60; // 1080

  // 1. Late Calculation
  // 5 mins grace period: if IN is 09:05 or earlier, lateMinutes = 0
  // if IN is 09:06 or later, lateMinutes = actual minutes late (e.g., 6)
  if (inMins > shiftStart) {
    const diff = inMins - shiftStart;
    if (diff > 5) {
      result.lateMinutes = diff;
    } else {
      result.lateMinutes = 0;
    }
  } else {
    result.lateMinutes = 0;
  }

  // 2. Undertime Calculation
  // If leaving earlier than 18:00
  if (actualOutMins < shiftEnd) {
    result.undertimeMinutes = shiftEnd - actualOutMins;
  } else {
    result.undertimeMinutes = 0;
  }

  // 3. Regular Work Hours
  // Total elapsed time minus 1 hour lunch (60 mins), capped at 8 hours
  const totalElapsed = actualOutMins - inMins;
  const netMins = Math.max(0, totalElapsed - 60);
  result.regularHours = Math.min(8.0, Number((netMins / 60).toFixed(2)));

  // 4. Overtime Calculation (Work beyond 8 hours)
  if (netMins > 480) {
    result.otHours = Number(((netMins - 480) / 60).toFixed(2));
  } else {
    result.otHours = 0;
  }

  // 5. Night Differential (ND) Calculation
  // Hours worked between 10:00 PM (22:00) and 6:00 AM (06:00 next day)
  // In minutes: 1320 (22 * 60) to 1800 (30 * 60)
  const ndStart = 22 * 60; // 1320
  const ndEnd = 30 * 60;   // 1800 (6:00 AM next day)
  
  let ndMins = 0;
  // Calculate overlap between punch interval [inMins, actualOutMins] and ND window [ndStart, ndEnd]
  const startOverlap = Math.max(inMins, ndStart);
  const endOverlap = Math.min(actualOutMins, ndEnd);

  if (startOverlap < endOverlap) {
    ndMins += (endOverlap - startOverlap);
  }

  // Also handle case if they worked very early in the morning before 6 AM (0 to 360 mins)
  const morningNdStart = 0;
  const morningNdEnd = 6 * 60; // 360
  const startOverlapMorning = Math.max(inMins, morningNdStart);
  const endOverlapMorning = Math.min(actualOutMins, morningNdEnd);

  if (startOverlapMorning < endOverlapMorning) {
    ndMins += (endOverlapMorning - startOverlapMorning);
  }

  result.ndHours = Number((ndMins / 60).toFixed(2));

  return result;
}

module.exports = {
  processDailyAttendance
};

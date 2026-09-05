const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the getDayStatus function
const oldGetDayStatusRegex = /const getDayStatus = \(day: number\) => \{[\s\S]*?\/\/ Otherwise fallback to mostly present\s*return 'PRES';\s*\};/g;

const newGetDayStatus = `const today = new Date(); // Current date

  const getDayStatus = (day: number, dayOfWeekIndex: number) => {
    const cellDate = new Date(currentYear, currentMonth, day);
    
    // Strip time for exact date comparison
    const isFuture = cellDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0);

    // 1. Future dates must be blank/unmarked
    if (isFuture) {
      return 'FUTURE';
    }

    // 2. Check if it's a weekend (Sunday = 6, Saturday = 5 in Mon-start index)
    if (dayOfWeekIndex === 5 || dayOfWeekIndex === 6) {
      return 'OFF';
    }

    // 3. Past or current days: use recorded data, or default to OFF/UNMARKED
    if (currentYear === 2026 && currentMonth === 7) {
        const status = attendanceData[day];
        if (status === 'P') return 'PRES';
        if (status === 'L') return 'LATE';
        if (status === 'A') return 'LEAVE';
        if (status === 'O') return 'OFF';
        return 'PRES'; // fallback
    }
    return 'PRES';
  };`;

// Replace the map loop inside the grid
const oldMapRegex = /\{Array\.from\(\{ length: daysInMonth \}\)\.map\(\(_, i\) => \{[\s\S]*?const day = i \+ 1;[\s\S]*?const status = getDayStatus\(day\);[\s\S]*?return \([\s\S]*?key=\{day\}[\s\S]*?style=\{\{[\s\S]*?\}\}[\s\S]*?>[\s\S]*?<span>\{day\}<\/span>[\s\S]*?<span style=\{\{ fontSize: '9px', textAlign: 'center' \}\}>[\s\S]*?\{status === 'PRES' \? '✓ PRES' : status === 'LATE' \? '⚠ LATE' : status === 'LEAVE' \? '✕ LEAVE' : 'OFF'\}[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}\)\}/;

const newMap = `{Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayOfWeekIndex = (offset + i) % 7; // 0 = Mon, 6 = Sun
          const status = getDayStatus(day, dayOfWeekIndex);

          // Styles based on status
          const isFuture = status === 'FUTURE';
          const isPres = status === 'PRES';
          const isOff = status === 'OFF';
          const isLate = status === 'LATE';
          const isLeave = status === 'LEAVE';

          return (
            <div
              key={day}
              style={{
                height: '48px',
                borderRadius: '8px',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4px 6px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: isFuture ? '#ffffff' : isPres ? '#f0fdf4' : isOff ? '#f8fafc' : isLate ? '#fefce8' : '#fef2f2',
                color: isFuture ? '#94a3b8' : isPres ? '#16a34a' : isOff ? '#64748b' : isLate ? '#ca8a04' : '#dc2626',
                opacity: isFuture ? 0.45 : 1 // Dim future dates
              }}
            >
              <span>{day}</span>
              <span style={{ fontSize: '9px', textAlign: 'center' }}>
                {isFuture ? '' : isPres ? '✓ PRES' : isOff ? 'OFF' : isLate ? '⚠ LATE' : '✕ LEAVE'}
              </span>
            </div>
          );
        })}`;

let updatedContent = content.replace(oldGetDayStatusRegex, newGetDayStatus);
updatedContent = updatedContent.replace(oldMapRegex, newMap);

fs.writeFileSync('src/App.tsx', updatedContent);
console.log('App.tsx updated successfully');

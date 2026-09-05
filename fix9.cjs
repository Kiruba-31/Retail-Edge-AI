const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

// The static calendar starts at line 1143 and ends around 1204.
// Let's find the exact indices in the array.
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{/* ATTENDANCE CALENDAR (August 2026)')) {
        startIdx = i - 1; // include the top comment banner
    }
    if (lines[i].includes('{/* ROLE MANAGEMENT: CURRENT ROLE VS AVAILABLE ROLES')) {
        endIdx = i - 1; // stop before the top comment banner of ROLE MANAGEMENT
        break;
    }
}

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = [
        '              {/* ------------------------------------------------------------- */}',
        '              {/* DYNAMIC ATTENDANCE CALENDAR                                   */}',
        '              {/* ------------------------------------------------------------- */}',
        '              <AttendanceCalendar attendanceData={selectedEmp.attendanceLog || {}} />',
        '              '
    ];
    
    // Splice array
    lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
    
    fs.writeFileSync('src/App.tsx', lines.join('\n'));
    console.log('Successfully replaced calendar by line indices.');
} else {
    console.log('Failed to find start or end index.', startIdx, endIdx);
}

const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{\/\*\s*-------------------------------------------------------------\s*\*\/\}\s*\{\/\*\s*ATTENDANCE CALENDAR \(August 2026\)\s*\*\/\}\s*\{\/\*\s*-------------------------------------------------------------\s*\*\/\}\s*<div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">[\s\S]*?<!-- End of static calendar -->/g;

// Instead of guessing the exact end tag, let's just use substring parsing between the known tags.
const startTag = '{/* ATTENDANCE CALENDAR';
const endBoundary = '{/* ROLE MANAGEMENT';

const startIndex = content.indexOf('{/* ------------------------------------------------------------- */}\n              {/* ATTENDANCE CALENDAR');
const endIndex = content.indexOf('{/* ------------------------------------------------------------- */}\n              {/* ROLE MANAGEMENT');

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = content.substring(0, startIndex) +
    `{/* ------------------------------------------------------------- */}
              {/* DYNAMIC ATTENDANCE CALENDAR                                   */}
              {/* ------------------------------------------------------------- */}
              <AttendanceCalendar attendanceData={selectedEmp.attendanceLog || {}} />
              
              ` + content.substring(endIndex);
              
    fs.writeFileSync('src/App.tsx', newContent);
    console.log('Replaced successfully using substring indices.');
} else {
    console.error('Failed to find indices. Start:', startIndex, 'End:', endIndex);
}

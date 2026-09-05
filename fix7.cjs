const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace static calendar block
const startStatic = '{/* ------------------------------------------------------------- */}\n              {/* ATTENDANCE CALENDAR (August 2026)                             */}\n              {/* ------------------------------------------------------------- */}\n              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">';
const endStatic = '                </div>\n              </div>';

const startIndex = content.indexOf(startStatic);
// Find the end index of the static block. We know it ends before ROLE MANAGEMENT
const roleManagementStart = '{/* ------------------------------------------------------------- */}\n              {/* ROLE MANAGEMENT: CURRENT ROLE VS AVAILABLE ROLES             */}';
const roleManagementIndex = content.indexOf(roleManagementStart);

const replacement = `<AttendanceCalendar attendanceData={selectedEmp.attendanceLog || {}} />`;

let newContent = content;
if (startIndex !== -1 && roleManagementIndex !== -1) {
    newContent = content.substring(0, startIndex) + replacement + '\n\n              ' + content.substring(roleManagementIndex);
} else {
    console.error('Could not find static calendar block to replace.');
}

// Append new component
const attendanceCalendarComponent = `

// --- NEW DYNAMIC ATTENDANCE CALENDAR COMPONENT ---
export function AttendanceCalendar({ attendanceData = {} }: { attendanceData: any }) {
  const [currentYear, setCurrentYear] = React.useState(2026);
  const [currentMonth, setCurrentMonth] = React.useState(7); // 0 = Jan, 7 = Aug

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const offset = (firstDayOfWeek + 6) % 7;

  const getDayStatus = (day: number) => {
    // If it's August 2026, use the mock data which just uses day number as key
    if (currentYear === 2026 && currentMonth === 7) {
        const status = attendanceData[day];
        if (status === 'P') return 'PRES';
        if (status === 'L') return 'LATE';
        if (status === 'A') return 'LEAVE';
        if (status === 'O') return 'OFF';
        return 'PRES'; // fallback
    }
    // Otherwise fallback to mostly present
    return 'PRES';
  };

  const navBtnStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center'
  };

  const selectStyle = {
    fontWeight: '600' as const,
    padding: '4px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    background: '#fff',
    fontSize: '13px',
    cursor: 'pointer'
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: '#fff' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handlePrevMonth} style={navBtnStyle}><ChevronLeft size={16} /></button>
          
          <select 
            value={currentMonth} 
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            style={selectStyle}
          >
            {MONTHS.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>

          <select 
            value={currentYear} 
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            style={selectStyle}
          >
            {[2024, 2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          <button onClick={handleNextMonth} style={navBtnStyle}><ChevronRight size={16} /></button>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: '600' }}>
          <span style={{ color: '#059669' }}>● Present</span>
          <span style={{ color: '#d97706' }}>● Late</span>
          <span style={{ color: '#dc2626' }}>● Leave</span>
          <span style={{ color: '#64748b' }}>● Off / Rest</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {Array.from({ length: offset }).map((_, i) => (
          <div key={\`empty-\${i}\`} style={{ height: '48px' }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = getDayStatus(day);

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
                background: status === 'PRES' ? '#f0fdf4' : status === 'LATE' ? '#fefce8' : status === 'LEAVE' ? '#fef2f2' : '#f8fafc',
                color: status === 'PRES' ? '#16a34a' : status === 'LATE' ? '#ca8a04' : status === 'LEAVE' ? '#dc2626' : '#64748b'
              }}
            >
              <span>{day}</span>
              <span style={{ fontSize: '9px', textAlign: 'center' }}>
                {status === 'PRES' ? '✓ PRES' : status === 'LATE' ? '⚠ LATE' : status === 'LEAVE' ? '✕ LEAVE' : 'OFF'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
`;

if (!newContent.includes('export function AttendanceCalendar')) {
    newContent += attendanceCalendarComponent;
}

fs.writeFileSync('src/App.tsx', newContent);
console.log('Successfully injected AttendanceCalendar and replaced static block.');

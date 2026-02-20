// Timetable Display - Read-only view of Weekly Plan
document.addEventListener('DOMContentLoaded', function() {
    displayTimetable();
});

function getSessions() {
    // Read from the same storage as weekly plan
    const sessions = localStorage.getItem('weeklySessions');
    return sessions ? JSON.parse(sessions) : {};
}

function displayTimetable() {
    const tbody = document.getElementById('timetableBody');
    const sessions = getSessions();
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    tbody.innerHTML = '';
    
    let hasAnySessions = false;
    
    days.forEach(day => {
        const daySessions = sessions[day] || [];
        
        if (daySessions.length > 0) {
            hasAnySessions = true;
            daySessions.forEach(session => {
                const row = document.createElement('tr');
                row.className = 'timetable-row';
                
                const timeStr = formatTime(session.startTime) + ' - ' + formatTime(session.endTime);
                const status = session.status || 'planned';
                const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
                
                row.innerHTML = `
                    <td><span class="day-badge">${day}</span></td>
                    <td><span class="subject-name">${session.subject}</span></td>
                    <td><span class="time-display">${timeStr}</span></td>
                    <td><span class="status-badge status-${status}">${statusDisplay}</span></td>
                `;
                
                tbody.appendChild(row);
            });
        }
    });
    
    if (!hasAnySessions) {
        const emptyRow = document.createElement('tr');
        emptyRow.className = 'empty-row';
        emptyRow.innerHTML = `
            <td colspan="4" class="empty-message">
                No study sessions planned yet. Visit Weekly Plan to add sessions.
            </td>
        `;
        tbody.appendChild(emptyRow);
    }
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

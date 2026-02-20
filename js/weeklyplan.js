// Weekly Plan Management
let currentWeekOffset = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeWeeklyPlan();
});

function initializeWeeklyPlan() {
    // Load default sessions on first visit
    const existingSessions = localStorage.getItem('weeklySessions');
    if (!existingSessions) {
        const defaultSessions = {
            'Monday': [
                { subject: 'Mathematics', startTime: '18:00', endTime: '19:00' }
            ],
            'Tuesday': [
                { subject: 'Science', startTime: '17:00', endTime: '18:00' }
            ],
            'Wednesday': [
                { subject: 'English', startTime: '16:00', endTime: '17:00' }
            ]
        };
        localStorage.setItem('weeklySessions', JSON.stringify(defaultSessions));
    }
    
    updateWeekDisplay();
    displayWeeklyPlan();
}

function updateWeekDisplay() {
    const weekRange = document.getElementById('weekRange');
    const { startDate, endDate } = getWeekDates(currentWeekOffset);
    
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const startStr = startDate.toLocaleDateString('en-US', options);
    const endStr = endDate.toLocaleDateString('en-US', options);
    
    weekRange.textContent = `${startStr} - ${endStr}`;
}

function getWeekDates(offset) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    
    const monday = new Date(today.setDate(diff));
    monday.setDate(monday.getDate() + (offset * 7));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return { startDate: monday, endDate: sunday };
}

function getSessions() {
    const sessions = localStorage.getItem('weeklySessions');
    return sessions ? JSON.parse(sessions) : {};
}

function saveSessions(sessions) {
    localStorage.setItem('weeklySessions', JSON.stringify(sessions));
}

function displayWeeklyPlan() {
    const tbody = document.getElementById('weeklyTableBody');
    const sessions = getSessions();
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    tbody.innerHTML = '';
    
    let hasAnySessions = false;
    
    daysOfWeek.forEach(day => {
        const daySessions = sessions[day] || [];
        
        if (daySessions.length === 0) {
            // Show empty row with add button
            const row = document.createElement('tr');
            row.className = 'empty-row';
            row.innerHTML = `
                <td><span class="day-badge">${day}</span></td>
                <td colspan="2" class="empty-message">No sessions scheduled</td>
                <td>
                    <button class="btn-add-session" onclick="openAddSessionModal('${day}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        } else {
            hasAnySessions = true;
            daySessions.forEach((session, index) => {
                const row = document.createElement('tr');
                row.className = 'session-row';
                
                const timeStr = formatTime(session.startTime) + ' - ' + formatTime(session.endTime);
                
                row.innerHTML = `
                    <td><span class="day-badge">${day}</span></td>
                    <td><span class="subject-name">${session.subject}</span></td>
                    <td><span class="time-display">${timeStr}</span></td>
                    <td>
                        <button class="btn-edit" onclick="editSession('${day}', ${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="deleteSession('${day}', ${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            // Add "add more" row for this day
            const addRow = document.createElement('tr');
            addRow.className = 'add-more-row';
            addRow.innerHTML = `
                <td></td>
                <td colspan="3">
                    <button class="btn-add-more" onclick="openAddSessionModal('${day}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add another session for ${day}
                    </button>
                </td>
            `;
            tbody.appendChild(addRow);
        }
    });
    
    // Add floating action button
    addFloatingActionButton();
}

function addFloatingActionButton() {
    // Remove existing FAB if any
    const existingFab = document.querySelector('.fab');
    if (existingFab) {
        existingFab.remove();
    }
    
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.onclick = () => openAddSessionModal();
    fab.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    `;
    document.body.appendChild(fab);
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

function openAddSessionModal(day = '') {
    const modal = document.getElementById('sessionModal');
    const form = document.getElementById('sessionForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    document.getElementById('editDay').value = '';
    document.getElementById('editIndex').value = '';
    
    if (day) {
        document.getElementById('sessionDay').value = day;
    }
    
    modalTitle.textContent = 'Add Study Session';
    modal.style.display = 'block';
}

function editSession(day, index) {
    const sessions = getSessions();
    const session = sessions[day][index];
    
    const modal = document.getElementById('sessionModal');
    const modalTitle = document.getElementById('modalTitle');
    
    document.getElementById('sessionDay').value = day;
    document.getElementById('sessionSubject').value = session.subject;
    document.getElementById('sessionStartTime').value = session.startTime;
    document.getElementById('sessionEndTime').value = session.endTime;
    document.getElementById('editDay').value = day;
    document.getElementById('editIndex').value = index;
    
    modalTitle.textContent = 'Edit Study Session';
    modal.style.display = 'block';
}

function closeSessionModal() {
    const modal = document.getElementById('sessionModal');
    modal.style.display = 'none';
}

function saveSession(event) {
    event.preventDefault();
    
    const day = document.getElementById('sessionDay').value;
    const subject = document.getElementById('sessionSubject').value.trim();
    const startTime = document.getElementById('sessionStartTime').value;
    const endTime = document.getElementById('sessionEndTime').value;
    const editDay = document.getElementById('editDay').value;
    const editIndex = document.getElementById('editIndex').value;
    
    // Validate times
    if (startTime >= endTime) {
        alert('End time must be after start time!');
        return;
    }
    
    const sessions = getSessions();
    
    // If editing
    if (editDay && editIndex !== '') {
        const index = parseInt(editIndex);
        // Remove from old day if day changed
        if (editDay !== day) {
            sessions[editDay].splice(index, 1);
            if (sessions[editDay].length === 0) {
                delete sessions[editDay];
            }
        } else {
            sessions[editDay].splice(index, 1);
        }
    }
    
    // Add to new/same day
    if (!sessions[day]) {
        sessions[day] = [];
    }
    
    sessions[day].push({
        subject: subject,
        startTime: startTime,
        endTime: endTime
    });
    
    // Sort sessions by start time
    sessions[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    saveSessions(sessions);
    displayWeeklyPlan();
    closeSessionModal();
    showNotification(editDay && editIndex !== '' ? 'Session updated!' : 'Session added!');
}

function deleteSession(day, index) {
    if (!confirm('Delete this study session?')) {
        return;
    }
    
    const sessions = getSessions();
    sessions[day].splice(index, 1);
    
    if (sessions[day].length === 0) {
        delete sessions[day];
    }
    
    saveSessions(sessions);
    displayWeeklyPlan();
    showNotification('Session deleted!');
}

function previousWeek() {
    currentWeekOffset--;
    updateWeekDisplay();
}

function nextWeek() {
    currentWeekOffset++;
    updateWeekDisplay();
}

function goToCurrentWeek() {
    currentWeekOffset = 0;
    updateWeekDisplay();
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('sessionModal');
    if (event.target === modal) {
        closeSessionModal();
    }
});

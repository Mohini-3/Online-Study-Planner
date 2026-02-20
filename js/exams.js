// Exam Tracker Management
let exams = [];
let nextExamId = 1;
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadExams();
    displayExams();
});

function loadExams() {
    const savedExams = localStorage.getItem('examTracker');
    if (savedExams) {
        exams = JSON.parse(savedExams);
        if (exams.length > 0) {
            nextExamId = Math.max(...exams.map(e => e.id)) + 1;
        }
    } else {
        // Load default exams
        exams = [
            {
                id: 1,
                name: 'Mid Term Exam',
                subject: 'Mathematics',
                date: '2025-03-20',
                status: 'Preparing',
                result: 'Pending',
                notes: ''
            },
            {
                id: 2,
                name: 'Unit Test',
                subject: 'Science',
                date: '2025-03-25',
                status: 'Not Started',
                result: 'Pending',
                notes: ''
            },
            {
                id: 3,
                name: 'Model Exam',
                subject: 'English',
                date: '2025-02-10',
                status: 'Ready',
                result: 'Passed',
                notes: ''
            }
        ];
        nextExamId = 4;
        saveExams();
    }
}

function saveExams() {
    localStorage.setItem('examTracker', JSON.stringify(exams));
}

function displayExams() {
    const tbody = document.getElementById('examsTableBody');
    
    // Filter exams based on current filter
    let filteredExams = exams;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (currentFilter === 'upcoming') {
        filteredExams = exams.filter(exam => new Date(exam.date) >= today);
    } else if (currentFilter === 'completed') {
        filteredExams = exams.filter(exam => new Date(exam.date) < today);
    }
    
    // Sort by date (upcoming first)
    filteredExams.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (filteredExams.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h3>No exams found</h3>
                    <p>Click "Add Exam" to create your first exam entry</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredExams.map(exam => {
        const formattedDate = formatDate(exam.date);
        const isPastExam = isPast(exam.date);
        const countdown = getCountdown(exam.date);
        const statusClass = `status-${exam.status.toLowerCase().replace(' ', '-')}`;
        const resultClass = `result-${exam.result.toLowerCase()}`;
        
        // For past exams, check if they wrote it or missed it
        let statusDisplay;
        if (isPastExam) {
            if (exam.result === 'Pending') {
                statusDisplay = '<span class="status-badge status-missed">Missed</span>';
            } else {
                statusDisplay = '<span class="status-badge status-completed">Completed</span>';
            }
        } else {
            statusDisplay = `<span class="status-badge ${statusClass}">${exam.status}</span>`;
        }
        
        return `
            <tr>
                <td class="exam-name">${exam.name}</td>
                <td><span class="subject-badge">${exam.subject}</span></td>
                <td class="date-display">${formattedDate}</td>
                <td>${countdown}</td>
                <td>${statusDisplay}</td>
                <td><span class="result-badge ${resultClass}">${exam.result}</span></td>
                <td>
                    <div class="exam-actions">
                        <button class="btn-edit" onclick="editExam(${exam.id})" title="Edit exam">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="deleteExam(${exam.id})" title="Delete exam">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

function isPast(examDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    return exam < today;
}

function getCountdown(examDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
    
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let countdownClass = '';
    let countdownText = '';
    
    if (diffDays < 0) {
        // Past exam - just show "Completed"
        countdownClass = 'passed';
        countdownText = 'Completed';
    } else if (diffDays === 0) {
        countdownClass = 'urgent';
        countdownText = 'Today!';
    } else if (diffDays <= 3) {
        countdownClass = 'urgent';
        countdownText = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays <= 7) {
        countdownClass = 'soon';
        countdownText = `${diffDays} days`;
    } else {
        countdownClass = 'later';
        countdownText = `${diffDays} days`;
    }
    
    return `<span class="countdown ${countdownClass}">${countdownText}</span>`;
}

function filterExams(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayExams();
}

function openAddExamModal() {
    const modal = document.getElementById('examModal');
    const form = document.getElementById('examForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    document.getElementById('editExamId').value = '';
    
    modalTitle.textContent = 'Add Exam';
    modal.style.display = 'block';
}

function editExam(id) {
    const exam = exams.find(e => e.id === id);
    if (!exam) return;
    
    const modal = document.getElementById('examModal');
    const modalTitle = document.getElementById('modalTitle');
    
    document.getElementById('editExamId').value = exam.id;
    document.getElementById('examName').value = exam.name;
    document.getElementById('examSubject').value = exam.subject;
    document.getElementById('examDate').value = exam.date;
    document.getElementById('examStatus').value = exam.status;
    document.getElementById('examResult').value = exam.result;
    document.getElementById('examNotes').value = exam.notes || '';
    
    modalTitle.textContent = 'Edit Exam';
    modal.style.display = 'block';
}

function closeExamModal() {
    const modal = document.getElementById('examModal');
    modal.style.display = 'none';
}

function saveExam(event) {
    event.preventDefault();
    
    const editId = document.getElementById('editExamId').value;
    const name = document.getElementById('examName').value.trim();
    const subject = document.getElementById('examSubject').value.trim();
    const date = document.getElementById('examDate').value;
    const status = document.getElementById('examStatus').value;
    const result = document.getElementById('examResult').value;
    const notes = document.getElementById('examNotes').value.trim();
    
    if (editId) {
        // Edit existing exam
        const examIndex = exams.findIndex(e => e.id === parseInt(editId));
        if (examIndex !== -1) {
            exams[examIndex] = {
                ...exams[examIndex],
                name,
                subject,
                date,
                status,
                result,
                notes
            };
            showNotification('Exam updated successfully!');
        }
    } else {
        // Add new exam
        exams.push({
            id: nextExamId++,
            name,
            subject,
            date,
            status,
            result,
            notes
        });
        showNotification('Exam added successfully!');
    }
    
    saveExams();
    displayExams();
    closeExamModal();
}

function deleteExam(id) {
    if (!confirm('Are you sure you want to delete this exam?')) {
        return;
    }
    
    exams = exams.filter(e => e.id !== id);
    saveExams();
    displayExams();
    showNotification('Exam deleted successfully!');
}

function showNotification(message) {
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
    const modal = document.getElementById('examModal');
    if (event.target === modal) {
        closeExamModal();
    }
});

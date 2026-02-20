// Study Goals Management
let goals = [];
let nextGoalId = 1;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadGoals();
    displayGoals();
});

function loadGoals() {
    const savedGoals = localStorage.getItem('studyGoals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
        // Find the highest ID to continue from
        if (goals.length > 0) {
            nextGoalId = Math.max(...goals.map(g => g.id)) + 1;
        }
    } else {
        // Load default goals
        goals = [
            {
                id: 1,
                title: 'Complete Algebra',
                subject: 'Math',
                date: '2025-03-20',
                progress: 70,
                priority: 'High',
                status: 'In Progress'
            },
            {
                id: 2,
                title: 'Revise Physics Unit-1',
                subject: 'Physics',
                date: '2025-03-25',
                progress: 100,
                priority: 'Medium',
                status: 'Completed'
            },
            {
                id: 3,
                title: 'Learn HTML Basics',
                subject: 'Computer',
                date: '2025-03-30',
                progress: 40,
                priority: 'Low',
                status: 'In Progress'
            },
            {
                id: 4,
                title: 'HTML Web Practice',
                subject: 'Web',
                date: '2026-02-03',
                progress: 80,
                priority: 'Medium',
                status: 'Completed'
            }
        ];
        nextGoalId = 5;
        saveGoals();
    }
}

function saveGoals() {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
}

function displayGoals() {
    const tbody = document.getElementById('goalsTableBody');
    
    if (goals.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3>No goals yet</h3>
                    <p>Click "Add Goal" to create your first study goal</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = goals.map(goal => {
        const formattedDate = formatDate(goal.date);
        const priorityClass = `priority-${goal.priority.toLowerCase()}`;
        const statusClass = `status-${goal.status.toLowerCase().replace(' ', '-')}`;
        
        return `
            <tr>
                <td class="goal-title">${goal.title}</td>
                <td><span class="subject-badge">${goal.subject}</span></td>
                <td class="date-display">${formattedDate}</td>
                <td>
                    <div class="progress-container">
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar" style="width: ${goal.progress}%"></div>
                        </div>
                        <span class="progress-text">${goal.progress}%</span>
                    </div>
                </td>
                <td><span class="priority-badge ${priorityClass}">${goal.priority}</span></td>
                <td><span class="status-badge ${statusClass}">${goal.status}</span></td>
                <td>
                    <div class="goal-actions">
                        <button class="btn-edit" onclick="editGoal(${goal.id})" title="Edit goal">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="btn-delete" onclick="deleteGoal(${goal.id})" title="Delete goal">
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

function openAddGoalModal() {
    const modal = document.getElementById('goalModal');
    const form = document.getElementById('goalForm');
    const modalTitle = document.getElementById('modalTitle');
    
    form.reset();
    document.getElementById('editGoalId').value = '';
    
    modalTitle.textContent = 'Add Study Goal';
    modal.style.display = 'block';
}

function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const modal = document.getElementById('goalModal');
    const modalTitle = document.getElementById('modalTitle');
    
    document.getElementById('editGoalId').value = goal.id;
    document.getElementById('goalTitle').value = goal.title;
    document.getElementById('goalSubject').value = goal.subject;
    document.getElementById('goalDate').value = goal.date;
    document.getElementById('goalProgress').value = goal.progress;
    document.getElementById('goalPriority').value = goal.priority;
    document.getElementById('goalStatus').value = goal.status;
    
    modalTitle.textContent = 'Edit Study Goal';
    modal.style.display = 'block';
}

function closeGoalModal() {
    const modal = document.getElementById('goalModal');
    modal.style.display = 'none';
}

function saveGoal(event) {
    event.preventDefault();
    
    const editId = document.getElementById('editGoalId').value;
    const title = document.getElementById('goalTitle').value.trim();
    const subject = document.getElementById('goalSubject').value.trim();
    const date = document.getElementById('goalDate').value;
    const progress = parseInt(document.getElementById('goalProgress').value);
    const priority = document.getElementById('goalPriority').value;
    const status = document.getElementById('goalStatus').value;
    
    // Validate progress
    if (progress < 0 || progress > 100) {
        alert('Progress must be between 0 and 100');
        return;
    }
    
    if (editId) {
        // Edit existing goal
        const goalIndex = goals.findIndex(g => g.id === parseInt(editId));
        if (goalIndex !== -1) {
            goals[goalIndex] = {
                ...goals[goalIndex],
                title,
                subject,
                date,
                progress,
                priority,
                status
            };
            showNotification('Goal updated successfully!');
        }
    } else {
        // Add new goal
        goals.push({
            id: nextGoalId++,
            title,
            subject,
            date,
            progress,
            priority,
            status
        });
        showNotification('Goal added successfully!');
    }
    
    saveGoals();
    displayGoals();
    closeGoalModal();
}

function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this goal?')) {
        return;
    }
    
    goals = goals.filter(g => g.id !== id);
    saveGoals();
    displayGoals();
    showNotification('Goal deleted successfully!');
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
    const modal = document.getElementById('goalModal');
    if (event.target === modal) {
        closeGoalModal();
    }
});

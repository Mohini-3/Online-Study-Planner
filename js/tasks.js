// Initialize tasks and display date/time
function initializeTasks() {
    // Display current date and time
    showDateTime();
    
    let tasks = getTasks();
    
    // If no tasks exist, add default ones
    if (tasks.length === 0) {
        tasks = [
            {
                id: Date.now(),
                name: 'Solve Algebra Problems',
                subject: 'Math',
                status: 'pending'
            },
            {
                id: Date.now() + 1,
                name: 'Read Chapter 2',
                subject: 'Science',
                status: 'completed'
            },
            {
                id: Date.now() + 2,
                name: 'Write Essay',
                subject: 'English',
                status: 'pending'
            }
        ];
        saveTasks(tasks);
    }
    
    displayTasks();
}

// Display current date and time
function showDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    const dateTimeString = now.toLocaleString('en-US', options);
    document.getElementById('datetime').textContent = dateTimeString;
}

// Get tasks from localStorage
function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Display tasks in the table
function displayTasks() {
    const tasks = getTasks();
    const tbody = document.getElementById('tasksTableBody');
    const emptyState = document.getElementById('emptyState');
    const table = document.querySelector('.tasks-table');
    
    if (tasks.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    table.style.display = 'table';
    emptyState.style.display = 'none';
    
    tbody.innerHTML = tasks.map(task => `
        <tr class="task-row">
            <td class="task-name">${task.name}</td>
            <td class="task-subject">
                <span class="subject-badge">${task.subject}</span>
            </td>
            <td class="task-status">
                <button class="status-badge status-${task.status}" onclick="toggleTaskStatus(${task.id})">
                    ${task.status === 'completed' ? 
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : 
                        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>'
                    }
                    ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </button>
            </td>
            <td class="task-actions">
                <button class="btn-delete-task" onclick="deleteTask(${task.id})" title="Delete task">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle task status between pending and completed
function toggleTaskStatus(id) {
    let tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        saveTasks(tasks);
        displayTasks();
        
        const statusText = task.status === 'completed' ? 'completed' : 'marked as pending';
        showNotification(`Task ${statusText}!`);
    }
}

// Open add task modal
function openAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'flex';
    document.getElementById('addTaskForm').reset();
}

// Close add task modal
function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

// Add new task
function addTask(event) {
    event.preventDefault();
    
    const name = document.getElementById('taskName').value.trim();
    const subject = document.getElementById('taskSubject').value.trim();
    
    const tasks = getTasks();
    
    const newTask = {
        id: Date.now(),
        name: name,
        subject: subject,
        status: 'pending'
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    displayTasks();
    closeAddTaskModal();
    
    showNotification('Task added successfully!');
}

// Delete task
function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    displayTasks();
    
    showNotification('Task deleted successfully!');
}

// Show notification
function showNotification(message) {
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
            document.body.removeChild(notification);
        }, 300);
    }, 2500);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addTaskModal');
    if (event.target === modal) {
        closeAddTaskModal();
    }
}

// Update time every second
setInterval(showDateTime, 1000);

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeTasks);

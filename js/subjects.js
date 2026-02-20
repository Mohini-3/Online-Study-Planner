// Initialize subjects from localStorage or default subjects
function initializeSubjects() {
    let subjects = getSubjects();
    
    // If no subjects exist, add default ones
    if (subjects.length === 0) {
        subjects = [
            {
                id: Date.now(),
                name: 'Mathematics',
                difficulty: 'Medium',
                link: 'https://www.khanacademy.org/math'
            },
            {
                id: Date.now() + 1,
                name: 'Science',
                difficulty: 'Medium',
                link: 'https://www.khanacademy.org/science'
            }
        ];
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }
    
    displaySubjects();
}

// Get subjects from localStorage
function getSubjects() {
    const subjects = localStorage.getItem('subjects');
    return subjects ? JSON.parse(subjects) : [];
}

// Save subjects to localStorage
function saveSubjects(subjects) {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Display subjects in the grid
function displaySubjects() {
    const subjects = getSubjects();
    const grid = document.getElementById('subjectsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (subjects.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <div class="subject-header">
                ${getSubjectIconHTML(subject.name)}
                <button class="btn-delete" onclick="deleteSubject(${subject.id})" title="Delete subject">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                    </svg>
                </button>
            </div>
            <div class="subject-body">
                <h3>${subject.name}</h3>
                <div class="difficulty-badge difficulty-${subject.difficulty.toLowerCase()}">
                    ${subject.difficulty}
                </div>
            </div>
            ${subject.link ? `
                <div class="subject-footer">
                    <a href="${subject.link}" target="_blank" class="subject-link">
                        View Resources
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                    </a>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Get icon HTML based on subject name
function getSubjectIconHTML(name) {
    const nameLower = name.toLowerCase();
    
    // Use images for Math and Science
    if (nameLower.includes('math')) {
        return '<img src="../public/math.png" class="subject-image" alt="Mathematics">';
    }
    if (nameLower.includes('science')) {
        return '<img src="../public/science.png" class="subject-image" alt="Science">';
    }
    
    // Use emoji icons for other subjects
    return `<div class="subject-icon">${getSubjectIcon(name)}</div>`;
}

// Get icon based on subject name
function getSubjectIcon(name) {
    const icons = {
        'math': '➗',
        'science': '🔬',
        'physics': '⚛️',
        'chemistry': '🧪',
        'biology': '🧬',
        'english': '📖',
        'history': '📜',
        'geography': '🌍',
        'computer': '💻',
        'art': '🎨',
        'music': '🎵',
        'economics': '📊'
    };
    
    const nameLower = name.toLowerCase();
    for (let key in icons) {
        if (nameLower.includes(key)) {
            return icons[key];
        }
    }
    return '📚'; // Default icon
}

// Open add subject modal
function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
    document.getElementById('addSubjectForm').reset();
}

// Close add subject modal
function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Add new subject
function addSubject(event) {
    event.preventDefault();
    
    const name = document.getElementById('subjectName').value.trim();
    const difficulty = document.getElementById('subjectDifficulty').value;
    const link = document.getElementById('subjectLink').value.trim();
    
    const subjects = getSubjects();
    
    const newSubject = {
        id: Date.now(),
        name: name,
        difficulty: difficulty,
        link: link || null
    };
    
    subjects.push(newSubject);
    saveSubjects(subjects);
    displaySubjects();
    closeAddModal();
    
    // Show success feedback
    showNotification('Subject added successfully!');
}

// Delete subject
function deleteSubject(id) {
    if (!confirm('Are you sure you want to delete this subject?')) {
        return;
    }
    
    let subjects = getSubjects();
    subjects = subjects.filter(subject => subject.id !== id);
    saveSubjects(subjects);
    displaySubjects();
    
    showNotification('Subject deleted successfully!');
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
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeAddModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSubjects);

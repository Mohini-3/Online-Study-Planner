import React from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'subjects', label: 'Subjects', icon: 'fas fa-book' },
    { id: 'exams', label: 'Exam Tracker', icon: 'fas fa-file-alt' },
    { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { id: 'goals', label: 'Goals', icon: 'fas fa-bullseye' },
    { id: 'studytips', label: 'Study Tips', icon: 'fas fa-lightbulb' },
    { id: 'timetable', label: 'Timetable', icon: 'fas fa-calendar-alt' },
    { id: 'weeklyplan', label: 'Weekly Plan', icon: 'fas fa-calendar-week' }
  ];

  return (
    <aside className="sidebar">
      <ul className="menu-list">
        {menuItems.map(item => (
          <li key={item.id} className="menu-item">
            <button
              className={`menu-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <i className={`menu-icon ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;

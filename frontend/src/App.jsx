import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Exams from './pages/Exams';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import StudyTips from './pages/StudyTips';
import Timetable from './pages/Timetable';
import WeeklyPlan from './pages/WeeklyPlan';
import Auth from './pages/Auth';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id);
      setUserData(user);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setUserId(user.id);
    setUserData(user);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserId(null);
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setCurrentPage('auth');
  };

  const renderPage = () => {
    if (!isLoggedIn) {
      return <Auth onLogin={handleLogin} />;
    }

    const pages = {
      dashboard: <Dashboard userId={userId} userName={userData?.full_name} />,
      subjects: <Subjects userId={userId} />,
      exams: <Exams userId={userId} />,
      tasks: <Tasks userId={userId} />,
      goals: <Goals userId={userId} />,
      studytips: <StudyTips userId={userId} />,
      timetable: <Timetable userId={userId} />,
      weeklyplan: <WeeklyPlan userId={userId} />
    };

    return pages[currentPage] || pages['dashboard'];
  };

  return (
    <div className="app">
      {isLoggedIn && <Header userName={userData?.full_name} onLogout={handleLogout} />}
      <div className="main-content-wrapper">
        {isLoggedIn && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

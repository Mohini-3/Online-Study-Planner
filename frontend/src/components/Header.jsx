import React, { useState } from 'react';

function Header({ userName, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: userName || '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Search functionality can be expanded here
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: userName || '', email: '', subject: '', message: '' });
    setShowContactForm(false);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="header-container">
        <div className="header-left">
          <h1 className="brand-title">Online Study Planner</h1>
        </div>

        <div className="header-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search subjects, exams, tasks..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        <nav className="header-nav">
          <button 
            className="nav-link contact-btn"
            onClick={() => setShowContactForm(true)}
            title="Contact Us"
          >
            <i className="fas fa-envelope"></i>
            <span>Contact Us</span>
          </button>

          <div className="user-menu">
            <button 
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="User Menu"
            >
              <i className="fas fa-user-circle"></i>
              <span className="user-name">{userName}</span>
              <i className="fas fa-chevron-down"></i>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <i className="fas fa-user"></i>
                  <span>{userName}</span>
                </div>
                <hr />
                <button className="dropdown-item settings-item">
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
                <button className="dropdown-item profile-item">
                  <i className="fas fa-id-card"></i>
                  Profile
                </button>
                <hr />
                <button 
                  className="dropdown-item logout-item"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {showContactForm && (
        <div className="modal-overlay" onClick={() => setShowContactForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Us</h2>
              <button 
                className="modal-close"
                onClick={() => setShowContactForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Your message here..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

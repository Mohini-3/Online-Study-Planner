import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function Timetable({ userId }) {
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    subject_id: '',
    start_time: '',
    end_time: '',
    topic: ''
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [timetableRes, subjectsRes] = await Promise.all([
        axios.get(`${API_URL}/timetable/${userId}`),
        axios.get(`${API_URL}/subjects/${userId}`)
      ]);
      setTimetable(timetableRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ day: 'Monday', subject_id: '', start_time: '', end_time: '', topic: '' });
    setShowModal(true);
  };

  const handleEditClick = (entry) => {
    setEditId(entry.id);
    setFormData({
      day: entry.day,
      subject_id: entry.subject_id || '',
      start_time: entry.start_time,
      end_time: entry.end_time,
      topic: entry.topic || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/timetable/${editId}`, {
          ...formData,
          subject_id: formData.subject_id || null
        });
      } else {
        await axios.post(`${API_URL}/timetable`, {
          user_id: userId,
          ...formData,
          subject_id: formData.subject_id || null
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving timetable entry:', error);
      alert('Error saving entry');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/timetable/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading timetable...</div>;

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <div>
          <h1>Weekly Study Timetable</h1>
          <p>Plan your weekly study schedule</p>
        </div>
        <button className="btn-add-exam" onClick={handleAddClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Session
        </button>
      </div>

      {timetable.length === 0 ? (
        <div className="empty-state">
          <p>No timetable entries yet</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="exams-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Topic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.day}</td>
                  <td>{entry.subject_name || 'N/A'}</td>
                  <td>{entry.start_time} - {entry.end_time}</td>
                  <td>{entry.topic || 'N/A'}</td>
                  <td>
                    <button className="btn-sm edit" onClick={() => handleEditClick(entry)}>Edit</button>
                    <button className="btn-sm delete" onClick={() => handleDelete(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Session' : 'Add Timetable Session'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Day *</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  required
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Algebra Chapter 5"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timetable;

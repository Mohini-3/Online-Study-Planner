import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function StudyTips({ userId }) {
  const [tips, setTips] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject_id: ''
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [tipsRes, subjectsRes] = await Promise.all([
        axios.get(`${API_URL}/studytips/${userId}`),
        axios.get(`${API_URL}/subjects/${userId}`)
      ]);
      setTips(tipsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ title: '', content: '', subject_id: '' });
    setShowModal(true);
  };

  const handleEditClick = (tip) => {
    setEditId(tip.id);
    setFormData({
      title: tip.title,
      content: tip.content || '',
      subject_id: tip.subject_id || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/studytips/${editId}`, {
          ...formData,
          subject_id: formData.subject_id || null
        });
      } else {
        await axios.post(`${API_URL}/studytips`, {
          user_id: userId,
          ...formData,
          subject_id: formData.subject_id || null
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving tip:', error);
      alert('Error saving tip');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/studytips/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting tip:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading study tips...</div>;

  return (
    <div className="studytips-container">
      <div className="studytips-header">
        <div>
          <h1>Study Tips</h1>
          <p>Save and organize helpful study tips and resources</p>
        </div>
        <button className="btn-add-exam" onClick={handleAddClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Tip
        </button>
      </div>

      {tips.length === 0 ? (
        <div className="empty-state">
          <p>No study tips yet</p>
        </div>
      ) : (
        <div className="tips-list">
          {tips.map(tip => (
            <div key={tip.id} className="tip-card">
              <div className="tip-header">
                <h3>{tip.title}</h3>
                <p className="tip-subject">{tip.subject_name || 'General'}</p>
              </div>
              <p className="tip-content">{tip.content}</p>
              <div className="tip-actions">
                <button className="btn-sm edit" onClick={() => handleEditClick(tip)}>Edit</button>
                <button className="btn-sm delete" onClick={() => handleDelete(tip.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Tip' : 'Add Study Tip'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter tip title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter tip content"
                  rows="5"
                  required
                />
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

export default StudyTips;

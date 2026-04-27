import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Subjects({ userId }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, [userId]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects/${userId}`);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ name: '', code: '' });
    setShowModal(true);
  };

  const handleEditClick = (subject) => {
    setEditId(subject.id);
    setFormData({ name: subject.name, code: subject.code || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/subjects/${editId}`, {
          ...formData
        });
      } else {
        await axios.post(`${API_URL}/subjects`, {
          user_id: userId,
          ...formData
        });
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('Error saving subject');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/subjects/${id}`);
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading subjects...</div>;

  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <div>
          <h1>Subjects Overview</h1>
          <p>Manage your academic subjects and track your progress</p>
        </div>
        <button className="btn-add" onClick={handleAddClick}>
          <span>+</span> Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><i className="fas fa-book fa-3x"></i></div>
          <h3>No subjects yet</h3>
          <p>Click "Add Subject" to start organizing your studies</p>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map(subject => (
            <div key={subject.id} className="subject-card">
              <h3>{subject.name}</h3>
              {subject.code && <p className="subject-code">{subject.code}</p>}
              <div className="subject-actions">
                <button className="btn-edit" onClick={() => handleEditClick(subject)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(subject.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Subject' : 'Add Subject'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="form-group">
                <label>Subject Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., MTH101"
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

export default Subjects;

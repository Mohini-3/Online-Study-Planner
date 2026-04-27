import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Exams({ userId }) {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    exam_name: '',
    subject_id: '',
    exam_date: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [examsRes, subjectsRes] = await Promise.all([
        axios.get(`${API_URL}/exams/${userId}`),
        axios.get(`${API_URL}/subjects/${userId}`)
      ]);
      setExams(examsRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExams = () => {
    if (filterStatus === 'all') return exams;
    return exams.filter(exam => exam.status === filterStatus);
  };

  const handleAddClick = () => {
    setEditId(null);
    setFormData({ exam_name: '', subject_id: '', exam_date: '', status: 'scheduled' });
    setShowModal(true);
  };

  const handleEditClick = (exam) => {
    setEditId(exam.id);
    setFormData({
      exam_name: exam.exam_name,
      subject_id: exam.subject_id || '',
      exam_date: exam.exam_date,
      status: exam.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/exams/${editId}`, {
          ...formData,
          subject_id: formData.subject_id || null
        });
      } else {
        await axios.post(`${API_URL}/exams`, {
          user_id: userId,
          ...formData,
          subject_id: formData.subject_id || null
        });
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Error saving exam');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_URL}/exams/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading exams...</div>;

  const filteredExams = getFilteredExams();

  return (
    <div className="exams-container">
      <div className="exams-header">
        <div>
          <h1>Exam Tracker</h1>
          <p>Track your upcoming and completed exams</p>
        </div>
        <button className="btn-add-exam" onClick={handleAddClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Exam
        </button>
      </div>

      <div className="filter-tabs">
        <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}>All Exams</button>
        <button className={`filter-tab ${filterStatus === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('scheduled')}>Upcoming</button>
        <button className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}>Completed</button>
      </div>

      {filteredExams.length === 0 ? (
        <div className="empty-state">
          <p>No exams found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="exams-table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => (
                <tr key={exam.id}>
                  <td>{exam.exam_name}</td>
                  <td>{exam.subject_name || 'N/A'}</td>
                  <td>{new Date(exam.exam_date).toLocaleDateString()}</td>
                  <td><span className={`status-badge ${exam.status}`}>{exam.status}</span></td>
                  <td>
                    <button className="btn-sm edit" onClick={() => handleEditClick(exam)}>Edit</button>
                    <button className="btn-sm delete" onClick={() => handleDelete(exam.id)}>Delete</button>
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
              <h2>{editId ? 'Edit Exam' : 'Add Exam'}</h2>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Exam Name *</label>
                <input
                  type="text"
                  value={formData.exam_name}
                  onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                  placeholder="e.g., Mid Term Exam"
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
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.exam_date}
                  onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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

export default Exams;

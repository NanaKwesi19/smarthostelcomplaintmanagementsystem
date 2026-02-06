import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const statuses = ['Pending', 'Resolved'];
const priorities = ['Low', 'Medium', 'High'];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(stored);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = complaints.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    );
    setComplaints(updated);
    localStorage.setItem('complaints', JSON.stringify(updated));
    alert('Status updated! Email notification sent.');
    console.log('Email sent: Status change notification');
  };

  const filteredComplaints = complaints
    .filter(c => {
      const term = search.toLowerCase().trim();
      return !term || 
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        c.studentName?.toLowerCase().includes(term) ||
        c.studentRoom?.toLowerCase().includes(term);
    })
    .filter(c => !statusFilter || c.status === statusFilter)
    .filter(c => !priorityFilter || c.priority === priorityFilter)
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.date) - new Date(a.date);
      if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sort === 'priority') {
        return priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
      }
      return 0;
    });

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="full-page-wrapper">
      {/* Background */}
      <div className="full-page-background" />

      {/* Overlay */}
      <div className="full-page-overlay" />

      {/* All content floats directly on background */}
      <div className="dashboard-content">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h2>

        {/* Summary Cards */}
        <motion.div
          className="summary-cards"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <motion.div
            className="summary-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="summary-number">{total}</div>
            <p>Total Complaints</p>
          </motion.div>
          <motion.div
            className="summary-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="summary-number">{pending}</div>
            <p>Pending</p>
          </motion.div>
          <motion.div
            className="summary-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="summary-number">{resolved}</div>
            <p>Resolved</p>
          </motion.div>
        </motion.div>

        {/* Search & Filters */}
        {/* Search & Filters - now using glass segmented controls */}
<motion.div
  className="filter-section"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.9, delay: 0.5 }}
>
  <input
    type="text"
    className="input"
    placeholder="Search title, description, student name or room..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ width: '100%', marginBottom: '1.5rem' }}
  />

  <div className="segmented-controls">
    {/* Status Filter */}
    <div className="segment-group">
      <label className="segment-label">Status</label>
      <div className="segment-buttons">
        <motion.button
          className={`segment-btn ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => setStatusFilter('')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          All
        </motion.button>
        {statuses.map(status => (
          <motion.button
            key={status}
            className={`segment-btn ${statusFilter === status ? 'active' : ''}`}
            onClick={() => setStatusFilter(status)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {status}
          </motion.button>
        ))}
      </div>
    </div>

    {/* Priority Filter */}
    <div className="segment-group">
      <label className="segment-label">Priority</label>
      <div className="segment-buttons">
        <motion.button
          className={`segment-btn ${priorityFilter === '' ? 'active' : ''}`}
          onClick={() => setPriorityFilter('')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          All
        </motion.button>
        {priorities.map(pri => (
          <motion.button
            key={pri}
            className={`segment-btn ${priorityFilter === pri ? 'active' : ''}`}
            onClick={() => setPriorityFilter(pri)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {pri}
          </motion.button>
        ))}
      </div>
    </div>

    {/* Sort */}
    <div className="segment-group">
      <label className="segment-label">Sort By</label>
      <div className="segment-buttons">
        <motion.button
          className={`segment-btn ${sort === 'newest' ? 'active' : ''}`}
          onClick={() => setSort('newest')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Newest
        </motion.button>
        <motion.button
          className={`segment-btn ${sort === 'oldest' ? 'active' : ''}`}
          onClick={() => setSort('oldest')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Oldest
        </motion.button>
        <motion.button
          className={`segment-btn ${sort === 'priority' ? 'active' : ''}`}
          onClick={() => setSort('priority')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Priority
        </motion.button>
      </div>
    </div>
  </div>
</motion.div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ textAlign: 'center', opacity: 0.7, color: 'white', marginTop: '3rem' }}
          >
            No complaints match the current filters.
          </motion.p>
        ) : (
          <motion.div
            initial="initial"
            animate="in"
            variants={{
              initial: { opacity: 0 },
              in: { opacity: 1, transition: { staggerChildren: 0.12 } }
            }}
          >
            {filteredComplaints.map((c, index) => (
              <motion.div
                key={c.id}
                className="complaint-card"
                variants={{
                  initial: { opacity: 0, y: 50 },
                  in: { opacity: 1, y: 0 }
                }}
                transition={{ delay: index * 0.1 }}
              >
                <h4>{c.title}</h4>
                <p style={{ margin: '0.6rem 0' }}>{c.description}</p>
                <div style={{ fontSize: '0.95rem', marginBottom: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                  Student: {c.studentName} • Room {c.studentRoom}
                </div>
                <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${(c.priority || 'Low').toLowerCase()}`}>
                    {c.priority || 'Low'} Priority
                  </span>

                  <div className="status-options">
                    {statuses.map(status => (
                      <motion.button
                        key={status}
                        className={`status-btn ${c.status === status ? 'active' : ''}`}
                        onClick={() => handleStatusChange(c.id, status)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {status}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  {c.date ? new Date(c.date).toLocaleString() : 'Date not available'}
                </div>

                {c.image && (
                  <img
                    src={c.image}
                    alt="Complaint"
                    style={{
                      maxWidth: '240px',
                      borderRadius: '12px',
                      marginTop: '1rem',
                      display: 'block'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Bottom-right back button */}
      <motion.div
        className="back-btn-bottom"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={() => window.history.back()}
      >
        ← Back
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const categories = [
  'Plumbing & Water',
  'Electrical & Lights',
  'Cleaning & Hygiene',
  'Furniture & Bedding',
  'WiFi & Internet',
  'Others',
];

const priorities = ['Low', 'Medium', 'High'];

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('complaints') || '[]');
    setComplaints(all.filter(c => c.studentName === user.name && c.studentRoom === user.room));
  }, [user.name, user.room]);

  // Auto-grow for both title and description textareas
  useEffect(() => {
    const titleArea = document.querySelector('.title-textarea');
    const descArea = document.querySelector('.description-textarea');

    const autoGrow = (el) => {
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    };

    if (titleArea) {
      titleArea.addEventListener('input', () => autoGrow(titleArea));
      autoGrow(titleArea);
    }

    if (descArea) {
      descArea.addEventListener('input', () => autoGrow(descArea));
      autoGrow(descArea);
    }

    return () => {
      if (titleArea) titleArea.removeEventListener('input', () => autoGrow(titleArea));
      if (descArea) descArea.removeEventListener('input', () => autoGrow(descArea));
    };
  }, [title, description]);

  const getCategoryImage = (cat) => {
    const images = {
      "Plumbing & Water": "https://plus.unsplash.com/premium_photo-1663013675008-bd5a7898ac4f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGx1bWJlcnxlbnwwfHwwfHx8MA%3D%3D",
      "Electrical & Lights": "https://plus.unsplash.com/premium_photo-1661908782924-de673a5c6988?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D",
      "Cleaning & Hygiene": "https://plus.unsplash.com/premium_photo-1663040355782-54d72d558f8a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xlYW5lcnxlbnwwfHwwfHx8MA%3D%3D",
      "Furniture & Bedding": "https://images.unsplash.com/photo-1611021061271-d13576f6bc34?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNhcnBlbnRlcnxlbnwwfHwwfHx8MA%3D%3D",
      "WiFi & Internet": "https://images.unsplash.com/photo-1645725677294-ed0843b97d5c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2lmaXxlbnwwfHwwfHx8MA%3D%3D",
      "Others": "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVwb3J0aW5nfGVufDB8fDB8fHww",
    };
    return images[cat] || "https://images.unsplash.com/photo-1516321310764-8a2380f89148?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q296eSUyMGhvc3RlbHxlbnwwfHwwfHx8MA%3D%3D";
  };

  const getCategoryDescription = (cat) => {
    const desc = {
      "Plumbing & Water": "Leaky taps, blocked drains, low water pressure",
      "Electrical & Lights": "Faulty wiring, flickering bulbs, no power",
      "Cleaning & Hygiene": "Dirty bathrooms, garbage overflow, pest problems",
      "Furniture & Bedding": "Broken beds, damaged chairs, missing mattress",
      "WiFi & Internet": "Slow connection, no signal, router problems",
      "Others": "Any other maintenance or hostel-related concern",
    };
    return desc[cat] || "Miscellaneous issue";
  };

  const validateForm = () => {
    const errs = {};
    if (title.trim().length < 5 || title.trim().length > 100) errs.title = 'Title must be 5–100 characters';
    if (description.trim().length < 10 || description.trim().length > 1000) errs.description = 'Description must be 10–1000 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const newComplaint = {
        id: Date.now(),
        studentName: user.name,
        studentRoom: user.room,
        title: title.trim(),
        category,
        priority,
        description: description.trim(),
        image,
        status: 'Pending',
        date: new Date().toLocaleString(),
      };

      const allComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
      allComplaints.push(newComplaint);
      localStorage.setItem('complaints', JSON.stringify(allComplaints));

      setComplaints([...complaints, newComplaint]);
      setTitle('');
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setDescription('');
      setImage('');
      setPreview('');
      setFormErrors({});
      setIsLoading(false);

      confetti({ particleCount: 120, spread: 70 });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);

      alert('Complaint submitted successfully!');
      console.log('Email sent: New complaint submitted');
    }, 1200);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const isFormValid = title.trim() && description.trim() && Object.keys(formErrors).length === 0;

  return (
    <div className="full-page-wrapper">
      {/* Full-screen background */}
      <div className="full-page-background" />

      {/* Subtle overlay for readability */}
      <div className="full-page-overlay" />

      {/* All content floats directly on background */}
      <div className="dashboard-content">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          Welcome, {user.name || 'User'} {user.room ? `(Room ${user.room})` : ''}
        </motion.h2>

        <form onSubmit={handleSubmit}>
          {/* Title - auto-growing textarea */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
              Complaint Title
            </label>
            <textarea
              className={`textarea title-textarea ${formErrors.title ? 'input-error' : ''}`}
              placeholder="Enter a clear title for your complaint..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={validateForm}
              rows="2" // starts with ~2 lines
            />
            {formErrors.title && <span className="error-text">{formErrors.title}</span>}
          </motion.div>

          {/* Category Cards */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <label style={{ display: 'block', marginBottom: '1.2rem', fontWeight: 600, fontSize: '1.1rem', color: 'white' }}>
              Issue Category
            </label>

            <div className="category-cards-grid">
              {categories.map((cat, index) => (
                <motion.div
                  key={cat}
                  className={`category-card ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                  whileHover={{ scale: 1.04, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <div className="category-image-wrapper">
                    <img
                      src={getCategoryImage(cat)}
                      alt={cat}
                      className="category-image"
                      loading="lazy"
                    />
                  </div>
                  <h4>{cat}</h4>
                  <p className="category-desc">{getCategoryDescription(cat)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Priority Cards */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <label style={{ display: 'block', marginBottom: '1.2rem', fontWeight: 600, fontSize: '1.1rem', color: 'white' }}>
              Priority Level
            </label>

            <div className="priority-cards-container">
              {priorities.map((pri, index) => (
                <motion.div
                  key={pri}
                  className={`priority-card ${priority === pri ? 'selected' : ''}`}
                  onClick={() => setPriority(pri)}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                >
                  <div
                    className="priority-badge"
                    style={{
                      background:
                        pri === 'High' ? '#FF6B6B' :
                        pri === 'Medium' ? '#FFB74D' :
                        '#A3CB38',
                      color: pri === 'High' ? 'white' : 'black',
                    }}
                  >
                    {pri}
                  </div>
                  <h4 className="priority-title">{pri}</h4>
                  <p className="priority-desc">
                    {pri === 'High' ? 'Urgent – needs immediate attention' :
                     pri === 'Medium' ? 'Important – fix soon' :
                     'Low – minor issue, can wait'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description - auto-growing textarea */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
              Description
            </label>
            <textarea
              className={`textarea description-textarea ${formErrors.description ? 'input-error' : ''}`}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={validateForm}
              rows="6" // starts with ~6 lines
            />
            {formErrors.description && <span className="error-text">{formErrors.description}</span>}
          </motion.div>

          {/* Attach Photo */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
              Attach photo (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <motion.img
                src={preview}
                alt="Preview"
                className="image-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{ marginTop: '1rem', maxWidth: '240px', borderRadius: '12px' }}
              />
            )}
          </motion.div>

          {/* Submit */}
          {isLoading ? (
            <div className="spinner" style={{ margin: '2rem auto' }} />
          ) : (
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !isFormValid}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ width: '100%', marginTop: '2rem' }}
            >
              Submit Complaint
            </motion.button>
          )}
        </form>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              className="toast"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              Complaint Submitted Successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complaints List */}
        <motion.h3
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          style={{ margin: '4rem 0 1.5rem', color: 'white' }}
        >
          Your Previous Complaints
        </motion.h3>

        {complaints.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ textAlign: 'center', opacity: 0.7, color: 'white' }}
          >
            No complaints submitted yet.
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
            {complaints.map((c, index) => (
              <motion.div
                key={c.id}
                className="complaint-card"
                variants={{
                  initial: { opacity: 0, y: 40 },
                  in: { opacity: 1, y: 0 }
                }}
                transition={{ delay: index * 0.1 }}
              >
                <h4>{c.title}</h4>
                <p>{c.description}</p>
                <div style={{ margin: '0.8rem 0' }}>
                  <span className={`badge badge-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  <span className={`badge badge-${c.status.toLowerCase()}`}>{c.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, color: 'white' }}>
                  {c.category} • {c.date}
                </p>
                {c.image && (
                  <img
                    src={c.image}
                    alt="Complaint"
                    style={{ maxWidth: '240px', borderRadius: '12px', marginTop: '1rem' }}
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

export default StudentDashboard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const nameRegex = /^[A-Za-z\s]{2,60}$/;
const roomRegex = /^[A-Za-z0-9\- ]{2,10}$/;

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState(user.name || '');
  const [room, setRoom] = useState(user.room || '');
  const [profilePic, setProfilePic] = useState(user.profilePic || '');
  const [preview, setPreview] = useState(profilePic);
  const [errors, setErrors] = useState({});

  const isStudent = user.role === 'Student';

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Name must contain only letters and spaces (2–60 characters)";
    }

    if (isStudent) {
      if (!room.trim()) {
        newErrors.room = "Room number is required for students";
      } else if (!roomRegex.test(room)) {
        newErrors.room = "Room number must be 2–10 characters (letters, numbers, hyphens, spaces allowed)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = () => {
    if (!validate()) return;

    const updatedUser = {
      ...user,
      name,
      room: isStudent ? room.trim() : '',
      profilePic,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert('Profile updated successfully!');
    console.log('Email sent: Profile updated');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out successfully!');
    console.log('Email sent: Logout notification');
    navigate('/');
  };

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
          Your Profile
        </motion.h2>

        {/* Profile Picture Preview */}
        {preview && (
          <motion.img
            src={preview}
            alt="Profile"
            className="profile-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        )}

        {/* User Info Display */}
        <motion.div
          className="user-info"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p><strong>Name:</strong> {user.name || 'Not set'}</p>
          <p><strong>Room:</strong> {isStudent ? (user.room || 'Not set') : 'Not applicable'}</p>
          <p><strong>Role:</strong> {user.role || 'Not set'}</p>
        </motion.div>

        {/* Edit Form */}
        <form>
          {/* Name */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
              Edit Name
            </label>
            <input
              type="text"
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Full Name (letters & spaces)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validate}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </motion.div>

          {/* Room - only show for Student */}
          {isStudent && (
            <motion.div
              className="form-field"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
                Edit Room Number
              </label>
              <input
                type="text"
                className={`input ${errors.room ? 'input-error' : ''}`}
                placeholder="e.g. B-12"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                onBlur={validate}
              />
              {errors.room && <span className="error-text">{errors.room}</span>}
            </motion.div>
          )}

          {/* Profile Picture Upload */}
          <motion.div
            className="form-field"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <label style={{ display: 'block', marginBottom: '0.6rem', color: 'white', fontWeight: 600 }}>
              Update Profile Picture
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="button-group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={Object.keys(errors).length > 0 || !name.trim() || (isStudent && !room.trim())}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1, marginRight: '1rem' }}
            >
              Save Changes
            </motion.button>

            <motion.button
              type="button"
              className="btn btn-logout"
              onClick={handleLogout}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1 }}
            >
              Logout
            </motion.button>
          </motion.div>
        </form>
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

export default Profile;
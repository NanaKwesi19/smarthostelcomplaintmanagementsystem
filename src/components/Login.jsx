// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiTool } from 'react-icons/fi';
/* eslint-disable react-hooks/exhaustive-deps */
const nameRegex = /^[A-Za-z\s]{2,60}$/;
const roomRegex = /^[A-Za-z0-9\- ]{2,10}$/;

const roles = [
  {
    value: 'Student',
    title: 'Student',
    icon: <FiUser size={48} />,
    description: 'Report issues, track status, manage your room complaints',
    color: '#A3CB38', // lime accent
  },
  {
    value: 'Admin',
    title: 'Admin',
    icon: <FiShield size={48} />,
    description: 'Manage all complaints, assign tasks, view analytics',
    color: '#00897B', // teal
  },
  {
    value: 'Staff',
    title: 'Staff',
    icon: <FiTool size={48} />,
    description: 'Receive & resolve assigned maintenance tasks',
    color: '#FF6B6B', // coral
  },
];

const Login = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isStudent = selectedRole === 'Student';

  // Re-validate on change
  useEffect(() => {
    validate();
  }, [name, room, selectedRole]);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      const trimmedName = name.trim();
      const existing = JSON.parse(localStorage.getItem('user') || 'null');

      let userData;
      if (existing && existing.name.toLowerCase() === trimmedName.toLowerCase()) {
        userData = { ...existing, name: trimmedName, room: isStudent ? room.trim() : '' };
      } else {
        userData = { name: trimmedName, room: isStudent ? room.trim() : '', role: selectedRole };
      }

      localStorage.setItem('user', JSON.stringify(userData));
      if (!localStorage.getItem('complaints')) localStorage.setItem('complaints', '[]');

      alert('Logged in successfully! Email notification sent.');
      console.log('Email sent: Login notification');
      setIsLoading(false);
      navigate('/dashboard');
    }, 1400);
  };

  // Clear room when switching away from Student
  useEffect(() => {
    if (!isStudent) setRoom('');
  }, [isStudent]);

  return (
    <div className="full-page-wrapper">
      <div className="full-page-background" />
      <div className="full-page-overlay" />

      <motion.div
        className="glass-form-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'white', fontSize: '2.2rem' }}>
          Choose Your Role
        </h2>

        <div className="role-cards-container">
          {roles.map((role) => (
            <motion.div
              key={role.value}
              className={`role-card ${selectedRole === role.value ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.value)}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                borderColor: role.color,
                boxShadow: selectedRole === role.value ? `0 0 24px ${role.color}60` : 'none',
              }}
            >
              <div className="role-icon" style={{ color: role.color }}>
                {role.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', margin: '0.8rem 0 0.4rem' }}>{role.title}</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.85 }}>{role.description}</p>
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate style={{ marginTop: '3rem' }}>
          {/* Name - larger, clearer */}
          <div className="form-field">
            <label style={{ display: 'block', marginBottom: '0.8rem', color: 'white', fontWeight: 600, fontSize: '1.15rem' }}>
              Full Name
            </label>
            <input
              type="text"
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter your full name (letters & spaces)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '14px 16px' }}
            />
            {errors.name && <span className="error-text" style={{ fontSize: '0.95rem' }}>{errors.name}</span>}
          </div>

          {/* Room - only for Student, larger */}
          {isStudent && (
            <div className="form-field">
              <label style={{ display: 'block', marginBottom: '0.8rem', color: 'white', fontWeight: 600, fontSize: '1.15rem' }}>
                Room Number
              </label>
              <input
                type="text"
                className={`input ${errors.room ? 'input-error' : ''}`}
                placeholder="e.g. B-12 or GH-405"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '14px 16px' }}
              />
              {errors.room && <span className="error-text" style={{ fontSize: '0.95rem' }}>{errors.room}</span>}
            </div>
          )}

          {/* Submit button - larger, full-width, prominent */}
          {isLoading ? (
            <div className="spinner" style={{ margin: '2.5rem auto' }} />
          ) : (
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={Object.keys(errors).length > 0 || !name.trim() || (isStudent && !room.trim())}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                marginTop: '2rem',
                fontSize: '1.25rem',
                padding: '16px',
                fontWeight: 600,
              }}
            >
              Continue as {selectedRole}
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
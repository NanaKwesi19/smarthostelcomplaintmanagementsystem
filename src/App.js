// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

import Landing from './components/Landing';
import Login from './components/Login';
import Profile from './components/Profile';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

import './index.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = { duration: 0.5, ease: 'easeOut' };

const TopNav = ({ user, isDarkMode, setIsDarkMode, navigate, handleLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  // Gentle parallax tilt effect on mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!navRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 10;   // subtle tilt (adjust *10 for strength)
      const y = (clientY / window.innerHeight - 0.5) * 10;
      navRef.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        className="top-glass-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          <div className="nav-brand">
            <span className="brand-text">Smart Hostel</span>
          </div>

          <div className="nav-links desktop">
            <button className="nav-link" onClick={() => navigate('/')}>
              <FiHome /> Home
            </button>
            <button className="nav-link" onClick={() => navigate('/profile')}>
              <FiUser /> Profile
            </button>
            <button className="nav-link" onClick={() => navigate('/dashboard')}>
              <FiSettings /> {user.role === 'Student' ? 'Dashboard' : 'Admin Panel'}
            </button>
            <button className="nav-link logout-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>

            <label className="dark-toggle">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <span className="toggle-icon">{isDarkMode ? <FiMoon /> : <FiSun />}</span>
            </label>
          </div>

          <div className="mobile-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </div>
        </div>
      </motion.nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mobile-menu-content">
              <button onClick={() => { navigate('/'); setMobileOpen(false); }}>
                <FiHome /> Home
              </button>
              <button onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
                <FiUser /> Profile
              </button>
              <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
                <FiSettings /> {user.role === 'Student' ? 'Dashboard' : 'Admin Panel'}
              </button>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}>
                <FiLogOut /> Logout
              </button>

              <div className="mobile-dark-toggle">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out successfully! Email notification sent.');
    console.log('Email sent: Logout notification');
    navigate('/');
  };

  if (!user.name && location.pathname !== '/' && location.pathname !== '/login') {
    navigate('/login');
    return null;
  }

  return (
    <div className="app">
      <TopNav
        user={user}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="main-content" style={{ paddingTop: '90px', paddingBottom: '80px' }}>
        {children}
      </div>

      {/* Back button moved to bottom-right */}
      {location.pathname !== '/' && location.pathname !== '/login' && (
        <motion.div
          className="back-btn-bottom"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </motion.div>
      )}
    </div>
  );
};
function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/dashboard" element={<MainLayout>{
            JSON.parse(localStorage.getItem('user') || '{}').role === 'Student' 
              ? <StudentDashboard /> 
              : <AdminDashboard />
          }</MainLayout>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
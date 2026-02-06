import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const bgRef = useRef(null);

  // Gentle mouse parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-wrapper">
      {/* Background image – always sharp */}
      <div ref={bgRef} className="hero-background" />

      {/* Very light overlay – only darkens slightly for text contrast */}
      <div className="hero-overlay" />

      {/* Text + button container – forced on top with high z-index */}
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
        >
          Smart Hostel Maintenance & Complaint Management System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7, ease: "easeOut" }}
        >
          Report issues quickly. Track fixes transparently. Better hostel life for everyone.
        </motion.p>

        <motion.button
          className="btn btn-primary get-started-btn"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
          whileHover={{ scale: 1.06, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default Landing;
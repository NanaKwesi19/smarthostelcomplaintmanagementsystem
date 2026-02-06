import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.1, x: -4 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => navigate(-1)}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg rounded-full text-white dark:text-gray-200 font-medium shadow-lg hover:bg-white/40 dark:hover:bg-gray-700/70 transition-all duration-300"
    >
      <HiArrowLeft size={20} />
      Back
    </motion.button>
  );
}
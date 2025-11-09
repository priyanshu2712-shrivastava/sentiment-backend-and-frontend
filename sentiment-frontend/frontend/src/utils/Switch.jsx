import { useUtils } from "../contexts/Utils.jsx";
import {motion} from 'motion/react'
function Switch() {
  const { theme, toggleTheme } = useUtils();
const isDark=theme==='dark'
  return (
     <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center border-none bg-transparent cursor-pointer p-2 pr-0 rounded-full transition-colors duration-300 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 gap-2"
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="flex items-center justify-center w-6 h-6 rounded-full transition-colors duration-300  bg-gray-200 dark:bg-gray-700"
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          // Moon SVG
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 12.79A9 9 0 0112.21 3a7 7 0 100 14A9 9 0 0021 12.79z"
              fill="#FFD700"
            />
          </svg>
        ) : (
          // Sun SVG
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" fill="#FFA500" />
            <g stroke="#FFA500" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="4" />
              <line x1="12" y1="20" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="4" y2="12" />
              <line x1="20" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
        )}
      </motion.span>
      <motion.span
        className="text-xs font-medium transition-colors duration-300 text-gray-700 dark:text-gray-300 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {isDark ? "Night" : "Day"}
      </motion.span>
    </motion.button>
  );
}

export default Switch;

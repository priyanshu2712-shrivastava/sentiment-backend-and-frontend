import React from 'react'
import { useState ,useEffect} from 'react';
import { motion } from 'framer-motion'; // Using 'framer-motion' standard import
import Switch from '../../utils/Switch';
function DasNav() {
   const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
     
      if (offset > 30) { 
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav 
      className={`
        sticky top-0 w-full h-[60px] md:h-[70px] flex justify-between items-center transition-all duration-300 ease-in-out z-50 
        px-4 md:px-10 lg:px-20
        ${scrolled
          ? "bg-white/20 dark:bg-black/95 backdrop-blur-md shadow-md py-2" 
          : "bg-transparent py-4"
        }
      `}
      initial={{
        opacity: 0,
        y: -50,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: 'easeInOut'
        }
      }}
    >
     
      {!scrolled && (
        <div className="absolute w-full h-[1px] bottom-0 left-0">
          <div className="mx-auto w-[80%] h-full "></div>
        </div>
      )}

      {/* Logo/Brand Section */}
      <div className="w-fit h-full flex items-center">
        <h1 className={`
          text-2xl md:text-3xl font-extrabold tracking-tight transition-colors duration-300
          text-gray-900 dark:text-white 
          ${scrolled ? "text-purple-600 dark:text-purple-400" : "text-gray-900 dark:text-white"}
        `}>
          XSentiment
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <Switch /> {/* Theme toggle component */}
        
        
      </div>
    </motion.nav>
  )
}

export default DasNav
// components/TopSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Login from '../../utils/Login';

const TopSection = () => {
    // Animation variants for the text
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // Animation variants for each word
    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 12 }
        },
    };
    
    // Split the title into words for dynamic animation
    const titleText = "Uncover Real-Time Sentiment Insights";
    const titleWords = titleText.split(" ");
    
    // Function to handle the CTA click (placeholder)
    const handleClick = () => {
        window.location.href = '/dashboard';
    };

    return (
        <div className='w-full h-screen flex items-center justify-center relative 
                      bg-white dark:bg-black transition-colors duration-500'>

            {/* Background Gradient & Blob Effect (Dark Mode) */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-[-20%] left-[-20%] w-[500px] h-[500px] 
                                bg-purple-500/20 dark:bg-purple-900/40 rounded-full 
                                filter blur-3xl opacity-30 animate-pulse-slow'></div>
                <div className='absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] 
                                bg-sky-500/10 dark:bg-sky-900/30 rounded-full 
                                filter blur-3xl opacity-20 animate-pulse-slow-reverse'></div>
            </div>

            <div className='w-full md:w-[80vw] lg:w-[60vw]  z-10 
                           p-4 md:p-3'>
                
                {/* Main Animated Title */}
                <motion.h1
                    className='text-5xl md:text-8xl lg:text-8xl tracking-snugged 
                                font-extrabold text-gray-900 dark:text-white 
                                mb-6 selection:bg-purple-300 w-full'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {titleWords.map((word, index) => (
                        <motion.span
                            key={index}
                            className='inline-block mr-3'
                            variants={itemVariants}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className='text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium 
                                mb-8 max-w-2xl mx-auto'
                >
                    Advanced sentiment analysis for **informed decisions**. Process user comments instantly to understand public perception.
                </motion.p>
                
                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.0, type: "spring", stiffness: 100 }}
                    className="w-[200px] h-fit px-6 py-3 text-xl font-bold rounded-xl 
                                bg-gradient-to-r from-purple-800 to-transparent 
                                 shadow-md shadow-purple-500/50 
                                border-none transition-all duration-300 
                                hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-400/20
                                focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-black dark:text-white"
                >
                    <Login content={"Analyze Now"}/>
                </motion.button>
            </div>
        </div>
    );
};

export default TopSection;

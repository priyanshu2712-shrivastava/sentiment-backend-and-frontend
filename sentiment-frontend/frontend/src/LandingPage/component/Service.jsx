// components/Service.jsx (Styled and Animated)
import React from 'react';
import ServiceInfo from '../../utils/ServiceInfo'; // Import the enhanced ServiceInfo
import { motion } from 'framer-motion'; // Ensure you are importing motion from framer-motion

function Service() {
    const services = [
        {
            url: "/img1.png",
            title: "Summary",
            para: "Automatically condenses a number of comments into clear and concise summaries which saves time by delivering quick insights from large amounts of content."
        },
        {
            url: "/img4.jpeg",
            title: "Analysis",
            // The sentiment analysis results are visualized using a pie chart , dividing comments into positive, negative, and neutral sections. Each slice of the pie chart represents the proportion of sentiments, making it easy to understand the overall mood at a glance.
            para: "The sentiment analysis results are visualized using a pie chart, dividing comments into positive, negative, and neutral sections. Each slice of the pie chart represents the proportion of sentiments, making it easy to understand the overall mood at a glance."
        },
        {
            url: "/img3.jpeg",
            title: "Word Cloud",
            // Transforms text data into a visual word cloud  where word size reflects frequency. Provides an engaging way to explore key themes and patterns in the text.
            para: "Transforms text data into a visual word cloud where word size reflects frequency. Provides an engaging way to explore key themes and patterns in the text."
        }
    ];
    
    // Animation variants for the container (staggering children)
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delay: 0.2, // Reduced delay for faster loading feel
                staggerChildren: 0.15, // Faster stagger between cards
            },
        },
    };
    
    // Animation variants for each card (flying up from the bottom)
    const childVariants = {
        hidden: { opacity: 0, y: 100 }, // Started at y: 200, reduced to 100
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 90, 
                damping: 15 
            }
        },
    };
    
    return (
        <div id='services' className='w-full py-20 dark:bg-[#020003] bg-white transition-colors duration-500'>
            <h1 className='text-4xl md:text-6xl w-full font-extrabold text-center tracking-tight 
                           text-gray-900 dark:text-neutral-100 mb-16 md:mb-20'>
                Powerful Sentiment Features
            </h1>
            
            <motion.div
                className="max-w-7xl mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // Increased viewport amount for smoother trigger
            >
                {services.map((s, index) => (
                    <motion.div
                        key={index}
                        variants={childVariants}
                        className="flex justify-center" // Center the card horizontally
                    >
                        <ServiceInfo
                            image={s.url}
                            title={s.title}
                            description={s.para}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default Service;

// components/HowItWorks.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, BarChart } from 'lucide-react'; 

const steps = [
    {
        icon: Upload,
        title: "Upload Data",
        description: "Securely input your text data, user comments, or reviews via API or file upload.",
        color: "text-purple-500"
    },
    {
        icon: Cpu,
        title: "Advanced Processing",
        description: "Our AI model analyzes the text to identify emotional tone, extracting sentiment and key topics.",
        color: "text-indigo-500"
    },
    {
        icon: BarChart,
        title: "Gain Insights",
        description: "Instantly view visual reports, summaries, and word clouds to drive your business decisions.",
        color: "text-sky-500"
    }
];

const HowItWorks = () => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                delay: 0.1,
                staggerChildren: 0.3,
            },
        },
    };
    
    const stepVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    };

    return (
        <div id='how-it-works' className='w-full py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-500'>
            <h2 className='text-4xl md:text-5xl font-bold text-center tracking-tight 
                           text-gray-900 dark:text-neutral-100 mb-20'>
                How XSentiment Works
            </h2>
            
            <motion.div
                className="max-w-5xl mx-auto px-5 md:px-10 flex flex-col md:flex-row justify-between relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Horizontal Connector Line (Hidden on Mobile) */}
                <div className='absolute hidden md:block top-16 left-1/2 transform -translate-x-1/2 w-4/5 h-1 
                                bg-gray-300 dark:bg-gray-700'></div>
                
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        variants={stepVariants}
                        className="flex flex-col items-center text-center md:w-1/3 mb-10 md:mb-0 relative"
                    >
                        {/* Step Icon */}
                        <div className={`w-20 h-20 p-4 rounded-full bg-white dark:bg-gray-800 
                                         border-4 border-gray-300 dark:border-gray-700 
                                         flex items-center justify-center mb-6 z-10 
                                         ${step.color}`}>
                            <step.icon size={36} strokeWidth={2.5} />
                        </div>

                        {/* Step Number Badge */}
                        <span className="absolute top-0 right-0 md:top-14 md:right-1/2 md:translate-x-1/2 
                                         px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold z-20">
                            Step {index + 1}
                        </span>

                        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white mt-4">{step.title}</h3>
                        <p className="text-base text-gray-600 dark:text-gray-400 px-4">{step.description}</p>
                    </motion.div>
                ))}
            </motion.div>


        </div>
    );
};

export default HowItWorks;
// components/Dashboard.jsx (Styled and Optimized)

import React, { useEffect, useState } from 'react';
import InputForm from './components/InputForm';
import Display from './components/Display';
import { analyzeSentiments, generateChart, generateWordCloud } from '../api';
import '../resultPage/styles/dashboard.css'; // Assuming this holds necessary utility styles
import Loading from './components/Loading';

import { motion } from 'framer-motion';
import DasNav from './components/DasNav.jsx';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firbase/firbaseConfig.js";
import Login from '../utils/Login.jsx';
function Dashboard() {
    const [result, setResults] = useState(null);
    const [sentimentCounts, setSentimentCounts] = useState({});
    const [wordData, setWordData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
 const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
    const handleAnalysisRequest = async (comments) => {
        try {
            setIsLoading(true); // Show loader immediately
            setResults(null); // Clear previous results when new request starts

            // 1. Prepare and Analyze Comments
            const commentTexts = comments.map(comment => 
                typeof comment === 'object' && comment.text ? comment.text : comment
            );
            
            const analysisResult = await analyzeSentiments(commentTexts);
            
            const transformedResults = {
                comments: comments.map((comment, index) => ({
                    commentId: typeof comment === 'object' ? comment.commentId : `comment-${index}`,
                    text: typeof comment === 'object' && comment.text ? comment.text : comment
                })),
                analysis: analysisResult.map((item, index) => ({
                    commentId: typeof comments[index] === 'object' ? 
                        comments[index].commentId : `comment-${index}`,
                    sentiment: item.sentiment
                }))
            };

            // 2. Prepare Sentiment Counts
            const counts = { "1": 0, "0": 0, "-1": 0 }; // 1: Positive, 0: Neutral, -1: Negative
            transformedResults.analysis.forEach((item) => {
                counts[item.sentiment] = (counts[item.sentiment] || 0) + 1;
            });

            // 3. Fetch Word Cloud Data
            const wordCloudResponse = await generateWordCloud(commentTexts);

            // Simulate a minimum loading time (kept for aesthetic continuity)
            setTimeout(() => {
                setResults(transformedResults);
                setSentimentCounts(counts);
                setWordData(wordCloudResponse);
                setIsLoading(false); 
            }, 1500); // Reduced simulated delay
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Something went wrong while analyzing comments!");
            setIsLoading(false);
        }
    }

    return (
        <>
        {user ? 
        <div className="w-full min-h-screen 
                        bg-gray-100 dark:bg-[#020003] transition-colors duration-500
                        font-sans text-gray-900 dark:text-white">
            <DasNav/>
            
            <motion.div 
                className="max-w-7xl mx-auto px-4 md:px-8 py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <h1 className="text-center text-4xl md:text-5xl font-extrabold pb-8 
                                text-gray-900 dark:text-purple-400 tracking-tight">
                    Sentiment Analysis Dashboard
                </h1>

                {/* Input Form Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-12 p-6 rounded-xl 
                               bg-white dark:bg-[#111] shadow-md dark:shadow-purple-900/50"
                >
                    <InputForm 
                        onAnalysisRequest={handleAnalysisRequest} 
                        setIsLoading={setIsLoading} 
                    />
                </motion.div>
                
                {/* Loading State or Display Results */}
                <div className='min-h-[40vh] flex items-center justify-center'>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        result && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className='w-full'
                            >
                                <Display
                                    results={result}
                                    sentimentCounts={sentimentCounts}
                                    wordData={wordData}
                                />
                            </motion.div>
                        )
                    )}
                </div>
            </motion.div>
        </div>

        :
        <div className='w-screen h-screen flex items-center justify-center dark:bg-black dark:text-white'>
            <div className='border border-2  p-3 rounded-md shadow-md '>
        <Login content={"Login To get Started"}/>
        </div>
        </div>
                }
       </>
                );   
  
}

export default Dashboard;

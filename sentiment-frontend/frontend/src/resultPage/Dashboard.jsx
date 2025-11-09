import React, { useEffect, useState } from 'react'
import InputForm from './components/InputForm'
import Display from './components/Display';
import { analyzeSentiments, generateChart, generateWordCloud } from '../api';
import '../resultPage/styles/dashboard.css'
import Loading from './components/Loading';
import Navbar from '../LandingPage/component/Navbar.jsx'
function Dashboard() {
    const [result, setResults] = useState(null);
    const [sentimentCounts, setSentimentCounts] = useState({});
    const [wordData, setWordData] = useState([]);
const [isLoading,setIsLoading] = useState(false);

   const handleAnalysisRequest = async (comments) => {
    try {
        setIsLoading(true); // Show loader immediately

        // Check if comments are objects with text property or simple strings
        const commentTexts = comments.map(comment => 
            typeof comment === 'object' && comment.text ? comment.text : comment
        );
        
        // analyze comments (send only the text to the API)
        const analysisResult = await analyzeSentiments(commentTexts);
        
        // Transform the results to include commentId if available
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

        // 2. prepare sentiment counts
        const counts = { "1": 0, "0": 0, "-1": 0 };
        transformedResults.analysis.forEach((item) => {
            counts[item.sentiment] = (counts[item.sentiment] || 0) + 1;
        });

        // 3. fetch the word cloud data (use only text for word cloud)
        const wordCloudResponse  = await generateWordCloud(commentTexts);
        setTimeout(() => {
            setResults(transformedResults);
            setSentimentCounts(counts);
            setWordData(wordCloudResponse);
            setIsLoading(false); 
        }, 2000); 
    } catch (error) {
        console.error("Analysis failed", error);
        alert("Something went wrong while analyzing comments!");
        setIsLoading(false);
    }
}

    return (
  <div className="w-full min-h-screen [background:linear-gradient(135deg,#2e003e,#000000)] font-sans m-0 p-0 text-white">
    <Navbar/>
    <h1 className="text-center text-3xl font-extrabold py-5">
      Sentiment Analysis Dashboard
    </h1>

    <InputForm onAnalysisRequest={handleAnalysisRequest} setIsLoading={setIsLoading} />
    {isLoading?<Loading/> :
    
     result &&  <Display
        results={result}
        sentimentCounts={sentimentCounts}
        wordData={wordData}
      />

}
  </div>
);

}

export default Dashboard

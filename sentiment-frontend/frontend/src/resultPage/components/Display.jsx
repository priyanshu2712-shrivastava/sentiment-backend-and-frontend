import React from 'react'
import WordCloudComponent from './WordCloudComponent';
import SentimentChart from './SentimentChart';
import '../styles/display.css'

function Display({ results, sentimentCounts, wordData }) {
  // Calculate summary stats from the results prop
  const totalReplies = results.analysis.length;
  const positiveCount = results.analysis.filter(r => r.sentiment === '1').length;
  const neutralCount = results.analysis.filter(r => r.sentiment === '0').length;
  const negativeCount = results.analysis.filter(r => r.sentiment === '-1').length;
 
  // Extract data from sentimentCounts prop and transform it for SentimentChart
  const chartData = [
    { 
      id: 0, 
      value: sentimentCounts?.positive || positiveCount || 0, 
      label: "Positive", 
      color: "#00ff88" 
    },
    { 
      id: 1, 
      value: sentimentCounts?.negative || negativeCount || 0, 
      label: "Negative", 
      color: "#ff3333" 
    },
    { 
      id: 2, 
      value: sentimentCounts?.neutral || neutralCount || 0, 
      label: "Neutral", 
      color: "#6a5acd" 
    },
  ].filter(item => item.value > 0); // Only include items with values > 0
  
  console.log('chartData from Display:', chartData);
  console.log('sentimentCounts prop:', sentimentCounts);
 
  // helper to map the sentiment value to a label and class
  const getSentimentDetails = (sentiment) => {
    switch (sentiment) {
      case '1': return { label: 'Positive', className: 'positive' };
      case '-1': return { label: 'Negative', className: 'negative' };
      default: return { label: 'Neutral', className: 'neutral' };
    }
  };
  
  return (
    <div className='results'>
      <div className='summary-stats'>
        <div className='card-container'>
          <div className='stat-card brown'>
            <div className='stat-label'>Total Comments : </div>
            <div className='stat-number'>{totalReplies}</div>
          </div>
          <div className='stat-card green'>
            <div className='stat-label'>Positive : </div>
            <div className='stat-number'>{positiveCount}</div>
          </div>
          <div className='stat-card blue'>
            <div className='stat-label'>Neutral : </div>
            <div className='stat-number'>{neutralCount}</div>
          </div>
          <div className='stat-card red'>
            <div className='stat-label'>Negative : </div>
            <div className='stat-number'>{negativeCount}</div>
          </div>
        </div>
        {/* chart and word cloud */}
        <div className='charts-container'>
          <div className='pie-chart'>
            <h3 className='!text-4xl !font-bold text-white'>Sentiment Distribution</h3>
            <SentimentChart data={chartData} />
          </div>
          <div className='chart-item'>
            <h3 className='!text-4xl text-white !font-bold'>Word Cloud</h3>
            {wordData && wordData.length > 0 ? (
              <WordCloudComponent words={wordData} />
            ) : (
              <p>No words to display</p>
            )}
          </div>
        </div>
        {/* individual comments list */}
        <h3>Individual Comment List</h3>
        <div className="comments-list">
          {results.analysis.map((result, index) => {
            const sentiment = getSentimentDetails(result.sentiment);
            // match comments by commentId OR id
            const commentData = results.comments.find(
              (cmt) =>
                cmt.commentId === result.commentId || cmt.id === result.commentId
            );
            return (
              <div key={result.commentId || index} className='comment-item'>
                {commentData
                  ? commentData.text
                  : '⚠️ Comment text not found'}
                <span className={`sentiment-label ${sentiment.className}`}>
                  {sentiment.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Display
import React, { useState } from 'react'
import InputForm from './components/InputForm'
import Display from './components/Display';
import { analyzeSentiments, generateChart, generateWordCloud } from '../api';
import '../resultPage/styles/dashboard.css'
import Loading from './components/Loading';
import Navbar from '../LandingPage/component/Navbar.jsx'
import jsPDF from 'jspdf';
import { GoogleGenerativeAI } from '@google/generative-ai';
import html2canvas from 'html2canvas';
// Gemini API Configuration
// Note: If your API key doesn't work, verify it starts with "AIza" (not "Alza")
// The key from the image appears to start with "Alza" but Google keys typically start with "AIza"
const GEMINI_API_KEY = 'AIzaSyBlaeaE7IzrQuYVPLVcwRegjdDu_4fjKw0';
function Dashboard() {
    const [result, setResults] = useState(null);
    const [sentimentCounts, setSentimentCounts] = useState({});
    const [wordData, setWordData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

   const generateGeminiReport = async (totalComments, positiveCount, neutralCount, negativeCount) => {
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            
            // Try gemini-1.5-flash first (faster and free), fallback to gemini-1.5-pro
            let model;
            try {
                model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            } catch (e) {
                console.log("Trying gemini-1.5-pro instead...");
                model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            }

            const positivePercentage = ((positiveCount / totalComments) * 100).toFixed(2);
            const neutralPercentage = ((neutralCount / totalComments) * 100).toFixed(2);
            const negativePercentage = ((negativeCount / totalComments) * 100).toFixed(2);

            const prompt = `Act as a Senior Data Analyst and Technical Writer. I will provide you with raw statistics from a Sentiment Analysis Report. Your goal is to rewrite this into a formal 'Executive Stakeholder Report.'

The Data:
    Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    Total Comments: ${totalComments}
    Positive: ${positiveCount} (${positivePercentage}%)
    Neutral: ${neutralCount} (${neutralPercentage}%)
    Negative: ${negativeCount} (${negativePercentage}%)

Report Requirements:
    Tone: Formal, objective, and corporate.
    Structure:
        1. Executive Summary: High-level overview of the feedback volume.
        2. Performance Verdict: Apply the following logic to determine the status:
            - Exceptional: > 80% Positive
            - Strong Performer: 65% - 79% Positive
            - Satisfactory: 50% - 64% Positive
            - Needs Attention: 30% - 49% Positive
            - Critical: < 30% Positive
        3. Sentiment Distribution: A breakdown of the metrics with implications.
        5. Strategic Recommendations: Based on the sentiment split, suggest general next steps.

Please generate the full report now. Format it with clear section headings and professional language suitable for executive stakeholders.`;

            console.log("Calling Gemini API...");
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("Gemini API response received, length:", text.length);
            return text;
        } catch (error) {
            console.error("Gemini API error details:", error);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            // Provide more specific error message
            let errorMessage = "Failed to generate executive report. ";
            if (error.message) {
                errorMessage += error.message;
            } else if (error.error) {
                errorMessage += error.error.message || JSON.stringify(error.error);
            } else {
                errorMessage += "Please check your API key and try again.";
            }
            
            throw new Error(errorMessage);
        }
    };

   const drawWordCloud = (canvas, wordData) => {
        if (!wordData || wordData.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Sort words by value (descending) and take top 40
        const sortedWords = [...wordData]
            .sort((a, b) => (b.value || 0) - (a.value || 0))
            .slice(0, 40);
        
        if (sortedWords.length === 0) return;
        
        // Calculate max and min values for scaling
        const maxValue = sortedWords[0].value || 1;
        const minValue = sortedWords[sortedWords.length - 1].value || 1;
        const valueRange = maxValue - minValue || 1;
        
        // Center of canvas
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Spiral parameters - using Archimedean spiral
        const goldenAngle = 2.399963229728653; // Golden angle in radians
        let angle = 0;
        let radius = 0;
        const radiusGrowth = 8;
        
        // Track placed words for simple overlap detection
        const placedWords = [];
        
        sortedWords.forEach((word, index) => {
            const wordText = word.text || word.word || String(word);
            const wordValue = word.value || 1;
            
            // Calculate font size based on value (scaled)
            const fontSize = Math.max(14, 14 + ((wordValue - minValue) / valueRange) * 20);
            ctx.font = `bold ${fontSize}px Arial`;
            
            // Color based on index (golden angle for distribution)
            const hue = (index * 137.508) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 45%)`;
            
            // Measure text
            const metrics = ctx.measureText(wordText);
            const textWidth = metrics.width;
            const textHeight = fontSize;
            
            // Try to place word in spiral
            let placed = false;
            let attempts = 0;
            let currentAngle = angle;
            let currentRadius = radius;
            
            while (!placed && attempts < 200) {
                const x = centerX + Math.cos(currentAngle) * currentRadius - textWidth / 2;
                const y = centerY + Math.sin(currentAngle) * currentRadius + textHeight / 2;
                
                // Check bounds
                if (x >= 5 && x + textWidth <= width - 5 && y >= textHeight && y <= height - 5) {
                    // Simple overlap check with placed words
                    let overlaps = false;
                    for (const placed of placedWords) {
                        const dx = Math.abs(x - placed.x);
                        const dy = Math.abs(y - placed.y);
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < (textWidth + placed.width) / 2 + 5) {
                            overlaps = true;
                            break;
                        }
                    }
                    
                    if (!overlaps) {
                        ctx.fillText(wordText, x, y);
                        placedWords.push({ x, y, width: textWidth, height: textHeight });
                        placed = true;
                    }
                }
                
                // Move along spiral
                currentAngle += goldenAngle;
                currentRadius += radiusGrowth / (attempts / 10 + 1);
                attempts++;
            }
            
            // Update spiral position for next word
            angle += goldenAngle;
            radius += radiusGrowth;
        });
    };

   const drawPieChart = (canvas, chartData, total) => {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) / 2 - 20;
        
        let startAngle = -Math.PI / 2; // Start from top
        
        chartData.forEach((item) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            const percentage = ((item.value / total) * 100).toFixed(1);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, labelX, labelY);
            
            startAngle = endAngle;
        });
    };

   const parseGeminiResponse = (text) => {
        // Split the response into sections
        const sections = [];
        const lines = text.split('\n');
        let currentSection = { title: '', content: [] };
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check if line is a section heading (numbered or bold)
            if (line.match(/^\d+\.\s+[A-Z]/) || line.match(/^[A-Z][^a-z]*$/)) {
                if (currentSection.title) {
                    sections.push(currentSection);
                }
                currentSection = { title: line, content: [] };
            } else if (line.length > 0) {
                currentSection.content.push(line);
            }
        }
        
        if (currentSection.title) {
            sections.push(currentSection);
        }
        
        return sections;
    };

   const generateFallbackReport = (totalComments, positiveCount, neutralCount, negativeCount) => {
        const positivePercentage = ((positiveCount / totalComments) * 100).toFixed(2);
        const neutralPercentage = ((neutralCount / totalComments) * 100).toFixed(2);
        const negativePercentage = ((negativeCount / totalComments) * 100).toFixed(2);
        
        let verdict = "Satisfactory";
        if (positivePercentage > 80) verdict = "Exceptional";
        else if (positivePercentage >= 65) verdict = "Strong Performer";
        else if (positivePercentage >= 50) verdict = "Satisfactory";
        else if (positivePercentage >= 30) verdict = "Needs Attention";
        else verdict = "Critical";
        
        return `1. Executive Summary

This report outlines the findings of the automated sentiment analysis performed on a dataset of ${totalComments} stakeholder comments. The analysis utilized Natural Language Processing (NLP) to classify feedback into Positive, Neutral, and Negative sentiments to gauge overall product reception and brand health.

2. Performance Verdict

Based on the cumulative sentiment score, the current product status is classified as:
STATUS: ${verdict.toUpperCase()}

Logic: The Positive Sentiment Index is ${positivePercentage}%, which falls within the ${verdict} threshold.

Interpretation: ${verdict === "Exceptional" ? "The product is performing exceptionally well with overwhelming positive feedback." : 
verdict === "Strong Performer" ? "The product demonstrates strong performance with majority positive sentiment." :
verdict === "Satisfactory" ? "The majority of users view the product favorably. However, a significant portion of the user base remains neutral or dissatisfied. The immediate goal is to stabilize the positive base while addressing the specific pain points driving negative feedback." :
verdict === "Needs Attention" ? "The product requires immediate attention as negative sentiment is significant. Focus on addressing core issues." :
"Critical action is required as the product is receiving predominantly negative feedback."}

3. Sentiment Distribution Analysis

The following breakdown illustrates the polarity of the analyzed feedback:

    Positive Sentiment: ${positivePercentage}% (${positiveCount} Comments)
        Implication: Indicates core features are meeting user expectations.

    Neutral Sentiment: ${neutralPercentage}% (${neutralCount} Comments)
        Implication: Represents a "swing" demographic. These users are ambivalent and are prime targets for conversion to positive through minor improvements.

    Negative Sentiment: ${negativePercentage}% (${negativeCount} Comments)
        Implication: Highlights critical friction points requiring immediate remediation.

4. Strategic Recommendations

To elevate the status from ${verdict} to a higher performance tier, the following actions are recommended:

    Convert the Neutrals: ${neutralPercentage}% of users are on the fence. Review "Neutral" comments to identify missing features or minor annoyances that prevent them from being fully satisfied.

    Root Cause Analysis: Investigate the ${negativePercentage}% Negative feedback for recurring defects or issues.

    Leverage Promoters: Engage with the ${positivePercentage}% positive users for testimonials to boost social proof.`;
    };

   const handleDownloadReport = async () => {
        if (!result) return;

        try {
            setIsLoading(true);
            
            // Calculate summary statistics
            const totalComments = result.analysis.length;
            const positiveCount = sentimentCounts["1"] || 0;
            const neutralCount = sentimentCounts["0"] || 0;
            const negativeCount = sentimentCounts["-1"] || 0;
            
            // Try to generate executive report from Gemini, fallback to local generation
            let geminiReport;
            let isGeminiGenerated = false;
            try {
                console.log("🔄 Attempting to generate report using Gemini API...");
                geminiReport = await generateGeminiReport(
                    totalComments, 
                    positiveCount, 
                    neutralCount, 
                    negativeCount
                );
                isGeminiGenerated = true;
                console.log("✅ Report successfully generated through Gemini API");
            } catch (geminiError) {
                console.warn("⚠️ Gemini API failed, using fallback report:", geminiError);
                geminiReport = generateFallbackReport(
                    totalComments, 
                    positiveCount, 
                    neutralCount, 
                    negativeCount
                );
                console.log("📝 Report generated using fallback method (NOT Gemini)");
            }
            
            // Log final status
            if (isGeminiGenerated) {
                console.log("📊 PDF Report Status: Generated through Gemini AI");
            } else {
                console.log("📊 PDF Report Status: Generated using fallback method (NOT Gemini)");
            }
            
            // Prepare chart data
            const chartData = [
                { label: "Positive", value: positiveCount, color: "#00ff88" },
                { label: "Negative", value: negativeCount, color: "#ff3333" },
                { label: "Neutral", value: neutralCount, color: "#6a5acd" }
            ].filter(item => item.value > 0);
            
            const total = chartData.reduce((sum, item) => sum + item.value, 0);
            
            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;
            let yPosition = margin;
            
            // Header
            pdf.setFillColor(46, 0, 62); // Purple background
            pdf.rect(0, 0, pageWidth, 40, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(20);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Customer Sentiment Audit: Executive Report', pageWidth / 2, 20, { align: 'center' });
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const generatedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            pdf.text(`Date: ${generatedAt} | Generated By: XSentiment Analytics Engine`, pageWidth / 2, 32, { align: 'center' });
            
            pdf.setTextColor(0, 0, 0);
            yPosition = 50;
            
            // Parse and add Gemini report content
            const sections = parseGeminiResponse(geminiReport);
            
            sections.forEach((section, sectionIndex) => {
                // Skip Keyword Intelligence / Word Cloud section
                const isWordCloudSection = section.title && (
                    section.title.toLowerCase().includes('word cloud') || 
                    section.title.toLowerCase().includes('keyword intelligence')
                );
                
                if (isWordCloudSection) {
                    return; // Skip this section entirely
                }
                
                // Check if we need a new page
                if (yPosition > pageHeight - 40) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                // Section title
                if (section.title) {
                    pdf.setFontSize(14);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(46, 0, 62);
                    pdf.text(section.title, margin, yPosition);
                    yPosition += 8;
                }
                
                // Section content
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(0, 0, 0);
                
                section.content.forEach((paragraph) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = margin;
                    }
                    
                    // Handle special formatting for STATUS
                    if (paragraph.includes('STATUS:') || paragraph.includes('Status:')) {
                        pdf.setFont('helvetica', 'bold');
                        pdf.setFontSize(12);
                        pdf.setTextColor(46, 0, 62);
                    }
                    
                    // Normal paragraph processing
                    const lines = pdf.splitTextToSize(paragraph, pageWidth - margin * 2);
                    lines.forEach((line) => {
                        if (yPosition > pageHeight - 20) {
                            pdf.addPage();
                            yPosition = margin;
                        }
                        pdf.text(line, margin, yPosition);
                        yPosition += 5;
                    });
                    
                    // Reset formatting
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 3;
                });
                
                yPosition += 5;
            });
            
            // Add Pie Chart Section
            if (chartData.length > 0 && total > 0) {
                if (yPosition > pageHeight - 100) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(46, 0, 62);
                pdf.text('Sentiment Distribution Chart', margin, yPosition);
                yPosition += 10;
                
                // Create canvas for pie chart
                const canvas = document.createElement('canvas');
                canvas.width = 300;
                canvas.height = 300;
                drawPieChart(canvas, chartData, total);
                
                // Convert canvas to image
                const chartImage = canvas.toDataURL('image/png');
                
                // Add chart to PDF (centered)
                const chartWidth = 80;
                const chartHeight = 80;
                const chartX = (pageWidth - chartWidth) / 2;
                pdf.addImage(chartImage, 'PNG', chartX, yPosition, chartWidth, chartHeight);
                yPosition += chartHeight + 10;
                
                // Legend
                pdf.setFontSize(9);
                pdf.setFont('helvetica', 'normal');
                chartData.forEach((item, index) => {
                    const legendX = margin + (index % 2) * 90;
                    const legendY = yPosition + Math.floor(index / 2) * 7;
                    
                    // Color box
                    pdf.setFillColor(
                        parseInt(item.color.substring(1, 3), 16),
                        parseInt(item.color.substring(3, 5), 16),
                        parseInt(item.color.substring(5, 7), 16)
                    );
                    pdf.rect(legendX, legendY - 3, 4, 4, 'F');
                    
                    // Label
                    pdf.setTextColor(0, 0, 0);
                    pdf.text(`${item.label}: ${item.value} (${((item.value / total) * 100).toFixed(1)}%)`, 
                        legendX + 6, legendY);
                });
                yPosition += Math.ceil(chartData.length / 2) * 7 + 10;
            }
            
            // Footer on all pages
            const totalPages = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(128, 128, 128);
                pdf.text(
                    `Page ${i} of ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
            
            // Save PDF
            const fileName = `sentiment-analysis-executive-report-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
            setIsLoading(false);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert(error.message || "Something went wrong while generating the PDF report!");
            setIsLoading(false);
        }
    };

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
  <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 
                  dark:[background:linear-gradient(135deg,#2e003e,#000000)]
                  font-sans m-0 p-0 text-gray-900 dark:text-white transition-colors duration-300">
    <Navbar/>
    <h1 className="text-center text-3xl font-extrabold py-5 text-gray-900 dark:text-white">
      Sentiment Analysis Dashboard
    </h1>

    <InputForm onAnalysisRequest={handleAnalysisRequest} setIsLoading={setIsLoading} />
    {isLoading?<Loading/> :
    
     result &&  <>
      <Display
        results={result}
        sentimentCounts={sentimentCounts}
        wordData={wordData}
      />
      <div className="flex justify-center my-8">
        <button
          onClick={handleDownloadReport}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 
                     dark:from-purple-600 dark:to-purple-800 
                     hover:from-purple-600 hover:to-purple-800 
                     dark:hover:from-purple-700 dark:hover:to-purple-900
                     text-white font-semibold rounded-lg shadow-lg shadow-purple-300/50 
                     dark:shadow-purple-500/50
                     transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          📥 Download Report
        </button>
      </div>
     </>

}
  </div>
);

}

export default Dashboard

import React, { useState } from 'react';

const SentimentChart = ({ data, width = 400, height = 400 }) => {
  const [hoveredId, setHoveredId] = useState(null);
  
  // Normalize data (array or object)
  const chartData = Array.isArray(data) 
    ? data 
    : [
        { id: 'positive', label: 'Positive', value: data?.positiveCount || 0, color: '#0c9b0c' },
        { id: 'neutral', label: 'Neutral', value: data?.neutralCount || 0, color: '#3b82f6' },
        { id: 'negative', label: 'Negative', value: data?.negativeCount || 0, color: '#ef4444' }
      ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  if (!data || total === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        No sentiment data available
      </div>
    );
  }
  
  const radius = 150;
  const cx = width / 2;
  const cy = height / 2;
  
  const createPieSlices = () => {
    let startAngle = -90;
    
    return chartData.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const pathData = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        Z
      `;
      
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const translateX = Math.cos(midRad) * 10;
      const translateY = Math.sin(midRad) * 10;
      
      startAngle = endAngle;
      
      return {
        pathData,
        item,
        percentage,
        translateX,
        translateY,
      };
    });
  };
  
  const slices = createPieSlices();
  const hoveredSlice = slices.find(s => s.item.id === hoveredId);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center gap-12">
        {/* PIE CHART */}
        <div 
          className="relative"
          style={{
            filter: 'drop-shadow(0 30px 80px rgba(0, 0, 0, 0.9)) drop-shadow(0 15px 40px rgba(0, 0, 0, 0.7)) drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5))'
          }}
        >
          <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            className="cursor-pointer"
          >
            {slices.map((slice, index) => {
              const isOtherHovered = hoveredId !== null && hoveredId !== slice.item.id;
              const uniqueId = `slice-${slice.item.id}`;
              
              return (
                <g key={index}>
                  <path
                    id={uniqueId}
                    d={slice.pathData}
                    fill={slice.item.color}
                    className={`cursor-pointer slice-element ${isOtherHovered ? 'slice-dimmed' : ''}`}
                    onMouseEnter={() => setHoveredId(slice.item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* SMALLER LABEL BOX */}
        {hoveredSlice && (
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-10 bg-slate-900/95 backdrop-blur-md rounded-xl p-3 min-w-[180px] animate-slideIn pointer-events-none"
            style={{
              border: `1px solid ${hoveredSlice.item.color}`,
              boxShadow: `0 10px 25px ${hoveredSlice.item.color}40, 0 5px 20px rgba(0,0,0,0.6)`
            }}
          >
            <h2 
              className="text-lg font-bold mb-2 uppercase tracking-wider"
              style={{
                color: hoveredSlice.item.color,
                textShadow: `0 0 10px ${hoveredSlice.item.color}60`
              }}
            >
              {hoveredSlice.item.label}
            </h2>
            <p className="my-0.5 text-xs text-gray-300">
              <span className="text-gray-400">Total:</span> {total}
            </p>
            <p className="my-0.5 text-xs text-gray-300">
              <span className="text-gray-400">{hoveredSlice.item.label}:</span> {hoveredSlice.item.value}
            </p>
            <span 
              className="block mt-2 pt-2 border-t border-white/10 text-xl font-bold"
              style={{
                color: hoveredSlice.item.color,
                textShadow: `0 0 8px ${hoveredSlice.item.color}50`
              }}
            >
              {hoveredSlice.percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        
        .slice-element {
          transition: all 0.3s ease-in-out;
          transform-origin: center;
        }
        
        .slice-dimmed {
          filter: grayscale(0.6) brightness(0.6);
          transform: scale(0.95);
        }
        
        ${slices.map((slice) => `
          #slice-${slice.item.id}:hover {
            filter: brightness(1.2);
            transform: translate(${slice.translateX}px, ${slice.translateY}px);
          }
        `).join('\n')}
      `}</style>
    </div>
  );
};

export default SentimentChart;

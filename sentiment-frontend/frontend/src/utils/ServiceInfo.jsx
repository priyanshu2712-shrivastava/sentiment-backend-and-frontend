import React, { useState, useRef } from 'react';

const ServiceInfo = ({ image, title, description }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[550px] h-[500px] bg-black rounded-2xl overflow-hidden transition-transform duration-300 ease-out cursor-pointer"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: '0 10px 20px rgba(168, 85, 247, 0.4)',
      }}
    >
      {/* Moving glow effect */}
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            width: '550px',
            height: '500px',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Image section - 60% height */}
      <div className="relative h-3/5 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content section - 40% height */}
      <div className="relative p-6 h-2/5 flex flex-col justify-center space-y-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceInfo;

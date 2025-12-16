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
      className="relative w-[550px] h-[500px] bg-white dark:bg-black   rounded-2xl overflow-hidden transition-transform duration-300 ease-out cursor-pointer"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: '1px 8px 8px  rgba(168, 85, 247, 0.4)',
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
            background: 'radial-gradient(circle, rgba(144, 27, 254, 0.4) 0%, transparent 70%)',
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {/* Image section - 60% height */}
      <div className="relative h-3/5 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover p-3 rounded-lg"
        />
      </div>

      {/* Content section - 40% height */}
      <div className="relative p-6 h-2/5 flex flex-col justify-center space-y-3">
        <h3 className="text-3xl font-bold text-black dark:text-neutral-400">{title}</h3>
        <p className="text-sm text-black-400 dark:text-neutral-200 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceInfo;

import React from 'react';
import './AnimatedLoader.css';

interface AnimatedLoaderProps {
  text?: string;
  size?: number;
  className?: string;
}

const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  text = 'Loading...',
  size = 180,
  className = '',
}) => {
  // Split text into individual letters for animation
  const letters = text.split('');

  return (
    <div 
      className={`loader-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.067, // Maintain proportional font size
      }}
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className="loader-letter"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter} {/* Handle spaces */}
        </span>
      ))}
      <div className="loader" />
    </div>
  );
};

export default AnimatedLoader;
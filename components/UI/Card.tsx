import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, glow = false }) => {
  return (
    <div 
      className={`
        relative overflow-hidden bg-surface border border-border rounded-xl backdrop-blur-sm
        ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-accent-blue/5' : ''}
        ${className}
      `}
    >
      {/* Top Edge Glow */}
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      )}
      
      {/* Inner subtle glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-white/5" />

      {children}
    </div>
  );
};

export default Card;
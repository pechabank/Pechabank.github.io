import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noAnimation?: boolean;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick, noAnimation = false, style }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-[32px] glass-panel overflow-hidden transition-all duration-500 ${!noAnimation && 'animate-scale-in'} ${className}`}
      style={style}
    >
      {/* Glossy reflection effect - Enhanced */}
      <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[32px] mix-blend-overlay"></div>
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
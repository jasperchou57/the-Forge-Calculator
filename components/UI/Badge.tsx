import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'accent';
  pulsing?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', pulsing = false }) => {
  const styles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    neutral: "bg-gray-800 text-gray-400 border-gray-700",
    accent: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
  };

  const gapClass = pulsing ? 'gap-1.5' : 'gap-0';
  const pulseWrapperClass = pulsing
    ? 'relative flex h-1.5 w-1.5'
    : 'relative flex h-0 w-0 overflow-hidden';
  const pingClass = pulsing
    ? 'animate-ping opacity-75'
    : 'opacity-0';
  const dotClass = pulsing
    ? 'opacity-100'
    : 'opacity-0';

  return (
    <span className={`
      inline-flex items-center ${gapClass} px-2 py-0.5 rounded-full text-xs font-mono border ${styles[variant]}
    `}>
      <span className={pulseWrapperClass} aria-hidden="true">
        <span className={`${pingClass} absolute inline-flex h-full w-full rounded-full bg-current`}></span>
        <span className={`${dotClass} relative inline-flex rounded-full h-1.5 w-1.5 bg-current`}></span>
      </span>
      {children}
    </span>
  );
};

export default Badge;
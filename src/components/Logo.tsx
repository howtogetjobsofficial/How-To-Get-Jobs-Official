import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'teal' | 'white';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'teal',
}) => {
  // Use the exact supplied logo asset from /assets/aistudio/2nd_HTGJ_Logo_479c899d.png
  // When displayed in dark sections (variant === 'white'), it sits in a crisp white badge
  // to maintain high contrast and 100% preservation of its original unaltered colors.
  if (variant === 'white') {
    return (
      <div className={`inline-flex items-center bg-white px-3.5 py-1.5 rounded-2xl shadow-sm ${className}`}>
        <img
          src="/assets/aistudio/2nd_HTGJ_Logo_479c899d.png"
          alt="How to Get Jobs"
          className="h-8 sm:h-10 w-auto object-contain block"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/assets/aistudio/2nd_HTGJ_Logo_479c899d.png"
        alt="How to Get Jobs"
        className="h-9 sm:h-11 w-auto object-contain block"
      />
    </div>
  );
};

// src/components/ui/Logo.jsx
import React from 'react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  // Size mapping
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const logoSize = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${logoSize} relative`}>
        {/* Ballot Box Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-indigo-600"
        >
          <path
            d="M4 8H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <rect
            x="4"
            y="4"
            width="16"
            height="4"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <path
            d="M10.5 11L9 12.5L12 15.5L15 12.5L13.5 11L12 12.5L10.5 11Z"
            fill="currentColor"
          />
          <path
            d="M4 8H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 4H20V8H4V4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 4V2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 4V2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chain element */}
          <path
            d="M9 15.5L6 18.5M15 15.5L18 18.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {showText && (
        <span className="ml-2 text-lg md:text-xl font-bold text-indigo-700">
          Secure Vote Chain
        </span>
      )}
    </div>
  );
};

export default Logo;
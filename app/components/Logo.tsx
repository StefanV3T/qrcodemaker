import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  bgColor?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 32, 
  color = "#000000", 
  bgColor = "#FFFFFF" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="100" height="100" rx="15" fill={bgColor} />
      
      {/* QR Code-like pattern */}
      {/* Position markers */}
      <rect x="15" y="15" width="25" height="25" fill={color} />
      <rect x="20" y="20" width="15" height="15" fill={bgColor} />
      <rect x="25" y="25" width="5" height="5" fill={color} />
      
      <rect x="60" y="15" width="25" height="25" fill={color} />
      <rect x="65" y="20" width="15" height="15" fill={bgColor} />
      <rect x="70" y="25" width="5" height="5" fill={color} />
      
      <rect x="15" y="60" width="25" height="25" fill={color} />
      <rect x="20" y="65" width="15" height="15" fill={bgColor} />
      <rect x="25" y="70" width="5" height="5" fill={color} />
      
      {/* QR code bits */}
      <rect x="50" y="15" width="5" height="5" fill={color} />
      <rect x="50" y="25" width="5" height="5" fill={color} />
      <rect x="15" y="50" width="5" height="5" fill={color} />
      <rect x="25" y="50" width="5" height="5" fill={color} />
      <rect x="45" y="45" width="15" height="15" fill={color} />
      <rect x="65" y="50" width="5" height="5" fill={color} />
      <rect x="80" y="50" width="5" height="5" fill={color} />
      <rect x="75" y="75" width="5" height="5" fill={color} />
      <rect x="65" y="65" width="5" height="5" fill={color} />
      <rect x="50" y="80" width="5" height="5" fill={color} />
    </svg>
  );
};

export default Logo;

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const Logo = ({ className, size = "md", showText = true }: LogoProps) => {
  // Larger size classes for better visibility
  const sizeClasses = {
    sm: "w-16 h-12",    // Increased from w-8 h-8
    md: "w-20 h-15",    // Increased from w-12 h-12
    lg: "w-28 h-21",    // Increased from w-16 h-16
    xl: "w-40 h-30"     // Increased from w-24 h-24
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* FitMate Logo SVG - Enhanced and Cleaner */}
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          width="400"
          height="300"
          viewBox="0 0 400 300"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Theme variables */}
          <defs>
            {/* Dashboard colors */}
            <linearGradient id="tealCardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5FB3C2"/>
              <stop offset="100%" stopColor="#2A7F8E"/>
            </linearGradient>
            
            {/* Soft depth effect */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2A7F8E" floodOpacity="0.25"/>
            </filter>
          </defs>
          
          {/* Base platform */}
          <rect
            x="100"
            y="125"
            width="200"
            height="8"
            rx="4"
            fill="url(#tealCardGradient)"
            filter="url(#softShadow)"
          />
          
          {/* Left bars */}
          <rect 
            x="115" 
            y="100" 
            width="12" 
            height="58" 
            rx="6" 
            fill="url(#tealCardGradient)" 
          />
          <rect 
            x="135" 
            y="85"  
            width="12" 
            height="88" 
            rx="6" 
            fill="url(#tealCardGradient)" 
          />
          
          {/* Right bars */}
          <rect 
            x="253" 
            y="85"  
            width="12" 
            height="88" 
            rx="6" 
            fill="url(#tealCardGradient)" 
          />
          <rect 
            x="273" 
            y="100" 
            width="12" 
            height="58" 
            rx="6" 
            fill="url(#tealCardGradient)" 
          />
          
          {/* Strong, readable "M" */}
          <path
            d="M155 200 L195 85 L215 135 L195 200 Z"
            fill="#2A7F8E"
          />
          <path
            d="M245 200 L205 85 L185 135 L205 200 Z"
            fill="#2A7F8E"
          />
          
          {/* Brand name */}
          <text
            x="200"
            y="260"
            fontFamily="Inter, Arial, sans-serif"
            fontWeight="700"
            fontSize="36"
            letterSpacing="4"
            textAnchor="middle"
            fill="#1F2D33"
          >
            FITMATE
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
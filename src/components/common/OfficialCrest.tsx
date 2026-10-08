import React, { useState } from 'react';
import { SCHOOL_LOGO_IMAGE } from '../../data/collegeImages';

interface CrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  light?: boolean;
}

export const OfficialCrest: React.FC<CrestProps> = ({
  className = '',
  size = 'md',
  showText = false,
  light = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
  };

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div className={`${sizeMap[size]} relative flex-shrink-0 flex items-center justify-center`}>
        {!imageError ? (
          <img
            src={SCHOOL_LOGO_IMAGE}
            alt="Original Logo of Labe College of Nursing Sciences, Gboko"
            onError={() => setImageError(true)}
            className="w-full h-full object-contain rounded-full shadow-xs select-none"
            loading="eager"
          />
        ) : (
          /* SVG fallback if image cannot be loaded */
          <svg
            viewBox="0 0 200 230"
            className="w-full h-full drop-shadow-md overflow-visible select-none"
          >
            <defs>
              <path id="topTextPath" d="M 28 100 A 72 72 0 1 1 172 100" fill="none" />
              <path id="bottomTextPath" d="M 60 148 A 72 72 0 0 0 140 148" fill="none" />
            </defs>
            <circle cx="100" cy="100" r="95" fill="none" stroke="#ea580c" strokeWidth="4.5" />
            <circle cx="100" cy="100" r="97.5" fill="none" stroke="#1e293b" strokeWidth="1" />
            <circle cx="100" cy="100" r="92.5" fill="#ffffff" />
            <circle cx="100" cy="100" r="91" fill="#059669" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="64" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <text fill="#ffffff" fontSize="11.8" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1.2">
              <textPath href="#topTextPath" startOffset="50%" textAnchor="middle">
                LABE COLLEGE OF NURSING SCIENCE
              </textPath>
            </text>
            <text x="32" y="145" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle">★</text>
            <text x="168" y="145" fill="#ffffff" fontSize="20" fontWeight="900" textAnchor="middle">★</text>
            <text x="100" y="178" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="2.5" textAnchor="middle">
              GBOKO
            </text>
            <g id="oilLamp" transform="translate(100, 48)">
              <path d="M -15 8 C -22 8 -26 4 -32 0 C -24 -2 -14 -3 0 -3 C 14 -3 24 -2 30 2 C 34 6 28 12 18 12 C 6 12 -4 10 -15 8 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="9" ry="4.5" fill="#451a03" stroke="#92400e" strokeWidth="0.8" />
              <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#1c1917" />
              <path d="M 18 -1 C 24 -6 28 3 24 9 C 20 12 16 10 16 7" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M -24 -1 C -28 -3 -32 -2 -34 0 C -32 3 -28 3 -24 3 Z" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
              <path d="M -31 -1 Q -33 -6 -31 -10 Q -29 -6 -31 -1 Z" fill="#f59e0b" />
              <path d="M -31 -2 Q -32 -5 -31 -7 Q -30 -5 -31 -2 Z" fill="#ef4444" />
              <circle cx="-31" cy="-6" r="5" fill="#fbbf24" opacity="0.3" />
            </g>
            <g id="rodOfAsclepius">
              <circle cx="100" cy="68" r="4.5" fill="#0f172a" />
              <line x1="100" y1="72" x2="100" y2="155" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              <polygon points="98,154 102,154 100,162" fill="#0f172a" />
              <path d="M 100 148 C 88 144 88 132 100 128 C 112 124 112 114 100 110" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
              <path d="M 100 110 C 86 106 86 94 100 90 C 116 86 116 76 100 74" fill="none" stroke="#0f172a" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M 100 74 C 106 72 116 72 118 76 C 120 80 114 84 106 84" fill="#0f172a" />
              <circle cx="114" cy="76" r="1" fill="#ffffff" />
              <path d="M 100 148 C 96 151 94 154 94 156" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            <g id="ribbonBanner" transform="translate(0, 168)">
              <path d="M 12 18 L 36 6 L 36 30 L 12 42 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
              <path d="M 188 18 L 164 6 L 164 30 L 188 42 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
              <polygon points="36,26 50,22 36,36" fill="#0f172a" />
              <polygon points="164,26 150,22 164,36" fill="#0f172a" />
              <path d="M 28 24 Q 100 12 172 24 L 172 46 Q 100 58 28 46 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
              <text x="100" y="39" fill="#dc2626" fontSize="12.2" fontWeight="900" fontFamily="Arial Black, Impact, sans-serif" letterSpacing="0.8" textAnchor="middle">
                LEARN, SERVE &amp; SAVE
              </text>
            </g>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`font-black tracking-tight leading-none text-base sm:text-lg ${
              light ? 'text-white' : 'text-emerald-950'
            }`}
          >
            LABE COLLEGE
          </span>
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              light ? 'text-amber-300' : 'text-emerald-800'
            }`}
          >
            OF NURSING SCIENCE, GBOKO
          </span>
          <span
            className={`text-[10px] tracking-normal ${
              light ? 'text-emerald-200' : 'text-emerald-700'
            }`}
          >
            Catholic Diocese of Gboko
          </span>
        </div>
      )}
    </div>
  );
};

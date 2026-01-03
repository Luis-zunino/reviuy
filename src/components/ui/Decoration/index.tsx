import React from 'react';
import type { DecorationProps } from './types';

export const Decoration = ({ className = 'w-full h-64 block' }: DecorationProps) => {
  return (
    <svg viewBox="0 0 1440 640" preserveAspectRatio="none" className={className}>
      <defs>
        <g id="wave">
          <path
            fill="#6C63FF"
            fillOpacity="0.3"
            d="M0,192L60,213.3C120,235,240,277,360,272C480,267,600,213,720,186.7C840,160,960,160,1080,181.3C1200,203,1320,245,1380,266.7L1440,288L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
          <path
            fill="#6C63FF"
            fillOpacity="0.5"
            d="M0,256L80,218.7C160,181,320,107,480,101.3C640,96,800,160,960,170.7C1120,181,1280,139,1360,117.3L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
          <path
            fill="#6C63FF"
            fillOpacity="0.7"
            d="M0,160L48,160C96,160,192,160,288,186.7C384,213,480,267,576,261.3C672,256,768,192,864,176C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </g>
      </defs>

      <use href="#wave" />

      <g transform="translate(0,320) rotate(180 720 160)">
        <use href="#wave" />
      </g>
    </svg>
  );
};

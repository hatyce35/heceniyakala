import React from 'react';

export const BackgroundSky: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50" />

      {/* Sun glow in top-right */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-200/50 blur-2xl" />
      <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-amber-300/80 shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-pulse-subtle flex items-center justify-center text-2xl">
        ☀️
      </div>

      {/* Gentle Floating Clouds */}
      <div
        className="absolute top-16 left-[-150px] opacity-75 animate-[float-cloud_45s_linear_infinite]"
        style={{ animationDelay: '0s' }}
      >
        <svg width="180" height="70" viewBox="0 0 180 70" fill="white">
          <ellipse cx="60" cy="45" rx="40" ry="22" />
          <ellipse cx="105" cy="40" rx="45" ry="25" />
          <ellipse cx="145" cy="48" rx="30" ry="18" />
          <ellipse cx="85" cy="25" rx="32" ry="22" />
        </svg>
      </div>

      <div
        className="absolute top-36 left-[-200px] opacity-65 animate-[float-cloud_65s_linear_infinite]"
        style={{ animationDelay: '-22s' }}
      >
        <svg width="220" height="80" viewBox="0 0 220 80" fill="white">
          <ellipse cx="70" cy="50" rx="50" ry="28" />
          <ellipse cx="130" cy="46" rx="55" ry="30" />
          <ellipse cx="180" cy="54" rx="35" ry="22" />
          <ellipse cx="105" cy="28" rx="40" ry="25" />
        </svg>
      </div>

      <div
        className="absolute top-64 left-[-180px] opacity-50 animate-[float-cloud_52s_linear_infinite]"
        style={{ animationDelay: '-12s' }}
      >
        <svg width="150" height="60" viewBox="0 0 150 60" fill="white">
          <ellipse cx="50" cy="40" rx="35" ry="18" />
          <ellipse cx="90" cy="35" rx="40" ry="22" />
          <ellipse cx="120" cy="42" rx="25" ry="15" />
          <ellipse cx="75" cy="22" rx="28" ry="18" />
        </svg>
      </div>

      {/* Soft rolling cartoon hills at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-full object-fill preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Back hill */}
          <path
            fill="#a7f3d0"
            fillOpacity="0.7"
            d="M0,192L60,181.3C120,171,240,149,360,160C480,171,600,213,720,208C840,203,960,149,1080,144C1200,139,1320,181,1380,202.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          {/* Front green hill */}
          <path
            fill="#6ee7b7"
            fillOpacity="0.85"
            d="M0,224L60,229.3C120,235,240,245,360,234.7C480,224,600,192,720,186.7C840,181,960,203,1080,213.3C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        {/* Tiny cute flowers/grass dots on hill */}
        <div className="absolute bottom-2 left-6 text-sm opacity-80">🌸</div>
        <div className="absolute bottom-4 left-24 text-xs opacity-75">🌼</div>
        <div className="absolute bottom-3 left-1/3 text-sm opacity-80">🌱</div>
        <div className="absolute bottom-2 right-1/4 text-sm opacity-80">🌸</div>
        <div className="absolute bottom-4 right-10 text-sm opacity-80">🌼</div>
      </div>
    </div>
  );
};

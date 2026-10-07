import React, { useEffect, useState } from 'react';

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  color?: string;
  size?: number; // Original bubble diameter in pixels (e.g. 82px)
}

interface MicroBubble {
  id: number;
  dx: number;
  dy: number;
  size: number;
  delay: number;
}

interface SoapDroplet {
  id: number;
  dx: number;
  dy: number;
  size: number;
  gravityY: number;
}

export const ParticleBurst: React.FC<{ effect: ParticleEffect; onComplete: (id: string) => void }> = ({
  effect,
  onComplete,
}) => {
  const bubbleDiameter = effect.size || 82;

  // 1. Realistic miniature soap bubbles thrown off by the rupture
  const [microBubbles] = useState<MicroBubble[]>(() => {
    const items: MicroBubble[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45;
      const dist = bubbleDiameter * 0.45 + Math.random() * 32;
      items.push({
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        size: Math.floor(9 + Math.random() * 8), // 9px to 17px
        delay: Math.random() * 50,
      });
    }
    return items;
  });

  // 2. Fine glistening water/soap droplets sprayed radially
  const [droplets] = useState<SoapDroplet[]>(() => {
    const items: SoapDroplet[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = bubbleDiameter * 0.55 + Math.random() * 45;
      items.push({
        id: i,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4, // 3px to 7px
        gravityY: 10 + Math.random() * 15,
      });
    }
    return items;
  });

  const [animating, setAnimating] = useState(false);
  const [poppedMicro, setPoppedMicro] = useState(false);

  useEffect(() => {
    // Start explosion instantly
    const frame = requestAnimationFrame(() => setAnimating(true));

    // Secondary micro-bubbles pop after flying outwards
    const microTimer = setTimeout(() => {
      setPoppedMicro(true);
    }, 180);

    // Complete effect and clean up
    const endTimer = setTimeout(() => {
      onComplete(effect.id);
    }, 380);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(microTimer);
      clearTimeout(endTimer);
    };
  }, [effect.id, onComplete]);

  return (
    <div
      className="pointer-events-none fixed z-40"
      style={{ left: `${effect.x}px`, top: `${effect.y}px` }}
    >
      {/* 1. Iridescent Thin-Film Rupture Ring (Expanding soap film snap) */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-out ${
          animating ? 'scale-135 opacity-0' : 'scale-90 opacity-95'
        }`}
        style={{
          width: `${bubbleDiameter}px`,
          height: `${bubbleDiameter}px`,
          transitionDuration: '160ms',
          border: '2px solid rgba(224, 242, 254, 0.95)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(186,230,253,0.3) 60%, transparent 100%)',
          boxShadow: '0 0 16px rgba(186, 230, 253, 0.8), inset 0 0 12px rgba(255, 255, 255, 0.95)',
        }}
      />

      {/* 2. Secondary soft vapor/mist splash expanding in center */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-out ${
          animating ? 'scale-150 opacity-0' : 'scale-50 opacity-70'
        }`}
        style={{
          width: `${bubbleDiameter * 0.7}px`,
          height: `${bubbleDiameter * 0.7}px`,
          transitionDuration: '220ms',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(186,230,253,0.4) 50%, transparent 80%)',
          filter: 'blur(3px)',
        }}
      />

      {/* 3. Micro-Foam Bubbles (Realistic baby soap bubbles flying outwards and popping) */}
      {microBubbles.map((mb) => (
        <div
          key={mb.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-out"
          style={{
            width: `${mb.size}px`,
            height: `${mb.size}px`,
            transitionDuration: '240ms',
            transitionDelay: `${mb.delay}ms`,
            transform: animating
              ? `translate3d(${mb.dx}px, ${mb.dy}px, 0) scale(${poppedMicro ? 0 : 1})`
              : 'translate3d(0, 0, 0) scale(0.6)',
            opacity: poppedMicro ? 0 : 0.95,
            background: 'radial-gradient(135% 135% at 30% 25%, #ffffff 0%, rgba(224, 242, 254, 0.7) 40%, rgba(125, 211, 252, 0.85) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 1px 4px rgba(14, 165, 233, 0.3), inset 0 0 3px rgba(255,255,255,0.9)',
          }}
        >
          {/* Specular glint on micro-bubble */}
          <div
            className="absolute rounded-full bg-white"
            style={{
              top: '18%',
              left: '20%',
              width: '28%',
              height: '28%',
              opacity: 0.95,
            }}
          />
        </div>
      ))}

      {/* 4. Fine Liquid Soap Droplets (Spherical glistening water droplets) */}
      {droplets.map((d) => (
        <span
          key={d.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ease-out"
          style={{
            width: `${d.size}px`,
            height: `${d.size}px`,
            transitionDuration: '320ms',
            transform: animating
              ? `translate3d(${d.dx}px, ${d.dy + d.gravityY}px, 0) scale(0.4)`
              : 'translate3d(0, 0, 0) scale(1)',
            opacity: animating ? 0 : 0.9,
            background: d.id % 2 === 0
              ? 'radial-gradient(circle at 32% 32%, #ffffff 0%, #bae6fd 50%, #38bdf8 100%)'
              : 'radial-gradient(circle at 32% 32%, #ffffff 0%, #e0f2fe 60%, #7dd3fc 100%)',
            boxShadow: '0 1px 3px rgba(14, 165, 233, 0.45)',
          }}
        />
      ))}

      {/* 5. Center specular flash of water droplets */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 transition-all ease-out ${
          animating ? 'scale-150 opacity-0' : 'scale-100 opacity-90'
        }`}
        style={{
          width: '14px',
          height: '14px',
          transitionDuration: '140ms',
          boxShadow: '0 0 10px #ffffff',
        }}
      />
    </div>
  );
};

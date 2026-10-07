import React, { useRef, useEffect, useCallback, useState } from 'react';
import { BubbleTheme, REALISTIC_SOAP_BUBBLE_THEME, getRandomDistractor } from '../data/syllables';

export interface BubbleData {
  id: string;
  text: string;
  isTarget: boolean;
  xRatio: number; // Normalized horizontal lane: 0.0 (left) to 1.0 (right)
  y: number; // Pixels from bottom of field
  size: number; // Diameter in pixels
  speed: number; // Pixels per second
  theme: BubbleTheme;
  wobbleOffset: number;
  wobbleSpeed: number;
  state: 'normal' | 'popping' | 'shaking';
}

interface BubbleFieldProps {
  currentTarget: string;
  levelId: number;
  isPaused: boolean;
  score: number;
  onBubbleHit: (bubble: BubbleData, clientX: number, clientY: number) => void;
  onWrongBubble: (bubble: BubbleData, clientX: number, clientY: number) => void;
}

export const BubbleField: React.FC<BubbleFieldProps> = ({
  currentTarget,
  levelId,
  isPaused,
  score,
  onBubbleHit,
  onWrongBubble,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<BubbleData[]>([]);
  const [, setRenderTrigger] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 360,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  const lastTimeRef = useRef<number>(performance.now());
  const spawnTimerRef = useRef<number>(0);
  const targetRef = useRef<string>(currentTarget);
  const levelIdRef = useRef<number>(levelId);
  const scoreRef = useRef<number>(score);
  const dimensionsRef = useRef<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 360,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  // Keep refs up-to-date
  useEffect(() => {
    targetRef.current = currentTarget;
  }, [currentTarget]);

  useEffect(() => {
    levelIdRef.current = levelId;
  }, [levelId]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Responsive configuration based on current screen width (phone, tablet, computer)
  const getResponsiveConfig = useCallback(() => {
    const w = dimensionsRef.current.width || 360;
    if (w < 500) {
      // Mobile Phone (e.g. 320px - 480px)
      return {
        lanes: [0.08, 0.28, 0.50, 0.72, 0.92],
        minSize: 70,
        maxSize: 82,
        maxBubbles: 11,
        sideMargin: 16,
        spawnInterval: 0.65,
      };
    } else if (w < 850) {
      // Tablet / iPad / Foldable (e.g. 500px - 850px)
      return {
        lanes: [0.08, 0.22, 0.36, 0.50, 0.64, 0.78, 0.92],
        minSize: 76,
        maxSize: 88,
        maxBubbles: 14,
        sideMargin: 24,
        spawnInterval: 0.58,
      };
    } else {
      // Laptop / Desktop / Large Screen (850px - 1920px+)
      return {
        lanes: [0.06, 0.17, 0.28, 0.39, 0.50, 0.61, 0.72, 0.83, 0.94],
        minSize: 80,
        maxSize: 94,
        maxBubbles: 17,
        sideMargin: 32,
        spawnInterval: 0.50,
      };
    }
  }, []);

  // Track container dimensions accurately with ResizeObserver for mobile, tablet & desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const w = el.clientWidth || window.innerWidth || 360;
      const h = el.clientHeight || window.innerHeight || 600;
      setDimensions({ width: w, height: h });
      dimensionsRef.current = { width: w, height: h };
    };

    updateDimensions();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateDimensions());
      ro.observe(el);
    }
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Spawn a new bubble starting cleanly from below the bottom edge
  const spawnBubble = useCallback((customY?: number) => {
    if (!containerRef.current) return;
    const currentBubbles = bubblesRef.current;
    const config = getResponsiveConfig();

    // Check if target is present
    const targetOnScreen = currentBubbles.some(
      (b) => b.text === targetRef.current && b.state === 'normal'
    );

    // Probability of spawning target: if missing, guarantee; otherwise 38%
    const shouldBeTarget = !targetOnScreen || Math.random() < 0.38;

    const text = shouldBeTarget
      ? targetRef.current
      : getRandomDistractor(levelIdRef.current, targetRef.current);

    const lanes = config.lanes;
    const recentRatios = currentBubbles.slice(-4).map((b) => b.xRatio);

    let chosenRatio = lanes[Math.floor(Math.random() * lanes.length)];
    for (let i = 0; i < 6; i++) {
      const candidate = lanes[i % lanes.length] + (Math.random() - 0.5) * 0.08;
      const safeCandidate = Math.max(0.04, Math.min(0.96, candidate));
      const hasConflict = recentRatios.some((r) => Math.abs(r - safeCandidate) < 0.14);
      if (!hasConflict) {
        chosenRatio = safeCandidate;
        break;
      }
    }

    // Adaptive speed: calm, steady, fluid glide
    const speedBonus = Math.min(scoreRef.current * 0.03, 20);
    const speed = 64 + Math.random() * 16 + speedBonus;

    const theme = REALISTIC_SOAP_BUBBLE_THEME;
    const size = Math.floor(config.minSize + Math.random() * (config.maxSize - config.minSize));

    const startY = customY !== undefined ? customY : -size - 4; // Start below the very bottom edge

    const newBubble: BubbleData = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text,
      isTarget: text === targetRef.current,
      xRatio: chosenRatio,
      y: startY,
      size,
      speed,
      theme,
      wobbleOffset: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.0 + Math.random() * 0.8,
      state: 'normal',
    };

    bubblesRef.current.push(newBubble);
  }, [getResponsiveConfig]);

  // Animation frame loop with high-performance time-delta
  useEffect(() => {
    let animId: number;

    const updateLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = currentTime;

      if (!isPaused && containerRef.current) {
        const containerH = dimensionsRef.current.height || 600;
        const config = getResponsiveConfig();

        // Advance spawn timer: spawn frequently for a rich, lively screen
        spawnTimerRef.current += dt;
        const spawnInterval = Math.max(config.spawnInterval - scoreRef.current * 0.0003, 0.45);

        // Allow bubbles based on screen width capacity
        if (spawnTimerRef.current >= spawnInterval && bubblesRef.current.length < config.maxBubbles) {
          spawnBubble();
          spawnTimerRef.current = 0;
        }

        // Update bubble vertical positions with smooth linear glide
        const activeBubbles: BubbleData[] = [];
        for (const bubble of bubblesRef.current) {
          if (bubble.state === 'normal') {
            bubble.y += bubble.speed * dt;
            // Remove when reaching top fade threshold
            if (bubble.y < containerH - bubble.size + 15) {
              activeBubbles.push(bubble);
            }
          } else {
            // Keep popping or shaking bubbles briefly
            activeBubbles.push(bubble);
          }
        }

        bubblesRef.current = activeBubbles;
        setRenderTrigger(currentTime);
      }

      animId = requestAnimationFrame(updateLoop);
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(updateLoop);

    return () => cancelAnimationFrame(animId);
  }, [isPaused, spawnBubble, getResponsiveConfig]);

  // Initial populate: bubbles staggered across screen height
  useEffect(() => {
    if (bubblesRef.current.length === 0) {
      const h = dimensionsRef.current.height || 600;
      const isTall = h > 750;
      const initialHeights = isTall
        ? [60, 150, 240, 330, 420, 510, 600, 690]
        : [50, 130, 210, 290, 370, 450];

      initialHeights.forEach((height, idx) => {
        // Guarantee at least one target bubble in initial batch
        if (idx === 1) {
          const cfg = getResponsiveConfig();
          const size = Math.floor((cfg.minSize + cfg.maxSize) / 2);
          bubblesRef.current.push({
            id: `init_target_${Date.now()}`,
            text: targetRef.current,
            isTarget: true,
            xRatio: 0.5,
            y: height,
            size,
            speed: 68,
            theme: REALISTIC_SOAP_BUBBLE_THEME,
            wobbleOffset: Math.random() * Math.PI,
            wobbleSpeed: 1.2,
            state: 'normal',
          });
        } else {
          spawnBubble(height);
        }
      });
    }
  }, [spawnBubble, getResponsiveConfig]);

  const handlePointerDown = (
    bubble: BubbleData,
    e: React.PointerEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (isPaused || bubble.state === 'popping') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;

    if (bubble.text === targetRef.current) {
      // Instant pop rupture
      bubble.state = 'popping';
      onBubbleHit(bubble, clientX, clientY);

      // Instant rupture: remove in 40ms for seamless handover to realistic foam burst
      setTimeout(() => {
        bubblesRef.current = bubblesRef.current.filter((b) => b.id !== bubble.id);
      }, 40);
    } else {
      // Gentle shake
      bubble.state = 'shaking';
      onWrongBubble(bubble, clientX, clientY);

      setTimeout(() => {
        const b = bubblesRef.current.find((item) => item.id === bubble.id);
        if (b && b.state === 'shaking') {
          b.state = 'normal';
        }
      }, 380);
    }
  };

  const config = getResponsiveConfig();
  const containerW = dimensions.width;
  const containerH = dimensions.height;
  const sideMargin = config.sideMargin;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full overflow-hidden touch-none select-none z-10"
    >
      {bubblesRef.current.map((bubble) => {
        // Organic, natural floating wobble (max ±4px)
        const wobbleX = Math.sin(bubble.y * 0.02 + bubble.wobbleOffset) * 4;

        // Position: horizontal center + safe margin
        const safeWidth = Math.max(containerW - bubble.size - sideMargin * 2, 20);
        const posX = sideMargin + bubble.xRatio * safeWidth + wobbleX;

        // Vertical position: GPU translate3d from top
        const posY = containerH - bubble.y - bubble.size;

        // Gentle fade-out as it approaches the top header
        const distFromTop = posY;
        const opacity = distFromTop < 40 ? Math.max(0, distFromTop / 40) : 1;

        return (
          <button
            key={bubble.id}
            onPointerDown={(e) => handlePointerDown(bubble, e)}
            aria-label={`Baloncuk: ${bubble.text}`}
            className={`bubble-sphere select-none active:scale-95 ${
              bubble.state === 'popping'
                ? 'animate-pop pointer-events-none'
                : bubble.state === 'shaking'
                ? 'animate-shake'
                : ''
            }`}
            style={{
              // Hardware-accelerated GPU translation: eliminates layout thrashing & jitter
              transform: `translate3d(${posX}px, ${posY}px, 0)`,
              top: 0,
              left: 0,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.state === 'popping' ? undefined : opacity,
              background: bubble.theme.bgGradient,
              border: `2px solid ${bubble.theme.bubbleBorder}`,
              boxShadow: `inset -5px -5px 14px rgba(14, 165, 233, 0.2), inset 5px 5px 14px rgba(255, 255, 255, 0.95), 0 10px 24px rgba(14, 165, 233, 0.16)`,
              zIndex: bubble.state === 'popping' ? 25 : 15,
            }}
          >
            {/* Top-left specular curved crescent reflection */}
            <div className="bubble-shine-primary" />

            {/* Tiny crisp secondary specular glint */}
            <div className="bubble-shine-dot" />

            {/* Bottom-right soft refractive rim */}
            <div className="bubble-rim" />

            {/* Bubble text: Turkish letter/syllable with high contrast for early readers */}
            <span
              className="relative z-10 font-black tracking-wide text-center px-1 break-words select-none pointer-events-none text-slate-900"
              style={{
                fontSize:
                  bubble.text.length >= 4
                    ? `${Math.floor(bubble.size * 0.25)}px`
                    : bubble.text.length >= 3
                    ? `${Math.floor(bubble.size * 0.32)}px`
                    : `${Math.floor(bubble.size * 0.39)}px`,
                lineHeight: '1.05',
                textShadow: '0 1px 2px rgba(255,255,255,0.85)',
              }}
            >
              {bubble.text}
            </span>
          </button>
        );
      })}
    </div>
  );
};

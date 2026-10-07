/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { BackgroundSky } from './components/BackgroundSky';
import { TopHud } from './components/TopHud';
import { BubbleField, BubbleData } from './components/BubbleField';
import { ParticleBurst, ParticleEffect } from './components/ParticleBurst';
import { FeedbackBanner, FloatingFeedback } from './components/FeedbackBanner';
import { StartScreen } from './components/StartScreen';
import { PauseModal } from './components/PauseModal';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import {
  LEVELS,
  LevelConfig,
  GameModeType,
  ChallengeConfig,
  DEFAULT_CHALLENGE_CONFIG,
  getLevelForScore,
  getRandomTarget,
  ENCOURAGING_MESSAGES,
  REINFORCEMENT_MESSAGES,
  RETRY_MESSAGES,
} from './data/syllables';
import { soundManager } from './utils/sound';

type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'SUMMARY';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [gameMode, setGameMode] = useState<GameModeType>('ENDLESS');
  const [selectedMode, setSelectedMode] = useState<number>(0); // 0 = All Levels/Endless, 1-5 = Specific Level
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig>(DEFAULT_CHALLENGE_CONFIG);

  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentTarget, setCurrentTarget] = useState<string>('A');
  const [isReinforcementTarget, setIsReinforcementTarget] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [highScore, setHighScore] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(soundManager.voiceEnabled);

  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [floatingFeedback, setFloatingFeedback] = useState<FloatingFeedback | null>(null);

  const prevHighScoreRef = useRef<number>(0);
  const hasCelebratedRecordRef = useRef<boolean>(false);

  // Load saved high score and settings on mount
  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('heceni_yakala_highscore');
      if (savedScore) {
        const val = parseInt(savedScore, 10);
        if (!isNaN(val)) {
          setHighScore(val);
          prevHighScoreRef.current = val;
        }
      }
      const savedStreak = localStorage.getItem('heceni_yakala_best_streak');
      if (savedStreak) {
        const val = parseInt(savedStreak, 10);
        if (!isNaN(val)) {
          setBestStreak(val);
        }
      }
    } catch {
      // LocalStorage access may fail in restricted sandboxes
    }
  }, []);

  // Update dynamic level for Endless Adventure mode
  useEffect(() => {
    if (gameMode === 'ENDLESS') {
      const dynamicLevel = getLevelForScore(score);
      setCurrentLevelId(dynamicLevel.id);
    } else if (gameMode === 'LEVEL') {
      setCurrentLevelId(selectedMode > 0 ? selectedMode : 1);
    } else if (gameMode === 'CHALLENGE') {
      if (selectedMode === 0) {
        const dynamicLevel = getLevelForScore(score);
        setCurrentLevelId(dynamicLevel.id);
      } else {
        setCurrentLevelId(selectedMode);
      }
    }
  }, [score, gameMode, selectedMode]);

  // Countdown timer effect for Süreli Mod
  useEffect(() => {
    if (
      gameState === 'PLAYING' &&
      gameMode === 'CHALLENGE' &&
      challengeConfig.kind === 'TIME'
    ) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            soundManager.playTimeUp();
            try {
              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a78bfa'],
              });
            } catch {
              // ignore
            }
            setGameState('SUMMARY');
            return 0;
          }
          if (prev <= 4 && prev >= 2) {
            soundManager.playTimeWarning();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, gameMode, challengeConfig.kind]);

  // Start or restart a game
  const handleStartGame = useCallback(() => {
    const isAllLevels = gameMode === 'ENDLESS' || selectedMode === 0;
    const startingLevelId = isAllLevels ? 1 : selectedMode;
    setCurrentLevelId(startingLevelId);
    const result = getRandomTarget(startingLevelId, undefined, isAllLevels);
    setCurrentTarget(result.target);
    setIsReinforcementTarget(false);

    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setTimeLeft(challengeConfig.timeLimit);
    setIsNewRecord(false);
    hasCelebratedRecordRef.current = false;
    setParticleEffects([]);
    setFloatingFeedback(null);
    setGameState('PLAYING');

    // Speak initial target if voice enabled
    setTimeout(() => {
      soundManager.speakText(result.target);
    }, 350);
  }, [gameMode, selectedMode, challengeConfig.timeLimit]);

  // Calculate score reward based on streak
  const calculatePoints = (currentStreak: number): number => {
    if (currentStreak <= 1) return 10;
    if (currentStreak === 2) return 12;
    if (currentStreak === 3) return 15;
    if (currentStreak === 4) return 20;
    if (currentStreak >= 5) return Math.min(20 + (currentStreak - 4) * 5, 45);
    return 10;
  };

  // Correct bubble hit handler
  const handleBubbleHit = useCallback(
    (bubble: BubbleData, clientX: number, clientY: number) => {
      const newStreak = streak + 1;
      const points = calculatePoints(newStreak);
      const newScore = score + points;
      const nextCorrectCount = correctCount + 1;

      setStreak(newStreak);
      setScore(newScore);
      setCorrectCount(nextCorrectCount);

      // Sound feedback
      soundManager.playPop();
      soundManager.playCorrect(newStreak);

      // Visual particles
      const newEffect: ParticleEffect = {
        id: `burst_${Date.now()}_${Math.random()}`,
        x: clientX,
        y: clientY,
        color: bubble.theme.particleColor,
        size: bubble.size,
      };
      setParticleEffects((prev) => [...prev, newEffect]);

      // Check if Sayılı Mod (Target Count Mode) is completed!
      if (
        gameMode === 'CHALLENGE' &&
        challengeConfig.kind === 'COUNT' &&
        nextCorrectCount >= challengeConfig.targetCount
      ) {
        soundManager.playLevelComplete();
        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a78bfa'],
          });
        } catch {
          // Ignore
        }

        setFloatingFeedback({
          id: `fb_${Date.now()}`,
          text: 'HEDEF TAMAMLANDI! 🏆',
          points,
          type: 'record',
          x: clientX,
          y: clientY,
        });

        // Short timeout for seamless visual burst handover
        setTimeout(() => {
          setGameState('SUMMARY');
        }, 450);
        return;
      }

      // Check for personal record break in Endless/Standard mode
      const currentBest = Math.max(highScore, prevHighScoreRef.current);
      if (currentBest > 0 && newScore > currentBest && !hasCelebratedRecordRef.current) {
        setIsNewRecord(true);
        hasCelebratedRecordRef.current = true;
        soundManager.playNewRecord();

        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a78bfa'],
          });
        } catch {
          // Ignore
        }

        setFloatingFeedback({
          id: `fb_${Date.now()}`,
          text: 'YENİ REKOR! 🎉',
          points,
          type: 'record',
          x: clientX,
          y: clientY,
        });
      } else if (isReinforcementTarget) {
        const randomReinf =
          REINFORCEMENT_MESSAGES[Math.floor(Math.random() * REINFORCEMENT_MESSAGES.length)];
        setFloatingFeedback({
          id: `fb_${Date.now()}`,
          text: randomReinf,
          points,
          type: 'correct',
          x: clientX,
          y: clientY,
        });
      } else {
        const randomMsg =
          ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
        setFloatingFeedback({
          id: `fb_${Date.now()}`,
          text: randomMsg,
          points,
          type: 'correct',
          x: clientX,
          y: clientY,
        });
      }

      // Save high score and streak
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('heceni_yakala_highscore', String(newScore));
        } catch {
          // Ignore
        }
      }

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        try {
          localStorage.setItem('heceni_yakala_best_streak', String(newStreak));
        } catch {
          // Ignore
        }
      }

      // Automatically generate a new target syllable
      const isAllLevels = gameMode === 'ENDLESS' || selectedMode === 0;
      const activeLevelId = isAllLevels ? getLevelForScore(newScore).id : selectedMode;
      const result = getRandomTarget(activeLevelId, bubble.text, isAllLevels);
      setCurrentTarget(result.target);
      setIsReinforcementTarget(result.isReinforcement);

      // Speak new target
      setTimeout(() => {
        soundManager.speakText(result.target);
      }, 300);
    },
    [
      streak,
      score,
      correctCount,
      gameMode,
      challengeConfig,
      highScore,
      bestStreak,
      isReinforcementTarget,
      selectedMode,
    ]
  );

  // Wrong bubble click handler
  const handleWrongBubble = useCallback(
    (bubble: BubbleData, clientX: number, clientY: number) => {
      setStreak(0);
      soundManager.playWrong();

      const retryMsg = RETRY_MESSAGES[Math.floor(Math.random() * RETRY_MESSAGES.length)];
      setFloatingFeedback({
        id: `fb_err_${Date.now()}`,
        text: retryMsg,
        points: 0,
        type: 'wrong',
        x: clientX,
        y: clientY,
      });

      // Repeat current target pronunciation to aid retention
      setTimeout(() => {
        soundManager.speakText(currentTarget);
      }, 350);
    },
    [currentTarget]
  );

  // Clean up completed particle bursts
  const handleParticleComplete = useCallback((id: string) => {
    setParticleEffects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Dismiss feedback banner after delay
  useEffect(() => {
    if (floatingFeedback) {
      const timer = setTimeout(() => {
        setFloatingFeedback(null);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [floatingFeedback]);

  // Sound and Voice toggles
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  }, [isMuted]);

  const handleToggleVoice = useCallback(() => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    soundManager.setVoiceEnabled(nextVoice);
  }, [voiceEnabled]);

  const currentLevelConfig: LevelConfig =
    LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  // Dynamic level badge string
  const getDisplayLevelName = () => {
    if (gameMode === 'CHALLENGE') {
      if (challengeConfig.kind === 'COUNT') {
        return `Sayılı Mod (${challengeConfig.targetCount} Doğru)`;
      }
      return `Süreli Mod (${challengeConfig.timeLimit} Sn)`;
    }
    if (gameMode === 'ENDLESS') {
      return `Macera (${currentLevelConfig.shortName})`;
    }
    return currentLevelConfig.name;
  };

  return (
    <div className="relative w-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between font-['Fredoka',sans-serif]">
      {/* Playful Sky Background with Floating Clouds and Hills */}
      <BackgroundSky />

      {/* Main Screens / States */}
      {gameState === 'START' && (
        <StartScreen
          highScore={highScore}
          bestStreak={bestStreak}
          gameMode={gameMode}
          selectedLevelId={selectedMode}
          challengeConfig={challengeConfig}
          isMuted={isMuted}
          voiceEnabled={voiceEnabled}
          onSelectGameMode={setGameMode}
          onSelectLevel={setSelectedMode}
          onUpdateChallengeConfig={setChallengeConfig}
          onToggleMute={handleToggleMute}
          onToggleVoice={handleToggleVoice}
          onStartGame={handleStartGame}
        />
      )}

      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="relative z-10 w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden">
          {/* Top HUD: Target Syllable, Score, Streak, Challenge Progress */}
          <TopHud
            currentTarget={currentTarget}
            score={score}
            highScore={highScore}
            streak={streak}
            isNewRecord={isNewRecord}
            isReinforcement={isReinforcementTarget}
            levelName={getDisplayLevelName()}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={() => setGameState('PAUSED')}
            onSpeakTarget={() => soundManager.speakText(currentTarget)}
            gameMode={gameMode}
            challengeConfig={challengeConfig}
            correctCount={correctCount}
            timeLeft={timeLeft}
          />

          {/* Active Bubble Floating Field spanning full width and down to bottom edge */}
          <BubbleField
            currentTarget={currentTarget}
            levelId={currentLevelId}
            isPaused={gameState === 'PAUSED'}
            score={score}
            onBubbleHit={handleBubbleHit}
            onWrongBubble={handleWrongBubble}
          />

          {/* Bottom quick actions strip - floating gracefully over bottom edge */}
          <footer className="absolute bottom-2 sm:bottom-3 left-0 right-0 z-20 w-full max-w-sm sm:max-w-md mx-auto px-3 sm:px-4 py-1 flex items-center justify-between pointer-events-none pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <button
              onClick={() => setGameState('SUMMARY')}
              className="pointer-events-auto text-[11px] sm:text-xs font-bold text-sky-800/90 hover:text-sky-950 bg-white/85 hover:bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-sky-200/80 shadow-xs transition-colors backdrop-blur-xs"
            >
              🏁 Oyunu Bitir
            </button>

            <span className="pointer-events-auto text-[10px] sm:text-[11px] font-semibold text-sky-800/90 bg-white/75 px-2 sm:px-2.5 py-1 rounded-full border border-sky-100 backdrop-blur-xs">
              Baloncuğu Yakala! 🫧
            </span>

            <button
              onClick={() => {
                const isAllLevels = gameMode === 'ENDLESS' || selectedMode === 0;
                const result = getRandomTarget(currentLevelId, currentTarget, isAllLevels);
                setCurrentTarget(result.target);
                setIsReinforcementTarget(result.isReinforcement);
                soundManager.speakText(result.target);
              }}
              className="pointer-events-auto text-[11px] sm:text-xs font-bold text-sky-800/90 hover:text-sky-950 bg-white/85 hover:bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-sky-200/80 shadow-xs transition-colors backdrop-blur-xs"
            >
              🔄 Başka Hece
            </button>
          </footer>
        </div>
      )}

      {/* Floating Feedback Banner */}
      {floatingFeedback && <FeedbackBanner feedback={floatingFeedback} />}

      {/* Bubble Popping Particle Bursts */}
      {particleEffects.map((effect) => (
        <ParticleBurst
          key={effect.id}
          effect={effect}
          onComplete={handleParticleComplete}
        />
      ))}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <PauseModal
          score={score}
          highScore={highScore}
          streak={streak}
          isMuted={isMuted}
          voiceEnabled={voiceEnabled}
          onResume={() => setGameState('PLAYING')}
          onRestart={handleStartGame}
          onHome={() => setGameState('START')}
          onToggleMute={handleToggleMute}
          onToggleVoice={handleToggleVoice}
        />
      )}

      {/* Session Summary Modal */}
      {gameState === 'SUMMARY' && (
        <SessionSummaryModal
          score={score}
          highScore={highScore}
          bestStreak={bestStreak}
          isNewRecord={isNewRecord}
          gameMode={gameMode}
          challengeConfig={challengeConfig}
          correctCount={correctCount}
          onRestart={handleStartGame}
          onHome={() => setGameState('START')}
        />
      )}
    </div>
  );
}

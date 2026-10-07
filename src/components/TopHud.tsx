import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Flame,
  Volume1,
  Target,
  Timer,
  CheckCircle,
  Maximize,
  Minimize,
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { getMebPhoneticDisplayGuide, GameModeType, ChallengeConfig } from '../data/syllables';
import { toggleFullscreen, isCurrentlyFullscreen } from '../utils/fullscreen';

interface TopHudProps {
  currentTarget: string;
  score: number;
  highScore: number;
  streak: number;
  isNewRecord: boolean;
  isReinforcement?: boolean;
  levelName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onSpeakTarget: () => void;

  // Challenge Mode props
  gameMode?: GameModeType;
  challengeConfig?: ChallengeConfig;
  correctCount?: number;
  timeLeft?: number;
}

export const TopHud: React.FC<TopHudProps> = ({
  currentTarget,
  score,
  highScore,
  streak,
  isNewRecord,
  isReinforcement,
  levelName,
  isMuted,
  onToggleMute,
  onPause,
  onSpeakTarget,
  gameMode = 'ENDLESS',
  challengeConfig,
  correctCount = 0,
  timeLeft = 60,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => isCurrentlyFullscreen());

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(isCurrentlyFullscreen());
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const isCountChallenge = gameMode === 'CHALLENGE' && challengeConfig?.kind === 'COUNT';
  const isTimeChallenge = gameMode === 'CHALLENGE' && challengeConfig?.kind === 'TIME';
  const targetCount = challengeConfig?.targetCount || 10;
  const progressPercent = isCountChallenge ? Math.min(100, (correctCount / targetCount) * 100) : 0;

  return (
    <header className="relative z-30 w-full max-w-xl lg:max-w-2xl mx-auto px-3 sm:px-4 pt-1.5 sm:pt-2.5 pb-1 select-none">
      {/* Top action bar: App name, Level badge, Audio, Fullscreen & Pause buttons */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-sky-900 flex items-center gap-1 shrink-0">
            <span className="text-xl sm:text-2xl">🫧</span>
            <span className="truncate">Heceni Yakala</span>
          </span>
          <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70 text-sky-800 border border-sky-200/60 shadow-xs truncate max-w-[120px] sm:max-w-none">
            {levelName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Audio toggle button */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-sky-800 border border-sky-200/80 shadow-xs flex items-center justify-center transition-transform active:scale-90"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-700" />}
          </button>

          {/* Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Modu'}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-sky-800 border border-sky-200/80 shadow-xs flex items-center justify-center transition-transform active:scale-90"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran Yap'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-sky-700" />
            ) : (
              <Maximize className="w-4 h-4 text-sky-700" />
            )}
          </button>

          {/* Pause button */}
          <button
            onClick={onPause}
            aria-label="Oyunu Duraklat"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-sky-800 border border-sky-200/80 shadow-xs flex items-center justify-center transition-transform active:scale-90 font-bold"
            title="Oyunu Duraklat"
          >
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-sky-800 text-sky-800" />
          </button>
        </div>
      </div>

      {/* Challenge Status Bar for Count or Time Challenge */}
      {isCountChallenge && (
        <div className="max-w-sm sm:max-w-md mx-auto mb-1.5 bg-amber-50/95 border border-amber-300 rounded-xl px-3 py-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black text-amber-950 mb-1">
            <span className="flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span>HEDEF DOĞRU:</span>
            </span>
            <span className="text-sm font-black text-amber-800 tabular-nums">
              {correctCount} / {targetCount}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {isTimeChallenge && (
        <div className="max-w-sm sm:max-w-md mx-auto mb-1.5 flex items-center justify-between bg-white/90 border border-sky-200 rounded-xl px-3 py-1.5 shadow-xs">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-sky-600" />
            <span>KALAN SÜRE:</span>
          </span>
          <span
            className={`text-base font-black tabular-nums px-2.5 py-0.5 rounded-lg border transition-all ${
              timeLeft <= 10
                ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                : timeLeft <= 20
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-sky-100 text-sky-900 border-sky-200'
            }`}
          >
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
      )}

      {/* Target Syllable Showcase Card */}
      <div className="relative mx-auto w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl border-2 border-sky-200 shadow-md p-2.5 sm:p-3 text-center transition-all duration-200">
        <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-0.5">
          {isReinforcement ? (
            <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <span>🔁</span>
              <span>PEKİŞTİRME TEKRARI</span>
            </span>
          ) : (
            <div className="flex items-center gap-1 text-sky-600">
              <span className="text-amber-500">✨</span>
              <span>HECEYİ BUL</span>
              <span className="text-amber-500">✨</span>
            </div>
          )}
        </div>

        {/* Large Prominent Target Syllable Display */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-3 my-0.5">
          <div className="text-3xl sm:text-5xl font-black tracking-wider text-sky-900 drop-shadow-xs px-3 sm:px-4 py-0.5 bg-sky-50/70 rounded-xl border border-sky-100 min-w-[110px] sm:min-w-[130px]">
            {currentTarget}
          </div>

          {/* Speaker button to pronounce syllable in Turkish */}
          <button
            onClick={() => {
              soundManager.speakText(currentTarget);
              onSpeakTarget();
            }}
            title="Sesi Dinle"
            aria-label="Sesi Dinle"
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-sm border border-amber-550 transition-all active:scale-90"
          >
            <Volume1 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* MEB Ses Esaslı Okuma Kılavuzu: Örn: Sesi: "ınnnn", Sesi: "Sı", Hece: "Se" */}
        {getMebPhoneticDisplayGuide(currentTarget) && (
          <div className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50/90 inline-block px-2.5 py-0.5 rounded-full border border-amber-200/80 mt-0.5 sm:mt-1 shadow-2xs">
            {getMebPhoneticDisplayGuide(currentTarget)}
          </div>
        )}

        {isNewRecord && (
          <div className="mt-1 text-xs font-black text-amber-600 animate-bounce tracking-wide">
            🎉 YENİ REKOR! TEBRİKLER! 🎉
          </div>
        )}
      </div>

      {/* Scores & Metrics Strip */}
      <div className="mt-1.5 sm:mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 max-w-sm sm:max-w-md mx-auto">
        {/* Score */}
        <div className="bg-white/90 backdrop-blur-xs rounded-xl border border-sky-150 p-1 sm:p-1.5 text-center shadow-xs">
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide">PUAN</div>
          <div className="text-base sm:text-lg font-black text-sky-900 tabular-nums leading-tight">
            {score}
          </div>
        </div>

        {/* Middle box: changes depending on mode */}
        {isCountChallenge ? (
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-1 sm:p-1.5 text-center shadow-xs">
            <div className="text-[10px] sm:text-[11px] font-bold text-amber-800 uppercase tracking-wide flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-amber-600" />
              <span>HEDEF</span>
            </div>
            <div className="text-base sm:text-lg font-black text-amber-900 tabular-nums leading-tight">
              {correctCount}/{targetCount}
            </div>
          </div>
        ) : isTimeChallenge ? (
          <div className="bg-sky-50/90 border border-sky-200 rounded-xl p-1 sm:p-1.5 text-center shadow-xs">
            <div className="text-[10px] sm:text-[11px] font-bold text-sky-800 uppercase tracking-wide flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>DOĞRU</span>
            </div>
            <div className="text-base sm:text-lg font-black text-sky-950 tabular-nums leading-tight">
              {correctCount}
            </div>
          </div>
        ) : (
          /* Streak / Combo in Endless/Level Mode */
          <div
            className={`backdrop-blur-xs rounded-xl border p-1 sm:p-1.5 text-center shadow-xs transition-colors duration-300 ${
              streak >= 5
                ? 'bg-amber-100/90 border-amber-300 text-amber-900'
                : streak >= 3
                ? 'bg-orange-50/90 border-orange-200 text-orange-900'
                : 'bg-white/90 border-sky-150 text-slate-800'
            }`}
          >
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide flex items-center justify-center gap-1">
              <span>SERİ</span>
              {streak >= 3 && <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-bounce" />}
            </div>
            <div className="text-base sm:text-lg font-black tabular-nums leading-tight">
              {streak}
              {streak >= 3 && <span className="text-xs font-bold text-amber-600 ml-0.5">🔥</span>}
            </div>
          </div>
        )}

        {/* Record or Streak */}
        <div
          className={`backdrop-blur-xs rounded-xl border p-1 sm:p-1.5 text-center shadow-xs ${
            isNewRecord
              ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
              : 'bg-white/90 border-sky-150 text-slate-800'
          }`}
        >
          <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            {isCountChallenge || isTimeChallenge ? 'SERİ' : 'REKOR'}
          </div>
          <div className="text-base sm:text-lg font-black text-amber-700 tabular-nums leading-tight">
            {isCountChallenge || isTimeChallenge ? `${streak} 🔥` : Math.max(score, highScore)}
          </div>
        </div>
      </div>
    </header>
  );
};

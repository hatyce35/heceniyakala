import React, { useState, useEffect } from 'react';
import {
  Play,
  HelpCircle,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  CheckCircle,
  Target,
  Timer,
  Maximize,
  Minimize,
  X,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';
import {
  LEVELS,
  LevelConfig,
  GameModeType,
  ChallengeConfig,
} from '../data/syllables';
import { toggleFullscreen, isCurrentlyFullscreen } from '../utils/fullscreen';

interface StartScreenProps {
  highScore: number;
  bestStreak: number;
  gameMode: GameModeType;
  selectedLevelId: number;
  challengeConfig: ChallengeConfig;
  isMuted: boolean;
  voiceEnabled: boolean;
  onSelectGameMode: (mode: GameModeType) => void;
  onSelectLevel: (levelId: number) => void;
  onUpdateChallengeConfig: (config: ChallengeConfig) => void;
  onToggleMute: () => void;
  onToggleVoice: () => void;
  onStartGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  bestStreak,
  gameMode,
  selectedLevelId,
  challengeConfig,
  isMuted,
  voiceEnabled,
  onSelectGameMode,
  onSelectLevel,
  onUpdateChallengeConfig,
  onToggleMute,
  onToggleVoice,
  onStartGame,
}) => {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
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

  const currentLevelConfig: LevelConfig =
    LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0];

  return (
    <div className="relative z-20 flex flex-col items-center justify-between h-[100dvh] max-h-[100dvh] w-full max-w-lg mx-auto p-3 sm:p-4 text-slate-800 overflow-y-auto select-none">
      {/* Top Bar with Sound & Fullscreen Settings */}
      <div className="w-full flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-white/75 backdrop-blur-xs px-2.5 sm:px-3 py-1.5 rounded-full border border-sky-200/80 shadow-xs">
          <span>İlkokul Okuma Oyunu</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice Pronunciation Toggle */}
          <button
            onClick={onToggleVoice}
            className={`px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 border transition-all ${
              voiceEnabled
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white/80 text-slate-500 border-slate-200'
            }`}
            title="Sesli Türkçe Okuma"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Sesli Okuma:</span>
            <span>{voiceEnabled ? 'Açık' : 'Kapalı'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            className="w-8 h-8 rounded-full bg-white/80 text-sky-800 border border-sky-200 shadow-xs flex items-center justify-center active:scale-95 transition-transform"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-sky-700" /> : <Maximize className="w-4 h-4 text-sky-700" />}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            className="w-8 h-8 rounded-full bg-white/80 text-sky-800 border border-sky-200 shadow-xs flex items-center justify-center active:scale-95 transition-transform"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-sky-700" />}
          </button>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="flex flex-col items-center text-center my-auto py-1 w-full">
        {/* Animated Mascot Bubble */}
        <div className="relative mb-1.5 animate-wobble">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-sky-200/90 shadow-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                'radial-gradient(135% 135% at 28% 22%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.7) 22%, rgba(224, 242, 254, 0.45) 48%, rgba(186, 230, 253, 0.55) 75%, rgba(125, 211, 252, 0.8) 100%)',
              boxShadow:
                'inset -4px -4px 12px rgba(14, 165, 233, 0.2), inset 4px 4px 12px rgba(255, 255, 255, 0.95), 0 10px 25px rgba(14, 165, 233, 0.18)',
            }}
          >
            <div className="bubble-shine-primary" />
            <div className="bubble-shine-dot" />
            <div className="bubble-rim" />
            <span className="text-2xl sm:text-3xl drop-shadow-xs">🫧</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-sky-600 text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm border border-sky-400">
            MEB Uyumlu
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-sky-950 tracking-tight leading-none mb-1 drop-shadow-xs">
          HECENİ YAKALA
        </h1>

        <p className="text-xs sm:text-sm font-medium text-sky-800/90 max-w-xs mb-2">
          “Doğru heceyi bul, puanını yükselt!”
        </p>

        {/* High Score Badge */}
        {highScore > 0 && (
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-2xl border border-sky-200 shadow-xs mb-2.5">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
              <Trophy className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>En Yüksek Rekor:</span>
              <span className="text-sm font-black text-amber-700 tabular-nums">{highScore}</span>
            </div>
            {bestStreak > 1 && (
              <div className="text-[11px] font-bold text-slate-500 border-l border-slate-200 pl-2">
                En İyi Seri: <span className="text-slate-800 font-black">{bestStreak} 🔥</span>
              </div>
            )}
          </div>
        )}

        {/* Compact Mode Selector Card - Never expands or pushes the play button */}
        <div className="w-full max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border-2 border-sky-200/90 p-2 sm:p-2.5 shadow-md mb-3 text-left">
          <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Öğrenme Modu Seçimi</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold normal-case">Dokun ve seç</span>
          </div>

          <div className="space-y-1.5">
            {/* 1. Sonsuz Macera Modu */}
            <button
              onClick={() => {
                onSelectGameMode('ENDLESS');
                onSelectLevel(0);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                gameMode === 'ENDLESS'
                  ? 'bg-sky-500 text-white border-sky-600 shadow-xs scale-[1.01]'
                  : 'bg-sky-50/70 text-slate-700 border-sky-150 hover:bg-sky-100/70'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <span>⭐ Sonsuz Macera</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      gameMode === 'ENDLESS' ? 'bg-sky-600 text-white' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Önerilen
                  </span>
                </span>
                <span className={`text-[10px] ${gameMode === 'ENDLESS' ? 'text-sky-100' : 'text-slate-500'}`}>
                  Puan arttıkça harflerden kelimelere geçer
                </span>
              </div>
              {gameMode === 'ENDLESS' && <CheckCircle className="w-4 h-4 text-white shrink-0 ml-2" />}
            </button>

            {/* 2. Sayılı - Süreli Mod (Opens Modal Window!) */}
            <button
              onClick={() => {
                onSelectGameMode('CHALLENGE');
                setShowChallengeModal(true);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                gameMode === 'CHALLENGE'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-[1.01]'
                  : 'bg-amber-50/80 text-amber-950 border-amber-200 hover:bg-amber-100/80'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="text-sm">⏱️</span>
                  <span>Sayılı - Süreli Mod</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      gameMode === 'CHALLENGE' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-950'
                    }`}
                  >
                    AYARLA
                  </span>
                </span>
                <span className={`text-[10px] ${gameMode === 'CHALLENGE' ? 'text-amber-100' : 'text-slate-600'}`}>
                  {challengeConfig.kind === 'COUNT'
                    ? `🎯 ${challengeConfig.targetCount} Doğru Hedefi`
                    : `⏱️ ${challengeConfig.timeLimit} Sn Geri Sayım`}
                  {selectedLevelId > 0 ? ` • ${currentLevelConfig.shortName}` : ' • Tüm Heceler'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {gameMode === 'CHALLENGE' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                )}
              </div>
            </button>

            {/* 3. Adım Adım Seviyeler (Opens Modal Window!) */}
            <button
              onClick={() => {
                onSelectGameMode('LEVEL');
                setShowLevelModal(true);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                gameMode === 'LEVEL'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs scale-[1.01]'
                  : 'bg-teal-50/70 text-teal-950 border-teal-200 hover:bg-teal-100/70'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="font-black text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="text-sm">📚</span>
                  <span>Adım Adım Seviyeler</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      gameMode === 'LEVEL' ? 'bg-teal-700 text-white' : 'bg-teal-200 text-teal-950'
                    }`}
                  >
                    SEÇ
                  </span>
                </span>
                <span className={`text-[10px] ${gameMode === 'LEVEL' ? 'text-teal-100' : 'text-slate-600'}`}>
                  {selectedLevelId > 0 ? currentLevelConfig.name : '1. Adım: A - N Heceleri'}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {gameMode === 'LEVEL' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <BookOpen className="w-4 h-4 text-teal-700" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Big Play Button - Always comfortably on screen without scrolling! */}
        <button
          onClick={onStartGame}
          className="w-full max-w-xs sm:max-w-sm py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xl sm:text-2xl tracking-wide shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-700 flex items-center justify-center gap-2 transition-all active:translate-y-1 active:border-b-0 shrink-0"
        >
          <Play className="w-6 h-6 fill-white text-white" />
          <span>OYNA</span>
        </button>

        {/* How to Play Button */}
        <button
          onClick={() => setShowHowToPlay(true)}
          className="mt-2 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-800 hover:text-sky-950 transition-colors py-1 px-3 rounded-xl hover:bg-white/40 shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" />
          <span>Nasıl Oynanır?</span>
        </button>
      </div>

      {/* Footer info */}
      <footer className="text-center text-[10px] sm:text-[11px] text-sky-700/80 py-1 shrink-0">
        İlkokul 1. ve 2. sınıf okuma-yazma eğitimi için hazırlanmıştır
      </footer>

      {/* MODAL 1: Sayılı - Süreli Mod Seçenekleri Açılır Penceresi */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="bg-white rounded-3xl p-4 sm:p-5 max-w-sm w-full border-4 border-amber-300 shadow-2xl text-left animate-badge max-h-[92dvh] flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <h2 className="text-lg font-black text-amber-950 leading-tight">Sayılı - Süreli Mod</h2>
                  <p className="text-[11px] text-slate-500 font-semibold">Hedefini seç ve hemen başla</p>
                </div>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Form */}
            <div className="space-y-3 mb-4">
              {/* Mod Türü Tabları: Sayılı vs Süreli */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Hedef Türü:</label>
                <div className="flex items-center gap-1.5 bg-amber-100/80 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateChallengeConfig({ ...challengeConfig, kind: 'COUNT' })}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      challengeConfig.kind === 'COUNT'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-amber-950 hover:bg-amber-200/60'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>🎯 Sayılı Mod</span>
                  </button>

                  <button
                    onClick={() => onUpdateChallengeConfig({ ...challengeConfig, kind: 'TIME' })}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                      challengeConfig.kind === 'TIME'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-amber-950 hover:bg-amber-200/60'
                    }`}
                  >
                    <Timer className="w-4 h-4" />
                    <span>⏱️ Süreli Mod</span>
                  </button>
                </div>
              </div>

              {/* 10 - 15 - 20 Doğru Seçeneği */}
              {challengeConfig.kind === 'COUNT' ? (
                <div className="bg-amber-50/90 rounded-xl p-3 border border-amber-200">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Bölümü bitirmek için hedef:</span>
                    <span className="text-amber-800 font-black">{challengeConfig.targetCount} Doğru</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([10, 15, 20] as const).map((count) => (
                      <button
                        key={count}
                        onClick={() => onUpdateChallengeConfig({ ...challengeConfig, targetCount: count })}
                        className={`py-2 rounded-xl text-xs font-black border transition-all ${
                          challengeConfig.targetCount === count
                            ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs scale-102 ring-2 ring-amber-300'
                            : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
                        }`}
                      >
                        {count} Doğru
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* 30 - 60 - 90 Saniye Seçeneği */
                <div className="bg-amber-50/90 rounded-xl p-3 border border-amber-200">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Oyun süresi:</span>
                    <span className="text-amber-800 font-black">{challengeConfig.timeLimit} Saniye</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {([30, 60, 90] as const).map((sec) => (
                      <button
                        key={sec}
                        onClick={() => onUpdateChallengeConfig({ ...challengeConfig, timeLimit: sec })}
                        className={`py-2 rounded-xl text-xs font-black border transition-all ${
                          challengeConfig.timeLimit === sec
                            ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs scale-102 ring-2 ring-amber-300'
                            : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100/50'
                        }`}
                      >
                        {sec} Sn
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hece Havuzu Seçimi */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">Çalışılacak Heceler:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onSelectLevel(0)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold truncate transition-all ${
                      selectedLevelId === 0
                        ? 'bg-sky-600 text-white shadow-2xs ring-2 ring-sky-300'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50'
                    }`}
                  >
                    Tüm Heceler
                  </button>
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => onSelectLevel(lvl.id)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold truncate transition-all ${
                        selectedLevelId === lvl.id
                          ? 'bg-sky-600 text-white shadow-2xs ring-2 ring-sky-300'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50'
                      }`}
                    >
                      {lvl.shortName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions with START BUTTON! */}
            <div className="pt-2 border-t border-amber-100 space-y-2">
              <button
                onClick={() => {
                  setShowChallengeModal(false);
                  onSelectGameMode('CHALLENGE');
                  onStartGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0 transition-all"
              >
                <Play className="w-5 h-5 fill-white text-white" />
                <span>OYUNA BAŞLA 🚀</span>
              </button>

              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Adım Adım Seviyeler Seçenekleri Açılır Penceresi */}
      {showLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/60 backdrop-blur-xs animate-fadeIn select-none">
          <div className="bg-white rounded-3xl p-4 sm:p-5 max-w-sm sm:max-w-md w-full border-4 border-teal-300 shadow-2xl text-left animate-badge max-h-[92dvh] flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-teal-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <h2 className="text-lg font-black text-teal-950 leading-tight">Adım Adım Seviyeler</h2>
                  <p className="text-[11px] text-slate-500 font-semibold">Çalışmak istediğin adımı seç</p>
                </div>
              </div>
              <button
                onClick={() => setShowLevelModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Level Cards List */}
            <div className="space-y-2 mb-4 overflow-y-auto pr-0.5">
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevelId === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => onSelectLevel(lvl.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500 text-white border-teal-600 shadow-xs ring-2 ring-teal-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50/60'
                    }`}
                  >
                    <div>
                      <div className="font-black text-xs sm:text-sm">{lvl.name}</div>
                      <div className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                        {lvl.description}
                      </div>
                      <div className={`text-[10px] mt-1 font-mono font-bold truncate ${isSelected ? 'text-teal-200' : 'text-teal-700'}`}>
                        {lvl.items.slice(0, 7).join(' • ')}...
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Bottom Actions with START BUTTON! */}
            <div className="pt-2 border-t border-teal-100 space-y-2">
              <button
                onClick={() => {
                  setShowLevelModal(false);
                  onSelectGameMode('LEVEL');
                  if (selectedLevelId === 0) onSelectLevel(1);
                  onStartGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0 transition-all"
              >
                <Play className="w-5 h-5 fill-white text-white" />
                <span>OYUNA BAŞLA 🚀</span>
              </button>

              <button
                onClick={() => setShowLevelModal(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Nasıl Oynanır Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 max-w-sm sm:max-w-md w-full border-4 border-sky-200 shadow-2xl text-center">
            <div className="text-3xl mb-1.5">🎯</div>
            <h2 className="text-xl font-black text-sky-950 mb-1.5">Nasıl Oynanır?</h2>

            <div className="bg-sky-50 rounded-2xl p-3 border border-sky-100 text-left space-y-2.5 mb-4">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  Ekranın üstünde gösterilen <strong className="text-sky-900">heceye veya harfe</strong> bak. Hoparlör düğmesiyle sesini dinle!
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  Alttan süzülen baloncukların arasından <strong className="text-emerald-700">aynı heceyi taşıyan baloncuğu</strong> yakala ve patlat!
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  <strong className="text-amber-700">Sayılı - Süreli Mod</strong> ile 10, 15, 20 hedef doğru yaparak veya 30, 60, 90 saniyede yarışarak kendini sına!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-md transition-all active:scale-95"
            >
              ANLADIM, BAŞLAYALIM!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

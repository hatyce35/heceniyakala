import React, { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Award, Target, Timer, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameModeType, ChallengeConfig } from '../data/syllables';

interface SessionSummaryModalProps {
  score: number;
  highScore: number;
  bestStreak: number;
  isNewRecord: boolean;
  gameMode?: GameModeType;
  challengeConfig?: ChallengeConfig;
  correctCount?: number;
  onRestart: () => void;
  onHome: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  score,
  highScore,
  bestStreak,
  isNewRecord,
  gameMode = 'ENDLESS',
  challengeConfig,
  correctCount = 0,
  onRestart,
  onHome,
}) => {
  const isCountChallenge = gameMode === 'CHALLENGE' && challengeConfig?.kind === 'COUNT';
  const isTimeChallenge = gameMode === 'CHALLENGE' && challengeConfig?.kind === 'TIME';

  useEffect(() => {
    try {
      confetti({
        particleCount: isNewRecord || isCountChallenge ? 90 : 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#a78bfa'],
      });
    } catch {
      // Fail silently
    }
  }, [isNewRecord, isCountChallenge]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-300 shadow-2xl text-center animate-badge">
        <div className="relative inline-block mb-2">
          <div className="w-20 h-20 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-4xl shadow-inner border-2 border-amber-200">
            {isCountChallenge ? '🏆' : isTimeChallenge ? '⏱️' : isNewRecord ? '🏆' : score > 100 ? '🌟' : '🎈'}
          </div>
          {isNewRecord && (
            <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce">
              REKOR!
            </div>
          )}
        </div>

        {/* Title & subtitle based on game mode */}
        {isCountChallenge ? (
          <div>
            <h2 className="text-2xl font-black text-amber-600 mb-1">HEDEF TAMAMLANDI! 🎉</h2>
            <p className="text-xs text-slate-600 font-semibold mb-4">
              Tebrikler! <strong className="text-amber-700">{challengeConfig?.targetCount} doğru hece</strong> hedefini başarıyla bitirdin!
            </p>
          </div>
        ) : isTimeChallenge ? (
          <div>
            <h2 className="text-2xl font-black text-sky-900 mb-1">SÜRE DOLDU! ⏱️</h2>
            <p className="text-xs text-slate-600 font-semibold mb-4">
              <strong className="text-sky-700">{challengeConfig?.timeLimit} saniyede</strong> toplam <strong className="text-emerald-700">{correctCount} doğru hece</strong> yakaladın!
            </p>
          </div>
        ) : isNewRecord ? (
          <div>
            <h2 className="text-2xl font-black text-amber-600 mb-1">YENİ REKOR! 🎉</h2>
            <p className="text-xs text-slate-600 font-semibold mb-4">
              Harika bir oyun çıkardın, önceki rekorunu geride bıraktın!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black text-sky-950 mb-1">OYUN TAMAMLANDI!</h2>
            <p className="text-xs text-slate-600 font-semibold mb-4">
              Çok güzel pratik yaptın, okuma becerin güçleniyor!
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 mb-5 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-sky-150">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-sky-600" />
              <span>TOPLAM PUAN</span>
            </span>
            <span className="text-2xl font-black text-sky-900 tabular-nums">{score}</span>
          </div>

          {/* Correct count in challenge mode or high score */}
          {isCountChallenge || isTimeChallenge ? (
            <div className="flex items-center justify-between pb-2 border-b border-sky-150">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>DOĞRU SAYISI</span>
              </span>
              <span className="text-xl font-black text-emerald-700 tabular-nums">
                {correctCount} {isCountChallenge ? `/${challengeConfig?.targetCount}` : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-sky-150">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>EN YÜKSEK REKOR</span>
              </span>
              <span className="text-xl font-black text-amber-600 tabular-nums">{highScore}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>EN İYİ SERİN</span>
            </span>
            <span className="text-lg font-black text-orange-600 tabular-nums">
              {bestStreak} {bestStreak >= 3 ? '🔥' : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0"
          >
            <RotateCcw className="w-5 h-5 text-white" />
            <span>TEKRAR OYNA</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-sm border border-sky-200 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Home className="w-4 h-4 text-sky-700" />
            <span>Ana Menü</span>
          </button>
        </div>
      </div>
    </div>
  );
};

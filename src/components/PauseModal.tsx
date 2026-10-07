import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Mic } from 'lucide-react';

interface PauseModalProps {
  score: number;
  highScore: number;
  streak: number;
  isMuted: boolean;
  voiceEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onToggleMute: () => void;
  onToggleVoice: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  score,
  highScore,
  streak,
  isMuted,
  voiceEnabled,
  onResume,
  onRestart,
  onHome,
  onToggleMute,
  onToggleVoice,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-sky-300 shadow-2xl text-center animate-badge">
        <div className="w-16 h-16 rounded-full bg-sky-100 mx-auto flex items-center justify-center text-3xl mb-3 shadow-inner">
          ⏸️
        </div>

        <h2 className="text-2xl font-black text-sky-950 mb-1">OYUN DURAKLATILDI</h2>
        <p className="text-xs text-sky-700 font-medium mb-4">Biraz dinlenip devam edebilirsin!</p>

        {/* Current status stats */}
        <div className="grid grid-cols-3 gap-2 bg-sky-50 rounded-2xl p-3 border border-sky-100 mb-5">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">PUAN</div>
            <div className="text-lg font-black text-sky-900 tabular-nums">{score}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">SERİ</div>
            <div className="text-lg font-black text-amber-600 tabular-nums">{streak}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">REKOR</div>
            <div className="text-lg font-black text-slate-800 tabular-nums">{Math.max(score, highScore)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-md border-b-4 border-emerald-700 flex items-center justify-center gap-2 active:translate-y-0.5 active:border-b-0"
          >
            <Play className="w-5 h-5 fill-white text-white" />
            <span>DEVAM ET</span>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-sm border border-sky-200 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-sky-700" />
            <span>Yeniden Başla</span>
          </button>

          {/* Home */}
          <button
            onClick={onHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Home className="w-4 h-4 text-slate-600" />
            <span>Ana Menü</span>
          </button>
        </div>

        {/* Settings toggles */}
        <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-150">
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-sky-600" />}
            <span>{isMuted ? 'Ses Kapalı' : 'Ses Açık'}</span>
          </button>

          <button
            onClick={onToggleVoice}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <Mic className={`w-4 h-4 ${voiceEnabled ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>{voiceEnabled ? 'Sesli Okuma Açık' : 'Sesli Okuma Kapalı'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

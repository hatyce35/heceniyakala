import React from 'react';

export interface FloatingFeedback {
  id: string;
  text: string;
  points?: number;
  type: 'correct' | 'wrong' | 'record';
  x: number;
  y: number;
}

export const FeedbackBanner: React.FC<{ feedback: FloatingFeedback }> = ({ feedback }) => {
  const isCorrect = feedback.type === 'correct';
  const isRecord = feedback.type === 'record';

  return (
    <div
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-badge"
      style={{
        left: `${feedback.x}px`,
        top: `${Math.max(feedback.y - 45, 120)}px`,
      }}
    >
      <div
        className={`px-4 py-1.5 rounded-full font-black text-sm sm:text-base shadow-lg border-2 flex items-center gap-1.5 whitespace-nowrap ${
          isRecord
            ? 'bg-amber-400 text-amber-950 border-amber-200 shadow-amber-400/40 animate-bounce'
            : isCorrect
            ? 'bg-emerald-500 text-white border-emerald-300 shadow-emerald-500/30'
            : 'bg-rose-500 text-white border-rose-300 shadow-rose-500/30'
        }`}
      >
        <span>{feedback.text}</span>
        {feedback.points && (
          <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs font-black">
            +{feedback.points}
          </span>
        )}
      </div>
    </div>
  );
};

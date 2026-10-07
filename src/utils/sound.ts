/**
 * Web Audio API synthesizer for child-friendly, delightful sound effects.
 * Completely self-contained with zero external asset dependencies.
 */

import { getMebPhoneticSpokenText } from '../data/syllables';

class SoundManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public voiceEnabled: boolean = true;
  private cachedTurkishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    // Read persisted sound preferences
    try {
      const savedMute = localStorage.getItem('heceni_yakala_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVoice = localStorage.getItem('heceni_yakala_voice');
      if (savedVoice !== null) {
        this.voiceEnabled = savedVoice !== 'false';
      }
    } catch {
      // Ignore localStorage restrictions
    }

    this.initVoiceListener();
  }

  private initVoiceListener() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          const voices = window.speechSynthesis.getVoices();
          const tr = voices.find(
            (v) =>
              (v.lang && (v.lang.toLowerCase().startsWith('tr') || v.lang.toLowerCase().includes('tr-tr'))) ||
              (v.name && (v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türkçe')))
          );
          if (tr) {
            this.cachedTurkishVoice = tr;
          }
        } catch {
          // ignore
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('heceni_yakala_muted', String(muted));
    } catch {
      // Ignore
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    try {
      localStorage.setItem('heceni_yakala_voice', String(enabled));
    } catch {
      // Ignore
    }
  }

  /**
   * Authentic soap bubble pop:
   * High-frequency membrane rupture snap (surface-tension release) + resonant liquid droplet plop!
   */
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. High-frequency surface-tension snap (membrane burst)
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(2400, now);
      snapOsc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      snapGain.gain.setValueAtTime(0.38, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      snapOsc.connect(snapGain);
      snapGain.connect(this.ctx.destination);

      snapOsc.start(now);
      snapOsc.stop(now + 0.045);

      // 2. Wet resonant soap bubble droplet "plop"
      const dropOsc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(760, now);
      dropOsc.frequency.exponentialRampToValueAtTime(170, now + 0.095);

      dropGain.gain.setValueAtTime(0.42, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      dropOsc.connect(dropGain);
      dropGain.connect(this.ctx.destination);

      dropOsc.start(now);
      dropOsc.stop(now + 0.11);
    } catch {
      // Fail silently
    }
  }

  /**
   * Cheerful chord / chime for a correct answer.
   */
  public playCorrect(streak: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreq = 523.25; // C5
      const pentatonic = [1, 1.125, 1.25, 1.5, 1.667, 2.0];
      const pitchIndex = Math.min(streak - 1, pentatonic.length - 1);
      const root = baseFreq * pentatonic[Math.max(0, pitchIndex)];

      const chord = [root, root * 1.25, root * 1.5]; // Major triad

      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.3);
      });
    } catch {
      // Fail silently
    }
  }

  /**
   * Soft, non-punishing friendly error sound ("boop-boop").
   */
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.16);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Fail silently
    }
  }

  /**
   * Grand fanfare when breaking a personal record!
   */
  public playNewRecord() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.1 },  // C5
        { f: 659.25, d: 0.1 },  // E5
        { f: 783.99, d: 0.1 },  // G5
        { f: 1046.50, d: 0.28 }, // C6
        { f: 880.00, d: 0.1 },  // A5
        { f: 1046.50, d: 0.4 }, // C6 long
      ];

      let cur = now;
      fanfare.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, cur);

        gain.gain.setValueAtTime(0, cur);
        gain.gain.linearRampToValueAtTime(0.28, cur + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(cur);
        osc.stop(cur + n.d + 0.05);

        cur += n.d * 0.85;
      });
    } catch {
      // Fail silently
    }
  }

  /**
   * Celebratory sound when completing target count (e.g. 10, 15, or 20 targets).
   */
  public playLevelComplete() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.14 }, // G5
        { f: 1046.50, d: 0.35 }, // C6
      ];

      let cur = now;
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, cur);

        gain.gain.setValueAtTime(0, cur);
        gain.gain.linearRampToValueAtTime(0.25, cur + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(cur);
        osc.stop(cur + n.d + 0.05);

        cur += n.d * 0.9;
      });
    } catch {
      // Fail silently
    }
  }

  /**
   * Tick sound for countdown timer warning (last 3-2-1 seconds).
   */
  public playTimeWarning() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Fail silently
    }
  }

  /**
   * Ending chime when time runs out.
   */
  public playTimeUp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 783.99, d: 0.15 }, // G5
        { f: 659.25, d: 0.15 }, // E5
        { f: 523.25, d: 0.4 },  // C5
      ];

      let cur = now;
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, cur);

        gain.gain.setValueAtTime(0, cur);
        gain.gain.linearRampToValueAtTime(0.22, cur + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, cur + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(cur);
        osc.stop(cur + n.d + 0.05);

        cur += n.d * 0.85;
      });
    } catch {
      // Fail silently
    }
  }

  /**
   * Pronounce Turkish syllable/letter using Web Speech API (Turkish voice tr-TR).
   * Follows MEB curriculum:
   * Consonants are sounded with "ı" appended: N -> "Nı", S -> "Sı", K -> "Kı", M -> "Mı".
   */
  public speakText(text: string) {
    if (this.isMuted || !this.voiceEnabled) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Resume speech engine in case suspended by browser
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const spokenWord = getMebPhoneticSpokenText(text);

        // Small timeout allows queue to clear cleanly on mobile browsers
        setTimeout(() => {
          try {
            const utterance = new SpeechSynthesisUtterance(spokenWord);
            utterance.lang = 'tr-TR';
            utterance.rate = 0.82; // Clear, pedagogical pace for 1st graders
            utterance.pitch = 1.0;

            // Find Turkish voice
            if (!this.cachedTurkishVoice) {
              const voices = window.speechSynthesis.getVoices();
              this.cachedTurkishVoice =
                voices.find(
                  (v) =>
                    (v.lang && (v.lang.toLowerCase().startsWith('tr') || v.lang.toLowerCase().includes('tr-tr'))) ||
                    (v.name && (v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türkçe')))
                ) || null;
            }

            if (this.cachedTurkishVoice) {
              utterance.voice = this.cachedTurkishVoice;
            }

            window.speechSynthesis.speak(utterance);
          } catch {
            // Fail silently
          }
        }, 25);
      }
    } catch {
      // Fail silently
    }
  }
}

export const soundManager = new SoundManager();

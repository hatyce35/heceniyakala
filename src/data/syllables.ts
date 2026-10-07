/**
 * Turkish letters, syllables and early reading curriculum dataset
 * specifically tailored for elementary school 1st grade early reading (MEB Ses Esaslı İlk Okuma Yazma).
 * Based on building blocks: letter -> syllable -> 2-syllable word.
 */

export interface LevelConfig {
  id: number;
  name: string;
  shortName: string;
  description: string;
  minScore: number;
  items: string[];
}

export type GameModeType = 'ENDLESS' | 'LEVEL' | 'CHALLENGE';
export type ChallengeKind = 'COUNT' | 'TIME'; // Sayılı (Count) or Süreli (Timed)

export interface ChallengeConfig {
  kind: ChallengeKind;
  targetCount: 10 | 15 | 20;
  timeLimit: 30 | 60 | 90;
}

export const DEFAULT_CHALLENGE_CONFIG: ChallengeConfig = {
  kind: 'COUNT',
  targetCount: 10,
  timeLimit: 60,
};

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '1. Adım: A - N Heceleri',
    shortName: 'A - N',
    description: 'A ve N harfleri, heceleri ve ilk sözcükler',
    minScore: 0,
    items: [
      'A', 'N', 'AN', 'NA', 'ANA', 'NAN', 'NANE'
    ],
  },
  {
    id: 2,
    name: '2. Adım: E - L Heceleri',
    shortName: 'E - L - A',
    description: 'E, L, A heceleri ve ilk okuma sözcükleri',
    minScore: 70,
    items: [
      'E', 'EL', 'EN', 'AL', 'LA', 'LE', 'ELE', 'ELA', 'LALE', 'ALA'
    ],
  },
  {
    id: 3,
    name: '3. Adım: K - İ Heceleri',
    shortName: 'K - İ',
    description: 'K ve İ sesleri ile oluşan heceler ve sözcükler',
    minScore: 180,
    items: [
      'İ', 'K', 'EK', 'KE', 'AK', 'KA', 'KEK', 'KALE', 'İK', 'Kİ', 'İN', 'Nİ', 'ALİ', 'İLKE'
    ],
  },
  {
    id: 4,
    name: '4. Adım: O - M - T Heceleri',
    shortName: 'O - M - T',
    description: 'O, M ve T sesleri ile temel heceler ve kelimeler',
    minScore: 320,
    items: [
      'O', 'M', 'T', 'ON', 'OL', 'OK', 'MA', 'ME', 'EM', 'ELMA', 'MAMA', 'AT', 'ET', 'OT', 'TA', 'TE', 'TUT'
    ],
  },
  {
    id: 5,
    name: '5. Adım: U - S - B Heceleri',
    shortName: 'U - S - B',
    description: 'U, S ve B sesleri ile hece ve sözcükler',
    minScore: 480,
    items: [
      'U', 'S', 'B', 'UN', 'SU', 'SA', 'SE', 'AS', 'ES', 'BA', 'BE', 'BAL', 'BABA', 'MASA', 'SÜT'
    ],
  },
];

/**
 * MEB Ses Esaslı İlk Okuma Yazma Öğretimi standartlarına göre
 * sessiz harflerin sesletimi.
 * N -> "ınnnn", S -> "Sı", K -> "Kı", M -> "Mı", L -> "Lı", T -> "Tı" vb.
 */
export const MEB_CONSONANT_PHONETICS: Record<string, string> = {
  B: 'Bı',
  C: 'Cı',
  Ç: 'Çı',
  D: 'Dı',
  F: 'Fı',
  G: 'Gı',
  Ğ: 'Ğı',
  H: 'Hı',
  J: 'Jı',
  K: 'Kı',
  L: 'Lı',
  M: 'Mı',
  N: 'ınnnn',
  P: 'Pı',
  R: 'Rı',
  S: 'Sı',
  Ş: 'Şı',
  T: 'Tı',
  V: 'Vı',
  Y: 'Yı',
  Z: 'Zı',
};

/**
 * Converts a string to proper Turkish Title Case (e.g. "SE" -> "Se", "AK" -> "Ak").
 */
export function toTurkishTitleCase(str: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  const first = trimmed.charAt(0).toLocaleUpperCase('tr-TR');
  const rest = trimmed.slice(1).toLocaleLowerCase('tr-TR');
  return `${first}${rest}`;
}

/**
 * Kesin fonetik okunuş haritası.
 * - Tek sesli harfler (A, E, O, U, İ...) kesinlikle küçük harfli ('a', 'e', 'o') olarak iletilir.
 *   Bu sayede tarayıcı/sistem seslendiricisinin "Büyük A" veya "Büyük E" demesi tamamen önlenir!
 * - N harfi özel olarak kullanıcı isteğine uygun "ınnnn" sesi olarak iletilir.
 * - Heceler TitleCase ("Se", "Ak", "Ek") olarak iletilerek harfleme/kısaltma okunuşları engellenir.
 */
export const SYLLABLE_PHONETICS: Record<string, string> = {
  // 1. Adım
  A: 'a', // Tek sesli harf: "Büyük A" dememesi için küçük harf 'a'!
  N: 'ınnnn', // N harfi sesletimi: "ınnnn"
  AN: 'An',
  NA: 'Na',
  ANA: 'Ana',
  NAN: 'Nan',
  NANE: 'Nane',

  // 2. Adım
  E: 'e',
  EL: 'El',
  EN: 'En',
  AL: 'Al',
  LA: 'La',
  LE: 'Le',
  ELE: 'Ele',
  ELA: 'Ela',
  LALE: 'Lale',
  ALA: 'Ala',

  // 3. Adım
  İ: 'i',
  I: 'ı',
  K: 'Kı',
  EK: 'Ek',
  KE: 'Ke',
  AK: 'Ak',
  KA: 'Ka',
  KEK: 'Kek',
  KALE: 'Kale',
  İK: 'İk',
  Kİ: 'Ki',
  İN: 'İn',
  Nİ: 'Ni',
  ALİ: 'Ali',
  İLKE: 'İlke',

  // 4. Adım
  O: 'o',
  M: 'Mı',
  T: 'Tı',
  ON: 'On',
  OL: 'Ol',
  OK: 'Ok',
  MA: 'Ma',
  ME: 'Me',
  EM: 'Em',
  ELMA: 'Elma',
  MAMA: 'Mama',
  AT: 'At',
  ET: 'Et',
  OT: 'Ot',
  TA: 'Ta',
  TE: 'Te',
  TUT: 'Tut',

  // 5. Adım
  U: 'u',
  Ü: 'ü',
  S: 'Sı',
  B: 'Bı',
  UN: 'Un',
  SU: 'Su',
  SA: 'Sa',
  SE: 'Se',
  AS: 'As',
  ES: 'Es',
  BA: 'Ba',
  BE: 'Be',
  BAL: 'Bal',
  BABA: 'Baba',
  MASA: 'Masa',
  SÜT: 'Süt',
};

/**
 * Return exact spoken string for speech synthesis following MEB curriculum.
 * - Single vowels: A -> "a", E -> "e", O -> "o" (Never uppercase "A" which triggers "Büyük A")
 * - Letter N -> "ınnnn"
 * - Syllables: SE -> "Se", AK -> "Ak"
 */
export function getMebPhoneticSpokenText(text: string): string {
  const upper = text.trim().toLocaleUpperCase('tr-TR');

  // 1. Direct explicit dictionary match
  if (SYLLABLE_PHONETICS[upper]) {
    return SYLLABLE_PHONETICS[upper];
  }

  // 2. Single vowels: strictly lowercase ('a', 'e', 'i', 'o', 'u', 'ı', 'ö', 'ü') so TTS NEVER says "büyük A"!
  if (upper.length === 1 && 'AEIİOÖUÜ'.includes(upper)) {
    return upper.toLocaleLowerCase('tr-TR');
  }

  // 3. Consonants: e.g. N -> "ınnnn", S -> "Sı", K -> "Kı"
  if (MEB_CONSONANT_PHONETICS[upper]) {
    return MEB_CONSONANT_PHONETICS[upper];
  }

  // 4. Fallback for any other single consonant
  if (upper.length === 1 && !'AEIİOÖUÜ'.includes(upper)) {
    return `${upper.toLocaleLowerCase('tr-TR')}ı`;
  }

  // 5. All other syllables and words: strictly TitleCase (e.g. "Se", "Ak")
  return toTurkishTitleCase(text);
}

/**
 * Return visual phonetic guide string for the target card (e.g. Sesi: "ınnnn", Sesi: "Sı", Hece: "Se").
 */
export function getMebPhoneticDisplayGuide(text: string): string | null {
  const upper = text.trim().toLocaleUpperCase('tr-TR');
  if (MEB_CONSONANT_PHONETICS[upper]) {
    return `Sesi: "${MEB_CONSONANT_PHONETICS[upper]}"`;
  }
  // For 2-letter syllables like SE, AK, EK, show "Hece: Se", "Hece: Ak"
  if (upper.length === 2) {
    const spoken = SYLLABLE_PHONETICS[upper] || toTurkishTitleCase(upper);
    return `Hece: "${spoken}"`;
  }
  return null;
}

export const ENCOURAGING_MESSAGES = [
  'HARİKA! 🌟',
  'SÜPER! ✨',
  'DOĞRU! 🎯',
  'MÜKEMMELSİN! 🚀',
  'ÇOK İYİ! 👏',
  'AFERİN! 🏆',
  'BÖYLE DEVAM! 🎈'
];

export const REINFORCEMENT_MESSAGES = [
  'HARİKA PEKİŞTİRDİN! 🎯',
  'TEKRAR BİLDİN! 🌟',
  'AKLINDA KALDI! ✨',
  'SÜPER TEKRAR! 👏',
  'ÇOK İYİ ÖĞRENDİN! 🚀'
];

export const RETRY_MESSAGES = [
  'TEKRAR DENE! 💪',
  'BİR DAHA BAK! 👀',
  'PES ETME! ⭐',
  'YAKLAŞTIN! 🎈'
];

/**
 * Unified, professional, realistic soap bubble theme (single clean color scheme).
 */
export interface BubbleTheme {
  name: string;
  bgGradient: string;
  bubbleBorder: string;
  textColor: string;
  shadowColor: string;
  shineColor: string;
  particleColor: string;
}

export const REALISTIC_SOAP_BUBBLE_THEME: BubbleTheme = {
  name: 'soap-bubble',
  bgGradient: 'radial-gradient(135% 135% at 28% 22%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.7) 22%, rgba(224, 242, 254, 0.45) 48%, rgba(186, 230, 253, 0.55) 75%, rgba(125, 211, 252, 0.8) 100%)',
  bubbleBorder: 'rgba(186, 230, 253, 0.85)',
  textColor: '#0f172a', // Clean, sharp deep slate for maximum child legibility
  shadowColor: 'rgba(14, 165, 233, 0.22)',
  shineColor: 'rgba(255, 255, 255, 0.95)',
  particleColor: '#38bdf8',
};

/**
 * Determine dynamic level from current score (for Endless Mode).
 */
export function getLevelForScore(score: number): LevelConfig {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Result of picking a target syllable/word.
 */
export interface TargetResult {
  target: string;
  isReinforcement: boolean;
}

/**
 * Pick a target from available curriculum pool.
 * To reinforce learning ("pekiştirme"):
 * - There is an intentional ~28% chance of repeating the same target immediately or recently.
 * - When progressing in levels, earlier level items remain in the pool so previous foundational
 *   syllables and words (A, AN, NA, EL, ELA, etc.) periodically reappear for review and retention!
 */
export function getRandomTarget(
  levelId: number,
  currentTarget?: string,
  isEndlessMode: boolean = true
): TargetResult {
  // ~28% intentional reinforcement repetition of the same syllable/word
  if (currentTarget && Math.random() < 0.28) {
    return { target: currentTarget, isReinforcement: true };
  }

  let pool: string[] = [];

  if (isEndlessMode && levelId > 1) {
    const currentLevel = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    const previousLevels = LEVELS.filter((l) => l.id < levelId);
    const previousItems = previousLevels.flatMap((l) => l.items);

    // 65% weight on current level, 35% on earlier levels for spaced retention
    if (Math.random() < 0.65 || previousItems.length === 0) {
      pool = currentLevel.items;
    } else {
      pool = previousItems;
    }
  } else {
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    pool = level.items;
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  const isReinforcement = Boolean(currentTarget && selected === currentTarget);
  return { target: selected, isReinforcement };
}

/**
 * Pick a random distractor from the appropriate level pool.
 */
export function getRandomDistractor(
  levelId: number,
  target: string,
  isEndlessMode: boolean = true
): string {
  let pool: string[] = [];
  if (isEndlessMode && levelId > 1) {
    pool = LEVELS.filter((l) => l.id <= levelId).flatMap((l) => l.items);
  } else {
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    pool = level.items;
  }

  const candidates = pool.filter((item) => item !== target);
  if (candidates.length === 0) return 'A';
  return candidates[Math.floor(Math.random() * candidates.length)];
}

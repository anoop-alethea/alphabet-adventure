import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';

// ============================================
// TYPES
// ============================================
type LetterKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
type LetterInfo = { word: string; emoji: string; color: string; phonics: string };
type Badge = { id: string; name: string; icon: string; description: string };
type Settings = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  showPhonics: boolean;
};
type GameProgress = {
  score: number;
  completedLevels: number[];
  badges: string[];
  totalLettersLearned: number;
  streak: number;
  lastPlayDate: string;
  unlockedThemes: string[];
  currentTheme: string;
  settings: Settings;
};

// ============================================
// DATA
// ============================================
const letterData: Record<LetterKey, LetterInfo> = {
  A: { word: 'Apple', emoji: '🍎', color: '#FF6B6B', phonics: 'ah' },
  B: { word: 'Ball', emoji: '⚽', color: '#4ECDC4', phonics: 'buh' },
  C: { word: 'Cat', emoji: '🐱', color: '#FFE66D', phonics: 'kuh' },
  D: { word: 'Dog', emoji: '🐕', color: '#95E1D3', phonics: 'duh' },
  E: { word: 'Elephant', emoji: '🐘', color: '#DDA0DD', phonics: 'eh' },
  F: { word: 'Fish', emoji: '🐟', color: '#87CEEB', phonics: 'fff' },
  G: { word: 'Grapes', emoji: '🍇', color: '#9B59B6', phonics: 'guh' },
  H: { word: 'House', emoji: '🏠', color: '#F39C12', phonics: 'huh' },
  I: { word: 'Ice cream', emoji: '🍦', color: '#FFEAA7', phonics: 'ih' },
  J: { word: 'Juice', emoji: '🧃', color: '#E17055', phonics: 'juh' },
  K: { word: 'Kite', emoji: '🪁', color: '#00CEC9', phonics: 'kuh' },
  L: { word: 'Lion', emoji: '🦁', color: '#FDCB6E', phonics: 'lll' },
  M: { word: 'Moon', emoji: '🌙', color: '#A29BFE', phonics: 'mmm' },
  N: { word: 'Nest', emoji: '🪺', color: '#D4A574', phonics: 'nnn' },
  O: { word: 'Orange', emoji: '🍊', color: '#FF7F50', phonics: 'oh' },
  P: { word: 'Penguin', emoji: '🐧', color: '#74B9FF', phonics: 'puh' },
  Q: { word: 'Queen', emoji: '👸', color: '#E056FD', phonics: 'kwuh' },
  R: { word: 'Rainbow', emoji: '🌈', color: '#FF6B6B', phonics: 'rrr' },
  S: { word: 'Sun', emoji: '☀️', color: '#FFD93D', phonics: 'sss' },
  T: { word: 'Tree', emoji: '🌳', color: '#6BCB77', phonics: 'tuh' },
  U: { word: 'Umbrella', emoji: '☂️', color: '#4D96FF', phonics: 'uh' },
  V: { word: 'Violin', emoji: '🎻', color: '#C9485B', phonics: 'vvv' },
  W: { word: 'Whale', emoji: '🐋', color: '#5F9EA0', phonics: 'wuh' },
  X: { word: 'Xylophone', emoji: '🎵', color: '#FF69B4', phonics: 'ks' },
  Y: { word: 'Yak', emoji: '🦬', color: '#8B4513', phonics: 'yuh' },
  Z: { word: 'Zebra', emoji: '🦓', color: '#2C3E50', phonics: 'zzz' }
};

const lowercaseMap: Record<LetterKey, string> = {
  A: 'a', B: 'b', C: 'c', D: 'd', E: 'e', F: 'f', G: 'g', H: 'h', I: 'i',
  J: 'j', K: 'k', L: 'l', M: 'm', N: 'n', O: 'o', P: 'p', Q: 'q', R: 'r',
  S: 's', T: 't', U: 'u', V: 'v', W: 'w', X: 'x', Y: 'y', Z: 'z'
};

const allBadges: Badge[] = [
  { id: 'first-letter', name: 'First Steps', icon: '👶', description: 'Learn your first letter' },
  { id: 'five-letters', name: 'Fast Learner', icon: '🚀', description: 'Learn 5 letters' },
  { id: 'ten-letters', name: 'Letter Explorer', icon: '🧭', description: 'Learn 10 letters' },
  { id: 'all-letters', name: 'Alphabet Master', icon: '👑', description: 'Learn all 26 letters' },
  { id: 'first-trace', name: 'Little Writer', icon: '✏️', description: 'Trace your first letter' },
  { id: 'perfect-match', name: 'Match Maker', icon: '🧩', description: 'Complete a match game' },
  { id: 'streak-3', name: 'On Fire', icon: '🔥', description: '3-day streak' },
  { id: 'score-100', name: 'Century Club', icon: '💯', description: 'Score 100 points' },
  { id: 'score-500', name: 'High Scorer', icon: '🏆', description: 'Score 500 points' },
  { id: 'bubble-master', name: 'Bubble Popper', icon: '🫧', description: 'Pop 20 bubbles' },
  { id: 'word-builder', name: 'Word Smith', icon: '📚', description: 'Build 5 words' },
  { id: 'speed-demon', name: 'Speed Star', icon: '⚡', description: 'Answer 5 in a row fast' },
];

const themes: Record<string, { name: string; gradient: string; icon: string }> = {
  default: { name: 'Rainbow', gradient: 'from-blue-200 via-purple-100 to-pink-200', icon: '🌈' },
  ocean: { name: 'Ocean', gradient: 'from-blue-300 via-cyan-200 to-teal-200', icon: '🌊' },
  forest: { name: 'Forest', gradient: 'from-green-300 via-emerald-200 to-lime-200', icon: '🌲' },
  sunset: { name: 'Sunset', gradient: 'from-orange-300 via-pink-200 to-purple-300', icon: '🌅' },
  candy: { name: 'Candy', gradient: 'from-pink-300 via-fuchsia-200 to-purple-200', icon: '🍭' },
};

const levels = [
  { name: 'Meet the Letters', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'learn', icon: '👋' },
  { name: 'Write A-E', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'write', icon: '✏️' },
  { name: 'Find the Letter', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'find', icon: '🔍' },
  { name: 'Case Match', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'caseMatch', icon: '🔤' },
  { name: 'More Friends', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'learn', icon: '🌟' },
  { name: 'Write F-J', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'write', icon: '✏️' },
  { name: 'Bubble Pop!', letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'], mode: 'bubblePop', icon: '🫧' },
  { name: 'Keep Going', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'learn', icon: '🚀' },
  { name: 'Write K-O', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'write', icon: '✏️' },
  { name: 'Match Time', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'match', icon: '🧩' },
  { name: 'Letter Sort', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'dragSort', icon: '📝' },
  { name: 'Almost There', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'learn', icon: '⭐' },
  { name: 'Write P-T', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'write', icon: '✏️' },
  { name: 'Word Builder', letters: ['C', 'A', 'T', 'D', 'O', 'G', 'S', 'U', 'N'], mode: 'wordBuild', icon: '📚' },
  { name: 'Final Letters', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'learn', icon: '🎉' },
  { name: 'Write U-Z', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'write', icon: '✏️' },
  { name: 'Phonics Fun', letters: Object.keys(letterData), mode: 'phonics', icon: '🔊' },
  { name: 'All Letters Review', letters: Object.keys(letterData), mode: 'review', icon: '📚' },
  { name: 'Grand Finale', letters: Object.keys(letterData), mode: 'match', icon: '👑' }
];

// ============================================
// AUDIO SYSTEM
// ============================================
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.3) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = type;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

const sounds = {
  tap: () => playTone(800, 0.1, 'sine', 0.2),
  correct: () => {
    playTone(523, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 200);
  },
  wrong: () => playTone(200, 0.3, 'sawtooth', 0.15),
  celebrate: () => {
    [523, 587, 659, 698, 784, 880, 988, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, 'sine', 0.25), i * 80);
    });
  },
  pop: () => playTone(600, 0.08, 'sine', 0.4),
};

const speakText = (text: string, rate = 0.8, pitch = 1.2) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    window.speechSynthesis.speak(u);
  }
};

const speakLetter = (letter: string, word: string, phonics: string, showPhonics: boolean) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u1 = new SpeechSynthesisUtterance(letter);
    u1.rate = 0.7;
    u1.pitch = 1.2;
    window.speechSynthesis.speak(u1);
    setTimeout(() => {
      if (showPhonics) {
        speakText(`says ${phonics}. ${letter} is for ${word}`, 0.85, 1.1);
      } else {
        speakText(`is for ${word}`, 0.8, 1.1);
      }
    }, 600);
  }
};

const celebrateVoice = () => {
  const phrases = ['Great job!', 'Wonderful!', 'You did it!', 'Amazing!', 'Super star!', 'Fantastic!'];
  speakText(phrases[Math.floor(Math.random() * phrases.length)], 0.9, 1.3);
};

// ============================================
// LOCALSTORAGE HOOK
// ============================================
const useLocalStorage = <T,>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch { return initial; }
  });

  const setStored = (v: T | ((p: T) => T)) => {
    const newVal = v instanceof Function ? v(value) : v;
    setValue(newVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newVal));
    }
  };

  return [value, setStored];
};

// ============================================
// DEFAULT STATE
// ============================================
const defaultSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'easy',
  showPhonics: true,
};

const defaultProgress: GameProgress = {
  score: 0,
  completedLevels: [],
  badges: [],
  totalLettersLearned: 0,
  streak: 0,
  lastPlayDate: '',
  unlockedThemes: ['default'],
  currentTheme: 'default',
  settings: defaultSettings,
};

// ============================================
// COMPONENTS
// ============================================
const ConfettiEffect = ({ show }: { show: boolean }) => {
  if (!show) return null;
  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    size: Math.random() * 8 + 4,
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#FF69B4', '#00CEC9', '#FDCB6E'][Math.floor(Math.random() * 7)]
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            width: c.size,
            height: c.size,
            backgroundColor: c.color,
            animation: `confetti-fall 2.5s ease-in ${c.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const AnimatedLetter = ({ letter, color, size = 'large', onClick }: {
  letter: string; color: string; size?: 'small' | 'medium' | 'large'; onClick?: () => void;
}) => {
  const sizes = { small: 'text-4xl', medium: 'text-6xl md:text-7xl', large: 'text-7xl md:text-9xl' };
  return (
    <span
      onClick={onClick}
      className={`font-bold cursor-pointer select-none ${sizes[size]} animate-bounce-gentle`}
      style={{ color, textShadow: `3px 3px 0 ${color}40` }}
    >
      {letter}
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
      `}</style>
    </span>
  );
};

const LetterCard = ({ letter, data, onClick, size = 'large', showWord = true, showLower = false }: {
  letter: LetterKey; data: LetterInfo; onClick?: () => void; size?: 'small' | 'large'; showWord?: boolean; showLower?: boolean;
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center ${size === 'large' ? 'p-8 md:p-12' : 'p-4 md:p-6'}`}
    style={{ backgroundColor: data.color + '30', border: `4px solid ${data.color}` }}
  >
    <div className="flex items-center gap-2">
      <AnimatedLetter letter={letter} color={data.color} size={size === 'large' ? 'large' : 'medium'} />
      {showLower && <AnimatedLetter letter={lowercaseMap[letter]} color={data.color} size={size === 'large' ? 'large' : 'medium'} />}
    </div>
    <span className={size === 'large' ? 'text-6xl md:text-8xl my-2 md:my-4' : 'text-3xl md:text-5xl my-1 md:my-2'}>{data.emoji}</span>
    {showWord && <span className={`font-semibold ${size === 'large' ? 'text-xl md:text-3xl' : 'text-sm md:text-xl'}`} style={{ color: data.color }}>{data.word}</span>}
  </div>
);

// Touch-based letter tracing canvas
const LetterTracer = ({ letter, color, onComplete }: { letter: LetterKey; color: string; onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<{x: number; y: number}[]>([]);
  const [complete, setComplete] = useState(false);

  const isLarge = typeof window !== 'undefined' && window.innerWidth >= 768;
  const isIPad = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1366;
  const size = isIPad ? 450 : (isLarge ? 400 : 280);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${size * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color + '15';
    ctx.fillText(letter, size / 2, size / 2);
    ctx.strokeStyle = color + '30';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, size / 2, size / 2);
    ctx.setLineDash([]);
  }, [letter, color, size]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (complete) return;
    setDrawing(true);
    setStrokes([getPos(e)]);
    sounds.tap();
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!drawing || complete) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    const newStrokes = [...strokes, pos];
    setStrokes(newStrokes);
    if (newStrokes.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = isIPad ? 20 : (isLarge ? 16 : 12);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const prev = newStrokes[newStrokes.length - 2];
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    if (strokes.length > 30) {
      setComplete(true);
      sounds.celebrate();
      celebrateVoice();
      setTimeout(onComplete, 1500);
    }
  };

  const reset = () => {
    setStrokes([]);
    setComplete(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.font = `bold ${size * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color + '15';
    ctx.fillText(letter, size / 2, size / 2);
    ctx.strokeStyle = color + '30';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, size / 2, size / 2);
    ctx.setLineDash([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="bg-white rounded-3xl shadow-2xl touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {complete && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl">
            <div className="text-center">
              <div className="text-6xl md:text-8xl mb-2">🎉</div>
              <p className="text-2xl font-bold text-green-500">Perfect!</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-gray-500">Trace the letter with your finger!</p>
      <button onClick={reset} className="mt-3 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700">
        🔄 Start Over
      </button>
    </div>
  );
};

// Bubble Pop Mini-game
const BubblePop = ({ letters, onComplete }: { letters: string[]; onComplete: () => void }) => {
  const [bubbles, setBubbles] = useState<{id: number; letter: string; x: number; y: number; popped: boolean}[]>([]);
  const [target, setTarget] = useState('');
  const [popped, setPopped] = useState(0);
  const goal = 8;

  useEffect(() => {
    const t = letters[Math.floor(Math.random() * letters.length)];
    setTarget(t);
    setBubbles(Array.from({ length: 12 }, (_, i) => ({
      id: i,
      letter: i < 4 ? t : letters[Math.floor(Math.random() * letters.length)],
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25,
      popped: false
    })).sort(() => Math.random() - 0.5));
  }, [letters, popped]);

  const pop = (id: number, letter: string) => {
    if (letter === target) {
      sounds.pop();
      setBubbles(b => b.map(x => x.id === id ? { ...x, popped: true } : x));
      setPopped(p => {
        if (p + 1 >= goal) {
          sounds.celebrate();
          setTimeout(onComplete, 1000);
        }
        return p + 1;
      });
    } else {
      sounds.wrong();
    }
  };

  return (
    <div className="relative w-full h-80 md:h-96 bg-gradient-to-b from-blue-200 to-blue-400 rounded-3xl overflow-hidden">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-6 py-2">
        <p className="text-xl font-bold">Pop the <span style={{ color: letterData[target as LetterKey]?.color }}>{target}</span> bubbles!</p>
      </div>
      {bubbles.filter(b => !b.popped).map(b => (
        <button
          key={b.id}
          onClick={() => pop(b.id, b.letter)}
          className="absolute w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg hover:scale-110 active:scale-90 transition-transform"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: `radial-gradient(circle at 30% 30%, ${letterData[b.letter as LetterKey]?.color}88, ${letterData[b.letter as LetterKey]?.color})`,
            animation: 'float 3s ease-in-out infinite',
            animationDelay: `${b.id * 0.2}s`
          }}
        >
          {b.letter}
        </button>
      ))}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xl font-bold">{popped}/{goal}</p>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

// Drag Sort Game
const DragSort = ({ letters, onComplete }: { letters: string[]; onComplete: () => void }) => {
  const [items, setItems] = useState<string[]>([]);
  const [dragged, setDragged] = useState<number | null>(null);

  useEffect(() => {
    setItems([...letters.slice(0, 5)].sort(() => Math.random() - 0.5));
  }, [letters]);

  const sorted = [...items].sort();
  const isCorrect = JSON.stringify(items) === JSON.stringify(sorted);

  useEffect(() => {
    if (isCorrect && items.length > 0) {
      sounds.celebrate();
      setTimeout(onComplete, 1500);
    }
  }, [isCorrect]);

  const swap = (from: number, to: number) => {
    const arr = [...items];
    [arr[from], arr[to]] = [arr[to], arr[from]];
    setItems(arr);
    sounds.tap();
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl md:text-2xl text-gray-600 mb-6">Put letters in ABC order!</p>
      <div className="flex gap-3 md:gap-4">
        {items.map((l, i) => (
          <button
            key={l}
            draggable
            onDragStart={() => setDragged(i)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => { if (dragged !== null) swap(dragged, i); setDragged(null); }}
            onClick={() => {
              if (dragged === null) setDragged(i);
              else { swap(dragged, i); setDragged(null); }
            }}
            className={`w-14 h-14 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-2xl md:text-4xl font-bold shadow-lg transition-all ${
              dragged === i ? 'scale-110 ring-4 ring-yellow-400' : 'hover:scale-105'
            } ${isCorrect ? 'animate-bounce' : ''}`}
            style={{
              backgroundColor: letterData[l as LetterKey]?.color + '40',
              border: `3px solid ${letterData[l as LetterKey]?.color}`,
              color: letterData[l as LetterKey]?.color
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {isCorrect && <p className="mt-6 text-2xl font-bold text-green-500">🎉 Perfect Order!</p>}
    </div>
  );
};

// Word Builder Game
const WordBuild = ({ onComplete }: { onComplete: () => void }) => {
  const words = [{ word: 'CAT', emoji: '🐱' }, { word: 'DOG', emoji: '🐕' }, { word: 'SUN', emoji: '☀️' }];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const current = words[idx];

  useEffect(() => {
    const letters = current.word.split('');
    const extra = ['A', 'E', 'I', 'O', 'P', 'R'].filter(l => !letters.includes(l)).slice(0, 3);
    setAvailable([...letters, ...extra].sort(() => Math.random() - 0.5));
    setSelected([]);
  }, [idx]);

  const pick = (letter: string, i: number) => {
    sounds.tap();
    setSelected([...selected, letter]);
    setAvailable(available.filter((_, j) => j !== i));
  };

  const remove = (i: number) => {
    sounds.tap();
    setAvailable([...available, selected[i]]);
    setSelected(selected.filter((_, j) => j !== i));
  };

  useEffect(() => {
    if (selected.join('') === current.word) {
      sounds.celebrate();
      setTimeout(() => {
        if (idx < words.length - 1) setIdx(i => i + 1);
        else onComplete();
      }, 1500);
    }
  }, [selected]);

  const correct = selected.join('') === current.word;

  return (
    <div className="flex flex-col items-center">
      <div className="text-7xl mb-4">{current.emoji}</div>
      <p className="text-xl text-gray-600 mb-6">Spell the word!</p>
      <div className="flex gap-2 mb-6 min-h-[60px]">
        {Array.from({ length: current.word.length }).map((_, i) => (
          <div
            key={i}
            onClick={() => selected[i] && remove(i)}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border-4 flex items-center justify-center text-2xl font-bold cursor-pointer ${
              selected[i] ? 'bg-green-100 border-green-400' : 'border-dashed border-gray-300'
            } ${correct ? 'animate-bounce border-green-500' : ''}`}
          >
            {selected[i] || ''}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {available.map((l, i) => (
          <button
            key={i}
            onClick={() => pick(l, i)}
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg hover:scale-110 active:scale-95"
            style={{
              backgroundColor: letterData[l as LetterKey]?.color + '40',
              border: `2px solid ${letterData[l as LetterKey]?.color}`,
              color: letterData[l as LetterKey]?.color
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="mt-6 text-gray-400">{idx + 1}/{words.length}</p>
    </div>
  );
};

// Case Match (Upper/Lower)
const CaseMatch = ({ letters, onComplete }: { letters: string[]; onComplete: () => void }) => {
  const subset = letters.slice(0, 4);
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const shuffledLower = [...subset].sort(() => Math.random() - 0.5);

  const clickUpper = (l: string) => {
    if (matched.includes(l)) return;
    sounds.tap();
    setSelectedUpper(l);
  };

  const clickLower = (l: string) => {
    if (!selectedUpper) return;
    if (lowercaseMap[selectedUpper as LetterKey] === l) {
      sounds.correct();
      const newMatched = [...matched, selectedUpper];
      setMatched(newMatched);
      if (newMatched.length >= subset.length) {
        sounds.celebrate();
        setTimeout(onComplete, 1500);
      }
    } else {
      sounds.wrong();
    }
    setSelectedUpper(null);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl md:text-2xl text-gray-600 mb-6">Match UPPERCASE to lowercase!</p>
      <div className="flex gap-8 md:gap-16">
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-bold text-gray-400 mb-2">UPPER</p>
          {subset.map(l => (
            <button
              key={l}
              onClick={() => clickUpper(l)}
              disabled={matched.includes(l)}
              className={`w-14 h-14 md:w-18 md:h-18 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg transition-all ${
                matched.includes(l) ? 'opacity-30' : selectedUpper === l ? 'ring-4 ring-yellow-400 scale-110' : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: letterData[l as LetterKey]?.color + '40',
                border: `3px solid ${letterData[l as LetterKey]?.color}`,
                color: letterData[l as LetterKey]?.color
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-bold text-gray-400 mb-2">lower</p>
          {shuffledLower.map(l => (
            <button
              key={l}
              onClick={() => clickLower(lowercaseMap[l as LetterKey])}
              disabled={matched.includes(l)}
              className={`w-14 h-14 md:w-18 md:h-18 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg transition-all ${
                matched.includes(l) ? 'opacity-30' : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: letterData[l as LetterKey]?.color + '40',
                border: `3px solid ${letterData[l as LetterKey]?.color}`,
                color: letterData[l as LetterKey]?.color
              }}
            >
              {lowercaseMap[l as LetterKey]}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-gray-500">{matched.length}/{subset.length} matched</p>
    </div>
  );
};

// Phonics Practice
const PhonicsGame = ({ letters, onComplete }: { letters: string[]; onComplete: () => void }) => {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const letter = letters[idx] as LetterKey;
  const data = letterData[letter];

  const play = () => {
    sounds.tap();
    speakText(`${letter} says ${data.phonics}. ${data.phonics}. ${letter} is for ${data.word}`, 0.8, 1.1);
    setShowAnswer(true);
  };

  const next = () => {
    if (idx < Math.min(letters.length - 1, 9)) {
      setIdx(i => i + 1);
      setShowAnswer(false);
    } else {
      sounds.celebrate();
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <LetterCard letter={letter} data={data} size="large" showWord={showAnswer} />
      {showAnswer && (
        <p className="mt-4 text-2xl font-bold" style={{ color: data.color }}>
          "{letter}" says "{data.phonics}"
        </p>
      )}
      <div className="mt-6 flex gap-4">
        <button onClick={play} className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl shadow-lg active:scale-95">
          🔊 Hear Sound
        </button>
        {showAnswer && (
          <button onClick={next} className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold text-xl shadow-lg active:scale-95">
            Next ➡️
          </button>
        )}
      </div>
      <p className="mt-6 text-gray-500">{idx + 1}/{Math.min(letters.length, 10)}</p>
    </div>
  );
};

// Settings Panel
const SettingsPanel = ({ settings, onUpdate, onClose }: {
  settings: Settings;
  onUpdate: (s: Settings) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600">⚙️ Settings</h2>
        <button onClick={onClose} className="text-3xl">✕</button>
      </div>
      <div className="space-y-5">
        {[
          { key: 'soundEnabled', label: '🔊 Sound Effects' },
          { key: 'musicEnabled', label: '🎵 Music' },
          { key: 'showPhonics', label: '🔤 Show Phonics' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-lg font-semibold">{label}</span>
            <button
              onClick={() => onUpdate({ ...settings, [key]: !settings[key as keyof Settings] })}
              className={`w-14 h-8 rounded-full transition-colors ${settings[key as keyof Settings] ? 'bg-green-400' : 'bg-gray-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[key as keyof Settings] ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
        <div>
          <span className="text-lg font-semibold block mb-2">🎯 Difficulty</span>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => onUpdate({ ...settings, difficulty: d })}
                className={`flex-1 py-2 rounded-xl font-bold capitalize ${settings.difficulty === d ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="w-full mt-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl">
        Done
      </button>
    </div>
  </div>
);

// Badges Panel
const BadgesPanel = ({ badges, onClose }: { badges: string[]; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600">🏆 Badges</h2>
        <button onClick={onClose} className="text-3xl">✕</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {allBadges.map(b => {
          const unlocked = badges.includes(b.id);
          return (
            <div key={b.id} className={`p-3 rounded-2xl text-center ${unlocked ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100 opacity-50'}`}>
              <div className="text-3xl mb-1">{unlocked ? b.icon : '🔒'}</div>
              <p className="font-bold text-xs">{b.name}</p>
              <p className="text-xs text-gray-500">{b.description}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-4 text-gray-500">{badges.length}/{allBadges.length} unlocked</p>
    </div>
  </div>
);

// Theme Selector
const ThemePanel = ({ current, unlocked, onSelect, onClose }: {
  current: string; unlocked: string[]; onSelect: (t: string) => void; onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600">🎨 Themes</h2>
        <button onClick={onClose} className="text-3xl">✕</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(themes).map(([id, t]) => {
          const isUnlocked = unlocked.includes(id);
          return (
            <button
              key={id}
              onClick={() => isUnlocked && onSelect(id)}
              disabled={!isUnlocked}
              className={`p-3 rounded-2xl ${current === id ? 'ring-4 ring-yellow-400' : ''} ${!isUnlocked ? 'opacity-40' : ''}`}
            >
              <div className={`h-14 rounded-xl bg-gradient-to-r ${t.gradient} mb-2`} />
              <div className="text-2xl">{isUnlocked ? t.icon : '🔒'}</div>
              <p className="font-bold text-sm">{t.name}</p>
            </button>
          );
        })}
      </div>
      <p className="text-center mt-4 text-gray-400 text-sm">Complete levels to unlock!</p>
    </div>
  </div>
);

// Badge Popup
const BadgePopup = ({ badge, onClose }: { badge: Badge | null; onClose: () => void }) => {
  if (!badge) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-bounce-in">
        <div className="text-6xl mb-4">{badge.icon}</div>
        <h3 className="text-2xl font-bold text-purple-600">New Badge!</h3>
        <p className="text-xl font-semibold">{badge.name}</p>
        <p className="text-gray-500">{badge.description}</p>
      </div>
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function AlphabetAdventure() {
  const [progress, setProgress] = useLocalStorage<GameProgress>('alphabet-progress', defaultProgress);
  const [screen, setScreen] = useState('home');
  const [levelIdx, setLevelIdx] = useState(0);
  const [learnIdx, setLearnIdx] = useState(0);
  const [target, setTarget] = useState<LetterKey>('A');
  const [options, setOptions] = useState<LetterKey[]>([]);
  const [feedback, setFeedback] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [matchPairs, setMatchPairs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  const level = levels[levelIdx];
  const theme = themes[progress.currentTheme] || themes.default;

  // Streak tracking
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const consecutive = progress.lastPlayDate === yesterday.toDateString();
      setProgress(p => ({
        ...p,
        streak: consecutive ? p.streak + 1 : 1,
        lastPlayDate: today
      }));
    }
  }, []);

  const addScore = (pts: number) => {
    setProgress(p => {
      const newScore = p.score + pts;
      if (newScore >= 100 && !p.badges.includes('score-100')) unlockBadge('score-100');
      if (newScore >= 500 && !p.badges.includes('score-500')) unlockBadge('score-500');
      return { ...p, score: newScore };
    });
  };

  const unlockBadge = (id: string) => {
    if (progress.badges.includes(id)) return;
    const badge = allBadges.find(b => b.id === id);
    if (badge) {
      setProgress(p => ({ ...p, badges: [...p.badges, id] }));
      setNewBadge(badge);
      sounds.celebrate();
      setTimeout(() => setNewBadge(null), 3000);
    }
  };

  const completeLevel = () => {
    setProgress(p => {
      const newCompleted = [...new Set([...p.completedLevels, levelIdx])];
      const newUnlocked = [...p.unlockedThemes];
      if (newCompleted.length >= 5 && !newUnlocked.includes('ocean')) newUnlocked.push('ocean');
      if (newCompleted.length >= 10 && !newUnlocked.includes('forest')) newUnlocked.push('forest');
      if (newCompleted.length >= 15 && !newUnlocked.includes('sunset')) newUnlocked.push('sunset');
      if (newCompleted.length >= 18 && !newUnlocked.includes('candy')) newUnlocked.push('candy');
      return { ...p, completedLevels: newCompleted, unlockedThemes: newUnlocked };
    });
    setScreen('levelComplete');
  };

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const setupFind = useCallback(() => {
    const letters = level.letters as LetterKey[];
    const t = letters[Math.floor(Math.random() * letters.length)];
    const wrong = (Object.keys(letterData) as LetterKey[]).filter(l => l !== t);
    setTarget(t);
    setOptions(shuffle([t, ...shuffle(wrong).slice(0, 3)]));
    setFeedback('');
  }, [level]);

  const setupMatch = useCallback(() => {
    const letters = shuffle(level.letters as LetterKey[]).slice(0, 4);
    setMatchPairs(shuffle([
      ...letters.map(l => ({ type: 'letter', value: l, letter: l, id: `l-${l}` })),
      ...letters.map(l => ({ type: 'emoji', value: letterData[l].emoji, letter: l, id: `e-${l}` }))
    ]));
    setSelected(null);
    setMatched([]);
    setFeedback('');
  }, [level]);

  useEffect(() => {
    if (screen === 'play') {
      if (level.mode === 'find' || level.mode === 'review') setupFind();
      else if (level.mode === 'match') setupMatch();
    }
  }, [screen, levelIdx, setupFind, setupMatch, level]);

  const startLevel = (idx: number) => {
    setLevelIdx(idx);
    setLearnIdx(0);
    setAnswered(0);
    setScreen('play');
    if (progress.settings.soundEnabled) sounds.tap();
  };

  const nextLevel = () => {
    if (levelIdx < levels.length - 1) startLevel(levelIdx + 1);
    else setScreen('complete');
  };

  const handleLearn = () => {
    const letter = level.letters[learnIdx] as LetterKey;
    const data = letterData[letter];
    if (progress.settings.soundEnabled) sounds.tap();
    speakLetter(letter, data.word, data.phonics, progress.settings.showPhonics);

    if (learnIdx < level.letters.length - 1) {
      setTimeout(() => setLearnIdx(i => i + 1), 2500);
    } else {
      setTimeout(() => {
        setConfetti(true);
        sounds.celebrate();
        celebrateVoice();
        if (!progress.badges.includes('first-letter')) unlockBadge('first-letter');
        const newLearned = progress.totalLettersLearned + level.letters.length;
        if (newLearned >= 5 && !progress.badges.includes('five-letters')) unlockBadge('five-letters');
        if (newLearned >= 10 && !progress.badges.includes('ten-letters')) unlockBadge('ten-letters');
        if (newLearned >= 26 && !progress.badges.includes('all-letters')) unlockBadge('all-letters');
        setProgress(p => ({ ...p, totalLettersLearned: newLearned }));
        setTimeout(() => { setConfetti(false); completeLevel(); }, 2000);
      }, 2500);
    }
  };

  const handleFind = (letter: LetterKey) => {
    if (letter === target) {
      addScore(10);
      setFeedback('🎉 Correct!');
      if (progress.settings.soundEnabled) sounds.correct();
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1500);
      if (answered + 1 >= 5) {
        setTimeout(() => { setAnswered(0); completeLevel(); }, 1500);
      } else {
        setAnswered(a => a + 1);
        setTimeout(setupFind, 1500);
      }
    } else {
      if (progress.settings.soundEnabled) sounds.wrong();
      setFeedback('Try again! 💪');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  const handleMatch = (item: any) => {
    if (matched.includes(item.id)) return;
    if (progress.settings.soundEnabled) sounds.tap();
    if (!selected) {
      setSelected(item);
    } else {
      const isMatch = (selected.type === 'letter' && item.type === 'emoji' && item.letter === selected.value) ||
                      (selected.type === 'emoji' && item.type === 'letter' && selected.letter === item.value);
      if (isMatch) {
        const newMatched = [...matched, selected.id, item.id];
        setMatched(newMatched);
        addScore(15);
        if (progress.settings.soundEnabled) sounds.correct();
        setConfetti(true);
        setTimeout(() => setConfetti(false), 1000);
        if (newMatched.length === matchPairs.length) {
          if (!progress.badges.includes('perfect-match')) unlockBadge('perfect-match');
          setTimeout(completeLevel, 1500);
        }
      } else {
        if (progress.settings.soundEnabled) sounds.wrong();
        setFeedback('Try again! 💪');
        setTimeout(() => setFeedback(''), 800);
      }
      setSelected(null);
    }
  };

  // Header component
  const Header = () => (
    <div className="flex justify-between w-full max-w-2xl mb-4">
      <button onClick={() => setScreen('home')} className="text-2xl md:text-4xl p-2">🏠</button>
      <p className="text-lg md:text-2xl font-bold text-purple-600">{level.name}</p>
      <p className="text-lg md:text-2xl font-bold text-orange-500">⭐{progress.score}</p>
    </div>
  );

  // ============================================
  // SCREENS
  // ============================================

  if (screen === 'home') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} p-4 md:p-8 flex flex-col items-center`}>
        <ConfettiEffect show={confetti} />
        <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />
        {showSettings && <SettingsPanel settings={progress.settings} onUpdate={s => setProgress(p => ({ ...p, settings: s }))} onClose={() => setShowSettings(false)} />}
        {showBadges && <BadgesPanel badges={progress.badges} onClose={() => setShowBadges(false)} />}
        {showThemes && <ThemePanel current={progress.currentTheme} unlocked={progress.unlockedThemes} onSelect={t => setProgress(p => ({ ...p, currentTheme: t }))} onClose={() => setShowThemes(false)} />}

        <div className="w-full max-w-4xl flex justify-between mb-2">
          <button onClick={() => setShowSettings(true)} className="text-3xl p-2">⚙️</button>
          <div className="flex gap-2">
            <button onClick={() => setShowThemes(true)} className="text-3xl p-2">🎨</button>
            <button onClick={() => setShowBadges(true)} className="text-3xl p-2">🏆</button>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 text-center">🌈 Alphabet Adventure 🌈</h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-2">Learn your ABCs!</p>

        {progress.streak > 0 && (
          <div className="bg-orange-100 rounded-full px-4 py-1 mb-4">
            <span className="text-orange-500 font-bold">🔥 {progress.streak} day streak!</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mb-6">
          {levels.map((l, i) => {
            const done = progress.completedLevels.includes(i);
            const unlocked = i === 0 || progress.completedLevels.includes(i - 1);
            return (
              <button
                key={i}
                onClick={() => unlocked && startLevel(i)}
                disabled={!unlocked}
                className={`p-3 md:p-4 rounded-2xl font-bold text-white shadow-lg transform transition-all active:scale-95 ${
                  done ? 'bg-green-400' : unlocked ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:scale-105' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl md:text-4xl">{l.icon}</span>
                <p className="text-xs md:text-sm mt-1">{l.name}</p>
                {done && <span className="text-sm">✓</span>}
              </button>
            );
          })}
        </div>

        <div className="bg-white/80 rounded-2xl p-4 flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">⭐ {progress.score}</p>
            <p className="text-gray-500 text-sm">Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">📚 {progress.completedLevels.length}</p>
            <p className="text-gray-500 text-sm">Levels</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">🏆 {progress.badges.length}</p>
            <p className="text-gray-500 text-sm">Badges</p>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'levelComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-100 to-pink-200 flex flex-col items-center justify-center p-4">
        <ConfettiEffect show={true} />
        <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />
        <div className="text-8xl md:text-[10rem] mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-2">Level Complete!</h1>
        <p className="text-xl md:text-3xl text-gray-600 mb-4">{level.name}</p>
        <p className="text-2xl font-bold text-purple-600 mb-8">Score: {progress.score}</p>
        <div className="flex gap-4">
          <button onClick={() => setScreen('home')} className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold text-lg active:scale-95">
            🏠 Home
          </button>
          <button onClick={nextLevel} className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold text-lg active:scale-95">
            {levelIdx < levels.length - 1 ? '➡️ Next' : '🏆 Finish'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-pink-200 to-purple-300 flex flex-col items-center justify-center p-4">
        <ConfettiEffect show={true} />
        <div className="text-8xl mb-4 animate-bounce">👑</div>
        <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-4">ABC Champion!</h1>
        <p className="text-xl text-gray-600 mb-6">You mastered all 26 letters!</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mb-6">
          {(Object.keys(letterData) as LetterKey[]).map(l => (
            <AnimatedLetter key={l} letter={l} color={letterData[l].color} size="small" />
          ))}
        </div>
        <p className="text-3xl font-bold text-orange-500 mb-8">Final Score: {progress.score}</p>
        <button onClick={() => { setScreen('home'); setLevelIdx(0); }} className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl active:scale-95">
          🔄 Play Again
        </button>
      </div>
    );
  }

  if (screen === 'play') {
    const currentLetter = level.letters[learnIdx] as LetterKey;
    const currentData = letterData[currentLetter];

    // Learn mode
    if (level.mode === 'learn') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />
          <Header />
          <div className="flex gap-2 mb-6">
            {level.letters.map((l, i) => (
              <div key={l} className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl font-bold ${
                i < learnIdx ? 'bg-green-400 text-white' : i === learnIdx ? 'bg-purple-500 text-white ring-4 ring-yellow-300' : 'bg-gray-200'
              }`}>
                {i < learnIdx ? '✓' : l}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <LetterCard letter={currentLetter} data={currentData} onClick={handleLearn} showLower={true} />
            {progress.settings.showPhonics && (
              <p className="mt-4 text-xl text-gray-600">"{currentLetter}" says "<span className="font-bold" style={{ color: currentData.color }}>{currentData.phonics}</span>"</p>
            )}
            <p className="mt-4 text-lg text-gray-500">Tap to hear the letter!</p>
          </div>
        </div>
      );
    }

    // Write mode
    if (level.mode === 'write') {
      return (
        <div className={`min-h-screen bg-gradient-to-b from-cyan-200 via-teal-100 to-green-200 flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <BadgePopup badge={newBadge} onClose={() => setNewBadge(null)} />
          <Header />
          <div className="flex gap-2 mb-4">
            {level.letters.map((l, i) => (
              <div key={l} className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl font-bold ${
                i < learnIdx ? 'bg-green-400 text-white' : i === learnIdx ? 'bg-teal-500 text-white ring-4 ring-yellow-300' : 'bg-gray-200'
              }`}>
                {i < learnIdx ? '✓' : l}
              </div>
            ))}
          </div>
          <div className="text-center mb-4">
            <p className="text-xl text-gray-600">Trace the letter:</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <AnimatedLetter letter={currentLetter} color={currentData.color} size="large" />
              <span className="text-5xl">{currentData.emoji}</span>
            </div>
          </div>
          <LetterTracer
            key={currentLetter}
            letter={currentLetter}
            color={currentData.color}
            onComplete={() => {
              addScore(20);
              if (!progress.badges.includes('first-trace')) unlockBadge('first-trace');
              setConfetti(true);
              setTimeout(() => setConfetti(false), 2000);
              if (learnIdx < level.letters.length - 1) {
                setTimeout(() => setLearnIdx(i => i + 1), 1500);
              } else {
                setTimeout(completeLevel, 1500);
              }
            }}
          />
        </div>
      );
    }

    // Find mode
    if (level.mode === 'find' || level.mode === 'review') {
      return (
        <div className={`min-h-screen bg-gradient-to-b from-orange-200 via-yellow-100 to-green-200 flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <div className="text-center mb-6">
            <p className="text-xl md:text-3xl text-gray-600">Find the letter for:</p>
            <div className="text-7xl md:text-9xl my-4">{letterData[target].emoji}</div>
            <p className="text-2xl font-bold text-purple-600">{letterData[target].word}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {options.map(l => (
              <button
                key={l}
                onClick={() => handleFind(l)}
                className="p-6 md:p-10 rounded-2xl text-5xl md:text-7xl font-bold shadow-lg transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: letterData[l].color + '40', border: `3px solid ${letterData[l].color}`, color: letterData[l].color }}
              >
                {l}
              </button>
            ))}
          </div>
          {feedback && <p className="text-2xl font-bold mt-6 animate-bounce">{feedback}</p>}
          <p className="mt-6 text-gray-500">{answered}/5 correct</p>
        </div>
      );
    }

    // Match mode
    if (level.mode === 'match') {
      return (
        <div className={`min-h-screen bg-gradient-to-b from-pink-200 via-purple-100 to-blue-200 flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <p className="text-xl md:text-3xl text-gray-600 mb-6">Match letters with pictures!</p>
          <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-2xl">
            {matchPairs.map((item: any) => (
              <button
                key={item.id}
                onClick={() => handleMatch(item)}
                className={`p-4 md:p-8 rounded-xl text-3xl md:text-5xl font-bold shadow-lg transition-all active:scale-95 ${
                  matched.includes(item.id) ? 'opacity-30' : selected?.id === item.id ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: letterData[item.letter as LetterKey].color + '40', border: `2px solid ${letterData[item.letter as LetterKey].color}` }}
                disabled={matched.includes(item.id)}
              >
                {item.value}
              </button>
            ))}
          </div>
          {feedback && <p className="text-2xl font-bold mt-6 animate-bounce">{feedback}</p>}
          <p className="mt-6 text-gray-500">{matched.length / 2}/{matchPairs.length / 2} matched</p>
        </div>
      );
    }

    // Bubble Pop
    if (level.mode === 'bubblePop') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <BubblePop letters={level.letters} onComplete={() => { addScore(30); completeLevel(); }} />
        </div>
      );
    }

    // Drag Sort
    if (level.mode === 'dragSort') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <DragSort letters={level.letters} onComplete={() => { addScore(30); completeLevel(); }} />
        </div>
      );
    }

    // Word Build
    if (level.mode === 'wordBuild') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <WordBuild onComplete={() => { addScore(50); if (!progress.badges.includes('word-builder')) unlockBadge('word-builder'); completeLevel(); }} />
        </div>
      );
    }

    // Case Match
    if (level.mode === 'caseMatch') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <CaseMatch letters={level.letters} onComplete={() => { addScore(30); completeLevel(); }} />
        </div>
      );
    }

    // Phonics
    if (level.mode === 'phonics') {
      return (
        <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col items-center p-4 md:p-8`}>
          <ConfettiEffect show={confetti} />
          <Header />
          <PhonicsGame letters={level.letters} onComplete={() => { addScore(40); completeLevel(); }} />
        </div>
      );
    }
  }

  return null;
}

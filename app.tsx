import React, { useState, useEffect, useCallback, useRef } from 'react';

type LetterKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type LetterInfo = { word: string; emoji: string; color: string };

const letterData: Record<LetterKey, LetterInfo> = {
  A: { word: 'Apple', emoji: '🍎', color: '#FF6B6B' },
  B: { word: 'Ball', emoji: '⚽', color: '#4ECDC4' },
  C: { word: 'Cat', emoji: '🐱', color: '#FFE66D' },
  D: { word: 'Dog', emoji: '🐕', color: '#95E1D3' },
  E: { word: 'Elephant', emoji: '🐘', color: '#DDA0DD' },
  F: { word: 'Fish', emoji: '🐟', color: '#87CEEB' },
  G: { word: 'Grapes', emoji: '🍇', color: '#9B59B6' },
  H: { word: 'House', emoji: '🏠', color: '#F39C12' },
  I: { word: 'Ice cream', emoji: '🍦', color: '#FFEAA7' },
  J: { word: 'Juice', emoji: '🧃', color: '#E17055' },
  K: { word: 'Kite', emoji: '🪁', color: '#00CEC9' },
  L: { word: 'Lion', emoji: '🦁', color: '#FDCB6E' },
  M: { word: 'Moon', emoji: '🌙', color: '#A29BFE' },
  N: { word: 'Nest', emoji: '🪺', color: '#D4A574' },
  O: { word: 'Orange', emoji: '🍊', color: '#FF7F50' },
  P: { word: 'Penguin', emoji: '🐧', color: '#74B9FF' },
  Q: { word: 'Queen', emoji: '👸', color: '#E056FD' },
  R: { word: 'Rainbow', emoji: '🌈', color: '#FF6B6B' },
  S: { word: 'Sun', emoji: '☀️', color: '#FFD93D' },
  T: { word: 'Tree', emoji: '🌳', color: '#6BCB77' },
  U: { word: 'Umbrella', emoji: '☂️', color: '#4D96FF' },
  V: { word: 'Violin', emoji: '🎻', color: '#C9485B' },
  W: { word: 'Whale', emoji: '🐋', color: '#5F9EA0' },
  X: { word: 'Xylophone', emoji: '🎵', color: '#FF69B4' },
  Y: { word: 'Yak', emoji: '🦬', color: '#8B4513' },
  Z: { word: 'Zebra', emoji: '🦓', color: '#2C3E50' }
};

// Dot positions for each letter (x, y as percentages of canvas)
const letterDots = {
  A: [{ x: 50, y: 10 }, { x: 25, y: 90 }, { x: 50, y: 10 }, { x: 75, y: 90 }, { x: 35, y: 55 }, { x: 65, y: 55 }],
  B: [{ x: 25, y: 10 }, { x: 25, y: 90 }, { x: 25, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 60, y: 45 }, { x: 25, y: 50 }, { x: 65, y: 50 }, { x: 75, y: 70 }, { x: 60, y: 90 }, { x: 25, y: 90 }],
  C: [{ x: 75, y: 25 }, { x: 50, y: 10 }, { x: 25, y: 30 }, { x: 20, y: 50 }, { x: 25, y: 70 }, { x: 50, y: 90 }, { x: 75, y: 75 }],
  D: [{ x: 25, y: 10 }, { x: 25, y: 90 }, { x: 25, y: 10 }, { x: 55, y: 10 }, { x: 75, y: 30 }, { x: 75, y: 70 }, { x: 55, y: 90 }, { x: 25, y: 90 }],
  E: [{ x: 70, y: 10 }, { x: 25, y: 10 }, { x: 25, y: 50 }, { x: 60, y: 50 }, { x: 25, y: 50 }, { x: 25, y: 90 }, { x: 70, y: 90 }],
  F: [{ x: 70, y: 10 }, { x: 25, y: 10 }, { x: 25, y: 50 }, { x: 55, y: 50 }, { x: 25, y: 50 }, { x: 25, y: 90 }],
  G: [{ x: 70, y: 25 }, { x: 50, y: 10 }, { x: 25, y: 30 }, { x: 20, y: 50 }, { x: 25, y: 70 }, { x: 50, y: 90 }, { x: 70, y: 75 }, { x: 70, y: 55 }, { x: 50, y: 55 }],
  H: [{ x: 25, y: 10 }, { x: 25, y: 90 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 75, y: 10 }, { x: 75, y: 90 }],
  I: [{ x: 35, y: 10 }, { x: 65, y: 10 }, { x: 50, y: 10 }, { x: 50, y: 90 }, { x: 35, y: 90 }, { x: 65, y: 90 }],
  J: [{ x: 35, y: 10 }, { x: 65, y: 10 }, { x: 55, y: 10 }, { x: 55, y: 70 }, { x: 45, y: 90 }, { x: 25, y: 80 }],
  K: [{ x: 25, y: 10 }, { x: 25, y: 90 }, { x: 25, y: 55 }, { x: 70, y: 10 }, { x: 25, y: 55 }, { x: 70, y: 90 }],
  L: [{ x: 25, y: 10 }, { x: 25, y: 90 }, { x: 70, y: 90 }],
  M: [{ x: 15, y: 90 }, { x: 15, y: 10 }, { x: 50, y: 55 }, { x: 85, y: 10 }, { x: 85, y: 90 }],
  N: [{ x: 25, y: 90 }, { x: 25, y: 10 }, { x: 75, y: 90 }, { x: 75, y: 10 }],
  O: [{ x: 50, y: 10 }, { x: 25, y: 25 }, { x: 20, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 90 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 10 }],
  P: [{ x: 25, y: 90 }, { x: 25, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 60, y: 45 }, { x: 25, y: 50 }],
  Q: [{ x: 50, y: 10 }, { x: 25, y: 25 }, { x: 20, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 90 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 10 }, { x: 60, y: 70 }, { x: 80, y: 95 }],
  R: [{ x: 25, y: 90 }, { x: 25, y: 10 }, { x: 60, y: 10 }, { x: 70, y: 25 }, { x: 60, y: 45 }, { x: 25, y: 50 }, { x: 50, y: 50 }, { x: 75, y: 90 }],
  S: [{ x: 70, y: 20 }, { x: 50, y: 10 }, { x: 30, y: 20 }, { x: 30, y: 35 }, { x: 50, y: 50 }, { x: 70, y: 65 }, { x: 70, y: 80 }, { x: 50, y: 90 }, { x: 30, y: 80 }],
  T: [{ x: 20, y: 10 }, { x: 80, y: 10 }, { x: 50, y: 10 }, { x: 50, y: 90 }],
  U: [{ x: 25, y: 10 }, { x: 25, y: 70 }, { x: 35, y: 85 }, { x: 50, y: 90 }, { x: 65, y: 85 }, { x: 75, y: 70 }, { x: 75, y: 10 }],
  V: [{ x: 20, y: 10 }, { x: 50, y: 90 }, { x: 80, y: 10 }],
  W: [{ x: 10, y: 10 }, { x: 25, y: 90 }, { x: 50, y: 50 }, { x: 75, y: 90 }, { x: 90, y: 10 }],
  X: [{ x: 20, y: 10 }, { x: 80, y: 90 }, { x: 50, y: 50 }, { x: 80, y: 10 }, { x: 20, y: 90 }],
  Y: [{ x: 20, y: 10 }, { x: 50, y: 50 }, { x: 80, y: 10 }, { x: 50, y: 50 }, { x: 50, y: 90 }],
  Z: [{ x: 20, y: 10 }, { x: 80, y: 10 }, { x: 20, y: 90 }, { x: 80, y: 90 }]
};

const levels = [
  { name: 'Meet the Letters', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'learn', icon: '👋' },
  { name: 'Write A-E', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'write', icon: '✏️' },
  { name: 'Find the Letter', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'find', icon: '🔍' },
  { name: 'More Friends', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'learn', icon: '🌟' },
  { name: 'Write F-J', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'write', icon: '✏️' },
  { name: 'Letter Hunt', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'find', icon: '🎯' },
  { name: 'Keep Going', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'learn', icon: '🚀' },
  { name: 'Write K-O', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'write', icon: '✏️' },
  { name: 'Match Time', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'match', icon: '🧩' },
  { name: 'Almost There', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'learn', icon: '⭐' },
  { name: 'Write P-T', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'write', icon: '✏️' },
  { name: 'Picture Match', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'match', icon: '🖼️' },
  { name: 'Final Letters', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'learn', icon: '🎉' },
  { name: 'Write U-Z', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'write', icon: '✏️' },
  { name: 'Last Challenge', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'find', icon: '🏆' },
  { name: 'All Letters Review', letters: Object.keys(letterData), mode: 'review', icon: '📚' },
  { name: 'Grand Finale', letters: Object.keys(letterData), mode: 'match', icon: '👑' }
];

const speakLetter = (letter, word) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u1 = new SpeechSynthesisUtterance(letter.toLowerCase());
    u1.rate = 0.7;
    u1.pitch = 1.2;
    window.speechSynthesis.speak(u1);
    setTimeout(() => {
      const u2 = new SpeechSynthesisUtterance(`is for ${word}`);
      u2.rate = 0.8;
      window.speechSynthesis.speak(u2);
    }, 600);
  }
};

const celebrate = () => {
  if ('speechSynthesis' in window) {
    const phrases = ['Great job!', 'Wonderful!', 'You did it!', 'Amazing!', 'Super star!'];
    const u = new SpeechSynthesisUtterance(phrases[Math.floor(Math.random() * phrases.length)]);
    u.pitch = 1.3;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }
};

const ConfettiEffect = ({ show }) => {
  if (!show) return null;
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#FF69B4'][Math.floor(Math.random() * 5)]
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map(c => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            backgroundColor: c.color,
            animation: `fall 2s ease-in ${c.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const ConnectDots = ({ letter, color, onComplete }) => {
  const [connectedDots, setConnectedDots] = useState([]);
  const [lines, setLines] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const dots = letterDots[letter] || [];

  // Responsive size - bigger on iPad
  const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 768;
  const size = isLargeScreen ? 450 : 280;
  const dotSize = isLargeScreen ? 60 : 44;
  const nextDotSize = isLargeScreen ? 75 : 55;

  const getPos = (dot) => ({ x: (dot.x / 100) * size, y: (dot.y / 100) * size });

  const handleDotClick = (index) => {
    if (isComplete) return;
    if (index === connectedDots.length) {
      const newConnected = [...connectedDots, index];
      setConnectedDots(newConnected);

      if (newConnected.length > 1) {
        const from = getPos(dots[newConnected[newConnected.length - 2]]);
        const to = getPos(dots[index]);
        setLines([...lines, { from, to }]);
      }

      if (newConnected.length === dots.length) {
        setIsComplete(true);
        setTimeout(() => {
          celebrate();
          speakLetter(letter, letterData[letter].word);
          onComplete();
        }, 500);
      }
    }
  };

  const resetDrawing = () => {
    setConnectedDots([]);
    setLines([]);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative bg-white rounded-3xl shadow-2xl"
        style={{ width: size + 40, height: size + 40, padding: 20 }}
      >
        {/* Lines SVG */}
        <svg
          width={size}
          height={size}
          className="absolute"
          style={{ top: 20, left: 20 }}
        >
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke={color}
              strokeWidth={isLargeScreen ? 8 : 6}
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Background letter guide */}
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{ width: size, height: size, top: 20, left: 20, opacity: 0.08 }}
        >
          <span className="font-bold" style={{ fontSize: size * 0.85, color }}>{letter}</span>
        </div>

        {/* Dots */}
        <div className="absolute" style={{ width: size, height: size, top: 20, left: 20 }}>
          {dots.map((dot, i) => {
            const pos = getPos(dot);
            const isConnected = connectedDots.includes(i);
            const isNext = i === connectedDots.length && !isComplete;
            const currentSize = isNext ? nextDotSize : dotSize;
            return (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`absolute rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                  isConnected
                    ? 'scale-90'
                    : isNext
                    ? 'animate-pulse ring-4 ring-yellow-400 shadow-lg'
                    : ''
                }`}
                style={{
                  left: pos.x - currentSize / 2,
                  top: pos.y - currentSize / 2,
                  width: currentSize,
                  height: currentSize,
                  backgroundColor: isConnected ? '#10B981' : isNext ? color : color + 'AA',
                  fontSize: isLargeScreen ? (isNext ? '24px' : '20px') : (isNext ? '18px' : '14px'),
                  boxShadow: isNext ? '0 0 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                {isConnected ? '✓' : i + 1}
              </button>
            );
          })}
        </div>

        {/* Completion overlay */}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl">
            <div className="text-center">
              <div className="text-6xl md:text-8xl mb-2">🎉</div>
              <p className="text-2xl md:text-3xl font-bold text-green-500">Perfect!</p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={resetDrawing}
        className="mt-4 md:mt-6 px-6 py-3 md:px-8 md:py-4 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700 text-lg md:text-xl active:scale-95 transition-all"
      >
        🔄 Start Over
      </button>

      {!isComplete && (
        <p className="mt-3 text-gray-500 text-lg md:text-xl text-center">
          Tap dot <span className="font-bold text-xl md:text-2xl" style={{ color }}>{connectedDots.length + 1}</span> next!
        </p>
      )}
    </div>
  );
};

const LetterCard = ({ letter, data, onClick, size = 'large', showWord = true }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center ${size === 'large' ? 'p-8 md:p-12' : 'p-4 md:p-6'}`}
    style={{ backgroundColor: data.color + '30', border: `4px solid ${data.color}` }}
  >
    <span className={size === 'large' ? 'text-7xl md:text-9xl font-bold' : 'text-4xl md:text-6xl font-bold'} style={{ color: data.color }}>
      {letter}
    </span>
    <span className={size === 'large' ? 'text-6xl md:text-8xl my-2 md:my-4' : 'text-3xl md:text-5xl my-1 md:my-2'}>{data.emoji}</span>
    {showWord && <span className={`font-semibold ${size === 'large' ? 'text-xl md:text-3xl' : 'text-sm md:text-xl'}`} style={{ color: data.color }}>{data.word}</span>}
  </div>
);

type MatchItem = {
  type: 'letter' | 'emoji';
  value: string;
  letter: LetterKey;
  id: string;
};

export default function AlphabetAdventure() {
  const [screen, setScreen] = useState('home');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [learnIndex, setLearnIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetLetter, setTargetLetter] = useState<LetterKey>('A');
  const [options, setOptions] = useState<LetterKey[]>([]);
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [matchPairs, setMatchPairs] = useState<MatchItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const level = levels[currentLevel];

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const setupFindGame = useCallback(() => {
    const letters = level.letters as LetterKey[];
    const target = letters[Math.floor(Math.random() * letters.length)];
    const allLetters = Object.keys(letterData) as LetterKey[];
    const wrong = allLetters.filter(l => l !== target);
    const opts = shuffle<LetterKey>([target, ...shuffle(wrong).slice(0, 3)]);
    setTargetLetter(target);
    setOptions(opts);
    setFeedback('');
  }, [level]);

  const setupMatchGame = useCallback(() => {
    const letters = shuffle(level.letters as LetterKey[]).slice(0, 4);
    const pairs: MatchItem[] = shuffle([
      ...letters.map(l => ({ type: 'letter' as const, value: l, letter: l, id: `l-${l}` })),
      ...letters.map(l => ({ type: 'emoji' as const, value: letterData[l].emoji, letter: l, id: `e-${l}` }))
    ]);
    setMatchPairs(pairs);
    setSelectedMatch(null);
    setMatchedPairs([]);
    setFeedback('');
  }, [level]);

  useEffect(() => {
    if (screen === 'play') {
      if (level.mode === 'find') setupFindGame();
      else if (level.mode === 'match') setupMatchGame();
      else if (level.mode === 'review') setupFindGame();
    }
  }, [screen, currentLevel, setupFindGame, setupMatchGame, level]);

  const handleLearnNext = () => {
    const letter = level.letters[learnIndex] as LetterKey;
    speakLetter(letter, letterData[letter].word);
    if (learnIndex < level.letters.length - 1) {
      setTimeout(() => setLearnIndex(learnIndex + 1), 2000);
    } else {
      setTimeout(() => {
        setShowConfetti(true);
        celebrate();
        setTimeout(() => {
          setShowConfetti(false);
          setCompletedLevels([...completedLevels, currentLevel]);
          setScreen('levelComplete');
        }, 2000);
      }, 2000);
    }
  };

  const handleFindAnswer = (letter) => {
    if (letter === targetLetter) {
      setScore(score + 10);
      setFeedback('🎉 Correct!');
      celebrate();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
      if (questionsAnswered + 1 >= 5) {
        setTimeout(() => {
          setQuestionsAnswered(0);
          setCompletedLevels([...completedLevels, currentLevel]);
          setScreen('levelComplete');
        }, 1500);
      } else {
        setQuestionsAnswered(questionsAnswered + 1);
        setTimeout(setupFindGame, 1500);
      }
    } else {
      setFeedback('Try again! 💪');
      setTimeout(() => setFeedback(''), 1000);
    }
  };

  const handleMatchSelect = (item) => {
    if (matchedPairs.includes(item.id)) return;
    if (!selectedMatch) {
      setSelectedMatch(item);
    } else {
      const match = (selectedMatch.type === 'letter' && item.type === 'emoji' && item.letter === selectedMatch.value) ||
                    (selectedMatch.type === 'emoji' && item.type === 'letter' && selectedMatch.letter === item.value);
      if (match) {
        const newMatched = [...matchedPairs, selectedMatch.id, item.id];
        setMatchedPairs(newMatched);
        setScore(score + 15);
        celebrate();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
        if (newMatched.length === matchPairs.length) {
          setTimeout(() => {
            setCompletedLevels([...completedLevels, currentLevel]);
            setScreen('levelComplete');
          }, 1500);
        }
      } else {
        setFeedback('Try again! 💪');
        setTimeout(() => setFeedback(''), 800);
      }
      setSelectedMatch(null);
    }
  };

  const startLevel = (idx) => {
    setCurrentLevel(idx);
    setLearnIndex(0);
    setQuestionsAnswered(0);
    setScreen('play');
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      startLevel(currentLevel + 1);
    } else {
      setScreen('complete');
    }
  };

  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-100 to-pink-200 p-4 md:p-8 flex flex-col items-center">
        <ConfettiEffect show={showConfetti} />
        <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 md:mb-4 text-center">🌈 Alphabet Adventure 🌈</h1>
        <p className="text-lg md:text-2xl text-gray-600 mb-4 md:mb-8">Learn your ABCs!</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 w-full max-w-md md:max-w-4xl">
          {levels.map((lvl, idx) => (
            <button
              key={idx}
              onClick={() => startLevel(idx)}
              disabled={idx > 0 && !completedLevels.includes(idx - 1)}
              className={`p-4 md:p-6 rounded-2xl md:rounded-3xl font-bold text-white shadow-lg transform transition-all active:scale-95 ${
                completedLevels.includes(idx)
                  ? 'bg-green-400'
                  : idx === 0 || completedLevels.includes(idx - 1)
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="text-3xl md:text-5xl">{lvl.icon}</span>
              <p className="text-sm md:text-lg mt-1 md:mt-2">{lvl.name}</p>
              {completedLevels.includes(idx) && <span className="text-sm md:text-lg">✓</span>}
            </button>
          ))}
        </div>
        <div className="mt-4 md:mt-8 bg-white/80 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
          <p className="text-purple-600 font-bold text-lg md:text-2xl">⭐ Score: {score}</p>
        </div>
      </div>
    );
  }

  if (screen === 'levelComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-100 to-pink-200 flex flex-col items-center justify-center p-4 md:p-8">
        <ConfettiEffect show={true} />
        <div className="text-8xl md:text-[10rem] mb-4 md:mb-8">🎉</div>
        <h1 className="text-3xl md:text-5xl font-bold text-orange-500 mb-2 md:mb-4">Level Complete!</h1>
        <p className="text-xl md:text-3xl text-gray-600 mb-4 md:mb-6">{level.name}</p>
        <p className="text-2xl md:text-4xl font-bold text-purple-600 mb-6 md:mb-10">Score: {score}</p>
        <div className="flex gap-4 md:gap-8">
          <button onClick={() => setScreen('home')} className="px-6 py-3 md:px-10 md:py-5 bg-gray-400 text-white rounded-full font-bold text-lg md:text-2xl active:scale-95 transition-transform">
            🏠 Home
          </button>
          <button onClick={nextLevel} className="px-6 py-3 md:px-10 md:py-5 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold text-lg md:text-2xl active:scale-95 transition-transform">
            {currentLevel < levels.length - 1 ? '➡️ Next Level' : '🏆 Finish'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-pink-200 to-purple-300 flex flex-col items-center justify-center p-4 md:p-8">
        <ConfettiEffect show={true} />
        <div className="text-8xl md:text-[10rem] mb-4 md:mb-8">👑</div>
        <h1 className="text-4xl md:text-6xl font-bold text-purple-600 mb-2 md:mb-4">You're an ABC Champion!</h1>
        <p className="text-xl md:text-3xl text-gray-600 mb-4 md:mb-8">You learned all 26 letters!</p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-md md:max-w-2xl mb-6 md:mb-10">
          {Object.keys(letterData).map(l => (
            <span key={l} className="text-2xl md:text-4xl font-bold" style={{ color: letterData[l].color }}>{l}</span>
          ))}
        </div>
        <p className="text-3xl md:text-5xl font-bold text-orange-500 mb-6 md:mb-10">Final Score: {score}</p>
        <button onClick={() => { setScreen('home'); setCurrentLevel(0); setCompletedLevels([]); setScore(0); }} className="px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl md:text-3xl active:scale-95 transition-transform">
          🔄 Play Again
        </button>
      </div>
    );
  }

  if (screen === 'play') {
    const currentLetter = level.letters[learnIndex];
    const currentData = letterData[currentLetter];

    if (level.mode === 'learn') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-200 via-blue-100 to-purple-200 flex flex-col items-center p-4 md:p-8">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md md:max-w-2xl mb-4 md:mb-8">
            <button onClick={() => setScreen('home')} className="text-2xl md:text-4xl active:scale-95 transition-transform p-2">🏠</button>
            <p className="text-lg md:text-2xl font-bold text-purple-600">{level.name}</p>
            <p className="text-lg md:text-2xl font-bold text-orange-500">⭐{score}</p>
          </div>
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-8">
            {level.letters.map((l, i) => (
              <div key={l} className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl font-bold ${i <= learnIndex ? 'bg-green-400 text-white' : 'bg-gray-200'}`}>
                {l}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <LetterCard letter={currentLetter} data={currentData} onClick={handleLearnNext} />
            <p className="mt-6 md:mt-10 text-xl md:text-3xl text-gray-600">Tap to hear the letter!</p>
          </div>
        </div>
      );
    }

    if (level.mode === 'find' || level.mode === 'review') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-200 via-yellow-100 to-green-200 flex flex-col items-center p-4 md:p-8">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md md:max-w-2xl mb-4 md:mb-8">
            <button onClick={() => setScreen('home')} className="text-2xl md:text-4xl active:scale-95 transition-transform p-2">🏠</button>
            <p className="text-lg md:text-2xl font-bold text-purple-600">{level.name}</p>
            <p className="text-lg md:text-2xl font-bold text-orange-500">⭐{score}</p>
          </div>
          <div className="text-center mb-4 md:mb-8">
            <p className="text-xl md:text-3xl text-gray-600">Find the letter for:</p>
            <div className="text-7xl md:text-9xl my-2 md:my-6">{letterData[targetLetter].emoji}</div>
            <p className="text-2xl md:text-4xl font-bold text-purple-600">{letterData[targetLetter].word}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-sm md:max-w-xl">
            {options.map(l => (
              <button
                key={l}
                onClick={() => handleFindAnswer(l)}
                className="p-6 md:p-10 rounded-2xl md:rounded-3xl text-5xl md:text-7xl font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: letterData[l].color + '40', border: `3px solid ${letterData[l].color}`, color: letterData[l].color }}
              >
                {l}
              </button>
            ))}
          </div>
          {feedback && <p className="text-2xl md:text-4xl font-bold mt-4 md:mt-8 animate-bounce">{feedback}</p>}
          <p className="mt-4 md:mt-8 text-gray-500 text-lg md:text-2xl">{questionsAnswered}/5 correct</p>
        </div>
      );
    }

    if (level.mode === 'match') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-100 to-blue-200 flex flex-col items-center p-4 md:p-8">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md md:max-w-2xl mb-4 md:mb-8">
            <button onClick={() => setScreen('home')} className="text-2xl md:text-4xl active:scale-95 transition-transform p-2">🏠</button>
            <p className="text-lg md:text-2xl font-bold text-purple-600">{level.name}</p>
            <p className="text-lg md:text-2xl font-bold text-orange-500">⭐{score}</p>
          </div>
          <p className="text-xl md:text-3xl text-gray-600 mb-4 md:mb-8">Match letters with pictures!</p>
          <div className="grid grid-cols-4 gap-3 md:gap-6 w-full max-w-md md:max-w-2xl">
            {matchPairs.map(item => {
              const isMatched = matchedPairs.includes(item.id);
              const isSelected = selectedMatch?.id === item.id;
              const letter = item.type === 'letter' ? item.value : item.letter;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMatchSelect(item)}
                  className={`p-4 md:p-8 rounded-xl md:rounded-2xl text-3xl md:text-5xl font-bold shadow-lg transition-all active:scale-95 ${
                    isMatched ? 'opacity-30' : isSelected ? 'ring-4 md:ring-8 ring-yellow-400 scale-105' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: letterData[letter].color + '40', border: `2px solid ${letterData[letter].color}` }}
                  disabled={isMatched}
                >
                  {item.type === 'letter' ? item.value : item.value}
                </button>
              );
            })}
          </div>
          {feedback && <p className="text-2xl md:text-4xl font-bold mt-4 md:mt-8 animate-bounce">{feedback}</p>}
          <p className="mt-4 md:mt-8 text-gray-500 text-lg md:text-2xl">{matchedPairs.length / 2}/{matchPairs.length / 2} matched</p>
        </div>
      );
    }

    if (level.mode === 'write') {
      const handleWriteComplete = () => {
        setScore(score + 20);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);

        if (learnIndex < level.letters.length - 1) {
          setTimeout(() => setLearnIndex(learnIndex + 1), 1500);
        } else {
          setTimeout(() => {
            setCompletedLevels([...completedLevels, currentLevel]);
            setScreen('levelComplete');
          }, 2000);
        }
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-200 via-teal-100 to-green-200 flex flex-col items-center p-4 md:p-8">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md md:max-w-2xl mb-4 md:mb-6">
            <button onClick={() => setScreen('home')} className="text-2xl md:text-4xl active:scale-95 transition-transform p-2">🏠</button>
            <p className="text-lg md:text-2xl font-bold text-teal-600">{level.name}</p>
            <p className="text-lg md:text-2xl font-bold text-orange-500">⭐{score}</p>
          </div>
          <div className="flex gap-2 md:gap-4 mb-4">
            {level.letters.map((l, i) => (
              <div key={l} className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-xl font-bold ${i < learnIndex ? 'bg-green-400 text-white' : i === learnIndex ? 'bg-teal-500 text-white ring-4 ring-yellow-300' : 'bg-gray-200'}`}>
                {i < learnIndex ? '✓' : l}
              </div>
            ))}
          </div>
          <div className="text-center mb-4">
            <p className="text-xl md:text-2xl text-gray-600">Connect the dots to write:</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-5xl md:text-7xl font-bold" style={{ color: currentData.color }}>{currentLetter}</span>
              <span className="text-4xl md:text-6xl">{currentData.emoji}</span>
            </div>
          </div>
          <ConnectDots
            key={currentLetter}
            letter={currentLetter}
            color={currentData.color}
            onComplete={handleWriteComplete}
          />
        </div>
      );
    }
  }

  return null;
}
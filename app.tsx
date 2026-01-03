import React, { useState, useEffect, useCallback } from 'react';

const letterData = {
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

const levels = [
  { name: 'Meet the Letters', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'learn', icon: '👋' },
  { name: 'Find the Letter', letters: ['A', 'B', 'C', 'D', 'E'], mode: 'find', icon: '🔍' },
  { name: 'More Friends', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'learn', icon: '🌟' },
  { name: 'Letter Hunt', letters: ['F', 'G', 'H', 'I', 'J'], mode: 'find', icon: '🎯' },
  { name: 'Keep Going', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'learn', icon: '🚀' },
  { name: 'Match Time', letters: ['K', 'L', 'M', 'N', 'O'], mode: 'match', icon: '🧩' },
  { name: 'Almost There', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'learn', icon: '⭐' },
  { name: 'Picture Match', letters: ['P', 'Q', 'R', 'S', 'T'], mode: 'match', icon: '🖼️' },
  { name: 'Final Letters', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'learn', icon: '🎉' },
  { name: 'Last Challenge', letters: ['U', 'V', 'W', 'X', 'Y', 'Z'], mode: 'find', icon: '🏆' },
  { name: 'All Letters Review', letters: Object.keys(letterData), mode: 'review', icon: '📚' },
  { name: 'Grand Finale', letters: Object.keys(letterData), mode: 'match', icon: '👑' }
];

const speakLetter = (letter, word) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u1 = new SpeechSynthesisUtterance(letter);
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

const LetterCard = ({ letter, data, onClick, size = 'large', showWord = true }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center ${size === 'large' ? 'p-6' : 'p-3'}`}
    style={{ backgroundColor: data.color + '30', border: `4px solid ${data.color}` }}
  >
    <span className={size === 'large' ? 'text-7xl font-bold' : 'text-4xl font-bold'} style={{ color: data.color }}>
      {letter}
    </span>
    <span className={size === 'large' ? 'text-6xl my-2' : 'text-3xl my-1'}>{data.emoji}</span>
    {showWord && <span className={`font-semibold ${size === 'large' ? 'text-xl' : 'text-sm'}`} style={{ color: data.color }}>{data.word}</span>}
  </div>
);

export default function AlphabetAdventure() {
  const [screen, setScreen] = useState('home');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [learnIndex, setLearnIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [targetLetter, setTargetLetter] = useState('');
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const level = levels[currentLevel];

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const setupFindGame = useCallback(() => {
    const letters = level.letters;
    const target = letters[Math.floor(Math.random() * letters.length)];
    const wrong = Object.keys(letterData).filter(l => l !== target);
    const opts = shuffle([target, ...shuffle(wrong).slice(0, 3)]);
    setTargetLetter(target);
    setOptions(opts);
    setFeedback('');
  }, [level]);

  const setupMatchGame = useCallback(() => {
    const letters = shuffle(level.letters).slice(0, 4);
    const pairs = shuffle([
      ...letters.map(l => ({ type: 'letter', value: l, id: `l-${l}` })),
      ...letters.map(l => ({ type: 'emoji', value: letterData[l].emoji, letter: l, id: `e-${l}` }))
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
    const letter = level.letters[learnIndex];
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
      <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-100 to-pink-200 p-4 flex flex-col items-center">
        <ConfettiEffect show={showConfetti} />
        <h1 className="text-4xl font-bold text-purple-600 mb-2 text-center">🌈 Alphabet Adventure 🌈</h1>
        <p className="text-lg text-gray-600 mb-4">Learn your ABCs!</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {levels.map((lvl, idx) => (
            <button
              key={idx}
              onClick={() => startLevel(idx)}
              disabled={idx > 0 && !completedLevels.includes(idx - 1)}
              className={`p-3 rounded-2xl font-bold text-white shadow-lg transform transition-all ${
                completedLevels.includes(idx)
                  ? 'bg-green-400'
                  : idx === 0 || completedLevels.includes(idx - 1)
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl">{lvl.icon}</span>
              <p className="text-xs mt-1">{lvl.name}</p>
              {completedLevels.includes(idx) && <span className="text-xs">✓</span>}
            </button>
          ))}
        </div>
        <div className="mt-4 bg-white/80 rounded-xl p-3 text-center">
          <p className="text-purple-600 font-bold">⭐ Score: {score}</p>
        </div>
      </div>
    );
  }

  if (screen === 'levelComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-100 to-pink-200 flex flex-col items-center justify-center p-4">
        <ConfettiEffect show={true} />
        <div className="text-8xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-orange-500 mb-2">Level Complete!</h1>
        <p className="text-xl text-gray-600 mb-4">{level.name}</p>
        <p className="text-2xl font-bold text-purple-600 mb-6">Score: {score}</p>
        <div className="flex gap-4">
          <button onClick={() => setScreen('home')} className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold">
            🏠 Home
          </button>
          <button onClick={nextLevel} className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-bold">
            {currentLevel < levels.length - 1 ? '➡️ Next Level' : '🏆 Finish'}
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-pink-200 to-purple-300 flex flex-col items-center justify-center p-4">
        <ConfettiEffect show={true} />
        <div className="text-8xl mb-4">👑</div>
        <h1 className="text-4xl font-bold text-purple-600 mb-2">You're an ABC Champion!</h1>
        <p className="text-xl text-gray-600 mb-4">You learned all 26 letters!</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-md mb-6">
          {Object.keys(letterData).map(l => (
            <span key={l} className="text-2xl font-bold" style={{ color: letterData[l].color }}>{l}</span>
          ))}
        </div>
        <p className="text-3xl font-bold text-orange-500 mb-6">Final Score: {score}</p>
        <button onClick={() => { setScreen('home'); setCurrentLevel(0); setCompletedLevels([]); setScore(0); }} className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl">
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
        <div className="min-h-screen bg-gradient-to-b from-green-200 via-blue-100 to-purple-200 flex flex-col items-center p-4">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md mb-4">
            <button onClick={() => setScreen('home')} className="text-2xl">🏠</button>
            <p className="text-lg font-bold text-purple-600">{level.name}</p>
            <p className="text-lg font-bold text-orange-500">⭐{score}</p>
          </div>
          <div className="flex gap-2 mb-4">
            {level.letters.map((l, i) => (
              <div key={l} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= learnIndex ? 'bg-green-400 text-white' : 'bg-gray-200'}`}>
                {l}
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <LetterCard letter={currentLetter} data={currentData} onClick={handleLearnNext} />
            <p className="mt-6 text-xl text-gray-600">Tap to hear the letter!</p>
          </div>
        </div>
      );
    }

    if (level.mode === 'find' || level.mode === 'review') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-200 via-yellow-100 to-green-200 flex flex-col items-center p-4">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md mb-4">
            <button onClick={() => setScreen('home')} className="text-2xl">🏠</button>
            <p className="text-lg font-bold text-purple-600">{level.name}</p>
            <p className="text-lg font-bold text-orange-500">⭐{score}</p>
          </div>
          <div className="text-center mb-4">
            <p className="text-xl text-gray-600">Find the letter for:</p>
            <div className="text-7xl my-2">{letterData[targetLetter].emoji}</div>
            <p className="text-2xl font-bold text-purple-600">{letterData[targetLetter].word}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {options.map(l => (
              <button
                key={l}
                onClick={() => handleFindAnswer(l)}
                className="p-6 rounded-2xl text-5xl font-bold shadow-lg transform transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: letterData[l].color + '40', border: `3px solid ${letterData[l].color}`, color: letterData[l].color }}
              >
                {l}
              </button>
            ))}
          </div>
          {feedback && <p className="text-2xl font-bold mt-4 animate-bounce">{feedback}</p>}
          <p className="mt-4 text-gray-500">{questionsAnswered}/5 correct</p>
        </div>
      );
    }

    if (level.mode === 'match') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-100 to-blue-200 flex flex-col items-center p-4">
          <ConfettiEffect show={showConfetti} />
          <div className="flex justify-between w-full max-w-md mb-4">
            <button onClick={() => setScreen('home')} className="text-2xl">🏠</button>
            <p className="text-lg font-bold text-purple-600">{level.name}</p>
            <p className="text-lg font-bold text-orange-500">⭐{score}</p>
          </div>
          <p className="text-xl text-gray-600 mb-4">Match letters with pictures!</p>
          <div className="grid grid-cols-4 gap-3 w-full max-w-md">
            {matchPairs.map(item => {
              const isMatched = matchedPairs.includes(item.id);
              const isSelected = selectedMatch?.id === item.id;
              const letter = item.type === 'letter' ? item.value : item.letter;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMatchSelect(item)}
                  className={`p-4 rounded-xl text-3xl font-bold shadow-lg transition-all ${
                    isMatched ? 'opacity-30' : isSelected ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: letterData[letter].color + '40', border: `2px solid ${letterData[letter].color}` }}
                  disabled={isMatched}
                >
                  {item.type === 'letter' ? item.value : item.value}
                </button>
              );
            })}
          </div>
          {feedback && <p className="text-2xl font-bold mt-4 animate-bounce">{feedback}</p>}
          <p className="mt-4 text-gray-500">{matchedPairs.length / 2}/{matchPairs.length / 2} matched</p>
        </div>
      );
    }
  }

  return null;
}
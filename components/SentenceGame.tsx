'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAudio } from '@/hooks/useAudio';

interface SentenceGameProps {
  sentence: string;
  onComplete: (sentence: string) => void;
}

const SentenceGame: React.FC<SentenceGameProps> = ({ sentence, onComplete }) => {
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [sortedWords, setSortedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playSound, speakWord, speakSentence } = useAudio();

  useEffect(() => {
    const words = sentence.split(' ');
    setScrambledWords(words.sort(() => Math.random() - 0.5));
    setSortedWords([]);
    setIsCorrect(false);
    playSound('newSentence');
  }, [sentence, playSound]);

  const moveWord = useCallback((word: string, from: string[], to: string[]) => {
    const newFrom = from.filter(w => w !== word);
    const newTo = [...to, word];
    if (from === scrambledWords) {
      setScrambledWords(newFrom);
      setSortedWords(newTo);
    } else {
      setScrambledWords(newTo);
      setSortedWords(newFrom);
    }
    speakWord(word);
    playSound('wordMove');
    checkSentence(newTo);
  }, [scrambledWords, playSound, speakWord]);

  const checkSentence = useCallback((words: string[]) => {
    const currentSentence = words.join(' ');
    if (currentSentence === sentence) {
      setIsCorrect(true);
      playSound('success');
      speakSentence(sentence);
      setTimeout(() => {
        onComplete(sentence);
      }, 3000);
    }
  }, [sentence, onComplete, playSound, speakSentence]);

  const getWordType = (word: string) => {
    const lowerWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    if (['i', 'you', 'he', 'she', 'it', 'we', 'they', 'the'].includes(lowerWord)) return 'subject';
    if (['like', 'is', 'can', 'help', 'enjoy', 'loves', 'listen', 'studying', 'shining', 'find', 'cooking'].includes(lowerWord)) return 'verb';
    if (['books', 'sun', 'wallet', 'meals', 'music'].includes(lowerWord)) return 'object';
    if (['to', 'in', 'for', 'while'].includes(lowerWord)) return 'preposition';
    if (['brightly'].includes(lowerWord)) return 'adverb';
    if (['free', 'blue', 'lost', 'delicious'].includes(lowerWord)) return 'adjective';
    return 'others';
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">乱序单词：</h3>
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg min-h-[100px]">
          {scrambledWords.map((word, index) => (
            <Button
              key={`scrambled-${index}`}
              variant="outline"
              className={cn(
                "m-1 text-sm",
                getWordType(word) === 'subject' && "bg-yellow-200",
                getWordType(word) === 'verb' && "bg-red-200",
                getWordType(word) === 'object' && "bg-blue-200",
                getWordType(word) === 'preposition' && "bg-green-200",
                getWordType(word) === 'adverb' && "bg-purple-200",
                getWordType(word) === 'adjective' && "bg-pink-200",
                getWordType(word) === 'others' && "bg-gray-200"
              )}
              onClick={() => moveWord(word, scrambledWords, sortedWords)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">你的句子：</h3>
        <div className={cn(
          "flex flex-wrap gap-2 p-4 rounded-lg min-h-[100px]",
          isCorrect ? "bg-green-200" : "bg-green-50"
        )}>
          {sortedWords.map((word, index) => (
            <Button
              key={`sorted-${index}`}
              variant="outline"
              className={cn(
                "m-1 text-sm",
                getWordType(word) === 'subject' && "bg-yellow-200",
                getWordType(word) === 'verb' && "bg-red-200",
                getWordType(word) === 'object' && "bg-blue-200",
                getWordType(word) === 'preposition' && "bg-green-200",
                getWordType(word) === 'adverb' && "bg-purple-200",
                getWordType(word) === 'adjective' && "bg-pink-200",
                getWordType(word) === 'others' && "bg-gray-200"
              )}
              onClick={() => moveWord(word, sortedWords, scrambledWords)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentenceGame;
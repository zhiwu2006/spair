'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SentenceGame from '@/components/SentenceGame';
import { defaultSentences } from '@/lib/sentences';

export default function GamePage() {
  const [sentences, setSentences] = useState(defaultSentences);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedSentences, setCompletedSentences] = useState(new Set());

  const startGame = useCallback(() => {
    setCurrentIndex(0);
    setCompletedSentences(new Set());
  }, []);

  const showNextSentence = useCallback(() => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // Game over logic
    }
  }, [currentIndex, sentences.length]);

  const handleSentenceComplete = useCallback((sentence: string) => {
    setCompletedSentences(prev => new Set(prev).add(sentence));
    showNextSentence();
  }, [showNextSentence]);

  const importFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          if (jsonData.expressions && Array.isArray(jsonData.expressions)) {
            setSentences(jsonData.expressions);
            startGame();
          } else {
            throw new Error('Invalid JSON format');
          }
        } catch (error) {
          alert('Invalid JSON file');
          setSentences(defaultSentences);
          startGame();
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gradient-to-b from-blue-100 to-blue-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">英语句子重组游戏</h1>
      <div className="flex gap-4 mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">导入文件</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>导入文件</DialogTitle>
            </DialogHeader>
            <Input type="file" accept=".json" onChange={importFile} />
          </DialogContent>
        </Dialog>
        <Button onClick={startGame}>开始游戏</Button>
        <Button onClick={() => setSentences(defaultSentences)}>重置游戏</Button>
      </div>
      {sentences.length > 0 && (
        <SentenceGame
          sentence={sentences[currentIndex]}
          onComplete={handleSentenceComplete}
        />
      )}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">已完成的句子：</h2>
        {Array.from(completedSentences).map((sentence, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow mb-2">
            {index + 1}. {sentence}
          </div>
        ))}
      </div>
    </div>
  );
}
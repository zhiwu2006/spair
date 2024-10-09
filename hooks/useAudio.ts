'use client';

import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!synthRef.current) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const playSound = useCallback((type: 'success' | 'newSentence' | 'wordMove' | 'hint') => {
    initAudio();
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    switch (type) {
      case 'success':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
        break;
      case 'newSentence':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(330, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.3);
        break;
      case 'wordMove':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
        break;
      case 'hint':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(165, audioContextRef.current.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContextRef.current.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.3);
        break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
  }, []);

  const speakWord = useCallback((word: string) => {
    initAudio();
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      synthRef.current.speak(utterance);
    }
  }, []);

  const speakSentence = useCallback((sentence: string) => {
    initAudio();
    if (synthRef.current) {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'en-US';
      synthRef.current.speak(utterance);
    }
  }, []);

  return { playSound, speakWord, speakSentence };
};
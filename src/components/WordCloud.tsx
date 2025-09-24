import React, { useEffect, useRef } from 'react';
import { WordFrequency } from '../types';

interface WordCloudProps {
  words: WordFrequency[];
}

export function WordCloud({ words }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getWordSize = (frequency: number, maxFrequency: number) => {
    const minSize = 12;
    const maxSize = 36;
    return minSize + ((frequency / maxFrequency) * (maxSize - minSize));
  };

  const getRandomColor = () => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const maxFrequency = Math.max(...words.map(w => w.frequency));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Word Cloud</h3>
      <div 
        ref={containerRef}
        className="flex flex-wrap items-center justify-center gap-2 min-h-[300px] p-4 bg-gray-50 rounded-lg"
      >
        {words.map((word, index) => (
          <span
            key={`${word.word}-${index}`}
            className="font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-200 px-1"
            style={{
              fontSize: `${getWordSize(word.frequency, maxFrequency)}px`,
              color: getRandomColor(),
              lineHeight: '1.2'
            }}
            title={`${word.word}: ${word.frequency} occurrences`}
          >
            {word.word}
          </span>
        ))}
      </div>
    </div>
  );
}
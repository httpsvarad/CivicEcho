import React from 'react';
import { SentimentDistribution } from '../types';

interface SentimentChartProps {
  distribution: SentimentDistribution;
}

export function SentimentChart({ distribution }: SentimentChartProps) {
  const total = distribution.Positive + distribution.Negative + distribution.Neutral;
  
  const data = [
    { label: 'Positive', count: distribution.Positive, color: 'bg-green-500', percentage: (distribution.Positive / total * 100).toFixed(1) },
    { label: 'Negative', count: distribution.Negative, color: 'bg-red-500', percentage: (distribution.Negative / total * 100).toFixed(1) },
    { label: 'Neutral', count: distribution.Neutral, color: 'bg-gray-500', percentage: (distribution.Neutral / total * 100).toFixed(1) }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Distribution</h3>
      
      {/* Pie Chart Representation */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {data.map((item, index) => {
              const previousPercentages = data.slice(0, index).reduce((sum, d) => sum + parseFloat(d.percentage), 0);
              const strokeDasharray = `${parseFloat(item.percentage) * 2.51} 251`;
              const strokeDashoffset = -previousPercentages * 2.51;
              
              return (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={item.label === 'Positive' ? '#22c55e' : item.label === 'Negative' ? '#ef4444' : '#6b7280'}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{item.count}</span>
              <span className="text-sm font-semibold text-gray-800">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export interface Comment {
  Comment_ID: number;
  Comment: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
  confidence?: number;
  summary?: string;
}

export interface SentimentDistribution {
  Positive: number;
  Negative: number;
  Neutral: number;
}

export interface WordFrequency {
  word: string;
  frequency: number;
}
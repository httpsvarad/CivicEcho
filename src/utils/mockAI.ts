import { Comment, SentimentDistribution, WordFrequency } from '../types';

// Mock sentiment analysis - simulates AI model predictions
export function analyzeSentiment(text: string): { sentiment: 'Positive' | 'Negative' | 'Neutral'; confidence: number } {
  const lowerText = text.toLowerCase();
  
  // Simple keyword-based sentiment analysis for demo
  const positiveWords = ['useful', 'excellent', 'good', 'positive', 'well', 'improve', 'transparency', 'simplify'];
  const negativeWords = ['unclear', 'confusion', 'burden', 'complicate', 'redundant', 'bad', 'problem', 'difficult'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore += 1;
  });
  
  let sentiment: 'Positive' | 'Negative' | 'Neutral';
  let confidence: number;
  
  if (positiveScore > negativeScore) {
    sentiment = 'Positive';
    confidence = Math.min(0.6 + (positiveScore * 0.1), 0.95);
  } else if (negativeScore > positiveScore) {
    sentiment = 'Negative';
    confidence = Math.min(0.6 + (negativeScore * 0.1), 0.95);
  } else {
    sentiment = 'Neutral';
    confidence = 0.5 + Math.random() * 0.3;
  }
  
  return { sentiment, confidence: Math.round(confidence * 100) / 100 };
}

// Mock text summarization
export function generateSummary(text: string): string {
  // Simple extractive summarization for demo
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length === 0) return text;
  if (sentences.length === 1) return sentences[0].trim() + '.';
  
  // Take first sentence and try to make it concise
  let summary = sentences[0].trim();
  
  // Remove common unnecessary phrases
  summary = summary.replace(/^(The|This|It is|Overall|In general|I think|I believe)/i, '');
  summary = summary.replace(/\s+/g, ' ').trim();
  
  // Ensure it ends with punctuation
  if (!summary.match(/[.!?]$/)) {
    summary += '.';
  }
  
  return summary;
}

// Calculate sentiment distribution
export function calculateSentimentDistribution(comments: Comment[]): SentimentDistribution {
  const distribution = { Positive: 0, Negative: 0, Neutral: 0 };
  
  comments.forEach(comment => {
    if (comment.sentiment) {
      distribution[comment.sentiment]++;
    }
  });
  
  return distribution;
}

// Generate word frequency for word cloud
export function generateWordFrequency(comments: Comment[]): WordFrequency[] {
  const words: { [key: string]: number } = {};
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'a', 'an', 'as', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'you', 'your', 'i', 'my', 'me']);
  
  comments.forEach(comment => {
    const text = comment.Comment.toLowerCase();
    const wordArray = text.match(/\b[a-z]+\b/g) || [];
    
    wordArray.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        words[word] = (words[word] || 0) + 1;
      }
    });
  });
  
  return Object.entries(words)
    .map(([word, frequency]) => ({ word, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 50);
}

// Generate overall summary of all comments
export function generateOverallSummary(comments: Comment[]): {
  summary: string;
  keyThemes: string[];
  totalComments: number;
  averageLength: number;
  topConcerns: string[];
  recommendations: string[];
} {
  const totalComments = comments.length;
  const averageLength = Math.round(
    comments.reduce((sum, comment) => sum + comment.Comment.length, 0) / totalComments
  );
  
  // Extract key themes based on word frequency
  const wordFreq = generateWordFrequency(comments);
  const keyThemes = wordFreq.slice(0, 5).map(w => w.word);
  
  // Identify top concerns (negative sentiment comments)
  const negativeComments = comments.filter(c => c.sentiment === 'Negative');
  const topConcerns = [
    'Clarity and understanding issues',
    'Implementation complexity',
    'Compliance burden concerns',
    'Missing guidelines and details'
  ];
  
  // Generate recommendations based on sentiment distribution
  const sentimentDist = calculateSentimentDistribution(comments);
  const recommendations = [];
  
  if (sentimentDist.Negative > sentimentDist.Positive * 0.3) {
    recommendations.push('Address clarity concerns in key provisions');
  }
  if (keyThemes.includes('burden') || keyThemes.includes('complicate')) {
    recommendations.push('Simplify implementation procedures');
  }
  if (keyThemes.includes('guidelines') || keyThemes.includes('clarification')) {
    recommendations.push('Provide detailed implementation guidelines');
  }
  recommendations.push('Engage stakeholders for further consultation');
  
  // Generate overall summary text
  const positivePercentage = Math.round((sentimentDist.Positive / totalComments) * 100);
  const negativePercentage = Math.round((sentimentDist.Negative / totalComments) * 100);
  
  let summary = `Analysis of ${totalComments} stakeholder comments reveals `;
  
  if (positivePercentage > negativePercentage) {
    summary += `generally positive reception (${positivePercentage}% positive vs ${negativePercentage}% negative). `;
  } else if (negativePercentage > positivePercentage) {
    summary += `mixed reception with significant concerns (${negativePercentage}% negative vs ${positivePercentage}% positive). `;
  } else {
    summary += `balanced feedback with equal positive and negative sentiments. `;
  }
  
  summary += `Key themes include ${keyThemes.slice(0, 3).join(', ')}. `;
  
  if (negativeComments.length > 0) {
    summary += `Main concerns focus on clarity, implementation complexity, and compliance requirements. `;
  }
  
  summary += `Recommendations include addressing stakeholder concerns and providing clearer implementation guidance.`;
  
  return {
    summary,
    keyThemes,
    totalComments,
    averageLength,
    topConcerns: topConcerns.slice(0, 4),
    recommendations: recommendations.slice(0, 4)
  };
}
import React, { useState, useCallback } from 'react';
import { Upload, BarChart3, FileText, Cloud, Brain } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { SentimentChart } from './components/SentimentChart';
import { WordCloud } from './components/WordCloud';
import { TabNavigation } from './components/TabNavigation';
import { Comment, SentimentDistribution } from './types';
import { parseCSV, mockData } from './utils/csvParser';
import { 
  analyzeSentiment, 
  generateSummary, 
  calculateSentimentDistribution, 
  generateWordFrequency 
} from './utils/mockAI';

const tabs = [
  { id: 'upload', name: 'Upload & Preview', icon: <Upload className="w-4 h-4" /> },
  { id: 'sentiment', name: 'Sentiment Analysis', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'summaries', name: 'Comment Summaries', icon: <FileText className="w-4 h-4" /> },
  { id: 'wordcloud', name: 'Word Cloud', icon: <Cloud className="w-4 h-4" /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [comments, setComments] = useState<Comment[]>(mockData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const processComments = useCallback(async (commentsData: Comment[]) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    const processedComments = commentsData.map((comment, index) => {
      setTimeout(() => {
        const sentiment = analyzeSentiment(comment.Comment);
        const summary = generateSummary(comment.Comment);
        
        setComments(prev => prev.map(c => 
          c.Comment_ID === comment.Comment_ID 
            ? { ...c, sentiment: sentiment.sentiment, confidence: sentiment.confidence, summary }
            : c
        ));
      }, index * 100); // Stagger processing for realistic effect
      
      return comment;
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, commentsData.length * 100 + 500);
    
    return processedComments;
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const parsedComments = parseCSV(text);
      
      if (parsedComments.length === 0) {
        throw new Error('No valid data found in CSV file');
      }
      
      setComments(parsedComments);
      setHasUploadedFile(true);
      await processComments(parsedComments);
      setActiveTab('sentiment');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the CSV format.');
      setIsProcessing(false);
    }
  }, [processComments]);

  const handleUseMockData = useCallback(() => {
    setComments(mockData);
    setHasUploadedFile(false);
    processComments(mockData);
    setActiveTab('sentiment');
  }, [processComments]);

  const sentimentDistribution: SentimentDistribution = calculateSentimentDistribution(comments);
  const wordFrequency = generateWordFrequency(comments);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="./assets/logo2.png" alt="CivicEcho" className="h-8" />
              {/* <h1 className="text-xl font-bold text-gray-900">
                CivicEcho
              </h1> */}
            </div>
            <div className="text-sm text-gray-500">
              {comments.length} comments loaded
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="space-y-6">
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <FileUpload onFileUpload={handleFileUpload} isUploading={isProcessing} />
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">Or use sample data to explore the dashboard</p>
                <button
                  onClick={handleUseMockData}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  disabled={isProcessing}
                >
                  Load Sample Data
                </button>
              </div>

              {comments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Preview</h3>
                  <DataTable comments={comments.slice(0, 5)} />
                  {comments.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Showing first 5 of {comments.length} comments
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sentiment' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentChart distribution={sentimentDistribution} />
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Comments:</span>
                      <span className="font-semibold">{comments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Most Common Sentiment:</span>
                      <span className="font-semibold text-green-600">
                        {sentimentDistribution.Positive >= Math.max(sentimentDistribution.Negative, sentimentDistribution.Neutral) ? 'Positive' :
                         sentimentDistribution.Negative >= sentimentDistribution.Neutral ? 'Negative' : 'Neutral'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Status:</span>
                      <span className={`font-semibold ${isProcessing ? 'text-yellow-600' : 'text-green-600'}`}>
                        {isProcessing ? 'Processing...' : 'Complete'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <DataTable comments={comments} />
              </div>
            </div>
          )}

          {activeTab === 'summaries' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Comment Summaries</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.Comment_ID} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Comment #{comment.Comment_ID}
                        </span>
                        {comment.sentiment && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            comment.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                            comment.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {comment.sentiment}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{comment.Comment}</p>
                      <p className="text-blue-600 font-medium text-sm">
                        Summary: {comment.summary || 'Generating summary...'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wordcloud' && (
            <div className="space-y-6">
              <WordCloud words={wordFrequency} />
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Keywords</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordFrequency.slice(0, 12).map((word) => (
                    <div key={word.word} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{word.word}</span>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                        {word.frequency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

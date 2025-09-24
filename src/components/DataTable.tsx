import React from 'react';
import { Comment } from '../types';

interface DataTableProps {
  comments: Comment[];
}

export function DataTable({ comments }: DataTableProps) {
  const getSentimentBadge = (sentiment?: string, confidence?: number) => {
    if (!sentiment) return null;
    
    const colorClass = sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                      sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800';
    
    return (
      <div className="flex flex-col items-center space-y-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
          {sentiment}
        </span>
        {confidence && (
          <span className="text-xs text-gray-500">
            {Math.round(confidence * 100)}%
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Summary
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comments.map((comment, index) => (
              <tr key={comment.Comment_ID} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {comment.Comment_ID}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                  <div className="line-clamp-3">
                    {comment.Comment}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getSentimentBadge(comment.sentiment, comment.confidence)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="line-clamp-2">
                    {comment.summary || 'Processing...'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
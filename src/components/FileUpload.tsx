import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200 bg-blue-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Upload CSV File
        </h3>
        <p className="text-gray-500 mb-4">
          Drag and drop your CSV file here, or click to select
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          } transition-colors duration-200`}
        >
          <FileText className="mr-2 h-4 w-4" />
          {isUploading ? 'Processing...' : 'Select CSV File'}
        </label>
      </div>
    </div>
  );
}
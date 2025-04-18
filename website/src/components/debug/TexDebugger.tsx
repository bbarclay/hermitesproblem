'use client';

import React, { useState } from 'react';
import { preprocessTeX } from '@/utils/texPreprocessor';

interface TexDebuggerProps {
  rawTex?: string;
}

/**
 * A component for debugging TeX content transformation
 */
export default function TexDebugger({ rawTex = '' }: TexDebuggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState(rawTex || '\\begin{enumerate}\n\\item First item\n\\item Second item\n\\end{enumerate}');
  const [processed, setProcessed] = useState('');

  const handleProcess = () => {
    try {
      const result = preprocessTeX(inputText);
      setProcessed(result);
    } catch (error) {
      console.error('Error processing TeX:', error);
      setProcessed(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Process initial text
  React.useEffect(() => {
    handleProcess();
  }, []);

  return (
    <div className="tex-debugger border border-gray-300 rounded-md mt-4 mb-4">
      <div
        className="bg-gray-100 p-2 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-sm font-medium">TeX Content Debugger</h3>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="p-3">
          <div className="mb-4">
            <h4 className="text-xs font-semibold mb-1 text-gray-700">TeX Input:</h4>
            <textarea
              className="w-full h-32 text-xs font-mono p-2 border border-gray-200 rounded"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
              onClick={handleProcess}
            >
              Process TeX
            </button>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-semibold mb-1 text-gray-700">Processed Output (Before React-Markdown):</h4>
            <pre className="text-xs bg-gray-50 p-2 overflow-auto max-h-32 border border-gray-200 rounded">
              {processed}
            </pre>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-1 text-gray-700">Rendered HTML Preview:</h4>
            <div
              className="text-xs bg-white p-2 overflow-auto max-h-32 border border-gray-200 rounded"
              dangerouslySetInnerHTML={{ __html: processed }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
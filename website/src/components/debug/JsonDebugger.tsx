'use client';

import React, { useState } from 'react';

interface JsonDebuggerProps {
  data: any;
  title?: string;
  initiallyExpanded?: boolean;
}

/**
 * A component to display JSON data for debugging purposes
 */
const JsonDebugger: React.FC<JsonDebuggerProps> = ({ 
  data, 
  title = 'Debug JSON Data', 
  initiallyExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="json-debugger my-8 border border-gray-300 rounded-md overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
        onClick={toggleExpand}
      >
        <h3 className="text-sm font-mono font-medium text-gray-700">{title}</h3>
        <button 
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-gray-50 overflow-auto max-h-[500px]">
          <pre className="text-xs font-mono whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonDebugger;

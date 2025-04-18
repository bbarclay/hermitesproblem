'use client';

import React from 'react';
import EnhancedTexParser from './EnhancedTexParser';

interface TexBlockProps {
  type: string;
  id: string;
  title?: string;
  content: string;
  number?: number;
  className?: string;
}

/**
 * TeX Block Component
 * 
 * This component renders a specific TeX environment (theorem, lemma, etc.) with proper styling.
 */
const TexBlock: React.FC<TexBlockProps> = ({
  type,
  id,
  title,
  content,
  number,
  className = ''
}) => {
  // Get the appropriate styling based on the block type
  const getBlockStyle = (): string => {
    switch (type) {
      case 'theorem':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'lemma':
        return 'bg-indigo-50 border-l-4 border-indigo-500';
      case 'proposition':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'corollary':
        return 'bg-pink-50 border-l-4 border-pink-500';
      case 'definition':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'example':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'proof':
        return 'bg-gray-50 border-l-4 border-gray-400';
      case 'equation':
        return 'py-4 flex justify-center';
      case 'figure':
        return 'py-4 flex flex-col items-center';
      case 'algorithm':
        return 'bg-gray-50 border border-gray-200 font-mono';
      case 'table':
        return 'overflow-x-auto';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  // Get the appropriate title based on the block type
  const getBlockTitle = (): string => {
    if (title) return title;
    
    const numberStr = number ? ` ${number}` : '';
    
    switch (type) {
      case 'theorem':
        return `Theorem${numberStr}`;
      case 'lemma':
        return `Lemma${numberStr}`;
      case 'proposition':
        return `Proposition${numberStr}`;
      case 'corollary':
        return `Corollary${numberStr}`;
      case 'definition':
        return `Definition${numberStr}`;
      case 'example':
        return `Example${numberStr}`;
      case 'proof':
        return 'Proof';
      case 'algorithm':
        return `Algorithm${numberStr}`;
      default:
        return '';
    }
  };

  // Render the block based on its type
  const renderBlock = () => {
    // Special case for equation
    if (type === 'equation') {
      return (
        <div className="math-display">
          <EnhancedTexParser content={content} />
          {number && (
            <div className="text-right text-sm text-gray-500">({number})</div>
          )}
        </div>
      );
    }
    
    // Special case for proof (add QED symbol)
    if (type === 'proof') {
      return (
        <>
          <div className="font-italic mb-2">{getBlockTitle()}</div>
          <div className="tex-content">
            <EnhancedTexParser content={content} />
          </div>
          <div className="text-right">□</div>
        </>
      );
    }
    
    // Default rendering for other block types
    return (
      <>
        {getBlockTitle() && (
          <div className="font-semibold mb-2">{getBlockTitle()}</div>
        )}
        <div className="tex-content">
          <EnhancedTexParser content={content} />
        </div>
      </>
    );
  };

  return (
    <div 
      id={id}
      className={`tex-block tex-${type} my-4 p-4 rounded-md ${getBlockStyle()} ${className}`}
    >
      {renderBlock()}
    </div>
  );
};

export default TexBlock;

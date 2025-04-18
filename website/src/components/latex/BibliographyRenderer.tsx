'use client';

import React, { memo } from 'react';
import { useBibliography } from '@/hooks/useLatexContent';

interface BibliographyRendererProps {
  content: string | string[];
  className?: string;
}

/**
 * Optimized bibliography renderer component
 */
const BibliographyRenderer = ({ content, className = '' }: BibliographyRendererProps) => {
  const bibliographyEntries = useBibliography(content);
  
  if (bibliographyEntries.length === 0) {
    return <div className="text-gray-500 italic">No bibliography entries found.</div>;
  }
  
  return (
    <div className={`bibliography-container ${className}`}>
      {bibliographyEntries.map(entry => (
        <div key={entry.key} className="bibliography-entry py-2 pl-8 -indent-8">
          <span className="font-semibold">[{entry.number}]</span> {entry.text}
        </div>
      ))}
    </div>
  );
};

export default memo(BibliographyRenderer);

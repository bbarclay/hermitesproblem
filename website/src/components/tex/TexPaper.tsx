'use client';

import React from 'react';
import TexSection, { TexSectionProps } from './TexSection';
import JsonDebugger from '../debug/JsonDebugger';

interface TexPaperProps {
  title: string;
  authors: string[];
  date: string;
  sections: TexSectionProps[];
  currentSection: string;
  currentSubsection?: string;
}

export default function TexPaper({
  title,
  authors,
  date,
  sections,
  currentSection,
  currentSubsection
}: TexPaperProps) {
  // Find the current section
  const section = sections.find(s => s.id === currentSection);

  if (!section) {
    return (
      <div className="p-8">
        <div className="text-red-500">Section not found: {currentSection}</div>
      </div>
    );
  }

  // Special handling for introduction
  const isIntroduction = section.id === 'introduction';

  return (
    <div className="p-8 academic-paper">
      {isIntroduction && (
        <>
          <h1 className="text-3xl font-bold text-center mb-4">{title}</h1>
          <div className="text-center mb-8">
            {authors.map((author, index) => (
              <div key={index} className="text-lg">{author}</div>
            ))}
            <div className="text-gray-500 mt-2">{date}</div>
          </div>
        </>
      )}

      <TexSection
        {...section}
        currentSubsection={currentSubsection}
      />

      {/* JSON Debugger */}
      <JsonDebugger
        data={{
          title,
          authors,
          date,
          sectionsCount: sections.length,
          sections: sections.map(s => ({ id: s.id, title: s.title })),
          currentSection,
          currentSubsection
        }}
        title="Debug: Paper Data"
        initiallyExpanded={false}
      />
    </div>
  );
}

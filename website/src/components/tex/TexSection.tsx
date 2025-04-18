'use client';

import React from 'react';
import TexContent from './TexContent';
import TexBlock from './TexBlock';
import { TexBlockProps } from './TexBlock';
import TableOfContents from '../TableOfContents';
import JsonDebugger from '../debug/JsonDebugger';
import InteractiveToolsInjector from '../registry/InteractiveToolsInjector';

export interface TexSectionProps {
  title: string;
  id: string;
  level: string;
  content: string[];
  blocks?: TexBlockProps[];
  subsections?: TexSubsectionProps[];
  currentSubsection?: string;
}

export interface TexSubsectionProps {
  title: string;
  id: string;
  level: string;
  content: string[];
  blocks?: TexBlockProps[];
}

export default function TexSection({
  title,
  id,
  level,
  content,
  blocks = [],
  subsections = [],
  currentSubsection
}: TexSectionProps) {
  // Generate headings for table of contents
  const generateHeadings = () => {
    const headings = [
      { id, text: title, level: 1 }
    ];

    subsections.forEach(subsection => {
      headings.push({
        id: subsection.id,
        text: subsection.title,
        level: 2
      });
    });

    return headings;
  };

  const headings = generateHeadings();

  // Scroll to heading when clicked
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };



  // Render the section content
  const renderSectionContent = () => {
    return (
      <>
        <div id={id}>
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          {content.map((chunk, index) => (
            <TexContent key={`content-${index}`} content={chunk} />
          ))}

          {/* Render standard blocks */}
          {blocks.map(block => (
            <TexBlock key={block.id} {...block} />
          ))}

          {/* Interactive Tools Injector */}
          <InteractiveToolsInjector sectionId={id} content={content} />
        </div>

        {subsections.map(subsection => {


          return (
            <div
              key={subsection.id}
              id={subsection.id}
              className={`mt-8 ${currentSubsection === subsection.id ? 'scroll-mt-20' : ''}`}
            >
              <h3 className="text-xl font-semibold mb-4">{subsection.title}</h3>
              {subsection.content.map((chunk, index) => (
                <TexContent key={`subcontent-${subsection.id}-${index}`} content={chunk} />
              ))}

              {/* Render standard blocks for subsection */}
              {subsection.blocks && subsection.blocks.map(block => (
                <TexBlock key={block.id} {...block} />
              ))}

              {/* Interactive Tools Injector for subsection */}
              <InteractiveToolsInjector sectionId={subsection.id} content={subsection.content} />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="tex-section">
      {headings.length > 1 && (
        <TableOfContents
          headings={headings}
          onHeadingClick={scrollToHeading}
          title="In This Section"
        />
      )}

      {renderSectionContent()}

      {/* JSON Debugger */}
      <JsonDebugger
        data={{
          id,
          title,
          level,
          contentCount: content.length,
          blocksCount: blocks.length,
          subsectionsCount: subsections.length,
          subsections: subsections.map(sub => ({ id: sub.id, title: sub.title })),
          currentSubsection
        }}
        title="Debug: Section Data"
        initiallyExpanded={false}
      />
    </div>
  );
}

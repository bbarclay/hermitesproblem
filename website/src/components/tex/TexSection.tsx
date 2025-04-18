'use client';

import React from 'react';
import TexContent from './TexContent';
import TexBlock from './TexBlock';
import { TexBlockProps } from './TexBlock';
import JsonDebugger from '../debug/JsonDebugger';
import InteractiveToolsInjector from '../registry/InteractiveToolsInjector';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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
  // Animation variants for content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.1 to make animations faster
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3 // Reduced from 0.5 for smoother animation
      }
    }
  };

  // Scroll to subsection if specified in URL
  React.useEffect(() => {
    if (currentSubsection) {
      const element = document.getElementById(currentSubsection);
      if (element) {
        // Add a slight delay to ensure DOM is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }
  }, [currentSubsection]);

  // Render the section content
  const renderSectionContent = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          id={id}
          className="relative"
          variants={itemVariants}
        >
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-50" />
          <div className="pl-6">
            <h2 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {title}
            </h2>
            <div className="prose prose-lg max-w-none">
              {content.map((chunk, index) => (
                <motion.div 
                  key={`content-${index}`} 
                  variants={itemVariants}
                  className="mb-6"
                >
                  <TexContent content={chunk} />
                </motion.div>
              ))}
            </div>

            {/* Render standard blocks */}
            {blocks.map(block => (
              <motion.div 
                key={block.id} 
                variants={itemVariants}
                className="my-8"
              >
                <TexBlock {...block} />
              </motion.div>
            ))}

            {/* Interactive Tools Injector */}
            <motion.div variants={itemVariants}>
              <InteractiveToolsInjector sectionId={id} content={content} />
            </motion.div>
          </div>
        </motion.div>

        {subsections.map(subsection => {
          return (
            <motion.div
              key={subsection.id}
              id={subsection.id}
              className={cn(
                "mt-16",
                currentSubsection === subsection.id && "scroll-mt-20"
              )}
              variants={itemVariants}
            >
              <div className="relative">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full opacity-30" />
                <div className="pl-6">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <ChevronRight className="text-purple-500" size={20} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                      {subsection.title}
                    </span>
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    {subsection.content.map((chunk, index) => (
                      <motion.div 
                        key={`subcontent-${subsection.id}-${index}`}
                        variants={itemVariants}
                        className="mb-6"
                      >
                        <TexContent content={chunk} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Render standard blocks for subsection */}
                  {subsection.blocks && subsection.blocks.map(block => (
                    <motion.div 
                      key={block.id}
                      variants={itemVariants}
                      className="my-8"
                    >
                      <TexBlock {...block} />
                    </motion.div>
                  ))}

                  {/* Interactive Tools Injector for subsection */}
                  <motion.div variants={itemVariants}>
                    <InteractiveToolsInjector sectionId={subsection.id} content={subsection.content} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="tex-section">
      {renderSectionContent()}

      {/* JSON Debugger */}
      {process.env.NODE_ENV !== 'production' && (
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
      )}
    </div>
  );
}

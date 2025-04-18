'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { highlightUnparsedTeX } from '@/utils/texDebugger';
import { preprocessTeX } from '@/utils/texPreprocessor';

interface EnhancedTexParserProps {
  content: string;
  debug?: boolean;
}

/**
 * Enhanced TeX Parser Component
 *
 * This component parses and renders TeX content with proper formatting.
 * It includes support for the most common TeX elements found in the content.
 */
const EnhancedTexParser: React.FC<EnhancedTexParserProps> = ({
  content,
  debug = false
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(debug);

  // Pre-process the content to handle TeX elements that KaTeX doesn't support natively
  const processContent = (text: string): string => {
    // Use the comprehensive TeX preprocessor
    return preprocessTeX(text);
  };

  // Process the content
  const processedContent = processContent(content);

  // If debug mode is enabled, highlight unparsed TeX
  const displayContent = showDebugInfo
    ? highlightUnparsedTeX(processedContent, true)
    : processedContent;

  return (
    <div className="enhanced-tex-parser">
      {showDebugInfo && (
        <div className="bg-yellow-50 border border-yellow-200 p-2 mb-4 rounded text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">TeX Debug Mode</span>
            <button
              onClick={() => setShowDebugInfo(false)}
              className="text-xs bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300"
            >
              Hide Debug Info
            </button>
          </div>
          <p className="text-xs mt-1">
            Unparsed TeX elements are highlighted in red. Click on an element to see its type.
          </p>
        </div>
      )}

      {showDebugInfo ? (
        <div dangerouslySetInnerHTML={{ __html: displayContent }} />
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            [rehypeKatex, {
              throwOnError: false,
              output: 'html',
              strict: false,
              trust: true,
              macros: {
                "\\tr": "\\operatorname{tr}",
                "\\det": "\\operatorname{det}",
                "\\mod": "\\operatorname{mod}",
                "\\gcd": "\\operatorname{gcd}",
                "\\lcm": "\\operatorname{lcm}",
                "\\sgn": "\\operatorname{sgn}",
                "\\floor": "\\lfloor#1\\rfloor",
                "\\ceil": "\\lceil#1\\rceil",
                "\\Z": "\\mathbb{Z}",
                "\\N": "\\mathbb{N}",
                "\\Q": "\\mathbb{Q}",
                "\\R": "\\mathbb{R}",
                "\\C": "\\mathbb{C}",
                "\\epsilon": "\\varepsilon",
                "\\iff": "\\Leftrightarrow",
                "\\implies": "\\Rightarrow",
                "\\to": "\\rightarrow",
                "\\HAPD": "\\text{HAPD}"
              }
            }]
          ]}
          components={{
            // Custom components for specific HTML elements
            div: ({ className, ...props }) => {
              // Handle theorem-like environments
              if (className === 'theorem') {
                return (
                  <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                    {props.children}
                  </div>
                );
              } else if (className === 'lemma') {
                return (
                  <div className="my-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-md">
                    {props.children}
                  </div>
                );
              } else if (className === 'definition') {
                return (
                  <div className="my-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                    {props.children}
                  </div>
                );
              } else if (className === 'proposition') {
                return (
                  <div className="my-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-md">
                    {props.children}
                  </div>
                );
              } else if (className === 'corollary') {
                return (
                  <div className="my-4 p-4 bg-pink-50 border-l-4 border-pink-500 rounded-md">
                    {props.children}
                  </div>
                );
              } else if (className === 'proof') {
                return (
                  <div className="my-4 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-md">
                    {props.children}
                  </div>
                );
              }
              // Handle equation environments
              else if (className === 'equation' || className === 'align' ||
                       className === 'eqnarray' || className === 'gather' ||
                       className === 'multline') {
                return (
                  <div className={`my-4 ${className}`} {...props} />
                );
              }
              return <div {...props} />;
            },

            // Handle links for references and citations
            a: ({ className, ...props }) => {
              if (className === 'reference') {
                return (
                  <a className="reference" {...props} onClick={(e) => {
                    e.preventDefault();
                    const targetId = props.href?.substring(1);
                    const targetElement = document.getElementById(targetId || '');
                    if (targetElement) {
                      targetElement.scrollIntoView({ behavior: 'smooth' });
                      // Highlight the target element briefly
                      targetElement.classList.add('highlight-target');
                      setTimeout(() => {
                        targetElement.classList.remove('highlight-target');
                      }, 2000);
                    }
                  }} />
                );
              } else if (className === 'citation') {
                return (
                  <a className="citation" {...props} />
                );
              }
              return <a {...props} />;
            },

            // This custom component prevents equation duplication
            equation: ({node, ...props}) => {
              return <span className="math-display">{props.children}</span>
            }
          }}
        >
          {displayContent}
        </ReactMarkdown>
      )}

      {!showDebugInfo && debug && (
        <div className="mt-4 text-right">
          <button
            onClick={() => setShowDebugInfo(true)}
            className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Show Debug Info
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedTexParser;

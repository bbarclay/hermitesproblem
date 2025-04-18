'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { preprocessTeX } from '@/utils/texPreprocessor';
import { highlightUnparsedTeX } from '@/utils/texDebugger';

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

  // Process the content
  const processedContent = preprocessTeX(content);

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
            rehypeRaw,
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
                "\\floor": "\\lfloor #1 \\rfloor",
                "\\ceil": "\\lceil #1 \\rceil",
                "\\Z": "\\mathbb{Z}",
                "\\N": "\\mathbb{N}",
                "\\Q": "\\mathbb{Q}",
                "\\R": "\\mathbb{R}",
                "\\C": "\\mathbb{C}",
                "\\F": "\\mathbb{F}",
                "\\P": "\\mathbb{P}",
                "\\epsilon": "\\varepsilon",
                "\\iff": "\\Leftrightarrow",
                "\\implies": "\\Rightarrow",
                "\\to": "\\rightarrow",
                "\\HAPD": "\\text{HAPD}",
                "\\set": "\\{#1\\}",
                "\\norm": "\\left\\|#1\\right\\|",
                "\\abs": "\\left|#1\\right|",
                "\\inner": "\\langle#1,#2\\rangle",
                "\\paren": "\\left(#1\\right)",
                "\\bra": "\\left\\langle#1\\right|",
                "\\ket": "\\left|#1\\right\\rangle"
              }
            }]
          ]}
          components={{
            // Custom components for specific HTML elements
            div: ({ className, ...props }) => {
              if (className === 'theorem') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--theorem-bg))] border-l-4 border-blue-500 rounded-md shadow-sm">
                    <div className="font-serif">{props.children}</div>
                  </div>
                );
              } else if (className === 'lemma') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--lemma-bg))] border-l-4 border-indigo-500 rounded-md shadow-sm">
                    <div className="font-serif">{props.children}</div>
                  </div>
                );
              } else if (className === 'definition') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--definition-bg))] border-l-4 border-green-500 rounded-md shadow-sm">
                    <div className="font-serif">{props.children}</div>
                  </div>
                );
              } else if (className === 'proposition') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--theorem-bg))] border-l-4 border-purple-500 rounded-md shadow-sm">
                    <div className="font-serif">{props.children}</div>
                  </div>
                );
              } else if (className === 'corollary') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--lemma-bg))] border-l-4 border-pink-500 rounded-md shadow-sm">
                    <div className="font-serif">{props.children}</div>
                  </div>
                );
              } else if (className === 'proof') {
                return (
                  <div className="my-6 p-6 bg-[hsl(var(--proof-bg))] border-l-4 border-gray-400 rounded-md shadow-sm">
                    <div className="font-serif italic">
                      {props.children}
                      <div className="text-right mt-4">□</div>
                    </div>
                  </div>
                );
              }
              return <div {...props} />;
            },

            // Handle ordered and unordered lists
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-8 my-4 space-y-2" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-8 my-4 space-y-2" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="pl-2" {...props} />
            ),

            // Handle citations and references
            a: ({ href, className, ...props }) => {
              if (className === 'citation') {
                return (
                  <a
                    href={href}
                    className="text-[hsl(var(--citation-color))] no-underline hover:underline"
                    {...props}
                  />
                );
              }
              return <a href={href} className="text-[hsl(var(--link-color))] hover:underline" {...props} />;
            },

            // Custom components for specific elements
            span: ({className, ...props}) => {
              if (className === 'math-display') {
                return <span className="math-display block my-4 overflow-x-auto">{props.children}</span>;
              }
              return <span {...props} />;
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

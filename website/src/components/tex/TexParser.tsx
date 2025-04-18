'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { preprocessLatex } from '@/components/latexProcessing';
import { highlightUnparsedTeX } from '@/utils/texDebugger';

// Import the Components type from react-markdown
import type { Components } from 'react-markdown';

// Define custom component props
type CustomComponentProps = {
  node?: any;
  children?: React.ReactNode;
  title?: string;
  caption?: string;
  className?: string;
};

// Define custom components type
type CustomComponents = Components & {
  theorem?: React.ComponentType<CustomComponentProps>;
  lemma?: React.ComponentType<CustomComponentProps>;
  proposition?: React.ComponentType<CustomComponentProps>;
  corollary?: React.ComponentType<CustomComponentProps>;
  definition?: React.ComponentType<CustomComponentProps>;
  example?: React.ComponentType<CustomComponentProps>;
  proof?: React.ComponentType<CustomComponentProps>;
  equation?: React.ComponentType<CustomComponentProps>;
  algorithm?: React.ComponentType<CustomComponentProps>;
};

interface TexParserProps {
  content: string;
  debug?: boolean;
}

/**
 * TeX Parser Component
 *
 * This component parses and renders TeX content with proper formatting.
 * It includes support for:
 * - Math environments (equation, align, etc.)
 * - Theorem-like environments (theorem, lemma, etc.)
 * - Lists (itemize, enumerate, etc.)
 * - Tables
 * - Figures
 * - Algorithms
 * - Inline and display math
 * - Common TeX commands
 */
const TexParser: React.FC<TexParserProps> = ({ content, debug = false }) => {
  const [showDebugInfo, setShowDebugInfo] = useState(debug);

  // Process the content
  const processedContent = preprocessLatex(content);

  // If debug mode is enabled, highlight unparsed TeX
  const displayContent = showDebugInfo
    ? highlightUnparsedTeX(processedContent, true)
    : processedContent;

  return (
    <div className="tex-parser">
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
            // @ts-ignore - Custom components
            // Custom components for specific TeX environments

            // Theorem-like environments
            theorem: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <div className="font-semibold mb-2">Theorem{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            lemma: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-md">
                <div className="font-semibold mb-2">Lemma{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            proposition: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-md">
                <div className="font-semibold mb-2">Proposition{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            corollary: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-pink-50 border-l-4 border-pink-500 rounded-md">
                <div className="font-semibold mb-2">Corollary{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            definition: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                <div className="font-semibold mb-2">Definition{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            example: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                <div className="font-semibold mb-2">Example{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
              </div>
            ),

            proof: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-md">
                <div className="italic mb-2">Proof{props.title ? ` (${props.title})` : ''}</div>
                <div>{props.children}</div>
                <div className="text-right">□</div>
              </div>
            ),

            // Math environments
            equation: ({ node, ...props }) => (
              <div className="my-4 py-2 flex justify-center">
                <span className="math-display">{props.children}</span>
              </div>
            ),

            // Tables
            table: ({ node, ...props }: any) => {
              // Use type assertion for custom props
              const customProps = props as { caption?: string, children: React.ReactNode };
              return (
                <div className="my-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    {customProps.children}
                  </table>
                  {customProps.caption && (
                    <div className="text-center text-sm text-gray-600 mt-2">{customProps.caption}</div>
                  )}
                </div>
              );
            },

            // Figures
            figure: ({ node, ...props }: any) => {
              // Use type assertion for custom props
              const customProps = props as { caption?: string, children: React.ReactNode };
              return (
                <figure className="my-4 text-center">
                  {customProps.children}
                  {customProps.caption && (
                    <figcaption className="text-sm text-gray-600 mt-2">{customProps.caption}</figcaption>
                  )}
                </figure>
              );
            },

            // Algorithms
            algorithm: ({ node, ...props }) => (
              <div className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm">
                <div className="font-semibold mb-2">Algorithm{props.title ? `: ${props.title}` : ''}</div>
                <div className="whitespace-pre-wrap">{props.children}</div>
              </div>
            ),

            // Lists
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 my-4 space-y-2">{props.children}</ul>
            ),

            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 my-4 space-y-2">{props.children}</ol>
            ),

            // Custom components for specific elements
            span: ({className, ...props}) => {
              if (className === 'math-display') {
                return <span className="math-display">{props.children}</span>;
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

export default TexParser;

'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { useLatexContent } from '@/hooks/useLatexContent';

interface LatexRendererProps {
  content: string | string[];
  className?: string;
}

/**
 * Error boundary for LaTeX rendering
 */
class LatexErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="latex-error p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-600 font-medium">Error rendering LaTeX content</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-red-500">Show details</summary>
            <pre className="mt-2 text-xs overflow-auto p-2 bg-red-100 rounded">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Memoized LaTeX content renderer
 */
const MemoizedLatexContent = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[
        [
          rehypeKatex,
          {
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
          }
        ]
      ]}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedLatexContent.displayName = 'MemoizedLatexContent';

/**
 * Main LaTeX renderer component with error boundary
 */
const LatexRenderer = ({ content, className = '' }: LatexRendererProps) => {
  const processedContent = useLatexContent(content);
  
  if (!processedContent) {
    return null;
  }
  
  return (
    <div className={`latex-content ${className}`}>
      <LatexErrorBoundary>
        <MemoizedLatexContent content={processedContent} />
      </LatexErrorBoundary>
    </div>
  );
};

export default memo(LatexRenderer);

'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { preprocessLatex } from '@/lib/tex-utils';
import JsonDebugger from '../debug/JsonDebugger';

interface TexContentProps {
  content: string;
}

export default function TexContent({ content }: TexContentProps) {
  const processedContent = preprocessLatex(content);

  return (
    <>
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
        className="tex-content"
      >
        {processedContent}
      </ReactMarkdown>

      {/* JSON Debugger */}
      <JsonDebugger
        data={{
          rawContent: content,
          processedContent: processedContent
        }}
        title="Debug: TeX Content"
        initiallyExpanded={false}
      />
    </>
  );
}

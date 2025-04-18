'use client';

import React from 'react';
import EnhancedTexParser from './EnhancedTexParser';
import JsonDebugger from '../debug/JsonDebugger';

interface TexContentProps {
  content: string;
}

export default function TexContent({ content }: TexContentProps) {
  return (
    <>
      <EnhancedTexParser content={content} debug={false} />

      {/* JSON Debugger */}
      <JsonDebugger
        data={{
          rawContent: content
        }}
        title="Debug: TeX Content"
        initiallyExpanded={false}
      />
    </>
  );
}

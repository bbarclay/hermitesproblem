'use client';

import React from 'react';
import EnhancedTexParser from './EnhancedTexParser';
import { highlightUnparsedTeX } from '@/utils/texDebugger';
import JsonDebugger from '../debug/JsonDebugger';
import TexDebugger from '../debug/TexDebugger';

interface TexContentProps {
  content: string;
  debug?: boolean;
}

export default function TexContent({ content, debug = false }: TexContentProps) {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <>
      <EnhancedTexParser content={content} debug={debug} />

      {/* Include TexDebugger only in development mode or when debug=true */}
      {(debug || isDev) && <TexDebugger rawTex={content} />}

      {/* JSON Debugger */}
      {debug && (
        <JsonDebugger
          data={{
            rawContent: content
          }}
          title="Debug: TeX Content"
          initiallyExpanded={false}
        />
      )}
    </>
  );
}

'use client';

import React from 'react';
import {
  Sparkles, ChartLine, Hash, Atom, Dna, Beaker, Sigma,
  PieChart, Cpu, GitPullRequest, Table, Code
} from 'lucide-react';
import TexContent from './TexContent';
import JsonDebugger from '../debug/JsonDebugger';

export interface TexBlockProps {
  type: string;
  id: string;
  title?: string;
  content: string;
  number: number;
  caption?: string;
  image?: string;
}

const blockTypeIcons: Record<string, React.ReactNode> = {
  'theorem': <Sparkles size={18} className="text-blue-500" />,
  'lemma': <ChartLine size={18} className="text-red-500" />,
  'definition': <Hash size={18} className="text-green-500" />,
  'proposition': <Atom size={18} className="text-purple-500" />,
  'corollary': <Dna size={18} className="text-pink-500" />,
  'example': <Beaker size={18} className="text-amber-500" />,
  'equation': <Sigma size={18} className="text-indigo-500" />,
  'figure': <PieChart size={18} className="text-cyan-500" />,
  'algorithm': <Cpu size={18} className="text-teal-500" />,
  'proof': <GitPullRequest size={18} className="text-gray-500" />,
  'table': <Table size={18} className="text-orange-500" />
};

const getBlockIcon = (type: string) => {
  return blockTypeIcons[type] || <Code size={18} className="text-gray-400" />;
};

const blockTypeClasses: Record<string, string> = {
  'theorem': 'bg-blue-50 border-blue-200',
  'lemma': 'bg-red-50 border-red-200',
  'definition': 'bg-green-50 border-green-200',
  'proposition': 'bg-purple-50 border-purple-200',
  'corollary': 'bg-pink-50 border-pink-200',
  'example': 'bg-amber-50 border-amber-200',
  'proof': 'bg-gray-50 border-gray-200',
  'algorithm': 'bg-teal-50 border-teal-200',
};

export default function TexBlock({ type, id, title, content, number, caption, image }: TexBlockProps) {
  // Special handling for equations
  if (type === 'equation') {
    return (
      <div id={id} className="my-6 relative">
        <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
          {getBlockIcon(type)}
          <span>Equation {number}</span>
        </div>
        <div className="katex-display">
          <TexContent content={`$$${content}$$`} />
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">({number})</span>

        {/* JSON Debugger */}
        <JsonDebugger
          data={{ type, id, content, number }}
          title="Debug: Equation Block"
          initiallyExpanded={false}
        />
      </div>
    );
  }

  // Special handling for figures
  if (type === 'figure') {
    return (
      <figure id={id} className="my-6">
        <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
          {getBlockIcon(type)}
          <span>Figure {number}</span>
        </div>
        {image && (
          <div className="flex justify-center my-4">
            <img
              src={`/images/${image}`}
              alt={caption || `Figure ${number}`}
              className="max-w-full h-auto"
            />
          </div>
        )}
        {caption && (
          <figcaption className="text-center text-sm text-gray-600 mt-2">
            <strong>Figure {number}.</strong> {caption}
          </figcaption>
        )}

        {/* JSON Debugger */}
        <JsonDebugger
          data={{ type, id, image, caption, number }}
          title="Debug: Figure Block"
          initiallyExpanded={false}
        />
      </figure>
    );
  }

  // Special handling for tables
  if (type === 'table') {
    return (
      <div id={id} className="my-6">
        <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
          {getBlockIcon(type)}
          <span>Table {number}</span>
        </div>
        <div className="overflow-x-auto">
          <TexContent content={content} />
        </div>
        {caption && (
          <div className="text-center text-sm text-gray-600 mt-2">
            <strong>Table {number}.</strong> {caption}
          </div>
        )}

        {/* JSON Debugger */}
        <JsonDebugger
          data={{ type, id, content, caption, number }}
          title="Debug: Table Block"
          initiallyExpanded={false}
        />
      </div>
    );
  }

  // Default block rendering (theorem, lemma, definition, etc.)
  const blockClass = blockTypeClasses[type] || 'bg-gray-50 border-gray-200';

  return (
    <div
      id={id}
      className={`my-6 p-4 rounded-md border-l-4 ${blockClass}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {getBlockIcon(type)}
        <span className="font-bold capitalize">
          {type} {number}{title ? `: ${title}` : ''}
        </span>
      </div>
      <div className="pl-6">
        <TexContent content={content} />
      </div>

      {/* JSON Debugger */}
      <JsonDebugger
        data={{ type, id, title, content, number }}
        title={`Debug: ${type.charAt(0).toUpperCase() + type.slice(1)} Block`}
        initiallyExpanded={false}
      />
    </div>
  );
}

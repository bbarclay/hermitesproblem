import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, ChartLine, Hash, Atom, Dna, Beaker, Sigma, PieChart, Cpu, GitPullRequest, Table, Code, Infinity,
  Bookmark, BookOpen, GraduationCap, Microscope, Calculator, Binary, Compass, Waves, Gauge, Lightbulb, Database,
  Brain, ScrollText, FileSearch
} from 'lucide-react';
import { preprocessLatex } from './latexProcessing';

// Interfaces
export interface Block {
  type: string;
  id: string;
  content: string;
  number: number;
  caption?: string;
  image?: string;
  environment?: string;
}

export interface Section {
  title: string;
  id: string;
  level: string;
  content: string[];
  blocks?: Block[];
}

// Block type icons
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

export const getBlockIcon = (type: string) => {
  return blockTypeIcons[type] || <Code size={18} className="text-gray-400" />;
};

// Section icons
const sectionIcons: Record<string, React.ReactNode> = {
  'abstract': <Bookmark size={20} className="text-gray-700" />,
  'introduction': <BookOpen size={20} className="text-blue-600" />,
  'galois-theory': <GraduationCap size={20} className="text-purple-600" />,
  'hapd-algorithm': <Microscope size={20} className="text-green-600" />,
  'matrix-approach': <Sigma size={20} className="text-indigo-600" />,
  'matrix-verification': <Calculator size={20} className="text-red-600" />,
  'matrix-computational': <Binary size={20} className="text-orange-600" />,
  'equivalence': <Compass size={20} className="text-yellow-600" />,
  'subtractive-algorithm': <Waves size={20} className="text-teal-600" />,
  'numerical-validation': <Gauge size={20} className="text-cyan-600" />,
  'objections-tex': <Lightbulb size={20} className="text-amber-600" />,
  'implementation-examples': <Database size={20} className="text-pink-600" />,
  'conclusion': <Brain size={20} className="text-violet-600" />,
  'bibliography': <ScrollText size={20} className="text-gray-600" />,
  'debug-test': <FileSearch size={20} className="text-red-500" />
};

export const getSectionIcon = (file: string) => {
  return sectionIcons[file] || <Infinity size={20} className="text-gray-400" />;
};

// Render specific block types
export const renderBlock = (block: Block) => {
  const icon = getBlockIcon(block.type);
  switch (block.type) {
    case 'theorem':
    case 'lemma':
    case 'definition':
    case 'proposition':
    case 'corollary':
    case 'example':
      return (
        <div key={block.id} className={block.type} id={block.id}>
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="font-bold capitalize">{block.type} {block.number}</span>
          </div>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
          >
            {preprocessLatex(block.content)}
          </ReactMarkdown>
        </div>
      );
    case 'equation':
      return (
        <div key={block.id} className="equation" id={block.id}>
          <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
            {icon}
            <span>Equation {block.number}</span>
          </div>
          <div className="katex-display">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[[rehypeKatex, { throwOnError: false }]]}
            >
              {`$$${block.content}$$`}
            </ReactMarkdown>
          </div>
          <span className="equation-number">({block.number})</span>
        </div>
      );
    case 'figure':
      return (
        <figure key={block.id} className="figure" id={block.id}>
          <div className="flex items-center gap-2 mb-1 text-gray-500 text-sm">
            {icon}
            <span>Figure {block.number}</span>
          </div>
          {block.image && (
            <img
              src={`/images/${block.image}`}
              alt={block.caption || `Figure ${block.number}`}
            />
          )}
          {block.caption && (
            <figcaption className="figure-caption">
              <strong>Figure {block.number}.</strong> {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
};
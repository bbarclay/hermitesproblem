import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Code, 
  FileText, 
  Grid, 
  LayoutGrid, 
  Lightbulb, 
  Microscope, 
  Sigma, 
  Sparkles, 
  Zap 
} from 'lucide-react';

export interface Block {
  type: string;
  id: string;
  title?: string;
  content: string;
  number: number;
  caption?: string;
  image?: string;
}

export interface Subsection {
  title: string;
  id: string;
  level: string;
  content: string[];
  blocks?: Block[];
}

export interface Section {
  level: string;
  title: string;
  id: string;
  content: string[];
  blocks?: Block[];
  subsections?: Subsection[];
}

export const getSectionIcon = (sectionId: string) => {
  const icons: Record<string, () => React.ReactNode> = {
    'introduction': () => <BookOpen className="text-blue-500" size={20} />,
    'projective-algorithm': () => <Grid className="text-purple-500" size={20} />,
    'matrix-approach': () => <LayoutGrid className="text-green-500" size={20} />,
    'subtractive-algorithm': () => <Calculator className="text-red-500" size={20} />,
    'galois-theory': () => <Sparkles className="text-amber-500" size={20} />,
    'equivalence': () => <Sigma className="text-indigo-500" size={20} />,
    'implementation': () => <Code className="text-teal-500" size={20} />,
    'applications': () => <Lightbulb className="text-pink-500" size={20} />,
    'future-work': () => <Zap className="text-cyan-500" size={20} />,
    'bibliography': () => <FileText className="text-gray-500" size={20} />,
    'appendix': () => <Microscope className="text-gray-500" size={20} />
  };

  // Find the closest match if exact match not found
  const key = Object.keys(icons).find(k => sectionId.includes(k)) || 'introduction';
  return icons[key]();
};

export const renderBlock = (block: Block) => {
  const { type, id, title, content, number, caption, image } = block;
  
  // Special handling for equations
  if (type === 'equation') {
    return (
      <div key={id} id={id} className="my-6 relative">
        <div className="katex-display">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">({number})</span>
      </div>
    );
  }
  
  // Special handling for figures
  if (type === 'figure') {
    return (
      <figure key={id} id={id} className="my-6">
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
      </figure>
    );
  }
  
  // Special handling for tables
  if (type === 'table') {
    return (
      <div key={id} id={id} className="my-6">
        <div className="overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        {caption && (
          <div className="text-center text-sm text-gray-600 mt-2">
            <strong>Table {number}.</strong> {caption}
          </div>
        )}
      </div>
    );
  }
  
  // Default block rendering (theorem, lemma, definition, etc.)
  const blockClasses: Record<string, string> = {
    'theorem': 'bg-blue-50 border-blue-200',
    'lemma': 'bg-red-50 border-red-200',
    'definition': 'bg-green-50 border-green-200',
    'proposition': 'bg-purple-50 border-purple-200',
    'corollary': 'bg-pink-50 border-pink-200',
    'example': 'bg-amber-50 border-amber-200',
    'proof': 'bg-gray-50 border-gray-200',
    'algorithm': 'bg-teal-50 border-teal-200',
  };
  
  const blockClass = blockClasses[type] || 'bg-gray-50 border-gray-200';
  
  return (
    <div 
      key={id} 
      id={id} 
      className={`my-6 p-4 rounded-md border-l-4 ${blockClass}`}
    >
      <div className="mb-2">
        <span className="font-bold capitalize">
          {type} {number}{title ? `: ${title}` : ''}
        </span>
      </div>
      <div className="pl-6">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

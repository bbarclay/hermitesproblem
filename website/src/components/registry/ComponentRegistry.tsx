'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import basic components
import TexBlock from '../tex/TexBlock';
import TexContent from '../tex/TexContent';

// Dynamically import interactive components to reduce initial bundle size
const ProjectiveSpaceVisualizer = dynamic(
  () => import('../interactive/ProjectiveSpaceVisualizer'),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" /> }
);

const SubtractiveAlgorithmVisualizer = dynamic(
  () => import('../interactive/SubtractiveAlgorithmVisualizer'),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" /> }
);

const CubicFieldExplorer = dynamic(
  () => import('../interactive/CubicFieldExplorer'),
  { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" /> }
);

// Define component types
export type ComponentType = 
  | 'theorem'
  | 'lemma'
  | 'definition'
  | 'proposition'
  | 'corollary'
  | 'example'
  | 'equation'
  | 'figure'
  | 'algorithm'
  | 'table'
  | 'proof'
  | 'interactive-projective-space'
  | 'interactive-subtractive-algorithm'
  | 'interactive-cubic-field';

// Define component props
export interface ComponentProps {
  type: ComponentType;
  id: string;
  title?: string;
  content: string;
  number?: number;
  caption?: string;
  image?: string;
  [key: string]: any;
}

// Component registry
const ComponentRegistry = {
  // Basic TeX blocks
  'theorem': (props: ComponentProps) => <TexBlock {...props} />,
  'lemma': (props: ComponentProps) => <TexBlock {...props} />,
  'definition': (props: ComponentProps) => <TexBlock {...props} />,
  'proposition': (props: ComponentProps) => <TexBlock {...props} />,
  'corollary': (props: ComponentProps) => <TexBlock {...props} />,
  'example': (props: ComponentProps) => <TexBlock {...props} />,
  'equation': (props: ComponentProps) => <TexBlock {...props} />,
  'figure': (props: ComponentProps) => <TexBlock {...props} />,
  'algorithm': (props: ComponentProps) => <TexBlock {...props} />,
  'table': (props: ComponentProps) => <TexBlock {...props} />,
  'proof': (props: ComponentProps) => <TexBlock {...props} />,
  
  // Interactive components
  'interactive-projective-space': (props: ComponentProps) => (
    <div className="my-8">
      <ProjectiveSpaceVisualizer 
        initialAlpha={props.initialAlpha || Math.pow(2, 1/3)} 
        className="shadow-lg"
      />
    </div>
  ),
  'interactive-subtractive-algorithm': (props: ComponentProps) => (
    <div className="my-8">
      <SubtractiveAlgorithmVisualizer 
        initialAlpha={props.initialAlpha || Math.pow(2, 1/3)} 
        className="shadow-lg"
      />
    </div>
  ),
  'interactive-cubic-field': (props: ComponentProps) => (
    <div className="my-8">
      <CubicFieldExplorer className="shadow-lg" />
    </div>
  ),
};

// Component renderer
export const renderComponent = (props: ComponentProps) => {
  const Component = ComponentRegistry[props.type];
  
  if (!Component) {
    console.warn(`Component type "${props.type}" not found in registry`);
    return <div className="text-red-500">Unknown component type: {props.type}</div>;
  }
  
  return <Component {...props} />;
};

// Function to detect if a section should have interactive components
export const detectInteractiveComponents = (sectionId: string, content: string[]): ComponentProps[] => {
  const interactiveComponents: ComponentProps[] = [];
  
  // Check section ID to determine which interactive components to include
  if (sectionId.includes('hapd-algorithm') || sectionId.includes('projective')) {
    interactiveComponents.push({
      type: 'interactive-projective-space',
      id: `${sectionId}-projective-space`,
      content: 'Projective Space Visualizer',
      title: 'Projective Space Visualizer'
    });
  }
  
  if (sectionId.includes('subtractive')) {
    interactiveComponents.push({
      type: 'interactive-subtractive-algorithm',
      id: `${sectionId}-subtractive-algorithm`,
      content: 'Subtractive Algorithm Visualizer',
      title: 'Subtractive Algorithm Visualizer'
    });
  }
  
  if (sectionId.includes('cubic') || sectionId.includes('field') || sectionId.includes('matrix')) {
    interactiveComponents.push({
      type: 'interactive-cubic-field',
      id: `${sectionId}-cubic-field`,
      content: 'Cubic Field Explorer',
      title: 'Cubic Field Explorer'
    });
  }
  
  // Also check content for specific keywords
  const contentText = content.join(' ').toLowerCase();
  
  if (
    !interactiveComponents.some(c => c.type === 'interactive-projective-space') && 
    (contentText.includes('projective space') || contentText.includes('hapd algorithm'))
  ) {
    interactiveComponents.push({
      type: 'interactive-projective-space',
      id: `${sectionId}-projective-space`,
      content: 'Projective Space Visualizer',
      title: 'Projective Space Visualizer'
    });
  }
  
  if (
    !interactiveComponents.some(c => c.type === 'interactive-subtractive-algorithm') && 
    contentText.includes('subtractive algorithm')
  ) {
    interactiveComponents.push({
      type: 'interactive-subtractive-algorithm',
      id: `${sectionId}-subtractive-algorithm`,
      content: 'Subtractive Algorithm Visualizer',
      title: 'Subtractive Algorithm Visualizer'
    });
  }
  
  if (
    !interactiveComponents.some(c => c.type === 'interactive-cubic-field') && 
    (contentText.includes('cubic field') || contentText.includes('minimal polynomial'))
  ) {
    interactiveComponents.push({
      type: 'interactive-cubic-field',
      id: `${sectionId}-cubic-field`,
      content: 'Cubic Field Explorer',
      title: 'Cubic Field Explorer'
    });
  }
  
  return interactiveComponents;
};

export default ComponentRegistry;

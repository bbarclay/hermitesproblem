'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// Dynamically import interactive components
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

interface InteractiveToolsInjectorProps {
  sectionId: string;
  content: string[];
}

const InteractiveToolsInjector: React.FC<InteractiveToolsInjectorProps> = ({
  sectionId,
  content
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tools, setTools] = useState<string[]>([]);

  // Detect which tools to show based on section content
  useEffect(() => {
    const contentText = content.join(' ').toLowerCase();
    const detectedTools: string[] = [];

    if (
      sectionId.includes('hapd-algorithm') ||
      sectionId.includes('projective') ||
      contentText.includes('projective space') ||
      contentText.includes('hapd algorithm')
    ) {
      detectedTools.push('projective');
    }

    if (
      sectionId.includes('subtractive') ||
      contentText.includes('subtractive algorithm')
    ) {
      detectedTools.push('subtractive');
    }

    if (
      sectionId.includes('cubic') ||
      sectionId.includes('field') ||
      sectionId.includes('matrix') ||
      contentText.includes('cubic field') ||
      contentText.includes('minimal polynomial')
    ) {
      detectedTools.push('cubic');
    }

    setTools(detectedTools);
  }, [sectionId, content]);

  // If no tools detected, don't render anything
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="my-8 border rounded-lg overflow-hidden bg-white shadow-lg">
      <div
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-blue-500" />
          <h3 className="text-lg font-semibold">Interactive Tools</h3>
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>

      {expanded && (
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Explore the mathematical concepts in this section through interactive visualizations.
          </p>

          <Tabs defaultValue={tools[0]} className="w-full">
            <TabsList className={`grid w-full grid-cols-${tools.length}`}>
              {tools.includes('projective') && (
                <TabsTrigger value="projective">Projective Space</TabsTrigger>
              )}
              {tools.includes('subtractive') && (
                <TabsTrigger value="subtractive">Subtractive Algorithm</TabsTrigger>
              )}
              {tools.includes('cubic') && (
                <TabsTrigger value="cubic">Cubic Fields</TabsTrigger>
              )}
            </TabsList>

            {tools.includes('projective') && (
              <TabsContent value="projective" className="mt-4">
                <ProjectiveSpaceVisualizer />
              </TabsContent>
            )}

            {tools.includes('subtractive') && (
              <TabsContent value="subtractive" className="mt-4">
                <SubtractiveAlgorithmVisualizer />
              </TabsContent>
            )}

            {tools.includes('cubic') && (
              <TabsContent value="cubic" className="mt-4">
                <CubicFieldExplorer />
              </TabsContent>
            )}
          </Tabs>

          <div className="mt-4 text-right">
            <Button asChild variant="outline" size="sm">
              <a href="/interactive" target="_blank" rel="noopener noreferrer">
                Open in Full Screen
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveToolsInjector;

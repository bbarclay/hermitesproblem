'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectiveSpaceVisualizer from '@/components/interactive/ProjectiveSpaceVisualizer';
import SubtractiveAlgorithmVisualizer from '@/components/interactive/SubtractiveAlgorithmVisualizer';
import CubicFieldExplorer from '@/components/interactive/CubicFieldExplorer';

export default function InteractiveToolsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Interactive Mathematical Tools</h1>
      <p className="text-gray-600 mb-8">
        Explore the mathematical concepts from Hermite's Problem through these interactive visualizations.
      </p>
      
      <Tabs defaultValue="projective" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projective">Projective Space</TabsTrigger>
          <TabsTrigger value="subtractive">Subtractive Algorithm</TabsTrigger>
          <TabsTrigger value="cubic">Cubic Fields</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projective" className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Projective Space Visualizer</h2>
            <p className="text-gray-600 mb-4">
              This tool visualizes the HAPD algorithm in projective space. It shows how the algorithm detects periodicity
              for cubic irrationals by tracking trajectories in projective space.
            </p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <ProjectiveSpaceVisualizer />
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">How It Works</h3>
              <p className="mb-2">
                The HAPD algorithm works by tracking a triple of values (v₁, v₂, v₃) in projective space. For a cubic irrational α:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>We start with (α, α², 1)</li>
                <li>At each step, we compute integer parts and remainders</li>
                <li>We update the triple based on these values</li>
                <li>For cubic irrationals, the trajectory eventually returns to a previous point in projective space</li>
                <li>This periodicity is what the visualizer detects and displays</li>
              </ol>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subtractive" className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Subtractive Algorithm Visualizer</h2>
            <p className="text-gray-600 mb-4">
              This tool demonstrates the Subtractive HAPD algorithm, which is a variant that offers computational advantages
              while maintaining the theoretical properties of the original algorithm.
            </p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <SubtractiveAlgorithmVisualizer />
            </div>
            
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Key Advantages</h3>
              <p className="mb-2">
                The Subtractive Algorithm offers several advantages over the standard HAPD algorithm:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Simpler update rule using the maximum remainder</li>
                <li>Reduced computational complexity</li>
                <li>Better numerical stability in floating-point implementations</li>
                <li>Maintains the same theoretical guarantees for detecting cubic irrationals</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="cubic" className="mt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Cubic Field Explorer</h2>
            <p className="text-gray-600 mb-4">
              This tool allows you to explore cubic fields and their properties. You can input a polynomial or a cubic irrational
              and examine the field's discriminant, trace sequence, and periodicity.
            </p>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <CubicFieldExplorer />
            </div>
            
            <div className="mt-6 bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Mathematical Background</h3>
              <p className="mb-2">
                Cubic fields are number fields of degree 3 over the rational numbers. They have rich mathematical properties:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>They can be represented as Q(α) where α is a cubic irrational</li>
                <li>The companion matrix of the minimal polynomial encodes important field properties</li>
                <li>The trace sequence of powers of the companion matrix exhibits periodicity</li>
                <li>This periodicity is related to the continued fraction expansion of the cubic irrational</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

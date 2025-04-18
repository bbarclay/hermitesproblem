'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TexBlock from '@/components/tex/TexBlock';
import TexParser from '@/components/tex/TexParser';

export default function ComponentsDebugPage() {
  const [texContent, setTexContent] = useState(`
Here is some sample TeX content with math: $E = mc^2$

\\begin{theorem}
This is a theorem with inline math: $a^2 + b^2 = c^2$
\\end{theorem}

\\begin{equation}
F = G \\frac{m_1 m_2}{r^2}
\\end{equation}

\\begin{itemize}
\\item First item
\\item Second item with math: $\\int_0^\\infty e^{-x} dx = 1$
\\item Third item
\\end{itemize}
  `.trim());
  
  const blockTypes = [
    'theorem',
    'lemma',
    'definition',
    'proposition',
    'corollary',
    'example',
    'proof',
    'equation',
    'figure',
    'algorithm',
    'table'
  ];
  
  const [selectedBlockType, setSelectedBlockType] = useState('theorem');
  const [blockTitle, setBlockTitle] = useState('Sample Theorem');
  const [blockContent, setBlockContent] = useState('This is a sample theorem with math: $a^2 + b^2 = c^2$');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Component Tester</h1>
      <p className="text-gray-600 mb-8">
        Test and preview UI components in isolation.
      </p>
      
      <Tabs defaultValue="tex-parser">
        <TabsList className="mb-4">
          <TabsTrigger value="tex-parser">TeX Parser</TabsTrigger>
          <TabsTrigger value="tex-block">TeX Block</TabsTrigger>
          <TabsTrigger value="ui-components">UI Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tex-parser">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Input</h2>
              
              <textarea
                className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
                value={texContent}
                onChange={(e) => setTexContent(e.target.value)}
              />
              
              <div className="mt-4">
                <Button
                  onClick={() => setTexContent(`
Here is some sample TeX content with math: $E = mc^2$

\\begin{theorem}
This is a theorem with inline math: $a^2 + b^2 = c^2$
\\end{theorem}

\\begin{equation}
F = G \\frac{m_1 m_2}{r^2}
\\end{equation}

\\begin{itemize}
\\item First item
\\item Second item with math: $\\int_0^\\infty e^{-x} dx = 1$
\\item Third item
\\end{itemize}
                  `.trim())}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Output</h2>
              
              <div className="border rounded-lg p-4 bg-gray-50 min-h-64">
                <TexParser content={texContent} debug={true} />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tex-block">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Input</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Block Type</label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedBlockType}
                    onChange={(e) => setSelectedBlockType(e.target.value)}
                  >
                    {blockTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    value={blockTitle}
                    onChange={(e) => setBlockTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    className="w-full h-32 p-2 border rounded-lg font-mono text-sm"
                    value={blockContent}
                    onChange={(e) => setBlockContent(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Output</h2>
              
              <div className="border rounded-lg p-4 bg-gray-50 min-h-64">
                <TexBlock
                  type={selectedBlockType}
                  id={`sample-${selectedBlockType}`}
                  title={blockTitle}
                  content={blockContent}
                  number={1}
                />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ui-components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Card Component</CardTitle>
                  <CardDescription>A versatile card component for displaying content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is a sample card with some content.</p>
                </CardContent>
              </Card>
              
              <div className="border rounded-lg p-4 bg-white mb-6">
                <h3 className="text-lg font-semibold mb-2">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-2">Tabs</h3>
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1">
                    <div className="p-4 bg-gray-50 rounded-lg mt-2">
                      <p>Content for Tab 1</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="tab2">
                    <div className="p-4 bg-gray-50 rounded-lg mt-2">
                      <p>Content for Tab 2</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="tab3">
                    <div className="p-4 bg-gray-50 rounded-lg mt-2">
                      <p>Content for Tab 3</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div>
              <div className="border rounded-lg p-4 bg-white mb-6">
                <h3 className="text-lg font-semibold mb-2">Button Sizes</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Button size="lg">Large</Button>
                    <Button>Default</Button>
                    <Button size="sm">Small</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="lg">Large</Button>
                    <Button variant="outline">Default</Button>
                    <Button variant="outline" size="sm">Small</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-white">
                <h3 className="text-lg font-semibold mb-2">Card Variations</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Compact Card</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>A more compact card design.</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Colored Card</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p>A card with custom background color.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

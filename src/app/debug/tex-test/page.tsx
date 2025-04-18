'use client';

import React, { useState } from 'react';
import EnhancedTexParser from '@/components/tex/EnhancedTexParser';
import TexBlock from '@/components/tex/TexBlock';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TexTestPage() {
  const [texContent, setTexContent] = useState(`
Here is some sample TeX content with inline math: $E = mc^2$

\\begin{theorem}
This is a theorem with inline math: $a^2 + b^2 = c^2$
\\end{theorem}

\\begin{equation}
F = G \\frac{m_1 m_2}{r^2}
\\end{equation}

\\begin{align}
a &= b + c \\\\
d &= e + f
\\end{align}

\\begin{itemize}
\\item First item
\\item Second item with math: $\\int_0^\\infty e^{-x} dx = 1$
\\item Third item
\\end{itemize}

\\begin{enumerate}
\\item First numbered item
\\item Second numbered item with math: $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$
\\item Third numbered item
\\end{enumerate}

\\begin{tabular}{lcr}
Left & Center & Right \\\\
1 & 2 & 3 \\\\
4 & 5 & 6
\\end{tabular}

\\textbf{Bold text} and \\textit{italic text} and \\emph{emphasized text}.

Reference to equation \\ref{eq:example} and citation \\cite{author2023}.

\\begin{proof}
This is a proof with inline math: $x^n + y^n = z^n$ has no integer solutions for $n > 2$.
\\end{proof}
  `.trim());
  
  const [debugMode, setDebugMode] = useState(false);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">TeX Rendering Test</h1>
      <p className="text-gray-600 mb-8">
        Test the enhanced TeX rendering capabilities.
      </p>
      
      <div className="mb-4">
        <Button 
          variant={debugMode ? "default" : "outline"}
          onClick={() => setDebugMode(!debugMode)}
          className="mr-2"
        >
          {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
        </Button>
      </div>
      
      <Tabs defaultValue="parser">
        <TabsList className="mb-4">
          <TabsTrigger value="parser">Enhanced Parser</TabsTrigger>
          <TabsTrigger value="blocks">TeX Blocks</TabsTrigger>
          <TabsTrigger value="editor">TeX Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parser">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Input</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm h-[500px] overflow-y-auto">
                {texContent}
              </pre>
            </div>
            
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Output</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto h-[500px] overflow-y-auto">
                <EnhancedTexParser content={texContent} debug={debugMode} />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="blocks">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <TexBlock
                type="theorem"
                id="theorem-example"
                title="Pythagorean Theorem"
                content="In a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the lengths of the other two sides: $a^2 + b^2 = c^2$"
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="lemma"
                id="lemma-example"
                content="If $n$ is a positive integer, then $n^2 \\geq n$."
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="definition"
                id="definition-example"
                content="A **cubic irrational** is a real number that is a root of an irreducible cubic polynomial with integer coefficients."
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="proposition"
                id="proposition-example"
                content="The continued fraction expansion of a real number is eventually periodic if and only if the number is a quadratic irrational."
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="corollary"
                id="corollary-example"
                content="The continued fraction expansion of a cubic irrational is not eventually periodic."
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="proof"
                id="proof-example"
                content="Assume for contradiction that the continued fraction expansion of a cubic irrational $\\alpha$ is eventually periodic. Then by the previous proposition, $\\alpha$ would be a quadratic irrational. But this contradicts the fact that $\\alpha$ is a cubic irrational."
              />
            </div>
            
            <div>
              <TexBlock
                type="equation"
                id="equation-example"
                content="E = mc^2"
                number={1}
              />
            </div>
            
            <div>
              <TexBlock
                type="algorithm"
                id="algorithm-example"
                title="HAPD Algorithm"
                content={`Input: Cubic irrational α
Output: Period length or "Not periodic"

1. Initialize v = (α, α², 1)
2. For i = 1 to MAX_ITERATIONS:
   a. Compute integer parts a₁, a₂
   b. Calculate remainders r₁, r₂
   c. Update v = (r₁, r₂, v₃ - a₁r₁ - a₂r₂)
   d. Normalize v
   e. If v is close to a previous value:
      Return period length
3. Return "Not periodic"`}
                number={1}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">TeX Editor</h2>
              <textarea
                className="w-full h-[500px] p-4 border rounded-lg font-mono text-sm"
                value={texContent}
                onChange={(e) => setTexContent(e.target.value)}
              />
            </div>
            
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto h-[500px] overflow-y-auto">
                <EnhancedTexParser content={texContent} debug={debugMode} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

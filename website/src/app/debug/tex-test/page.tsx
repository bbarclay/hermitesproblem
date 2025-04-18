'use client';

import React, { useState } from 'react';
import EnhancedTexParser from '@/components/tex/EnhancedTexParser';
import TexBlock from '@/components/tex/TexBlock';
import { Button } from '@/components/ui/button';

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
          onClick={() => setDebugMode(!debugMode)}
          className="mr-2"
        >
          {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Input</h2>
          <textarea
            className="w-full h-[500px] p-4 border rounded-lg font-mono text-sm"
            value={texContent}
            onChange={(e) => setTexContent(e.target.value)}
          />
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto h-[500px] overflow-y-auto">
            <EnhancedTexParser content={texContent} debug={debugMode} />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">TeX Block Examples</h2>
        
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
        </div>
      </div>
    </div>
  );
}

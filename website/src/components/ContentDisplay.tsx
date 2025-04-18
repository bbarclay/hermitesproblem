'use client';

import { ArrowUp, Download, Printer, BookOpen, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSectionIcon } from './ContentUtils';
import ContentViewer from './ContentViewer';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Dynamic academic styles that support both light and dark modes
const getAcademicStyles = (theme: string | undefined) => `
:root {
  --primary-color: hsl(var(--primary));
  --secondary-color: hsl(var(--secondary));
  --text-color: hsl(var(--foreground));
  --muted-text: hsl(var(--muted-foreground));
  --border-color: hsl(var(--border));
  --theorem-bg: ${theme === 'dark' ? 'hsl(var(--theorem-bg))' : '#f0f9ff'};
  --definition-bg: ${theme === 'dark' ? 'hsl(var(--definition-bg))' : '#f0fdf4'};
  --lemma-bg: ${theme === 'dark' ? 'hsl(var(--lemma-bg))' : '#fef3f2'};
  --example-bg: ${theme === 'dark' ? 'hsl(var(--example-bg))' : '#fffbeb'};
  --proof-bg: ${theme === 'dark' ? 'hsl(var(--proof-bg))' : '#f8fafc'};
  --algorithm-bg: ${theme === 'dark' ? 'hsl(var(--algorithm-bg))' : '#f9fafb'};
  --citation-color: ${theme === 'dark' ? 'hsl(var(--citation-color))' : '#4b5563'};
  --link-color: ${theme === 'dark' ? 'hsl(var(--link-color))' : '#2563eb'};
}
.academic-paper {
  font-family: var(--font-sans), sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  counter-reset: theorem definition lemma proposition corollary example equation algorithm;
}
@media print {
  .paper-controls, .ml-64 {
    display: none !important;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .academic-paper {
    margin: 0;
    padding: 2rem;
    max-width: 100% !important;
  }
}
`;

interface ContentDisplayProps {
  currentFile: string;
  currentSection: string;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  staticContent?: Record<string, any>;
}

export default function ContentDisplay({
  currentFile,
  currentSection,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = true,
  hasNext = true,
  staticContent,
}: ContentDisplayProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    // Create a hidden iframe for printing to PDF
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    // Get the content and clone it into the iframe
    const contentElement = document.querySelector('.academic-paper');
    if (!contentElement) {
      window.alert('Content not found for PDF export');
      return;
    }

    const contentClone = contentElement.cloneNode(true) as HTMLElement;

    // Set up the iframe document
    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.alert('Error creating PDF document');
      return;
    }

    // Write the content to the iframe
    frameDoc.open();
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hermite's Problem - ${currentFile}</title>
          <style>${getAcademicStyles('light')}</style>
          <style>
            body { margin: 2rem; font-family: var(--font-sans), sans-serif; }
            img { max-width: 100%; height: auto; }
            .paper-controls, .navigation-controls { display: none !important; }
          </style>
        </head>
        <body>
          <div class="academic-paper">
            ${contentClone.innerHTML}
          </div>
        </body>
      </html>
    `;
    frameDoc.write(htmlContent);
    frameDoc.close();

    // Use the print dialog to save as PDF
    setTimeout(() => {
      printFrame.contentWindow?.print();
      // Remove the iframe after printing
      setTimeout(() => document.body.removeChild(printFrame), 100);
    }, 500);
  };

  const cleanLatexCommands = (content: string): string => {
    return content
      .replace(/\\\((.*?)\\\)/g, '$$$1$$')
      .replace(/\\\[(.*?)\\\]/g, '$$$$\n$1\n$$$$')
      // Uncommented block for LaTeX environment processing - using a pre-ES2018 compatible approach
      .replace(/\\begin\{(.*?)\}([^]*?)\\end\{\1\}/g, (_, env: string, content: string) => {
        if (env === 'equation' || env === 'align' || env === 'align*') {
          return `$$$$\n${content}\n$$$$`;
        }
        if (env === 'algorithm_def') {
          return `<div class="algorithm-def">\n${content}\n</div>`;
        }
        if (env === 'enumerate') {
          return content.split('\\item').filter(Boolean).map((item: string, i: number) => `${i+1}. ${item.trim()}`).join('\n');
        }
        if (env === 'itemize') {
          return content.split('\\item').filter(Boolean).map((item: string) => `- ${item.trim()}`).join('\n');
        }
        if (env === 'theorem' || env === 'lemma' || env === 'proposition' || env === 'definition' || env === 'corollary') {
          return `**${env.charAt(0).toUpperCase() + env.slice(1)}:** ${content}`;
        }
        if (env === 'proof') {
          return `*Proof:* ${content}`;
        }
        return content;
      })
      .replace(/\\HAPD/g, 'HAPD')
      .replace(/\\mathbb\{([A-Z])\}/g, (_, letter) => {
        const unicodeMap: Record<string, string> = {
          'R': 'ℝ', 'Z': 'ℤ', 'N': 'ℕ', 'Q': 'ℚ', 'C': 'ℂ'
        };
        return unicodeMap[letter] || letter;
      })
      .replace(/\\floor\{([^}]+)\}/g, '⌊$1⌋')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\operatorname\{([^}]+)\}/g, (_, name) => name)
      .replace(/\\Z/g, 'ℤ')
      .replace(/\\N/g, 'ℕ')
      .replace(/\\R/g, 'ℝ')
      .replace(/\\alpha/g, 'α')
      .replace(/##/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <style>{getAcademicStyles(mounted ? theme : undefined)}</style>
      <style>{`
        .gradient-border {
          position: relative;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .dark .gradient-border {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }

        .gradient-border::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 0.5rem;
          border: 1px solid transparent;
          background: linear-gradient(135deg, #3b82f620, #10b98120) border-box;
          -webkit-mask:
            linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
          z-index: 10;
          opacity: 0.5;
        }

        /* Responsive styles */
        .paper-controls {
          position: fixed;
          right: 1rem;
          top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 10;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background-color: hsl(var(--card));
          color: hsl(var(--card-foreground));
          border-radius: 9999px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .dark .control-button {
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }

        .control-button:hover {
          background-color: hsl(var(--secondary));
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .dark .control-button:hover {
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .paper-controls {
            bottom: 1rem;
            top: auto;
            right: 1rem;
            flex-direction: row;
          }

          .academic-paper {
            padding: 0.5rem;
          }
        }

        .katex-display {
          padding: 0.5rem 0;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .algorithm-def {
          background-color: #f8fafc;
          padding: 1rem;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          border-left: 3px solid #e2e8f0;
        }
      `}</style>
      <div className="paper-controls">
        <div className="control-button" onClick={scrollToTop} title="Scroll to top">
          <ArrowUp size={18} />
        </div>
        <div className="control-button" onClick={handlePrint} title="Print paper">
          <Printer size={18} />
        </div>
        <div className="control-button" onClick={handleDownloadPDF} title="Download as PDF">
          <Download size={18} />
        </div>
        <div className="control-button" title="Reading mode">
          <BookOpen size={18} />
        </div>
        <div className="control-button" title="Bookmark">
          <Bookmark size={18} />
        </div>
      </div>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm mb-4">
        <div className="max-w-5xl mx-auto px-4 py-2 flex justify-between items-center">
          <button
            onClick={onNavigatePrev}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${hasPrev ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <ChevronLeft size={16} />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <div className="text-sm font-medium text-gray-500">
            {currentSection}
          </div>

          <button
            onClick={onNavigateNext}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${hasNext ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <ContentViewer
          file={currentFile}
          sectionId={currentSection}
          onNavigatePrev={onNavigatePrev}
          onNavigateNext={onNavigateNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
          debug={false}
          staticContent={staticContent}
        />
      </div>
    </div>
  );
}
'use client';

import { ArrowUp, Download, Printer, BookOpen, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSectionIcon } from './ContentUtils';
import ContentViewer from './ContentViewer';

const academicStyles = `
:root {
  --primary-color: #2563eb;
  --secondary-color: #f3f4f6;
  --text-color: #1f2937;
  --muted-text: #6b7280;
  --border-color: #e5e7eb;
  --theorem-bg: #f0f9ff;
  --definition-bg: #f0fdf4;
  --lemma-bg: #fef3f2;
  --example-bg: #fffbeb;
  --proof-bg: #f8fafc;
  --algorithm-bg: #f9fafb;
  --citation-color: #4b5563;
  --link-color: #2563eb;
}
.academic-paper {
  font-family: "Times New Roman", Times, serif;
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
}

export default function ContentDisplay({
  currentFile,
  currentSection,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = true,
  hasNext = true,
}: ContentDisplayProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePrint = () => window.print();
  const handleDownloadPDF = () => window.alert('PDF download would be implemented here');

  return (
    <div className="ml-64 min-h-screen bg-gray-50 py-4">
      <style>{academicStyles}</style>
      <style>{`
        .gradient-border {
          position: relative;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
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
            {getSectionIcon(currentFile)}
            <span className="ml-2">{currentFile.replace(/-/g, ' ').toUpperCase()}</span>
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

      {/* Main content viewer */}
      <ContentViewer
        currentFile={currentFile}
        currentSection={currentSection}
        onNavigatePrev={onNavigatePrev}
        onNavigateNext={onNavigateNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
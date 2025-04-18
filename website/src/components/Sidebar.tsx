'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Calculator,
  BookOpen,
  GraduationCap,
  Brain,
  Microscope,
  Sigma,
  Binary,
  Waves,
  Lightbulb,
  Compass,
  ScrollText,
  FileSearch,
  Database,
  Gauge
} from 'lucide-react';

interface Section {
  title: string;
  id: string;
  file: string;
  level: string;
}

interface TOC {
  paper: {
    title: string;
    authors: string[];
    date: string;
    sections: Section[];
  };
}

// Map of section file names to icons
const sectionIcons: Record<string, React.ReactNode> = {
  'abstract': <Bookmark size={18} />,
  'introduction': <BookOpen size={18} />,
  'galois-theory': <GraduationCap size={18} />,
  'hapd-algorithm': <Microscope size={18} />,
  'matrix-approach': <Sigma size={18} />,
  'matrix-verification': <Calculator size={18} />,
  'matrix-computational': <Binary size={18} />,
  'equivalence': <Compass size={18} />,
  'subtractive-algorithm': <Waves size={18} />,
  'numerical-validation': <Gauge size={18} />,
  'objections-tex': <Lightbulb size={18} />,
  'implementation-examples': <Database size={18} />,
  'conclusion': <Brain size={18} />,
  'bibliography': <ScrollText size={18} />,
  'debug-test': <FileSearch size={18} />
};

// Function to get icon for a section
const getSectionIcon = (file: string) => {
  return sectionIcons[file] || <FileText size={18} />;
};

interface SidebarProps {
  currentFile: string;
  currentSection: string;
  onNavigate: (file: string, section: string) => void;
  staticContent?: any; // Add static content prop
}

export default function Sidebar({ currentFile, currentSection, onNavigate, staticContent }: SidebarProps) {
  const [toc, setToc] = useState<TOC | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Use static content if provided, otherwise fetch
    if (staticContent) {
      setToc(staticContent);

      // Initially expand the current file
      if (currentFile) {
        setExpandedFiles(prev => ({
          ...prev,
          [currentFile]: true
        }));
      }

      setLoading(false);
    } else {
      fetch('/content/toc.json')
        .then(res => res.json())
        .then(data => {
          setToc(data);

          // Initially expand the current file
          if (currentFile) {
            setExpandedFiles(prev => ({
              ...prev,
              [currentFile]: true
            }));
          }

          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading TOC:', err);
          setLoading(false);
        });
    }
  }, [currentFile, staticContent]);

  const toggleFileExpanded = (file: string) => {
    setExpandedFiles(prev => ({
      ...prev,
      [file]: !prev[file]
    }));
  };

  const handleSectionClick = (file: string, sectionId: string) => {
    onNavigate(file, sectionId);

    // Add scrolling to section anchor
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 border-r border-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!toc) {
    return (
      <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 border-r border-gray-200 p-4">
        <div className="text-red-500">Failed to load table of contents</div>
      </div>
    );
  }

  // Group sections by file
  const sectionsByFile: Record<string, Section[]> = {};

  // Add a null check before accessing toc.paper.sections
  if (toc && toc.paper && toc.paper.sections) {
    toc.paper.sections.forEach(section => {
      if (!sectionsByFile[section.file]) {
        sectionsByFile[section.file] = [];
      }
      sectionsByFile[section.file].push(section);
    });
  } else {
    console.error('Missing or invalid TOC structure:', toc);
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <Link href="/" className="block">
          <h1 className="text-lg font-bold mb-2">Hermite's Problem</h1>
          <div className="text-sm text-gray-600 mb-4">Novel Approaches for Cubic Irrationals</div>
        </Link>

        {/* Interactive Tools Link */}
        <div className="mb-4 border-b pb-2">
          <Link
            href="/interactive"
            className="flex items-center p-2 rounded text-sm hover:bg-gray-200 bg-blue-50"
          >
            <FileText size={18} className="mr-2" />
            <span className="font-medium">Interactive Tools</span>
          </Link>
        </div>

        <div className="space-y-1">
          {Object.entries(sectionsByFile).map(([file, sections]) => {
            const fileTitle = sections[0]?.title || file;
            const isExpanded = expandedFiles[file];
            const isCurrentFile = file === currentFile;

            return (
              <div key={file} className="border-b border-gray-200 pb-1 mb-1">
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-200 ${isCurrentFile ? 'bg-blue-100' : ''}`}
                  onClick={() => toggleFileExpanded(file)}
                >
                  <div className="flex items-center space-x-2">
                    {getSectionIcon(file)}
                    <span className="text-sm font-medium">{fileTitle}</span>
                  </div>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>

                {isExpanded && (
                  <div className="ml-5 pl-2 border-l border-gray-300 mt-1 space-y-1">
                    {sections.map(section => (
                      <div
                        key={section.id}
                        className={`flex items-center p-1 rounded text-sm hover:bg-gray-200 cursor-pointer ${
                          currentFile === file && currentSection === section.id ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                        }`}
                        onClick={() => handleSectionClick(file, section.id)}
                      >
                        <div className="flex-1 truncate">{section.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
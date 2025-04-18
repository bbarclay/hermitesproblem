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
  FolderTree,
  PenTool,
  BookMarked,
  FileDigit,
  Menu,
  X
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
  'matrix-approach': <Sigma size={18} />,
  'equivalence': <Binary size={18} />,
  'hapd-algorithm': <Calculator size={18} />,
  'subtractive-algorithm': <Waves size={18} />,
  'numerical-validation': <Microscope size={18} />,
  'conclusion': <Lightbulb size={18} />,
  'bibliography': <ScrollText size={18} />,
};

// Function to get the icon for a section
const getSectionIcon = (file: string) => {
  return sectionIcons[file] || <FileText size={18} />;
};

interface SidebarProps {
  currentFile: string;
  currentSection: string;
  onNavigate: (file: string, section: string) => void;
  staticContent?: any;
}

export default function Sidebar({ currentFile, currentSection, onNavigate, staticContent }: SidebarProps) {
  const [toc, setToc] = useState<TOC | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  if (loading) {
    return (
      <div className="fixed top-0 left-0 h-screen bg-gray-100 border-r border-gray-200 flex items-center justify-center w-16 z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!toc) {
    return (
      <div className="fixed top-0 left-0 h-screen bg-gray-100 border-r border-gray-200 p-4 w-16 z-50">
        <div className="text-red-500">Failed to load TOC</div>
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
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Toggle button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <div className={`fixed top-0 left-0 h-screen overflow-y-auto bg-gray-100 border-r border-gray-200 z-40 transition-all duration-300 ${isCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        {!isCollapsed && (
          <div className="p-4">
            <h1 className="text-lg font-bold mb-2">Hermite's Problem</h1>
            <div className="text-sm text-gray-600 mb-4">Novel Approaches for Cubic Irrationals</div>

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
                            onClick={() => {
                              onNavigate(file, section.id);
                              if (window.innerWidth < 1024) {
                                setIsCollapsed(true);
                              }
                            }}
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
        )}

        {/* Collapsed sidebar view */}
        {isCollapsed && (
          <div className="p-2 flex flex-col items-center space-y-4 pt-14">
            {Object.entries(sectionsByFile).map(([file, sections]) => {
              const isCurrentFile = file === currentFile;
              return (
                <div
                  key={file}
                  className={`p-2 rounded-full cursor-pointer hover:bg-gray-200 ${isCurrentFile ? 'bg-blue-100' : ''}`}
                  onClick={() => {
                    onNavigate(file, sections[0].id);
                    setExpandedFiles(prev => ({
                      ...prev,
                      [file]: true
                    }));
                    // Expand on larger screens
                    if (window.innerWidth >= 1024) {
                      setIsCollapsed(false);
                    }
                  }}
                  title={sections[0]?.title || file}
                >
                  {getSectionIcon(file)}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Spacer to push main content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}></div>
    </>
  );
}

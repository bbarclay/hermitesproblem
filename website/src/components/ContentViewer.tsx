'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TexContent from './tex/TexContent';
import JsonDebugger from './debug/JsonDebugger';

interface ContentViewerProps {
  file: string;
  sectionId?: string;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  debug?: boolean;
  staticContent?: Record<string, any>;
}

export default function ContentViewer({
  file,
  sectionId,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = false,
  hasNext = false,
  debug = false,
  staticContent
}: ContentViewerProps) {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<any>(null);

  // Load content
  useEffect(() => {
    if (!file) {
      setError('No file specified');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use staticContent if provided, otherwise fetch from API
    if (staticContent && staticContent[file]) {
      const data = staticContent[file];
      if (!data || !data.sections) {
        setError('Invalid content format');
        setLoading(false);
        return;
      }

      setContent(data);
      setLoading(false);

      // Find the active section
      if (sectionId && data.sections) {
        // First check top-level sections
        let section = data.sections.find((s: any) => s.id === sectionId);

        // If not found, check subsections
        if (!section) {
          for (const s of data.sections) {
            if (s.subsections) {
              const subsection = s.subsections.find((sub: any) => sub.id === sectionId);
              if (subsection) {
                section = subsection;
                break;
              }
            }
          }
        }

        setActiveSection(section || data.sections[0]);
      } else if (data.sections && data.sections.length > 0) {
        // Default to first section if no ID provided
        setActiveSection(data.sections[0]);
      }
    } else {
      // Remove any .json extension if present
      const cleanFile = file.replace(/\.json$/, '');

      fetch(`/content/${cleanFile}.json`)
        .then(res => {
          if (!res.ok) {
            if (res.status === 404) {
              throw new Error(`Content file "${cleanFile}.json" not found`);
            }
            throw new Error(`Failed to load content: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          if (!data || !data.sections) {
            throw new Error('Invalid content format');
          }
          setContent(data);
          setLoading(false);

          // Find the active section
          if (sectionId && data.sections) {
            // First check top-level sections
            let section = data.sections.find((s: any) => s.id === sectionId);

            // If not found, check subsections
            if (!section) {
              for (const s of data.sections) {
                if (s.subsections) {
                  const subsection = s.subsections.find((sub: any) => sub.id === sectionId);
                  if (subsection) {
                    section = subsection;
                    break;
                  }
                }
              }
            }

            setActiveSection(section || data.sections[0]);
          } else if (data.sections && data.sections.length > 0) {
            // Default to first section if no ID provided
            setActiveSection(data.sections[0]);
          }
        })
        .catch(err => {
          console.error('Error loading content:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [file, sectionId, staticContent]);

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          <p>No content available.</p>
        </div>
      );
    }

    // If we have active section, render it
    if (activeSection) {
      return (
        <div>
          <h2 id={activeSection.id} className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{activeSection.title}</h2>

          {activeSection.content && (
            <div className="mb-8">
              <TexContent content={activeSection.content.join('\n')} />
            </div>
          )}

          {activeSection.subsections && activeSection.subsections.map((subsection: any) => (
            <div key={subsection.id} className="mb-8">
              <h3 id={subsection.id} className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{subsection.title}</h3>

              {subsection.content && (
                <TexContent content={subsection.content.join('\n')} />
              )}
            </div>
          ))}

          {debug && (
            <JsonDebugger
              data={activeSection}
              title={`Debug: ${activeSection.title}`}
              initiallyExpanded={false}
            />
          )}
        </div>
      );
    }

    // Fallback to rendering all sections
    return (
      <div>
        {content.sections && content.sections.map((section: any) => (
          <div key={section.id} className="mb-12">
            <h2 id={section.id} className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{section.title}</h2>

            {section.content && (
              <div className="mb-8">
                <TexContent content={section.content.join('\n')} />
              </div>
            )}

            {section.subsections && section.subsections.map((subsection: any) => (
              <div key={subsection.id} className="mb-8">
                <h3 id={subsection.id} className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{subsection.title}</h3>

                {subsection.content && (
                  <TexContent content={subsection.content.join('\n')} />
                )}
              </div>
            ))}
          </div>
        ))}

        {debug && (
          <JsonDebugger
            data={content}
            title="Debug: Full Content"
            initiallyExpanded={false}
          />
        )}
      </div>
    );
  };

  return (
    <div className="content-viewer">
      <div className="mb-8">
        {renderContent()}
      </div>

      {/* Bottom navigation on mobile */}
      <div className="mt-6 pb-16 sm:pb-0 flex items-center justify-between text-sm md:hidden">
        <button
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          className={`flex items-center ${!hasPrev ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-400'} bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>
        <button
          onClick={onNavigateNext}
          disabled={!hasNext}
          className={`flex items-center ${!hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-400'} bg-white dark:bg-gray-800 px-3 py-2 rounded-md shadow-sm`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

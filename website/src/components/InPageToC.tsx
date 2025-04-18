'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  level: number;
  isVisible?: boolean;
  subsections?: Section[];
}

interface InPageToCProps {
  content: Section[];
  currentSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export default function InPageToC({
  content,
  currentSection,
  onNavigate,
}: InPageToCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(currentSection);
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  
  // Set up intersection observer to track which sections are visible
  useEffect(() => {
    // Skip if no content or running on server
    if (!content || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setVisibleSections(prev => ({
            ...prev, 
            [entry.target.id]: entry.isIntersecting
          }));
          
          // Update active section based on visibility
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -80% 0px' }
    );

    // Observe all sections 
    const sectionIds = getAllSectionIds(content);
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [content]);

  // Handle section click
  const handleSectionClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      // Default behavior: scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Close ToC on mobile after clicking
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <List size={18} className="mr-2" />
          <span>On this page</span>
        </span>
        {isOpen ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <nav className="p-4 pt-0 max-h-[50vh] overflow-y-auto" aria-label="Table of contents">
          <ul className="space-y-1 text-sm">
            {content.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full text-left py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors
                    ${section.id === activeSection ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : ''}
                    ${visibleSections[section.id] ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`
                  }
                >
                  {section.title}
                </button>
                
                {/* Render subsections if they exist */}
                {section.subsections && section.subsections.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <button
                          onClick={() => handleSectionClick(subsection.id)}
                          className={`w-full text-left py-1 px-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm
                            ${subsection.id === activeSection ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' : ''}
                            ${visibleSections[subsection.id] ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`
                          }
                        >
                          {subsection.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

// Helper function to get all section IDs (flattened)
function getAllSectionIds(sections: Section[]): string[] {
  const ids: string[] = [];
  
  sections.forEach(section => {
    ids.push(section.id);
    
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        ids.push(subsection.id);
      });
    }
  });
  
  return ids;
}
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TexContent from './tex/TexContent';

interface ContentDisplayProps {
  currentFile: string;
  currentSection: string;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  staticContent?: Record<string, any>;
  content?: string; // For backward compatibility
}

const ContentDisplay = ({
  currentFile,
  currentSection,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = false,
  hasNext = false,
  staticContent,
  content // For backward compatibility
}: ContentDisplayProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeContent, setActiveContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load content based on currentFile and currentSection
  useEffect(() => {
    if (!currentFile) {
      setError('No file specified');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use staticContent if provided, otherwise fetch from API
    if (staticContent && staticContent[currentFile]) {
      const data = staticContent[currentFile];
      if (!data || !data.sections) {
        setError('Invalid content format');
        setLoading(false);
        return;
      }

      // Find the active section
      if (currentSection && data.sections) {
        // First check top-level sections
        let section = data.sections.find((s: any) => s.id === currentSection);

        // If not found, check subsections
        if (!section) {
          for (const s of data.sections) {
            if (s.subsections) {
              const subsection = s.subsections.find((sub: any) => sub.id === currentSection);
              if (subsection) {
                section = subsection;
                break;
              }
            }
          }
        }

        if (section) {
          setActiveContent(section);
        } else {
          // Default to first section if section not found
          setActiveContent(data.sections[0]);
        }
      } else if (data.sections && data.sections.length > 0) {
        // Default to first section if no ID provided
        setActiveContent(data.sections[0]);
      }

      setLoading(false);
    } else {
      // Remove any .json extension if present
      const cleanFile = currentFile.replace(/\.json$/, '');

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

          // Find the active section
          if (currentSection && data.sections) {
            // First check top-level sections
            let section = data.sections.find((s: any) => s.id === currentSection);

            // If not found, check subsections
            if (!section) {
              for (const s of data.sections) {
                if (s.subsections) {
                  const subsection = s.subsections.find((sub: any) => sub.id === currentSection);
                  if (subsection) {
                    section = subsection;
                    break;
                  }
                }
              }
            }

            if (section) {
              setActiveContent(section);
            } else {
              // Default to first section if section not found
              setActiveContent(data.sections[0]);
            }
          } else if (data.sections && data.sections.length > 0) {
            // Default to first section if no ID provided
            setActiveContent(data.sections[0]);
          }

          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading content:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [currentFile, currentSection, staticContent]);

  // Dynamic academic styles that support both light and dark modes
  const academicStyles = `
    :root {
      --text-color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
      --primary-color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'};
      --bg-color: ${theme === 'dark' ? '#1e293b' : '#ffffff'};
      --muted-text: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
    }

    .math-content {
      font-family: var(--font-geist-sans);
      line-height: 1.6;
      color: var(--text-color);
    }

    .math-content h1, .math-content h2, .math-content h3 {
      margin-top: 2em;
      margin-bottom: 1em;
      font-weight: 600;
    }

    .math-content .reference {
      color: var(--primary-color);
      text-decoration: none;
    }

    .math-content .reference:hover {
      text-decoration: underline;
    }

    .math-content ol {
      list-style-type: decimal;
      padding-left: 2em;
      margin: 1em 0;
    }

    .math-content .citation {
      font-style: italic;
      color: var(--muted-text);
    }

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
      background-color: ${theme === 'dark' ? '#1e293b' : '#f8fafc'};
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      border-left: 3px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'};
    }

    .algorithm {
      background-color: ${theme === 'dark' ? '#1e293b' : '#f8fafc'};
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      border-left: 3px solid ${theme === 'dark' ? '#94a3b8' : '#64748b'};
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
    }

    .algorithm pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background-color: transparent;
      padding: 0;
      margin: 0;
      white-space: pre-wrap;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .language-algorithm {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-wrap;
      padding: 0;
      background-color: transparent;
    }
  `;

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

    // For backward compatibility with the old ContentDisplay usage
    if (content) {
      return (
        <div className="math-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    if (!activeContent) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded">
          <p>No content available.</p>
        </div>
      );
    }

    // If we have active content, render it
    return (
      <div>
        <h2 id={activeContent.id} className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{activeContent.title}</h2>

        {activeContent.content && (
          <div className="mb-8">
            <TexContent content={activeContent.content.join('\n')} />
          </div>
        )}

        {activeContent.subsections && activeContent.subsections.map((subsection: any) => (
          <div key={subsection.id} className="mb-8">
            <h3 id={subsection.id} className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{subsection.title}</h3>

            {subsection.content && (
              <TexContent content={subsection.content.join('\n')} />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{academicStyles}</style>
      <div className="content-display p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Navigation controls */}
        {(hasPrev || hasNext) && (
          <div className="mt-6 pb-16 sm:pb-0 flex items-center justify-between text-sm">
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
        )}
      </div>
    </>
  );
};

export default ContentDisplay;
import React, { useEffect, useState, useRef } from 'react';
import { Section } from './ContentUtils';
import TexSection from './tex/TexSection';

interface ContentViewerProps {
  currentFile: string;
  currentSection: string;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function ContentViewer({
  currentFile,
  currentSection,
  onNavigatePrev,
  onNavigateNext,
  hasPrev = true,
  hasNext = true,
}: ContentViewerProps) {
  const [content, setContent] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentFile) {
      setLoading(true);
      fetch(`/content/${currentFile}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`Error fetching content: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (data && data.sections && Array.isArray(data.sections)) {
            setContent(data.sections);
          } else {
            setContent([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setContent([]);
        });
    }
  }, [currentFile, currentSection]);

  const currentSectionContent = content && Array.isArray(content) && content.length > 0
    ? (currentSection
      ? content.find(section => section.id === currentSection) || content[0]
      : content[0])
    : undefined;

  const renderContent = () => {
    if (!currentSectionContent) return null;

    // Convert the section to TexSection props format
    const texSectionProps = {
      title: currentSectionContent.title || '',
      id: currentSectionContent.id,
      level: currentSectionContent.level,
      content: currentSectionContent.content,
      blocks: currentSectionContent.blocks?.map(block => ({
        type: block.type,
        id: block.id,
        title: block.title,
        content: block.content,
        number: block.number,
        caption: block.caption,
        image: block.image
      })) || [],
      subsections: currentSectionContent.subsections?.map(subsection => ({
        title: subsection.title || '',
        id: subsection.id,
        level: subsection.level,
        content: subsection.content,
        blocks: subsection.blocks?.map(block => ({
          type: block.type,
          id: block.id,
          title: block.title,
          content: block.content,
          number: block.number,
          caption: block.caption,
          image: block.image
        })) || []
      })) || [],
      currentSubsection: currentSection
    };

    return <TexSection {...texSectionProps} />;
  };

  return (
    <div className="mx-auto max-w-5xl px-4" ref={paperRef}>
      <div className="gradient-border bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8 academic-paper">
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : !currentSectionContent ? (
              <div className="text-gray-600">No content to display</div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
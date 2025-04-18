'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ContentDisplay from '@/components/ContentDisplay';
import allContent from '@/lib/static-content';

// No need to fetch - use pre-generated content
function useNavigationOrder() {
  const [order, setOrder] = useState<{ file: string; section: string }[]>([]);

  useEffect(() => {
    // Use statically imported content
    if (allContent?.toc?.paper?.sections) {
      setOrder(
        allContent.toc.paper.sections.map((s: any) => ({
          file: s.file,
          section: s.id,
        }))
      );
    }
  }, []);

  return order;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigationOrder = useNavigationOrder();

  const [currentFile, setCurrentFile] = useState<string>(searchParams.get('file') || 'introduction');
  const [currentSection, setCurrentSection] = useState<string>(searchParams.get('section') || 'introduction');
  const [isLoading, setIsLoading] = useState(false);

  // Handle navigation
  const handleNavigate = (file: string, section: string) => {
    setIsLoading(true);
    setCurrentFile(file);
    setCurrentSection(section);

    // Update URL
    const params = new URLSearchParams();
    params.set('file', file);
    params.set('section', section);
    router.push(`/?${params.toString()}`);

    setIsLoading(false);
  };

  // Find current position in navigation order
  const getCurrentPosition = () => {
    const currentPosition = navigationOrder.findIndex(
      item => item.file === currentFile && item.section === currentSection
    );
    return currentPosition === -1 ? 0 : currentPosition;
  };

  // Navigate to previous section/subsection
  const handleNavigatePrev = () => {
    const currentPosition = getCurrentPosition();
    if (currentPosition > 0) {
      const prevItem = navigationOrder[currentPosition - 1];
      handleNavigate(prevItem.file, prevItem.section);
    }
  };

  // Navigate to next section/subsection
  const handleNavigateNext = () => {
    const currentPosition = getCurrentPosition();
    if (currentPosition < navigationOrder.length - 1) {
      const nextItem = navigationOrder[currentPosition + 1];
      handleNavigate(nextItem.file, nextItem.section);
    }
  };

  // Check if there are previous/next sections
  const hasPrevSection = getCurrentPosition() > 0;
  const hasNextSection = getCurrentPosition() < navigationOrder.length - 1;

  return (
    <main className="flex min-h-screen relative">
      <Sidebar
        currentFile={currentFile}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        staticContent={allContent.toc}
      />

      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ContentDisplay
            currentFile={currentFile}
            currentSection={currentSection}
            onNavigatePrev={handleNavigatePrev}
            onNavigateNext={handleNavigateNext}
            hasPrev={hasPrevSection}
            hasNext={hasNextSection}
            staticContent={allContent.content}
          />
        )}
      </div>
    </main>
  );
}
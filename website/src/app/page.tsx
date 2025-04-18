'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import allContent from '@/lib/static-content';

// Dynamically import components for better performance
const Sidebar = dynamic(() => import('@/components/Sidebar'), {
  ssr: false,
  loading: () => (
    <div className="fixed top-0 left-0 h-screen w-64 bg-secondary/50 dark:bg-secondary/50 border-r border-border flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

const ContentDisplay = dynamic(() => import('@/components/ContentDisplay'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

// Use static content directly
function useNavigationOrder() {
  const [order, setOrder] = useState<{ file: string; section: string }[]>([]);

  useEffect(() => {
    // Use static content if available
    if (allContent?.toc?.paper?.sections) {
      setOrder(
        allContent.toc.paper.sections.map((s: any) => ({
          file: s.file,
          section: s.id,
        }))
      );
    } else {
      // Fallback to fetch if static content not available
      fetch('/content/toc.json')
        .then(res => res.json())
        .then(data => {
          if (data && data.paper && Array.isArray(data.paper.sections)) {
            setOrder(
              data.paper.sections.map((s: any) => ({
                file: s.file,
                section: s.id,
              }))
            );
          }
        });
    }
  }, []);

  return order;
}

export default function Home() {
  const router = useRouter();
  const navigationOrder = useNavigationOrder();

  // Create a component that uses searchParams
  function HomeContent() {
    const searchParams = useSearchParams();
    const [currentFile, setCurrentFile] = useState<string>(searchParams?.get('file') || 'introduction');
    const [currentSection, setCurrentSection] = useState<string>(searchParams?.get('section') || 'introduction');
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
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
      <main className="flex min-h-screen">
        {/* Mobile menu toggle button */}
        <button 
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
          <Sidebar
            currentFile={currentFile}
            currentSection={currentSection}
            onNavigate={handleNavigate}
            staticContent={allContent.toc}
          />
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

  // Wrap the component in Suspense
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
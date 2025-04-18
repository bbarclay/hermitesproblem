'use client';

import { useEffect, useState } from 'react';
import ContentDisplay from '@/components/ContentDisplay';

export default function DebugTestPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="p-4 bg-red-100 border-b border-red-300">
        <h1 className="text-lg font-bold">Debug Test Page</h1>
        <p>This page is for testing content rendering with the debug-test.json file</p>
      </div>
      
      {isClient ? (
        <ContentDisplay currentFile="debug-test" currentSection="debug-test-section" />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </main>
  );
} 
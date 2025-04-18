import React from 'react';
import { Metadata } from 'next';
import SimpleSidebar from '@/components/SimpleSidebar';

export const metadata: Metadata = {
  title: 'Debug Tools | Hermite\'s Problem',
  description: 'Debug tools for the Hermite\'s Problem website',
};

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SimpleSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}

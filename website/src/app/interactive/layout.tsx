import React from 'react';
import { Metadata } from 'next';
import SimpleSidebar from '@/components/SimpleSidebar';

export const metadata: Metadata = {
  title: 'Interactive Tools | Hermite\'s Problem',
  description: 'Interactive mathematical tools for exploring Hermite\'s Problem and cubic irrationals',
};

export default function InteractiveLayout({
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

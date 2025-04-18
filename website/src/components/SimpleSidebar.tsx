'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Calculator,
  BookOpen,
  Microscope,
  Sigma,
  Binary,
  Waves,
  Lightbulb,
  ScrollText,
  Menu,
  X
} from 'lucide-react';

export default function SimpleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={20} className="text-gray-800 dark:text-gray-200" /> : <X size={20} className="text-gray-800 dark:text-gray-200" />}
      </button>
      
      <div className={`fixed top-0 left-0 h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${isCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        {!isCollapsed && (
          <div className="p-4">
            <h1 className="text-lg font-bold mb-2 dark:text-white">Debug Tools</h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Development & Testing</div>
            
            <div className="space-y-1">
              <Link href="/debug" className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <FileText size={18} className="mr-2 text-gray-700 dark:text-gray-300" />
                <span>Debug Home</span>
              </Link>
              <Link href="/debug/json" className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <Binary size={18} className="mr-2 text-gray-700 dark:text-gray-300" />
                <span>JSON Debugger</span>
              </Link>
              <Link href="/debug/tex" className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <ScrollText size={18} className="mr-2 text-gray-700 dark:text-gray-300" />
                <span>TeX Debugger</span>
              </Link>
              <Link href="/debug/components" className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <Bookmark size={18} className="mr-2 text-gray-700 dark:text-gray-300" />
                <span>Component Tests</span>
              </Link>
              <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                <BookOpen size={18} className="mr-2 text-gray-700 dark:text-gray-300" />
                <span>Back to Main Site</span>
              </Link>
            </div>
          </div>
        )}
        
        {/* Collapsed sidebar view */}
        {isCollapsed && (
          <div className="p-2 flex flex-col items-center space-y-4 pt-14">
            <Link href="/debug" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Debug Home">
              <FileText size={18} className="text-gray-700 dark:text-gray-300" />
            </Link>
            <Link href="/debug/json" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="JSON Debugger">
              <Binary size={18} className="text-gray-700 dark:text-gray-300" />
            </Link>
            <Link href="/debug/tex" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="TeX Debugger">
              <ScrollText size={18} className="text-gray-700 dark:text-gray-300" />
            </Link>
            <Link href="/debug/components" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Component Tests">
              <Bookmark size={18} className="text-gray-700 dark:text-gray-300" />
            </Link>
            <Link href="/" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Back to Main Site">
              <BookOpen size={18} className="text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
        )}
      </div>
      
      {/* Spacer to push main content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}></div>
    </>
  );
}

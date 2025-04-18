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
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>
      
      <div className={`fixed top-0 left-0 h-screen overflow-y-auto bg-gray-100 border-r border-gray-200 z-40 transition-all duration-300 ${isCollapsed ? 'w-0 lg:w-16' : 'w-64'}`}>
        {!isCollapsed && (
          <div className="p-4">
            <h1 className="text-lg font-bold mb-2">Debug Tools</h1>
            <div className="text-sm text-gray-600 mb-4">Development & Testing</div>
            
            <div className="space-y-1">
              <Link href="/debug" className="flex items-center p-2 rounded hover:bg-gray-200">
                <FileText size={18} className="mr-2" />
                <span>Debug Home</span>
              </Link>
              <Link href="/debug/json" className="flex items-center p-2 rounded hover:bg-gray-200">
                <Binary size={18} className="mr-2" />
                <span>JSON Debugger</span>
              </Link>
              <Link href="/debug/tex" className="flex items-center p-2 rounded hover:bg-gray-200">
                <ScrollText size={18} className="mr-2" />
                <span>TeX Debugger</span>
              </Link>
              <Link href="/debug/components" className="flex items-center p-2 rounded hover:bg-gray-200">
                <Bookmark size={18} className="mr-2" />
                <span>Component Tests</span>
              </Link>
              <Link href="/" className="flex items-center p-2 rounded hover:bg-gray-200">
                <BookOpen size={18} className="mr-2" />
                <span>Back to Main Site</span>
              </Link>
            </div>
          </div>
        )}
        
        {/* Collapsed sidebar view */}
        {isCollapsed && (
          <div className="p-2 flex flex-col items-center space-y-4 pt-14">
            <Link href="/debug" className="p-2 rounded-full hover:bg-gray-200" title="Debug Home">
              <FileText size={18} />
            </Link>
            <Link href="/debug/json" className="p-2 rounded-full hover:bg-gray-200" title="JSON Debugger">
              <Binary size={18} />
            </Link>
            <Link href="/debug/tex" className="p-2 rounded-full hover:bg-gray-200" title="TeX Debugger">
              <ScrollText size={18} />
            </Link>
            <Link href="/debug/components" className="p-2 rounded-full hover:bg-gray-200" title="Component Tests">
              <Bookmark size={18} />
            </Link>
            <Link href="/" className="p-2 rounded-full hover:bg-gray-200" title="Back to Main Site">
              <BookOpen size={18} />
            </Link>
          </div>
        )}
      </div>
      
      {/* Spacer to push main content */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}></div>
    </>
  );
}

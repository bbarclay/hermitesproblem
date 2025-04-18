'use client';

import { useEffect } from 'react';

interface ContentPreloaderProps {
  currentFile: string;
  navigationOrder: { file: string; section: string }[];
  currentPosition: number;
}

export default function ContentPreloader({
  currentFile,
  navigationOrder,
  currentPosition,
}: ContentPreloaderProps) {
  useEffect(() => {
    // Preload next and previous content to speed up navigation
    const preloadFiles = [];
    
    // Get prev and next files
    if (currentPosition > 0) {
      const prevItem = navigationOrder[currentPosition - 1];
      if (prevItem?.file && prevItem.file !== currentFile) {
        preloadFiles.push(prevItem.file);
      }
    }
    
    if (currentPosition < navigationOrder.length - 1) {
      const nextItem = navigationOrder[currentPosition + 1];
      if (nextItem?.file && nextItem.file !== currentFile) {
        preloadFiles.push(nextItem.file);
      }
    }
    
    // Deduplicate files
    const uniqueFiles = [...new Set(preloadFiles)];
    
    // Preload each file
    uniqueFiles.forEach(file => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/api/content?file=${file}`;
      link.as = 'fetch';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      
      // Also try to prefetch images
      fetch(`/api/content?file=${file}`)
        .then(res => res.json())
        .then(data => {
          // Extract all image URLs for prefetching
          const imgUrls = extractImageUrls(data);
          imgUrls.forEach(imgUrl => {
            const imgLink = document.createElement('link');
            imgLink.rel = 'prefetch';
            imgLink.href = imgUrl;
            imgLink.as = 'image';
            document.head.appendChild(imgLink);
          });
        })
        .catch(() => {
          // Ignore errors with prefetching
        });
    });
    
    return () => {
      // Cleanup prefetch links when component unmounts
      document.querySelectorAll('link[rel="prefetch"]').forEach(el => el.remove());
    };
  }, [currentFile, navigationOrder, currentPosition]);
  
  return null; // This component doesn't render anything
}

// Utility function to extract image URLs from content
function extractImageUrls(data: any): string[] {
  const urls: string[] = [];
  
  // Extract image URLs from block content
  const extractFromBlocks = (blocks: any[] = []) => {
    blocks.forEach(block => {
      if (block?.image) {
        urls.push(block.image);
      }
      
      // Look for image URLs in content (often in figure/img tags)
      if (block?.content) {
        const imgMatches = block.content.match(/src="([^"]+)"/g) || [];
        imgMatches.forEach((match: string) => {
          const url = match.replace('src="', '').replace('"', '');
          urls.push(url);
        });
      }
    });
  };
  
  // Process sections and subsections
  if (data?.sections) {
    data.sections.forEach((section: any) => {
      extractFromBlocks(section.blocks);
      
      // Process subsections
      if (section.subsections) {
        section.subsections.forEach((subsection: any) => {
          extractFromBlocks(subsection.blocks);
        });
      }
    });
  }
  
  return [...new Set(urls)]; // Remove duplicates
}
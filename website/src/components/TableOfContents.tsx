import React from 'react';
import { ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TOCItem[];
  onHeadingClick: (id: string) => void;
  title?: string;
}

export default function TableOfContents({ headings, onHeadingClick, title = "In This Section" }: TableOfContentsProps) {
  if (headings.length <= 1) return null;
  
  // Group headings hierarchically
  const hierarchy: Record<string, TOCItem[]> = {};
  
  // Find all top-level headings
  const topLevelHeadings = headings.filter(h => h.level === 1 || h.level === 2);
  
  // For each top heading, find its sub-headings
  topLevelHeadings.forEach(heading => {
    const subHeadings = headings.filter(h => 
      h.level > heading.level && 
      headings.indexOf(h) > headings.indexOf(heading) && 
      (
        headings.indexOf(h) < headings.findIndex((next, i) => 
          i > headings.indexOf(heading) && next.level <= heading.level
        ) || 
        headings.findIndex((next, i) => 
          i > headings.indexOf(heading) && next.level <= heading.level
        ) === -1
      )
    );
    
    hierarchy[heading.id] = subHeadings;
  });

  return (
    <div className="section-toc">
      <h4 className="flex items-center gap-2">
        <ChevronRight size={16} className="text-blue-600" />
        {title}
      </h4>
      <ul>
        {topLevelHeadings.map(heading => (
          <li key={heading.id}>
            <a 
              href={`#${heading.id}`} 
              onClick={(e) => {
                e.preventDefault();
                onHeadingClick(heading.id);
              }}
              className="font-medium"
            >
              {heading.text}
            </a>
            
            {hierarchy[heading.id]?.length > 0 && (
              <ul className="pl-4 mt-1 mb-2 border-l border-gray-200">
                {hierarchy[heading.id].map(subHeading => (
                  <li key={subHeading.id} style={{ marginTop: '0.25rem' }}>
                    <a 
                      href={`#${subHeading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onHeadingClick(subHeading.id);
                      }}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      {subHeading.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
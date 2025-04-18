import React from 'react';

// Assuming you have some type definitions like this
interface TocItem {
  level: number;
  text: string;
  slug: string;
  file: string; // Added file property based on your usage
}

interface SidebarProps {
  toc: TocItem[] | undefined | null; // Allow undefined/null initially if async
}

const Sidebar: React.FC<SidebarProps> = ({ toc }) => {
  // --- DEBUGGING START ---
  console.log('Sidebar received toc type:', typeof toc);
  console.log('Sidebar received toc value:', toc);
  // --- DEBUGGING END ---

  // Add a guard clause or default value
  if (!Array.isArray(toc)) {
    console.error("Sidebar 'toc' prop is not an array. Rendering empty or fallback.", toc);
    // Option 1: Render nothing or a placeholder
    return null;
    // Option 2: Use an empty array to prevent the error downstream
    // toc = [];
  }

  // Group TOC items by file
  const groupedToc = toc.reduce((acc, item) => {
    if (!acc[item.file]) {
      acc[item.file] = [];
    }
    acc[item.file].push(item);
    return acc;
  }, {} as Record<string, TocItem[]>); // Initialize reduce with an empty object and type assertion

  // ... rest of your component logic using groupedToc
  return (
    <aside>
      <h2>Table of Contents</h2>
      {Object.entries(groupedToc).map(([file, items]) => (
        <div key={file}>
          <h3>{file}</h3>
          <ul>
            {items.map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
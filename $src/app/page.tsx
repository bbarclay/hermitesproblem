import Sidebar from '@/components/Sidebar'; // Adjust import path if needed

// Assume getTableOfContents is an async function fetching/generating the TOC
async function getTableOfContents() {
  // ... your logic to get TOC data ...
  // Example:
  // const tocData = await fetch('/api/toc').then(res => res.json());
  // Make sure this function actually returns an array or handles errors
  // return tocData;

  // Placeholder for demonstration - replace with your actual data fetching
  // Ensure this actually returns an array!
  const exampleToc = [
    { level: 1, text: 'Intro', slug: 'intro', file: 'chapter1.mdx' },
    { level: 2, text: 'Setup', slug: 'setup', file: 'chapter1.mdx' },
    { level: 1, text: 'Usage', slug: 'usage', file: 'chapter2.mdx' },
  ];
  // Simulate potential issue: sometimes it might return null or undefined
  // return null;
  return exampleToc;
}

export default async function Home() {
  const tocData = await getTableOfContents();

  // --- DEBUGGING START ---
  console.log('Home page passing tocData type:', typeof tocData);
  console.log('Home page passing tocData value:', tocData);
  // --- DEBUGGING END ---

  return (
    <div>
      <h1>My Documentation</h1>
      <main>
        {/* Main content goes here */}
      </main>
      {/* Ensure tocData is passed correctly */}
      {/* Add a check here too if needed: */}
      {/* {Array.isArray(tocData) ? <Sidebar toc={tocData} /> : <p>Loading TOC...</p>} */}
      <Sidebar toc={tocData} />
    </div>
  );
}
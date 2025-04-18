import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay = ({ content }: ContentDisplayProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic academic styles that support both light and dark modes
  const academicStyles = `
    :root {
      --text-color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
      --primary-color: ${theme === 'dark' ? '#60a5fa' : '#2563eb'};
      --bg-color: ${theme === 'dark' ? '#1e293b' : '#ffffff'};
      --muted-text: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
    }
    
    .math-content {
      font-family: var(--font-geist-sans);
      line-height: 1.6;
      color: var(--text-color);
    }

    .math-content h1, .math-content h2, .math-content h3 {
      margin-top: 2em;
      margin-bottom: 1em;
      font-weight: 600;
    }

    .math-content .reference {
      color: var(--primary-color);
      text-decoration: none;
    }

    .math-content .reference:hover {
      text-decoration: underline;
    }

    .math-content ol {
      list-style-type: decimal;
      padding-left: 2em;
      margin: 1em 0;
    }

    .math-content .citation {
      font-style: italic;
      color: var(--muted-text);
    }

    .gradient-border {
      position: relative;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }

    .dark .gradient-border {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }

    .gradient-border::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0.5rem;
      border: 1px solid transparent;
      background: linear-gradient(135deg, #3b82f620, #10b98120) border-box;
      -webkit-mask:
        linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      pointer-events: none;
      z-index: 10;
      opacity: 0.5;
    }

    /* Responsive styles */
    .paper-controls {
      position: fixed;
      right: 1rem;
      top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 10;
    }

    .control-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background-color: hsl(var(--card));
      color: hsl(var(--card-foreground));
      border-radius: 9999px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.2s;
    }

    .dark .control-button {
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .control-button:hover {
      background-color: hsl(var(--secondary));
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }

    .dark .control-button:hover {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
    }

    @media (max-width: 768px) {
      .paper-controls {
        bottom: 1rem;
        top: auto;
        right: 1rem;
        flex-direction: row;
      }

      .academic-paper {
        padding: 0.5rem;
      }
    }

    .katex-display {
      padding: 0.5rem 0;
      overflow-x: auto;
      margin: 1rem 0;
    }

    .algorithm-def {
      background-color: ${theme === 'dark' ? '#1e293b' : '#f8fafc'};
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      border-left: 3px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'};
    }
    
    .algorithm {
      background-color: ${theme === 'dark' ? '#1e293b' : '#f8fafc'};
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.5rem;
      border-left: 3px solid ${theme === 'dark' ? '#94a3b8' : '#64748b'};
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
    }
    
    .algorithm pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background-color: transparent;
      padding: 0;
      margin: 0;
      white-space: pre-wrap;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    
    .language-algorithm {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-wrap;
      padding: 0;
      background-color: transparent;
    }
  `;

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{academicStyles}</style>
      <div className="math-content">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};

export default ContentDisplay;
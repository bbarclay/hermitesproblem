import { useMemo } from 'react';
import { preprocessLatex, cleanLatexCommands } from '@/lib/tex-utils';

/**
 * Custom hook for processing LaTeX content
 * @param content - Raw LaTeX content
 * @returns Processed content ready for rendering
 */
export function useLatexContent(content: string | string[] | null | undefined) {
  return useMemo(() => {
    if (!content) return '';
    
    const contentStr = Array.isArray(content) ? content.join('\n') : content;
    return cleanLatexCommands(preprocessLatex(contentStr));
  }, [content]);
}

/**
 * Custom hook for extracting and processing headings from LaTeX content
 * @param content - Raw LaTeX content
 * @returns Array of headings with id, text, and level
 */
export function useLatexHeadings(content: string | string[] | null | undefined) {
  return useMemo(() => {
    if (!content) return [];
    
    const contentStr = Array.isArray(content) ? content.join('\n') : content;
    const headings: { id: string; text: string; level: number }[] = [];
    const processedHeadings = new Map<string, boolean>();
    
    // Process Markdown-style headings (#, ##, ###)
    const markdownHeadingRegex = /^(#{1,3})\s+(.+?)$/gm;
    let markdownMatch;
    
    while ((markdownMatch = markdownHeadingRegex.exec(contentStr)) !== null) {
      const level = markdownMatch[1].length;
      const headingText = markdownMatch[2].trim();
      
      if (processedHeadings.has(headingText)) continue;
      
      const id = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      headings.push({ id, text: headingText, level });
      processedHeadings.set(headingText, true);
    }
    
    // Process LaTeX-style headings (\section, \subsection, etc.)
    const latexHeadingRegex = /\\((?:sub)*section)\{([^}]+)\}/g;
    let latexMatch;
    
    while ((latexMatch = latexHeadingRegex.exec(contentStr)) !== null) {
      const commandType = latexMatch[1];
      const headingText = latexMatch[2].trim();
      
      if (processedHeadings.has(headingText)) continue;
      
      let level = 1;
      if (commandType === 'subsection') level = 2;
      else if (commandType === 'subsubsection') level = 3;
      
      const id = headingText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      headings.push({ id, text: headingText, level });
      processedHeadings.set(headingText, true);
    }
    
    // Sort headings by their position in the document
    headings.sort((a, b) => {
      const posA = contentStr.indexOf(a.text);
      const posB = contentStr.indexOf(b.text);
      return posA - posB;
    });
    
    return headings;
  }, [content]);
}

/**
 * Custom hook for bibliography processing
 * @param content - Raw LaTeX content
 * @returns Processed bibliography entries
 */
export function useBibliography(content: string | string[] | null | undefined) {
  return useMemo(() => {
    if (!content) return [];
    
    const contentStr = Array.isArray(content) ? content.join('\n') : content;
    const entries = contentStr.split(/\\bibitem\{([^}]+)\}/g).filter(Boolean);
    
    if (entries.length <= 1) return [];
    
    const result = [];
    for (let i = 0; i < entries.length; i += 2) {
      const key = entries[i];
      const text = entries[i+1] || '';
      
      result.push({
        key,
        number: Math.floor(i/2) + 1,
        text
      });
    }
    
    return result;
  }, [content]);
}

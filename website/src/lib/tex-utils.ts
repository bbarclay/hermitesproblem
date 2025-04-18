/**
 * Utility functions for processing TeX content
 */

/**
 * Preprocess LaTeX content before rendering with ReactMarkdown
 * @param content - The LaTeX content to preprocess
 * @returns The preprocessed content
 */
export function preprocessLatex(content: string): string {
  let processed = content;

  // 1. Handle environments with optional arguments (e.g. \begin{theorem}[Title])
  processed = processed.replace(/\\begin\{([a-zA-Z_]+)\}(\[[^\]]*\])?/g, (m, env, opt) => `\\begin{${env}}${opt ? opt : ''}`);
  processed = processed.replace(/\\end\{([a-zA-Z_]+)\}/g, (m, env) => `\\end{${env}}`);

  // 2. Convert theorem-like, proof, objection, response, algorithm environments (with or without optional args)
  const envs = [
    { env: 'theorem', prefix: '**Theorem**' },
    { env: 'definition', prefix: '**Definition**' },
    { env: 'proposition', prefix: '**Proposition**' },
    { env: 'lemma', prefix: '**Lemma**' },
    { env: 'proof', prefix: '*Proof*' },
    { env: 'example', prefix: '**Example**' },
    { env: 'corollary', prefix: '**Corollary**' },
    { env: 'objection', prefix: '**Objection**' },
    { env: 'response', prefix: '**Response**' },
    { env: 'algorithm', prefix: '**Algorithm**' },
    { env: 'algorithm_def', prefix: '**Algorithm**' }
  ];
  envs.forEach(({ env, prefix }) => {
    processed = processed.replace(
      new RegExp(`\\\\begin\\{${env}\\}(\\[[^\\]]*\\])?([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g'),
      `\n\n${prefix} $2\n\n`
    );
  });

  // 3. Convert itemize/enumerate to markdown lists
  processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
    return content
      .split('\\item')
      .filter(Boolean)
      .map((item: string) => `- ${item.trim()}`)
      .join('\n');
  });
  processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
    return content
      .split('\\item')
      .filter(Boolean)
      .map((item: string, i: number) => `${i + 1}. ${item.trim()}`)
      .join('\n');
  });

  // 4. Convert tabular/table to markdown tables (simple heuristic)
  processed = processed.replace(/\\begin\{tabular\}(\{[^}]*\})?([\s\S]*?)\\end\{tabular\}/g, (match, fmt, table) => {
    // Remove LaTeX line breaks and hlines, split rows
    let rows = table.replace(/\\\\/g, '\n').replace(/\\hline/g, '').trim().split('\n');
    rows = rows.map((row: string) => row.trim()).filter(Boolean);
    if (rows.length < 2) return rows.join('\n');
    // Assume first row is header
    const header = rows[0].split('&').map((cell: string) => cell.trim()).join(' | ');
    const divider = rows[0].split('&').map(() => '---').join(' | ');
    const body = rows.slice(1).map((row: string) => row.split('&').map((cell: string) => cell.trim()).join(' | ')).join('\n');
    return `${header}\n${divider}\n${body}`;
  });

  // 5. Convert equations, align, pmatrix, bmatrix, cases to display math
  processed = processed
    .replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, '\n$$\n$1\n$$\n')
    .replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, '\n$$\\begin{align}$1\\end{align}$$\n')
    .replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, '$$\\begin{pmatrix}$1\\end{pmatrix}$$')
    .replace(/\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}/g, '$$\\begin{bmatrix}$1\\end{bmatrix}$$')
    .replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, '$$\\begin{cases}$1\\end{cases}$$');

  // 6. Convert center environment to markdown center (just newlines)
  processed = processed.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, '\n\n$1\n\n');

  // 7. Convert lstlisting/code blocks to markdown code
  processed = processed.replace(/\\begin\{lstlisting\}(?:\[.*?\])?([\s\S]*?)\\end\{lstlisting\}/g, (match, code) => {
    return `\n\`\`\`\n${code.trim()}\n\`\`\`\n`;
  });

  // 8. Convert figure environments to markdown images (if possible)
  processed = processed.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (match, fig) => {
    // Try to extract \includegraphics and \caption
    const imgMatch = fig.match(/\\includegraphics(?:\[.*?\])?\{([^}]+)\}/);
    const captionMatch = fig.match(/\\caption\{([^}]+)\}/);
    if (imgMatch) {
      const src = imgMatch[1];
      const caption = captionMatch ? captionMatch[1] : '';
      return `\n![${caption}](${src})\n`;
    }
    return '';
  });

  // 9. Replace \cite and \label with placeholders
  processed = processed.replace(/\\cite\{([^}]+)\}/g, '[@$1]');
  processed = processed.replace(/\\label\{([^}]+)\}/g, '');

  // 10. Replace \S with section symbol, \ref with placeholder
  processed = processed.replace(/\\S/g, '§');
  processed = processed.replace(/\\ref\{([^}]+)\}/g, '[§]');

  // 11. Inline math protection and restoration
  processed = processed
    .replace(/\$([^$\n]+?)\$/g, '§INLINEMATH§$1§ENDINLINEMATH§')
    .replace(/([^$])(\\mathbb|\\frac|\\sqrt|\\left|\\right|\\operatorname)([^$]*?)([^$])/g,
      (_, prefix, command, content, suffix) =>
        `${prefix}$${command}${content}$${suffix}`)
    .replace(/§INLINEMATH§(.*?)§ENDINLINEMATH§/g, '$$$1$$');

  // 12. Miscellaneous fixes
  processed = processed
    .replace(/sin\$\^2\$/g, 'sin²')
    .replace(/\$\^(\d+)\$/g, '^$1')
    .replace(/\[([^\]]*?)\$([^\]]*?)\]/g, '[$1\\$$2]');

  // 13. Cleanup: double spaces, multiple newlines, heading spacing, empty paragraphs
  processed = processed
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(\#{1,6}[^\n]*)\n{1}([^\n#])/g, '$1\n\n$2')
    .replace(/\n\s*\n\s*\n/g, '\n\n');

  return processed;
}

/**
 * Clean LaTeX commands for rendering
 * @param content - The LaTeX content to clean
 * @returns The cleaned content
 */
export function cleanLatexCommands(content: string): string {
  return content
    .replace(/\\\((.*?)\\\)/g, '$$$1$$')
    .replace(/\\\[(.*?)\\\]/g, '$$$$\n$1\n$$$$')
    .replace(/\\begin\{(.*?)\}(.*?)\\end\{\1\}/gs, (_, env, content) => {
      if (env === 'equation' || env === 'align' || env === 'align*') {
        return `$$$$\n${content}\n$$$$`;
      }
      if (env === 'algorithm_def') {
        return `<div class="algorithm-def">\n${content}\n</div>`;
      }
      if (env === 'enumerate') {
        return content.split('\\item').filter(Boolean).map((item, i) => `${i+1}. ${item.trim()}`).join('\n');
      }
      return content;
    })
    .replace(/\\HAPD/g, 'HAPD')
    .replace(/\\mathbb\{([A-Z])\}/g, (_, letter) => {
      const unicodeMap: Record<string, string> = {
        'R': 'ℝ', 'Z': 'ℤ', 'N': 'ℕ', 'Q': 'ℚ', 'C': 'ℂ'
      };
      return unicodeMap[letter] || letter;
    })
    .replace(/##/g, '')
    .replace(/\\operatorname\{([^}]+)\}/g, (_, name) => name);
}

/**
 * Generate a slug from a string
 * @param str - The string to slugify
 * @returns The slugified string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extract headings from content
 * @param content - The content to extract headings from
 * @returns Array of headings with id, text, and level
 */
export function extractHeadings(content: string): { id: string, text: string, level: number }[] {
  const headings: { id: string, text: string, level: number }[] = [];
  const seenIds = new Set<string>();
  const headingRegex = /(?:#{1,3} ?(.*?)$)|(?:\\(?:sub)*section\{(.*?)\})|(?:\\(?:sub)*subsection\{(.*?)\})/gm;
  
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const headingText = match[1] || match[2] || match[3];
    if (!headingText) continue;
    
    const level = match[0].startsWith('#')
      ? match[0].split(' ')[0].length
      : match[0].includes('subsection') ? 3 : match[0].includes('section') ? 2 : 1;
    
    let id = slugify(headingText);
    
    // Ensure unique IDs by adding a suffix if needed
    let uniqueId = id;
    let counter = 1;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    
    seenIds.add(uniqueId);
    headings.push({ id: uniqueId, text: headingText, level });
  }
  
  return headings;
}

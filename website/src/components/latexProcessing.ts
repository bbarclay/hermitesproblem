// LaTeX/Markdown preprocessing and conversion helpers

// --- LaTeX Preprocessing ---
export const preprocessLatex = (content: string): string => {
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
    let rows = table.replace(/\\\\/g, '\n').replace(/\\hline/g, '').trim().split('\n');
    rows = rows.map((row: string) => row.trim()).filter(Boolean);
    if (rows.length < 2) return rows.join('\n');
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
};

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
    { env: 'algorithm', prefix: '**Algorithm**' }
  ];
  envs.forEach(({ env, prefix }) => {
    processed = processed.replace(
      new RegExp(`\\\\begin\\{${env}\\}(\\[[^\\]]*\\])?([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g'),
      `\n\n${prefix} $2\n\n`
    );
  });

  // Special handling for algorithm_def environment
  processed = processed.replace(
    /\\begin\{algorithm_def\}(\[[^\]]*\])?([\s\S]*?)\\end\{algorithm_def\}/g,
    (match, opt, content) => {
      const title = opt ? opt.replace(/^\[|\]$/g, '') : 'Algorithm';
      return `\n\n<div class="algorithm-def">\n<strong>${title}</strong>\n\n${content}\n</div>\n\n`;
    }
  );

  // Special handling for algorithmic environment
  processed = processed.replace(
    /\\begin\{algorithmic\}(?:\[.*?\])?([\s\S]*?)\\end\{algorithmic\}/g,
    (match, content) => {
      // First, fix common spacing and formatting issues
      content = content.replace(/\n\s+/g, '\n').trim();
      
      // Process algorithmic commands
      let result = content
        // Fix numbered State commands (replace [1] with empty string)
        .replace(/\[1\]/g, '')
        // Handle indentation properly by replacing \State with markdown bullet points
        .replace(/\\State\s+/g, '\n• ')
        // Replace §tate (special character) with blank
        .replace(/§tate\s+/g, '\n• ')
        // Replace control structures with proper indentation
        .replace(/\\If\{([^}]*)\}/g, '\n**if** $1:')
        .replace(/\\ElseIf\{([^}]*)\}/g, '\n**else if** $1:')
        .replace(/\\Else/g, '\n**else**:')
        .replace(/\\EndIf/g, '')
        .replace(/\\For\{([^}]*)\}/g, '\n**for** $1:')
        .replace(/\\EndFor/g, '')
        .replace(/\\While\{([^}]*)\}/g, '\n**while** $1:')
        .replace(/\\EndWhile/g, '')
        // Handle \gets assignment
        .replace(/\\gets/g, '←')
        // Clean up \textbf
        .replace(/\\textbf\{([^}]*)\}/g, '**$1**')
        // Handle return statements
        .replace(/\\Return\s+/g, '\n• **return** ');
      
      // Clean up empty lines and ensure proper spacing
      result = result.replace(/\n{3,}/g, '\n\n').trim();
      
      return `\n\n<div class="algorithm">\n<pre class="language-algorithm"><code>${result}</code></pre>\n</div>\n\n`;
    }
  );

  // Handle algorithm environment with caption and label
  processed = processed.replace(
    /\\begin\{algorithm\}(\[[^\]]*\])?([\s\S]*?)\\end\{algorithm\}/g,
    (match, opt, content) => {
      const captionMatch = content.match(/\\caption\{([^}]+)\}/);
      const caption = captionMatch ? `**Algorithm: ${captionMatch[1]}**\n\n` : '';
      
      // Extract algorithmic content if present
      const algorithmicMatch = content.match(/\\begin\{algorithmic\}([\s\S]*?)\\end\{algorithmic\}/);
      if (algorithmicMatch) {
        content = content.replace(/\\caption\{([^}]+)\}/, '');
        content = content.replace(/\\label\{([^}]+)\}/, '');
      }
      
      return `\n\n<div class="algorithm">\n${caption}${content}\n</div>\n\n`;
    }
  );

  // 3. Fixed enumerate/itemize processing to prevent numbering issues
  processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
    return content
      .split('\\item')
      .filter(Boolean)
      .map((item: string) => `- ${item.trim()}`)
      .join('\n');
  });
  
  // Proper enumerate handling to ensure correct numbering
  processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
    const items = content
      .split('\\item')
      .filter(Boolean)
      .map((item: string, index: number) => `${index + 1}. ${item.trim()}`);
    
    return items.join('\n\n');
  });

  // 4. Improved table conversion with better cell formatting
  processed = processed.replace(/\\begin\{table\}(\[[^\]]*\])?([\s\S]*?)\\end\{table\}/g, (match, opt, content) => {
    // Extract caption if present
    const captionMatch = content.match(/\\caption\{([^}]+)\}/);
    const caption = captionMatch ? `**Table: ${captionMatch[1]}**\n\n` : '';
    
    // Find tabular environment
    const tabularMatch = content.match(/\\begin\{tabular\}(\{[^}]*\})?([\s\S]*?)\\end\{tabular\}/);
    if (!tabularMatch) return match; // If no tabular found, return unchanged
    
    return caption + processTabular(tabularMatch[2]);
  });
  
  // Direct tabular processing for tables outside of table environment
  processed = processed.replace(/\\begin\{tabular\}(\{[^}]*\})?([\s\S]*?)\\end\{tabular\}/g, 
    (match, fmt, content) => processTabular(content));

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

  // 11. Enhanced math commands processing
  processed = processed
    .replace(/\\tr(?!\w)/g, '\\operatorname{tr}')
    .replace(/\\checkmark/g, '✓')
    .replace(/\\hline/g, '')
    .replace(/\\HAPD/g, 'HAPD')
    .replace(/\\mathbb\{([A-Z])\}/g, (_, letter) => {
      const unicodeMap: Record<string, string> = {
        'R': 'ℝ', 'Z': 'ℤ', 'N': 'ℕ', 'Q': 'ℚ', 'C': 'ℂ'
      };
      return unicodeMap[letter] || letter;
    });

  // 12. Inline math protection and restoration
  processed = processed
    .replace(/\$([^$\n]+?)\$/g, '§INLINEMATH§$1§ENDINLINEMATH§')
    .replace(/([^$])(\\mathbb|\\frac|\\sqrt|\\left|\\right|\\operatorname)([^$]*?)([^$])/g,
      (_, prefix, command, content, suffix) =>
        `${prefix}$${command}${content}$${suffix}`)
    .replace(/§INLINEMATH§(.*?)§ENDINLINEMATH§/g, '$$$1$$');

  // 13. Miscellaneous fixes
  processed = processed
    .replace(/sin\$\^2\$/g, 'sin²')
    .replace(/\$\^(\d+)\$/g, '^$1')
    .replace(/\[([^\]]*?)\$([^\]]*?)\]/g, '[$1\\$$2]');

  // 14. Cleanup: double spaces, multiple newlines, heading spacing, empty paragraphs
  processed = processed
    .replace(/\s{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/(\#{1,6}[^\n]*)\n{1}([^\n#])/g, '$1\n\n$2')
    .replace(/\n\s*\n\s*\n/g, '\n\n');

  return processed;
};

// Helper function to process tabular content
function processTabular(content: string): string {
  // Clean the content
  content = content.replace(/\\\\$/gm, ''); // Remove trailing newlines
  
  // Split into rows
  let rows = content
    .replace(/\\\\/g, '\n')
    .replace(/\\hline/g, '')
    .trim()
    .split('\n')
    .map(row => row.trim())
    .filter(Boolean);
  
  if (rows.length === 0) return '';
  
  // Process cells in each row
  const processedRows = rows.map(row => {
    // Split the row into cells
    return row
      .split('&')
      .map(cell => cell.trim())
      .join(' | ');
  });
  
  // Create markdown table
  if (processedRows.length === 1) {
    // Just a header
    return processedRows[0] + '\n' + 
      processedRows[0].split('|').map(() => '---').join(' | ');
  } else if (processedRows.length > 1) {
    // Header and body
    const header = processedRows[0];
    const divider = header.split('|').map(() => '---').join(' | ');
    const body = processedRows.slice(1).join('\n');
    return `${header}\n${divider}\n${body}`;
  }
  
  return '';
}

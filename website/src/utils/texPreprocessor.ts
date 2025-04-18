/**
 * TeX Preprocessor Utility
 *
 * This utility preprocesses TeX content to make it compatible with Markdown and KaTeX rendering.
 * It handles common TeX elements that aren't natively supported by the rendering pipeline.
 */

/**
 * Preprocesses TeX content for rendering
 * @param content The TeX content to preprocess
 * @returns The preprocessed content ready for rendering
 */
export function preprocessTeX(content: string): string {
  let processed = content;

  // Handle enumerated lists
  processed = processed.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    (match, content) => {
      // Extract items
      const items = content.split('\\item').filter(Boolean);

      // Convert to markdown list
      let markdownList = '\n';
      items.forEach((item, index) => {
        markdownList += `${index + 1}. ${item.trim()}\n`;
      });

      return markdownList;
    }
  );

  // Handle itemize lists
  processed = processed.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    (match, content) => {
      // Extract items
      const items = content.split('\\item').filter(Boolean);

      // Convert to markdown list
      let markdownList = '\n';
      items.forEach(item => {
        markdownList += `* ${item.trim()}\n`;
      });

      return markdownList;
    }
  );

  // Handle description lists
  processed = processed.replace(
    /\\begin\{description\}([\s\S]*?)\\end\{description\}/g,
    (match, content) => {
      // Extract items
      const items = content.split('\\item').filter(Boolean);

      // Convert to markdown list with bold terms
      let markdownList = '\n';
      items.forEach(item => {
        // Check if item has a term in square brackets
        const termMatch = item.match(/^\[(.*?)\]/);
        if (termMatch) {
          const term = termMatch[1];
          const description = item.replace(/^\[(.*?)\]/, '').trim();
          markdownList += `**${term}**: ${description}\n\n`;
        } else {
          markdownList += `* ${item.trim()}\n`;
        }
      });

      return markdownList;
    }
  );

  // Handle textbf (bold text)
  processed = processed.replace(
    /\\textbf\{([^}]+)\}/g,
    '**$1**'
  );

  // Handle textit (italic text)
  processed = processed.replace(
    /\\textit\{([^}]+)\}/g,
    '*$1*'
  );

  // Handle emph (emphasized text)
  processed = processed.replace(
    /\\emph\{([^}]+)\}/g,
    '*$1*'
  );

  // Handle \\S (section symbol)
  processed = processed.replace(/\\S/g, '§');

  // Handle \\S\\ref combination (common in LaTeX for section references)
  processed = processed.replace(
    /§\\ref\{([^}]+)\}/g,
    (match, reference) => {
      return `§<a href="#${reference}" class="reference" data-reference="${reference}">[${reference.split(':').pop()}]</a>`;
    }
  );

  // Handle \\cite commands
  processed = processed.replace(
    /\\cite\{([^}]+)\}/g,
    (match, citation) => {
      return `<a href="#citation-${citation}" class="citation" data-citation="${citation}">[${citation}]</a>`;
    }
  );

  // Handle \ref commands
  processed = processed.replace(
    /\\ref\{([^}]+)\}/g,
    (match, reference) => {
      return `<a href="#${reference}" class="reference" data-reference="${reference}">[${reference.split(':').pop()}]</a>`;
    }
  );

  // Handle \label commands that are not part of environments
  // (we already handle labels in environments separately)
  processed = processed.replace(
    /(?<!\\begin\{[^}]+\}[\s\S]*?)\\label\{([^}]+)\}/g,
    (match, label) => {
      return `<span id="${label}" data-label="${label}"></span>`;
    }
  );

  // Handle tabular environments
  processed = processed.replace(
    /\\begin\{tabular\}\{([^}]+)\}([\s\S]*?)\\end\{tabular\}/g,
    (match, columns, content) => {
      // Extract rows
      const rows = content.split('\\\\').filter(Boolean);

      // Convert to markdown table
      let markdownTable = '\n';

      // Add header row based on number of columns
      const colCount = columns.replace(/[^lcr]/g, '').length;
      markdownTable += '| ' + Array(colCount).fill('Column').join(' | ') + ' |\n';
      markdownTable += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n';

      // Add data rows
      rows.forEach(row => {
        const cells = row.split('&').map(cell => cell.trim());
        markdownTable += '| ' + cells.join(' | ') + ' |\n';
      });

      return markdownTable;
    }
  );

  // Handle table environments
  processed = processed.replace(
    /\\begin\{table\}([\s\S]*?)\\end\{table\}/g,
    (match, content) => {
      // Extract caption if present
      const captionMatch = content.match(/\\caption\{([^}]+)\}/);
      const caption = captionMatch ? captionMatch[1] : '';

      // Extract tabular content
      const tabularMatch = content.match(/\\begin\{tabular\}([\s\S]*?)\\end\{tabular\}/);

      if (tabularMatch) {
        // Keep the tabular content as is, it will be processed by the tabular handler
        let result = tabularMatch[0];

        // Add caption as markdown if present
        if (caption) {
          result += `\n\n*Table: ${caption}*\n`;
        }

        return result;
      }

      // If no tabular environment found, just return the original content
      return match;
    }
  );

  // Handle figure environments
  processed = processed.replace(
    /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g,
    (match, content) => {
      // Extract caption if present
      const captionMatch = content.match(/\\caption\{([^}]+)\}/);
      const caption = captionMatch ? captionMatch[1] : '';

      // Extract includegraphics if present
      const graphicsMatch = content.match(/\\includegraphics(?:\[([^]]*)\])?\{([^}]+)\}/);

      if (graphicsMatch) {
        const options = graphicsMatch[1] || '';
        const imagePath = graphicsMatch[2];

        // Convert to markdown image
        let result = `\n\n![${caption}](${imagePath})`;

        // Add caption as markdown if present
        if (caption) {
          result += `\n\n*Figure: ${caption}*\n`;
        }

        return result;
      }

      // If no includegraphics found, just return the original content
      return match;
    }
  );

  // Handle theorem environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{theorem\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{theorem\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="theorem"${labelAttr}><strong>Theorem${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle lemma environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{lemma\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{lemma\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="lemma"${labelAttr}><strong>Lemma${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle definition environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{definition\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{definition\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="definition"${labelAttr}><strong>Definition${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle proposition environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{proposition\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{proposition\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="proposition"${labelAttr}><strong>Proposition${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle corollary environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{corollary\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{corollary\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="corollary"${labelAttr}><strong>Corollary${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle example environments with optional arguments and labels
  processed = processed.replace(
    /\\begin\{example\}(?:\[([^\]]+)\])?\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{example\}/g,
    (match, title, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const titleText = title ? ` (${title})` : '';
      return `<div class="example"${labelAttr}><strong>Example${titleText}.</strong> ${content}</div>`;
    }
  );

  // Handle proof environments with optional arguments
  processed = processed.replace(
    /\\begin\{proof\}(?:\[([^\]]+)\])?([\s\S]*?)\\end\{proof\}/g,
    (match, title, content) => {
      const titleText = title ? ` (${title})` : '';
      return `<div class="proof"><em>Proof${titleText}.</em> ${content}</div>`;
    }
  );

  // Handle equation environments with labels
  processed = processed.replace(
    /\\begin\{equation\}\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{equation\}/g,
    (match, label, content) => {
      if (label) {
        return `\n<div class="equation" id="${label}" data-label="${label}">\n$$\n${content}\n$$\n<span class="equation-number">(${label.split(':').pop()})</span>\n</div>\n`;
      }
      return `\n$$\n${content}\n$$\n`;
    }
  );

  // Handle align environments with labels
  processed = processed.replace(
    /\\begin\{align\}\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{align\}/g,
    (match, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const labelSpan = label ? `<span class="equation-number">(${label.split(':').pop()})</span>` : '';
      return `\n<div class="align"${labelAttr}>\n$$\n\\begin{aligned}\n${content}\n\\end{aligned}\n$$\n${labelSpan}\n</div>\n`;
    }
  );

  // Handle align* environments
  processed = processed.replace(
    /\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g,
    '\n$$\n\\begin{aligned}\n$1\n\\end{aligned}\n$$\n'
  );

  // Handle eqnarray environments with labels
  processed = processed.replace(
    /\\begin\{eqnarray\}\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{eqnarray\}/g,
    (match, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const labelSpan = label ? `<span class="equation-number">(${label.split(':').pop()})</span>` : '';
      return `\n<div class="eqnarray"${labelAttr}>\n$$\n\\begin{array}{rcl}\n${content}\n\\end{array}\n$$\n${labelSpan}\n</div>\n`;
    }
  );

  // Handle gather environments with labels
  processed = processed.replace(
    /\\begin\{gather\}\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{gather\}/g,
    (match, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const labelSpan = label ? `<span class="equation-number">(${label.split(':').pop()})</span>` : '';
      return `\n<div class="gather"${labelAttr}>\n$$\n\\begin{gather}\n${content}\n\\end{gather}\n$$\n${labelSpan}\n</div>\n`;
    }
  );

  // Handle multline environments with labels
  processed = processed.replace(
    /\\begin\{multline\}\s*(?:\\label\{([^}]+)\})?([\s\S]*?)\\end\{multline\}/g,
    (match, label, content) => {
      const labelAttr = label ? ` id="${label}" data-label="${label}"` : '';
      const labelSpan = label ? `<span class="equation-number">(${label.split(':').pop()})</span>` : '';
      return `\n<div class="multline"${labelAttr}>\n$$\n\\begin{multline}\n${content}\n\\end{multline}\n$$\n${labelSpan}\n</div>\n`;
    }
  );

  // Handle display math
  processed = processed.replace(
    /\\\[([\s\S]*?)\\\]/g,
    '\n$$\n$1\n$$\n'
  );

  // Handle algorithm environments
  processed = processed.replace(
    /\\begin\{algorithm\}([\s\S]*?)\\end\{algorithm\}/g,
    '<div class="algorithm"><strong>Algorithm.</strong>\n<pre>$1</pre></div>'
  );

  // Handle algorithmic environments
  processed = processed.replace(
    /\\begin\{algorithmic\}([\s\S]*?)\\end\{algorithmic\}/g,
    '<pre class="algorithmic">$1</pre>'
  );

  // Handle section commands
  processed = processed.replace(
    /\\section\{([^}]+)\}/g,
    '\n\n## $1\n\n'
  );

  // Handle subsection commands
  processed = processed.replace(
    /\\subsection\{([^}]+)\}/g,
    '\n\n### $1\n\n'
  );

  // Handle subsubsection commands
  processed = processed.replace(
    /\\subsubsection\{([^}]+)\}/g,
    '\n\n#### $1\n\n'
  );

  // Handle paragraph commands
  processed = processed.replace(
    /\\paragraph\{([^}]+)\}/g,
    '\n\n**$1**\n\n'
  );

  // Handle footnote commands
  processed = processed.replace(
    /\\footnote\{([^}]+)\}/g,
    '[^fn]'
  );

  return processed;
}

export default {
  preprocessTeX
};

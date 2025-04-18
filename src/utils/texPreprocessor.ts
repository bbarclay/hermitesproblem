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

  // Handle \cite commands
  processed = processed.replace(
    /\\cite\{([^}]+)\}/g,
    '[Citation: $1]'
  );

  // Handle \ref commands
  processed = processed.replace(
    /\\ref\{([^}]+)\}/g,
    '[Ref: $1]'
  );

  // Handle \label commands (just remove them as they don't affect rendering)
  processed = processed.replace(
    /\\label\{([^}]+)\}/g,
    ''
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

  // Handle theorem environments
  processed = processed.replace(
    /\\begin\{theorem\}([\s\S]*?)\\end\{theorem\}/g,
    '<div class="theorem"><strong>Theorem.</strong> $1</div>'
  );

  // Handle lemma environments
  processed = processed.replace(
    /\\begin\{lemma\}([\s\S]*?)\\end\{lemma\}/g,
    '<div class="lemma"><strong>Lemma.</strong> $1</div>'
  );

  // Handle definition environments
  processed = processed.replace(
    /\\begin\{definition\}([\s\S]*?)\\end\{definition\}/g,
    '<div class="definition"><strong>Definition.</strong> $1</div>'
  );

  // Handle proposition environments
  processed = processed.replace(
    /\\begin\{proposition\}([\s\S]*?)\\end\{proposition\}/g,
    '<div class="proposition"><strong>Proposition.</strong> $1</div>'
  );

  // Handle corollary environments
  processed = processed.replace(
    /\\begin\{corollary\}([\s\S]*?)\\end\{corollary\}/g,
    '<div class="corollary"><strong>Corollary.</strong> $1</div>'
  );

  // Handle example environments
  processed = processed.replace(
    /\\begin\{example\}([\s\S]*?)\\end\{example\}/g,
    '<div class="example"><strong>Example.</strong> $1</div>'
  );

  // Handle proof environments
  processed = processed.replace(
    /\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g,
    '<div class="proof"><em>Proof.</em> $1 □</div>'
  );

  // Handle equation environments
  processed = processed.replace(
    /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g,
    '\n$$\n$1\n$$\n'
  );

  // Handle align environments
  processed = processed.replace(
    /\\begin\{align\}([\s\S]*?)\\end\{align\}/g,
    '\n$$\n\\begin{aligned}\n$1\n\\end{aligned}\n$$\n'
  );

  // Handle align* environments
  processed = processed.replace(
    /\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g,
    '\n$$\n\\begin{aligned}\n$1\n\\end{aligned}\n$$\n'
  );

  // Handle eqnarray environments
  processed = processed.replace(
    /\\begin\{eqnarray\}([\s\S]*?)\\end\{eqnarray\}/g,
    '\n$$\n\\begin{array}{rcl}\n$1\n\\end{array}\n$$\n'
  );

  // Handle gather environments
  processed = processed.replace(
    /\\begin\{gather\}([\s\S]*?)\\end\{gather\}/g,
    '\n$$\n\\begin{gather}\n$1\n\\end{gather}\n$$\n'
  );

  // Handle multline environments
  processed = processed.replace(
    /\\begin\{multline\}([\s\S]*?)\\end\{multline\}/g,
    '\n$$\n\\begin{multline}\n$1\n\\end{multline}\n$$\n'
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

  // Handle special math commands - we preserve these for KaTeX rendering
  // These commands are already properly handled by KaTeX, so we just need to make sure
  // they're properly wrapped in math delimiters

  // Define a helper function to ensure math commands are in math mode
  const ensureMathMode = (match) => {
    // If the match is already in math mode (between $ or $$), return it as is
    const prevChar = processed.substring(processed.indexOf(match) - 1, processed.indexOf(match));
    const nextChar = processed.substring(processed.indexOf(match) + match.length, processed.indexOf(match) + match.length + 1);

    if (prevChar === '$' || nextChar === '$') {
      return match;
    }
    // Otherwise, wrap it in math delimiters
    return `$${match}$`;
  };

  // Handle mathbb commands (blackboard bold)
  processed = processed.replace(
    /(?<!\$)\\mathbb\{([^}]+)\}(?!\$)/g,
    (match) => `$\\mathbb{${match.slice(8, -1)}}$`
  );

  // Handle mathcal commands (calligraphic)
  processed = processed.replace(
    /(?<!\$)\\mathcal\{([^}]+)\}(?!\$)/g,
    (match) => `$\\mathcal{${match.slice(9, -1)}}$`
  );

  // Handle mathrm commands (roman)
  processed = processed.replace(
    /(?<!\$)\\mathrm\{([^}]+)\}(?!\$)/g,
    (match) => `$\\mathrm{${match.slice(8, -1)}}$`
  );

  // Handle mathit commands (italic)
  processed = processed.replace(
    /(?<!\$)\\mathit\{([^}]+)\}(?!\$)/g,
    (match) => `$\\mathit{${match.slice(8, -1)}}$`
  );

  // Handle mathbf commands (bold)
  processed = processed.replace(
    /(?<!\$)\\mathbf\{([^}]+)\}(?!\$)/g,
    (match) => `$\\mathbf{${match.slice(8, -1)}}$`
  );

  // Handle overline commands
  processed = processed.replace(
    /(?<!\$)\\overline\{([^}]+)\}(?!\$)/g,
    (match) => `$\\overline{${match.slice(10, -1)}}$`
  );

  // Handle underline commands
  processed = processed.replace(
    /(?<!\$)\\underline\{([^}]+)\}(?!\$)/g,
    (match) => `$\\underline{${match.slice(11, -1)}}$`
  );

  // Handle sqrt commands
  processed = processed.replace(
    /(?<!\$)\\sqrt\{([^}]+)\}(?!\$)/g,
    (match) => `$\\sqrt{${match.slice(6, -1)}}$`
  );

  // Handle vec commands
  processed = processed.replace(
    /(?<!\$)\\vec\{([^}]+)\}(?!\$)/g,
    (match) => `$\\vec{${match.slice(5, -1)}}$`
  );

  // Handle hat commands
  processed = processed.replace(
    /(?<!\$)\\hat\{([^}]+)\}(?!\$)/g,
    (match) => `$\\hat{${match.slice(5, -1)}}$`
  );

  // Handle dot commands
  processed = processed.replace(
    /(?<!\$)\\dot\{([^}]+)\}(?!\$)/g,
    (match) => `$\\dot{${match.slice(5, -1)}}$`
  );

  // Handle ddot commands
  processed = processed.replace(
    /(?<!\$)\\ddot\{([^}]+)\}(?!\$)/g,
    (match) => `$\\ddot{${match.slice(6, -1)}}$`
  );

  // Handle frac commands
  processed = processed.replace(
    /(?<!\$)\\frac\{([^}]+)\}\{([^}]+)\}(?!\$)/g,
    (match, num, denom) => `$\\frac{${num}}{${denom}}$`
  );

  // Handle sum commands
  processed = processed.replace(
    /(?<!\$)\\sum_\{([^}]+)\}(?:\^\{([^}]+)\})?(?!\$)/g,
    (match, sub, sup) => sup ? `$\\sum_{${sub}}^{${sup}}$` : `$\\sum_{${sub}}$`
  );

  // Handle prod commands
  processed = processed.replace(
    /(?<!\$)\\prod_\{([^}]+)\}(?:\^\{([^}]+)\})?(?!\$)/g,
    (match, sub, sup) => sup ? `$\\prod_{${sub}}^{${sup}}$` : `$\\prod_{${sub}}$`
  );

  // Handle int commands
  processed = processed.replace(
    /(?<!\$)\\int_\{([^}]+)\}(?:\^\{([^}]+)\})?(?!\$)/g,
    (match, sub, sup) => sup ? `$\\int_{${sub}}^{${sup}}$` : `$\\int_{${sub}}$`
  );

  // Handle lim commands
  processed = processed.replace(
    /(?<!\$)\\lim_\{([^}]+)\}(?!\$)/g,
    (match, sub) => `$\\lim_{${sub}}$`
  );

  // Handle special TeX functions like \floor and \ceil
  processed = processed.replace(
    /(?<!\$)\\floor\{([^}]+)\}(?!\$)/g,
    (match, content) => `$\\lfloor ${content} \\rfloor$`
  );

  processed = processed.replace(
    /(?<!\$)\\ceil\{([^}]+)\}(?!\$)/g,
    (match, content) => `$\\lceil ${content} \\rceil$`
  );

  return processed;
}

export default {
  preprocessTeX
};

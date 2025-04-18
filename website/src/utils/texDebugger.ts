/**
 * TeX Debugger Utility
 * 
 * This utility helps identify unparsed TeX content in rendered pages.
 * It adds visual indicators around unparsed TeX elements to make them easier to spot.
 */

// Regular expressions for common TeX patterns
const TEX_PATTERNS = [
  // Math environments
  { regex: /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, name: 'equation' },
  { regex: /\\begin\{align\}([\s\S]*?)\\end\{align\}/g, name: 'align' },
  { regex: /\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, name: 'align*' },
  { regex: /\\begin\{eqnarray\}([\s\S]*?)\\end\{eqnarray\}/g, name: 'eqnarray' },
  { regex: /\\begin\{gather\}([\s\S]*?)\\end\{gather\}/g, name: 'gather' },
  { regex: /\\begin\{multline\}([\s\S]*?)\\end\{multline\}/g, name: 'multline' },
  
  // Theorem-like environments
  { regex: /\\begin\{theorem\}([\s\S]*?)\\end\{theorem\}/g, name: 'theorem' },
  { regex: /\\begin\{lemma\}([\s\S]*?)\\end\{lemma\}/g, name: 'lemma' },
  { regex: /\\begin\{proposition\}([\s\S]*?)\\end\{proposition\}/g, name: 'proposition' },
  { regex: /\\begin\{corollary\}([\s\S]*?)\\end\{corollary\}/g, name: 'corollary' },
  { regex: /\\begin\{definition\}([\s\S]*?)\\end\{definition\}/g, name: 'definition' },
  { regex: /\\begin\{example\}([\s\S]*?)\\end\{example\}/g, name: 'example' },
  { regex: /\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, name: 'proof' },
  
  // List environments
  { regex: /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, name: 'itemize' },
  { regex: /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, name: 'enumerate' },
  { regex: /\\begin\{description\}([\s\S]*?)\\end\{description\}/g, name: 'description' },
  
  // Table environments
  { regex: /\\begin\{table\}([\s\S]*?)\\end\{table\}/g, name: 'table' },
  { regex: /\\begin\{tabular\}([\s\S]*?)\\end\{tabular\}/g, name: 'tabular' },
  
  // Figure environments
  { regex: /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, name: 'figure' },
  
  // Algorithm environments
  { regex: /\\begin\{algorithm\}([\s\S]*?)\\end\{algorithm\}/g, name: 'algorithm' },
  { regex: /\\begin\{algorithmic\}([\s\S]*?)\\end\{algorithmic\}/g, name: 'algorithmic' },
  
  // Inline math
  { regex: /\$([^$]+?)\$/g, name: 'inline-math' },
  { regex: /\\\((.*?)\\\)/g, name: 'inline-math-2' },
  { regex: /\\\[(.*?)\\\]/g, name: 'display-math' },
  
  // Common TeX commands
  { regex: /\\section\{([^}]+)\}/g, name: 'section' },
  { regex: /\\subsection\{([^}]+)\}/g, name: 'subsection' },
  { regex: /\\subsubsection\{([^}]+)\}/g, name: 'subsubsection' },
  { regex: /\\paragraph\{([^}]+)\}/g, name: 'paragraph' },
  { regex: /\\textbf\{([^}]+)\}/g, name: 'textbf' },
  { regex: /\\textit\{([^}]+)\}/g, name: 'textit' },
  { regex: /\\emph\{([^}]+)\}/g, name: 'emph' },
  { regex: /\\cite\{([^}]+)\}/g, name: 'cite' },
  { regex: /\\ref\{([^}]+)\}/g, name: 'ref' },
  { regex: /\\label\{([^}]+)\}/g, name: 'label' },
  { regex: /\\footnote\{([^}]+)\}/g, name: 'footnote' },
  
  // Math operators and symbols
  { regex: /\\frac\{([^}]+)\}\{([^}]+)\}/g, name: 'frac' },
  { regex: /\\sum_\{([^}]+)\}\^?\{?([^}]*)\}?/g, name: 'sum' },
  { regex: /\\prod_\{([^}]+)\}\^?\{?([^}]*)\}?/g, name: 'prod' },
  { regex: /\\int_\{([^}]+)\}\^?\{?([^}]*)\}?/g, name: 'int' },
  { regex: /\\lim_\{([^}]+)\}/g, name: 'lim' },
  { regex: /\\mathbb\{([^}]+)\}/g, name: 'mathbb' },
  { regex: /\\mathcal\{([^}]+)\}/g, name: 'mathcal' },
  { regex: /\\mathrm\{([^}]+)\}/g, name: 'mathrm' },
  { regex: /\\mathit\{([^}]+)\}/g, name: 'mathit' },
  { regex: /\\mathbf\{([^}]+)\}/g, name: 'mathbf' },
  { regex: /\\overline\{([^}]+)\}/g, name: 'overline' },
  { regex: /\\underline\{([^}]+)\}/g, name: 'underline' },
  { regex: /\\sqrt\{([^}]+)\}/g, name: 'sqrt' },
  { regex: /\\vec\{([^}]+)\}/g, name: 'vec' },
  { regex: /\\hat\{([^}]+)\}/g, name: 'hat' },
  { regex: /\\dot\{([^}]+)\}/g, name: 'dot' },
  { regex: /\\ddot\{([^}]+)\}/g, name: 'ddot' },
];

/**
 * Highlights unparsed TeX content in a string
 * @param content The content to check for unparsed TeX
 * @param debug Whether to add debug highlighting (default: true)
 * @returns The content with debug highlighting around unparsed TeX
 */
export function highlightUnparsedTeX(content: string, debug: boolean = true): string {
  if (!debug) return content;
  
  let debugContent = content;
  
  // Add debug highlighting around unparsed TeX
  TEX_PATTERNS.forEach(pattern => {
    debugContent = debugContent.replace(pattern.regex, (match) => {
      return `<span class="unparsed-tex unparsed-${pattern.name}" style="background-color: #ffcccc; border: 1px dashed red; padding: 2px; position: relative;" title="Unparsed ${pattern.name}">${match}<span style="position: absolute; top: -15px; right: 0; font-size: 10px; background: red; color: white; padding: 2px 4px; border-radius: 3px;">${pattern.name}</span></span>`;
    });
  });
  
  return debugContent;
}

/**
 * Checks if a string contains unparsed TeX content
 * @param content The content to check
 * @returns True if the content contains unparsed TeX, false otherwise
 */
export function containsUnparsedTeX(content: string): boolean {
  return TEX_PATTERNS.some(pattern => pattern.regex.test(content));
}

/**
 * Gets a list of unparsed TeX elements in a string
 * @param content The content to check
 * @returns An array of objects with the pattern name and the matched content
 */
export function getUnparsedTeXElements(content: string): { type: string, content: string }[] {
  const unparsedElements: { type: string, content: string }[] = [];
  
  TEX_PATTERNS.forEach(pattern => {
    let match;
    // Reset the regex before using it
    pattern.regex.lastIndex = 0;
    
    while ((match = pattern.regex.exec(content)) !== null) {
      unparsedElements.push({
        type: pattern.name,
        content: match[0]
      });
    }
  });
  
  return unparsedElements;
}

export default {
  highlightUnparsedTeX,
  containsUnparsedTeX,
  getUnparsedTeXElements
};

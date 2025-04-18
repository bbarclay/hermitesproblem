#!/usr/bin/env node

/**
 * Scan Unparsed TeX
 * 
 * This script scans all content files for unparsed TeX elements and generates a report.
 * It helps identify which TeX elements need additional parsing support.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONTENT_DIR = './public/content';
const OUTPUT_FILE = './unparsed-tex-report.md';

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

// Function to get unparsed TeX elements in a string
function getUnparsedTeXElements(content) {
  const unparsedElements = [];
  
  TEX_PATTERNS.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.regex);
    
    while ((match = regex.exec(content)) !== null) {
      unparsedElements.push({
        type: pattern.name,
        content: match[0],
        // If there's a capture group, use it as the inner content
        innerContent: match[1] || match[0]
      });
    }
  });
  
  return unparsedElements;
}

// Function to scan a file for unparsed TeX elements
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const unparsedElements = getUnparsedTeXElements(content);
    
    return {
      file: filePath,
      unparsedElements
    };
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error);
    return {
      file: filePath,
      error: error.message,
      unparsedElements: []
    };
  }
}

// Function to scan all files in a directory
function scanDirectory(dir) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist. Skipping.`);
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Recursively scan subdirectories
      results.push(...scanDirectory(filePath));
    } else if (file.endsWith('.json')) {
      // Scan JSON files
      results.push(scanFile(filePath));
    }
  });
  
  return results;
}

// Function to generate a report
function generateReport(results) {
  let report = '# Unparsed TeX Elements Report\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Count total unparsed elements by type
  const elementCounts = {};
  let totalUnparsedElements = 0;
  
  results.forEach(result => {
    result.unparsedElements.forEach(element => {
      elementCounts[element.type] = (elementCounts[element.type] || 0) + 1;
      totalUnparsedElements++;
    });
  });
  
  // Add summary
  report += `## Summary\n\n`;
  report += `Total files scanned: ${results.length}\n`;
  report += `Total unparsed TeX elements: ${totalUnparsedElements}\n\n`;
  
  // Add element counts by type
  report += `### Element Types\n\n`;
  report += `| Type | Count |\n`;
  report += `| ---- | ----- |\n`;
  
  Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .forEach(([type, count]) => {
      report += `| ${type} | ${count} |\n`;
    });
  
  report += '\n';
  
  // Add details for each file
  report += `## File Details\n\n`;
  
  results.forEach(result => {
    if (result.unparsedElements.length === 0) return;
    
    report += `### ${result.file}\n\n`;
    report += `Total unparsed elements: ${result.unparsedElements.length}\n\n`;
    
    // Group by type
    const elementsByType = {};
    
    result.unparsedElements.forEach(element => {
      if (!elementsByType[element.type]) {
        elementsByType[element.type] = [];
      }
      elementsByType[element.type].push(element);
    });
    
    // Add details for each type
    Object.entries(elementsByType).forEach(([type, elements]) => {
      report += `#### ${type} (${elements.length})\n\n`;
      
      elements.slice(0, 3).forEach((element, index) => {
        report += `${index + 1}. \`${element.content.substring(0, 100)}${element.content.length > 100 ? '...' : ''}\`\n\n`;
      });
      
      if (elements.length > 3) {
        report += `... and ${elements.length - 3} more\n\n`;
      }
    });
  });
  
  // Add recommendations
  report += `## Recommendations\n\n`;
  report += `Based on the scan results, here are the TeX elements that need additional parsing support:\n\n`;
  
  Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .slice(0, 10) // Top 10
    .forEach(([type, count]) => {
      report += `1. **${type}** (${count} occurrences): Add a custom component to handle this element type\n`;
    });
  
  return report;
}

// Main function
function main() {
  console.log('Scanning for unparsed TeX elements...');
  
  // Create content directory if it doesn't exist
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log(`Content directory ${CONTENT_DIR} does not exist. Creating it...`);
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  
  // Scan all files
  const results = scanDirectory(CONTENT_DIR);
  
  // Generate report
  const report = generateReport(results);
  
  // Write report to file
  fs.writeFileSync(OUTPUT_FILE, report);
  
  console.log(`Scan complete! Report written to ${OUTPUT_FILE}`);
  console.log(`Total files scanned: ${results.length}`);
  
  // Count total unparsed elements
  let totalUnparsedElements = 0;
  results.forEach(result => {
    totalUnparsedElements += result.unparsedElements.length;
  });
  
  console.log(`Total unparsed TeX elements: ${totalUnparsedElements}`);
}

// Run the script
main();

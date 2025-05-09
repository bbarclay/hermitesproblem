/**
 * LaTeX to HTML Converter for Mathematical Content
 * 
 * This utility helps convert LaTeX content from the paper into HTML format
 * with proper MathJax rendering.
 */

/**
 * Convert LaTeX environment content to appropriate HTML structure
 * @param {string} content - The LaTeX content to convert
 * @param {string} environment - The LaTeX environment type (theorem, definition, etc.)
 * @returns {string} HTML formatted content
 */
function convertEnvironment(content, environment) {
    // Strip the environment commands
    content = content.replace(new RegExp(`\\\\begin{${environment}}`, 'g'), '');
    content = content.replace(new RegExp(`\\\\end{${environment}}`, 'g'), '');
    
    // Create appropriate HTML structure based on environment type
    let cssClass = environment;
    let title = environment.charAt(0).toUpperCase() + environment.slice(1);
    
    if (environment === 'theorem' || environment === 'lemma' || environment === 'corollary') {
        cssClass = 'theorem';
    } else if (environment === 'definition' || environment === 'remark') {
        cssClass = 'definition';
    } else if (environment === 'example') {
        cssClass = 'example';
    }
    
    return `<div class="${cssClass}">
        <strong>${title}:</strong>
        ${content}
    </div>`;
}

/**
 * Convert section headers from LaTeX to HTML
 * @param {string} content - The LaTeX content
 * @returns {string} HTML with proper heading tags
 */
function convertSectionHeaders(content) {
    // Convert section headers
    content = content.replace(/\\section{([^}]+)}/g, '<h2>$1</h2>');
    content = content.replace(/\\subsection{([^}]+)}/g, '<h3>$1</h3>');
    content = content.replace(/\\subsubsection{([^}]+)}/g, '<h4>$1</h4>');
    
    return content;
}

/**
 * Convert LaTeX math environments to MathJax compatible format
 * @param {string} content - The LaTeX content
 * @returns {string} HTML with proper math delimiters
 */
function convertMathEnvironments(content) {
    // Convert display math environments
    content = content.replace(/\\begin{equation\*?}([^]*?)\\end{equation\*?}/g, '\\[$1\\]');
    content = content.replace(/\\begin{align\*?}([^]*?)\\end{align\*?}/g, '\\[$1\\]');
    
    // Convert inline math
    content = content.replace(/\$([^$]+)\$/g, '\\($1\\)');
    
    return content;
}

/**
 * Convert LaTeX references to HTML anchors
 * @param {string} content - The LaTeX content
 * @returns {string} HTML with proper links
 */
function convertReferences(content) {
    // Convert references to sections, theorems, etc.
    content = content.replace(/\\ref{([^}]+)}/g, '<a href="#$1">$1</a>');
    
    // Convert citations
    content = content.replace(/\\cite{([^}]+)}/g, '<a href="#ref-$1">[$1]</a>');
    
    return content;
}

/**
 * Convert LaTeX figures and tables
 * @param {string} content - The LaTeX content
 * @returns {string} HTML with properly formatted figures
 */
function convertFigures(content) {
    // Extract figure environments
    const figureRegex = /\\begin{figure}([^]*?)\\end{figure}/g;
    let match;
    
    while (match = figureRegex.exec(content)) {
        const figureContent = match[1];
        
        // Extract image path
        const imagePath = figureContent.match(/\\includegraphics(?:\[.*?\])?\{([^}]+)\}/);
        
        // Extract caption
        const caption = figureContent.match(/\\caption{([^}]+)}/);
        
        // Create HTML figure
        const figureHtml = `
        <div class="figure">
            <img src="arxiv_submission/figures/${imagePath ? imagePath[1] : ''}" alt="${caption ? caption[1] : 'Figure'}">
            <div class="figure-caption">${caption ? caption[1] : ''}</div>
        </div>`;
        
        // Replace LaTeX figure with HTML
        content = content.replace(match[0], figureHtml);
    }
    
    return content;
}

/**
 * Convert itemize and enumerate environments
 * @param {string} content - The LaTeX content
 * @returns {string} HTML with proper lists
 */
function convertLists(content) {
    // Convert itemize to unordered lists
    content = content.replace(/\\begin{itemize}([^]*?)\\end{itemize}/g, (match, items) => {
        items = items.replace(/\\item\s+/g, '<li>') + '</li>';
        items = items.replace(/<\/li>([^<]*)<li>/g, '</li>\n<li>$1');
        return `<ul>${items}</ul>`;
    });
    
    // Convert enumerate to ordered lists
    content = content.replace(/\\begin{enumerate}([^]*?)\\end{enumerate}/g, (match, items) => {
        items = items.replace(/\\item\s+/g, '<li>') + '</li>';
        items = items.replace(/<\/li>([^<]*)<li>/g, '</li>\n<li>$1');
        return `<ol>${items}</ol>`;
    });
    
    return content;
}

/**
 * Main function to convert LaTeX content to HTML
 * @param {string} latexContent - The LaTeX content to convert
 * @returns {string} Converted HTML content
 */
function convertLatexToHtml(latexContent) {
    let htmlContent = latexContent;
    
    // Process environments first (theorem, definition, etc.)
    const environments = ['theorem', 'lemma', 'corollary', 'definition', 'example', 'remark'];
    environments.forEach(env => {
        const regex = new RegExp(`\\\\begin{${env}}([^]*?)\\\\end{${env}}`, 'g');
        htmlContent = htmlContent.replace(regex, (match, content) => {
            return convertEnvironment(content, env);
        });
    });
    
    // Convert sections and other structural elements
    htmlContent = convertSectionHeaders(htmlContent);
    htmlContent = convertMathEnvironments(htmlContent);
    htmlContent = convertReferences(htmlContent);
    htmlContent = convertFigures(htmlContent);
    htmlContent = convertLists(htmlContent);
    
    // Handle paragraph breaks
    htmlContent = htmlContent.replace(/\n\n+/g, '</p><p>');
    htmlContent = '<p>' + htmlContent + '</p>';
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/g, '');
    
    return htmlContent;
}

// Example usage:
/*
const fs = require('fs');

// Read LaTeX file
fs.readFile('arxiv_submission/introduction.tex', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    
    // Convert to HTML
    const htmlContent = convertLatexToHtml(data);
    
    // Write HTML to file
    fs.writeFile('githubpages/converted/introduction.html', htmlContent, err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Successfully converted introduction.tex to HTML');
    });
});
*/

// Make functions available to browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertLatexToHtml,
        convertEnvironment,
        convertSectionHeaders,
        convertMathEnvironments,
        convertReferences,
        convertFigures,
        convertLists
    };
} 
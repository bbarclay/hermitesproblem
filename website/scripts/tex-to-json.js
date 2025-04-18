#!/usr/bin/env node

/**
 * TeX to JSON Converter
 * 
 * This script converts TeX files to a structured JSON format that can be used by the website.
 * It properly handles sections, subsections, equations, figures, tables, and other TeX elements.
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

// Configuration
const CONFIG = {
  texDir: path.resolve(__dirname, '../../arxiv_submission'),
  outputDir: path.resolve(__dirname, '../public/content'),
  tocFile: path.resolve(__dirname, '../public/content/toc.json'),
  debug: false
};

// Regular expressions for parsing TeX
const REGEX = {
  section: /\\section\{([^}]+)\}(?:\s*\\label\{([^}]+)\})?/g,
  subsection: /\\subsection\{([^}]+)\}(?:\s*\\label\{([^}]+)\})?/g,
  subsubsection: /\\subsubsection\{([^}]+)\}(?:\s*\\label\{([^}]+)\})?/g,
  theorem: /\\begin\{theorem\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{theorem\}/g,
  lemma: /\\begin\{lemma\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{lemma\}/g,
  definition: /\\begin\{definition\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{definition\}/g,
  proposition: /\\begin\{proposition\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{proposition\}/g,
  corollary: /\\begin\{corollary\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{corollary\}/g,
  example: /\\begin\{example\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{example\}/g,
  proof: /\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g,
  equation: /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g,
  align: /\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g,
  figure: /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g,
  table: /\\begin\{table\}([\s\S]*?)\\end\{table\}/g,
  itemize: /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
  enumerate: /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
  algorithm: /\\begin\{algorithm(?:_def)?\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{algorithm(?:_def)?\}/g,
  caption: /\\caption\{([^}]+)\}/,
  label: /\\label\{([^}]+)\}/,
  includegraphics: /\\includegraphics(?:\[([^\]]*)\])?\{([^}]+)\}/,
  item: /\\item\s+(.*?)(?=\\item|\\end\{(?:itemize|enumerate)\}|$)/gs,
  cite: /\\cite\{([^}]+)\}/g,
  ref: /\\ref\{([^}]+)\}/g,
  input: /\\input\{([^}]+)\}/g,
  comment: /%.*$/gm,
  math: /\$([^$]+)\$/g,
  displayMath: /\$\$([^$]+)\$\$/g,
};

/**
 * Generate a slug from a string
 * @param {string} str - The string to slugify
 * @returns {string} - The slugified string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Extract blocks from TeX content
 * @param {string} content - The TeX content
 * @returns {Array} - Array of blocks
 */
function extractBlocks(content) {
  const blocks = [];
  let blockCounter = {
    theorem: 0,
    lemma: 0,
    definition: 0,
    proposition: 0,
    corollary: 0,
    example: 0,
    equation: 0,
    figure: 0,
    table: 0,
    algorithm: 0,
  };

  // Extract theorems
  let match;
  while ((match = REGEX.theorem.exec(content)) !== null) {
    blockCounter.theorem++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `theorem-${blockCounter.theorem}`;
    
    blocks.push({
      type: 'theorem',
      id,
      title,
      content: body,
      number: blockCounter.theorem
    });
  }

  // Extract lemmas
  REGEX.lemma.lastIndex = 0;
  while ((match = REGEX.lemma.exec(content)) !== null) {
    blockCounter.lemma++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `lemma-${blockCounter.lemma}`;
    
    blocks.push({
      type: 'lemma',
      id,
      title,
      content: body,
      number: blockCounter.lemma
    });
  }

  // Extract definitions
  REGEX.definition.lastIndex = 0;
  while ((match = REGEX.definition.exec(content)) !== null) {
    blockCounter.definition++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `definition-${blockCounter.definition}`;
    
    blocks.push({
      type: 'definition',
      id,
      title,
      content: body,
      number: blockCounter.definition
    });
  }

  // Extract propositions
  REGEX.proposition.lastIndex = 0;
  while ((match = REGEX.proposition.exec(content)) !== null) {
    blockCounter.proposition++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `proposition-${blockCounter.proposition}`;
    
    blocks.push({
      type: 'proposition',
      id,
      title,
      content: body,
      number: blockCounter.proposition
    });
  }

  // Extract corollaries
  REGEX.corollary.lastIndex = 0;
  while ((match = REGEX.corollary.exec(content)) !== null) {
    blockCounter.corollary++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `corollary-${blockCounter.corollary}`;
    
    blocks.push({
      type: 'corollary',
      id,
      title,
      content: body,
      number: blockCounter.corollary
    });
  }

  // Extract examples
  REGEX.example.lastIndex = 0;
  while ((match = REGEX.example.exec(content)) !== null) {
    blockCounter.example++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `example-${blockCounter.example}`;
    
    blocks.push({
      type: 'example',
      id,
      title,
      content: body,
      number: blockCounter.example
    });
  }

  // Extract equations
  REGEX.equation.lastIndex = 0;
  while ((match = REGEX.equation.exec(content)) !== null) {
    blockCounter.equation++;
    const body = match[1];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `equation-${blockCounter.equation}`;
    
    blocks.push({
      type: 'equation',
      id,
      content: body,
      number: blockCounter.equation
    });
  }

  // Extract align environments as equations
  REGEX.align.lastIndex = 0;
  while ((match = REGEX.align.exec(content)) !== null) {
    blockCounter.equation++;
    const body = match[1];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `equation-${blockCounter.equation}`;
    
    blocks.push({
      type: 'equation',
      id,
      content: body,
      number: blockCounter.equation
    });
  }

  // Extract figures
  REGEX.figure.lastIndex = 0;
  while ((match = REGEX.figure.exec(content)) !== null) {
    blockCounter.figure++;
    const figureContent = match[1];
    
    const captionMatch = REGEX.caption.exec(figureContent);
    const caption = captionMatch ? captionMatch[1] : '';
    
    const labelMatch = REGEX.label.exec(figureContent);
    const id = labelMatch ? labelMatch[1] : `figure-${blockCounter.figure}`;
    
    const graphicsMatch = REGEX.includegraphics.exec(figureContent);
    const image = graphicsMatch ? graphicsMatch[2] : '';
    
    blocks.push({
      type: 'figure',
      id,
      caption,
      image,
      number: blockCounter.figure
    });
  }

  // Extract tables
  REGEX.table.lastIndex = 0;
  while ((match = REGEX.table.exec(content)) !== null) {
    blockCounter.table++;
    const tableContent = match[1];
    
    const captionMatch = REGEX.caption.exec(tableContent);
    const caption = captionMatch ? captionMatch[1] : '';
    
    const labelMatch = REGEX.label.exec(tableContent);
    const id = labelMatch ? labelMatch[1] : `table-${blockCounter.table}`;
    
    blocks.push({
      type: 'table',
      id,
      content: tableContent,
      caption,
      number: blockCounter.table
    });
  }

  // Extract algorithms
  REGEX.algorithm.lastIndex = 0;
  while ((match = REGEX.algorithm.exec(content)) !== null) {
    blockCounter.algorithm++;
    const title = match[1] || '';
    const body = match[2];
    const labelMatch = REGEX.label.exec(body);
    const id = labelMatch ? labelMatch[1] : `algorithm-${blockCounter.algorithm}`;
    
    blocks.push({
      type: 'algorithm',
      id,
      title,
      content: body,
      number: blockCounter.algorithm
    });
  }

  return blocks;
}

/**
 * Extract sections and subsections from TeX content
 * @param {string} content - The TeX content
 * @param {string} filename - The filename
 * @returns {Array} - Array of sections
 */
function extractSections(content, filename) {
  const sections = [];
  let currentSection = null;
  
  // Remove comments
  content = content.replace(REGEX.comment, '');
  
  // Split content by section
  const sectionMatches = [...content.matchAll(REGEX.section)];
  
  if (sectionMatches.length === 0) {
    // If no sections found, treat the whole file as one section
    const fileBaseName = path.basename(filename, '.tex');
    const title = fileBaseName.charAt(0).toUpperCase() + fileBaseName.slice(1).replace(/-/g, ' ');
    const id = slugify(title);
    
    sections.push({
      title,
      id,
      level: 'section',
      content: [content],
      blocks: extractBlocks(content)
    });
    
    return sections;
  }
  
  for (let i = 0; i < sectionMatches.length; i++) {
    const sectionMatch = sectionMatches[i];
    const sectionTitle = sectionMatch[1];
    const sectionLabel = sectionMatch[2] || slugify(sectionTitle);
    const sectionId = sectionLabel.replace(/^sec:/, '');
    
    const sectionStart = sectionMatch.index + sectionMatch[0].length;
    const sectionEnd = i < sectionMatches.length - 1 ? sectionMatches[i + 1].index : content.length;
    const sectionContent = content.substring(sectionStart, sectionEnd).trim();
    
    // Create section object
    currentSection = {
      title: sectionTitle,
      id: sectionId,
      level: 'section',
      content: [],
      subsections: [],
      blocks: extractBlocks(sectionContent)
    };
    
    // Extract subsections
    const subsectionMatches = [...sectionContent.matchAll(REGEX.subsection)];
    
    if (subsectionMatches.length === 0) {
      // If no subsections, add the whole section content
      currentSection.content = [sectionContent];
    } else {
      // Process subsections
      let lastSubsectionEnd = 0;
      
      // Add content before first subsection to section content
      if (subsectionMatches[0].index > 0) {
        currentSection.content.push(sectionContent.substring(0, subsectionMatches[0].index).trim());
      }
      
      for (let j = 0; j < subsectionMatches.length; j++) {
        const subsectionMatch = subsectionMatches[j];
        const subsectionTitle = subsectionMatch[1];
        const subsectionLabel = subsectionMatch[2] || slugify(subsectionTitle);
        const subsectionId = subsectionLabel.replace(/^subsec:/, '');
        
        const subsectionStart = subsectionMatch.index + subsectionMatch[0].length;
        const subsectionEnd = j < subsectionMatches.length - 1 ? subsectionMatches[j + 1].index : sectionContent.length;
        const subsectionContent = sectionContent.substring(subsectionStart, subsectionEnd).trim();
        
        // Create subsection object
        const subsection = {
          title: subsectionTitle,
          id: subsectionId,
          level: 'subsection',
          content: [subsectionContent],
          blocks: extractBlocks(subsectionContent)
        };
        
        // Add subsection to section
        currentSection.subsections.push(subsection);
        lastSubsectionEnd = subsectionEnd;
      }
      
      // Add content after last subsection to section content
      if (lastSubsectionEnd < sectionContent.length) {
        currentSection.content.push(sectionContent.substring(lastSubsectionEnd).trim());
      }
    }
    
    sections.push(currentSection);
  }
  
  return sections;
}

/**
 * Process a TeX file and convert it to JSON
 * @param {string} filePath - Path to the TeX file
 * @returns {Object} - The JSON representation of the TeX file
 */
async function processTexFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const filename = path.basename(filePath);
    const sections = extractSections(content, filename);
    
    return {
      filename,
      sections
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate a table of contents from the processed files
 * @param {Array} processedFiles - Array of processed files
 * @returns {Object} - The table of contents
 */
function generateTOC(processedFiles) {
  const toc = {
    paper: {
      title: "Solving Hermite's Problem: Three Novel Approaches for Complete Characterization of Cubic Irrationals",
      authors: ["Brandon Barclay"],
      date: "April 2025",
      sections: []
    }
  };
  
  // Define the order of files
  const fileOrder = [
    'abstract',
    'introduction',
    'galois-theory',
    'hapd-algorithm',
    'matrix-approach',
    'matrix-computational',
    'matrix-verification',
    'equivalence',
    'subtractive-algorithm',
    'numerical-validation',
    'objections-tex',
    'conclusion',
    'implementation-examples',
    'bibliography'
  ];
  
  // Sort processed files according to the defined order
  const sortedFiles = [...processedFiles].sort((a, b) => {
    const aName = path.basename(a.filename, '.tex');
    const bName = path.basename(b.filename, '.tex');
    const aIndex = fileOrder.indexOf(aName);
    const bIndex = fileOrder.indexOf(bName);
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
  
  // Add sections and subsections to TOC
  for (const file of sortedFiles) {
    const fileBaseName = path.basename(file.filename, '.tex');
    
    for (const section of file.sections) {
      toc.paper.sections.push({
        file: fileBaseName,
        title: section.title,
        id: section.id,
        level: 'section'
      });
      
      // Add subsections if they exist
      if (section.subsections && section.subsections.length > 0) {
        for (const subsection of section.subsections) {
          toc.paper.sections.push({
            file: fileBaseName,
            title: subsection.title,
            id: subsection.id,
            level: 'subsection'
          });
        }
      }
    }
  }
  
  return toc;
}

/**
 * Prepare the output directory
 */
async function prepareOutputDir() {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(CONFIG.outputDir)) {
      await mkdir(CONFIG.outputDir, { recursive: true });
    }
  } catch (error) {
    console.error('Error preparing output directory:', error);
    process.exit(1);
  }
}

/**
 * Save a JSON file
 * @param {string} filePath - Path to save the file
 * @param {Object} data - Data to save
 */
async function saveJsonFile(filePath, data) {
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved ${filePath}`);
  } catch (error) {
    console.error(`Error saving ${filePath}:`, error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('TeX to JSON Converter');
    console.log('====================');
    console.log(`TeX directory: ${CONFIG.texDir}`);
    console.log(`Output directory: ${CONFIG.outputDir}`);
    console.log('');
    
    // Prepare output directory
    await prepareOutputDir();
    
    // Get all TeX files
    const texFiles = fs.readdirSync(CONFIG.texDir)
      .filter(file => file.endsWith('.tex'))
      .map(file => path.join(CONFIG.texDir, file));
    
    console.log(`Found ${texFiles.length} TeX files`);
    
    // Process each file
    const processedFiles = [];
    for (const file of texFiles) {
      console.log(`Processing ${file}...`);
      const processed = await processTexFile(file);
      if (processed) {
        processedFiles.push(processed);
        
        // Save individual file
        const outputFile = path.join(
          CONFIG.outputDir,
          `${path.basename(file, '.tex')}.json`
        );
        await saveJsonFile(outputFile, processed);
      }
    }
    
    // Generate and save TOC
    console.log('Generating table of contents...');
    const toc = generateTOC(processedFiles);
    await saveJsonFile(CONFIG.tocFile, toc);
    
    console.log('');
    console.log('Conversion complete!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();

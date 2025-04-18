import { fromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';

const FIGURES_DIR = path.join(process.cwd(), 'figures', 'output');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Find all PDFs in figures directory
const pdfFiles = fs.readdirSync(FIGURES_DIR).filter(file => file.endsWith('.pdf'));

// Convert each PDF
async function convertPdfs() {
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(FIGURES_DIR, pdfFile);
    const outputFileName = pdfFile.replace('.pdf', '');
    
    const options = {
      density: 300,
      saveFilename: outputFileName,
      savePath: OUTPUT_DIR,
      format: "png",
      width: 1200,
      height: 900
    };
    
    const convert = fromPath(pdfPath, options);
    
    try {
      // Convert first page only
      await convert(1);
      console.log(`Converted ${pdfFile} to PNG`);
    } catch (error) {
      console.error(`Error converting ${pdfFile}:`, error);
    }
  }
}

convertPdfs();
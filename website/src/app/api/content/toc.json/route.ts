import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'toc.json');
    let fileContent;
    
    try {
      fileContent = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`TOC file not found: ${filePath}`);
      return NextResponse.json([], { status: 404 });
    }
    
    try {
      const jsonContent = JSON.parse(fileContent);
      return NextResponse.json(jsonContent);
    } catch (parseError) {
      console.error('Error parsing TOC JSON:', parseError);
      return NextResponse.json([], { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json([], { status: 500 });
  }
} 
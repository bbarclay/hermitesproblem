import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const file = slug;

    // Ensure the file parameter is safe
    if (!file || file.includes('..')) {
      return NextResponse.json({ error: 'Invalid file parameter' }, { status: 400 });
    }

    // Determine the file path
    const filePath = path.join(process.cwd(), 'public', 'content', `${file}`);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read the file
    const content = await fsPromises.readFile(filePath, 'utf8');

    // Parse the JSON content
    const data = JSON.parse(content);

    // Return the content
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

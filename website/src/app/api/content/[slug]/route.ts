import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Access the slug parameter safely
    const { slug } = await params;

    console.log(`API: Received request for slug:`, slug);

    if (!slug) {
      console.error('API: Missing slug parameter');
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Remove .json extension if it exists in the slug
    const baseName = slug.endsWith('.json')
      ? slug.slice(0, -5)
      : slug;

    // Construct the file path
    const filePath = path.join(process.cwd(), 'public', 'content', `${baseName}.json`);
    console.log(`API: Looking for file:`, filePath);

    // Try to read the file
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf8');
      console.log(`API: Successfully read file ${baseName}.json`);
    } catch (error) {
      console.error(`API: File not found: ${filePath}`);

      // Return a default structure if file doesn't exist
      return NextResponse.json({
        sections: [
          {
            title: baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/-/g, ' '),
            id: `section-${baseName}`,
            level: 'section',
            content: [`# ${baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/-/g, ' ')}\n\nContent for this section is being prepared.`]
          }
        ]
      });
    }

    // Parse and return the JSON
    try {
      const jsonContent = JSON.parse(fileContent);
      return NextResponse.json(jsonContent);
    } catch (parseError) {
      console.error('API: Error parsing JSON:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON format',
        sections: []
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API: Unexpected error:', error);
    return NextResponse.json({
      error: 'Failed to fetch content',
      sections: []
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import allContent from '@/lib/static-content';

// Cache for API responses
const contentCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export async function GET(request: NextRequest) {
    try {
        // Get file parameter from query string
        const file = request.nextUrl.searchParams.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'File parameter is required' },
                { status: 400 }
            );
        }

        // Check if we have a valid cached response
        const cacheKey = `content-${file}`;
        if (contentCache.has(cacheKey)) {
            const { data, timestamp } = contentCache.get(cacheKey);

            // Return cached data if it's still valid
            if (Date.now() - timestamp < CACHE_DURATION) {
                return NextResponse.json(data, {
                    headers: {
                        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                    },
                });
            }
        }

        // Try to get from pre-loaded static content first
        if (allContent?.content && allContent.content[file]) {
            const contentData = allContent.content[file];

            // Cache the response
            contentCache.set(cacheKey, {
                data: contentData,
                timestamp: Date.now(),
            });

            return NextResponse.json(contentData, {
                headers: {
                    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                },
            });
        }

        // If not found in static content, try to read from file system
        const filePath = path.join(process.cwd(), 'public', 'content', `${file}.json`);
        const fileData = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileData);

        // Cache the response
        contentCache.set(cacheKey, {
            data: jsonData,
            timestamp: Date.now(),
        });

        return NextResponse.json(jsonData, {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve content' },
            { status: 500 }
        );
    }
}
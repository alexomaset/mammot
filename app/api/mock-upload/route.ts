import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Define the upload directory paths for mock uploads
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directory exists
async function ensureDirectory(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    await mkdir(directoryPath, { recursive: true });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle PUT requests for file uploads
export async function PUT(request: NextRequest) {
  try {
    // Extract the file path from the request URL
    const pathname = request.nextUrl.pathname.replace(/^\/api\/mock-upload\//, '');
    
    if (!pathname) {
      return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
    }

    // Create full file path and ensure directory exists
    const fullDirPath = path.join(UPLOAD_DIR, path.dirname(pathname));
    const fullFilePath = path.join(UPLOAD_DIR, pathname);
    
    await ensureDirectory(fullDirPath);
    
    // Save the file
    const bytes = await request.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(fullFilePath, buffer);
    
    // Return success response
    return NextResponse.json({
      success: true,
      url: `/uploads/${pathname}`,
      path: pathname
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error in mock upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Handle POST requests for file uploads (alternative to PUT)
export async function POST(request: NextRequest) {
  return PUT(request);
} 
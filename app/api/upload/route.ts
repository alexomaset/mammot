import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the upload directory paths
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const VIDEO_DIR = path.join(UPLOAD_DIR, 'videos');
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');

// Ensure directories exist
async function ensureDirectories() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  if (!existsSync(VIDEO_DIR)) {
    await mkdir(VIDEO_DIR, { recursive: true });
  }
  if (!existsSync(IMAGE_DIR)) {
    await mkdir(IMAGE_DIR, { recursive: true });
  }
}

// Handle file upload
export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'video' && type !== 'image')) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "video" or "image"' },
        { status: 400 }
      );
    }

    // Validate file size (10MB for images, 100MB for videos)
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          error: `File too large. Maximum size is ${type === 'image' ? '10MB' : '100MB'}` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    };

    if (!validTypes[type].includes(file.type)) {
      return NextResponse.json(
        { 
          error: `Invalid file type. Allowed types for ${type} are: ${validTypes[type].join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    // Create a unique filename
    const fileName = `${uuidv4()}.${fileExt}`;
    const dir = type === 'video' ? VIDEO_DIR : IMAGE_DIR;
    const filePath = path.join(dir, fileName);

    // Convert file to buffer and save it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate the public URL
    const publicUrl = `/uploads/${type}s/${fileName}`;

    return NextResponse.json({
      url: publicUrl,
      fileName,
      success: true
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { put } from '@vercel/blob';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

export async function POST(request: NextRequest) {
  try {
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Check authentication in production
      const token = await getToken({ req: request as any });
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

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

    // Generate a unique path for the file
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const fileNameBase = file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${timestamp}-${fileNameBase}.${fileExt}`;
    const path = `${type}s/${fileName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(path, file, {
      access: 'public',
    });

    return NextResponse.json({
      url: blob.url,
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
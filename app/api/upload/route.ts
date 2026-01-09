import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Force development mode for local testing
const isDevelopment = process.env.NODE_ENV === 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-for-local-testing-only';

export async function POST(request: NextRequest) {
  try {
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Get the token from the cookie for production
      const tokenCookie = request.cookies.get('admin_token');

      if (!tokenCookie || !tokenCookie.value) {
        console.error('Upload unauthorized: No admin_token cookie found');
        return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
      }

      try {
        // Verify the JWT token from cookie
        const decoded = verify(tokenCookie.value, JWT_SECRET) as any;

        // Check if the token contains admin role
        if (!decoded || decoded.role !== 'admin') {
          console.error('Upload unauthorized: Token invalid or not admin role', decoded);
          return NextResponse.json({ error: 'Unauthorized - Invalid credentials' }, { status: 401 });
        }

        console.log('Upload authentication successful for user:', decoded.username);
      } catch (tokenError) {
        console.error('Upload unauthorized: Token verification failed', tokenError);
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
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

    // Validate file size (10MB for images, 100MB for videos in production, unlimited in dev)
    const maxSize = isDevelopment
      ? Infinity // No limit in development
      : (type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024);

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

    if (isDevelopment) {
      // Development: Save to local filesystem (no size limit!)
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', `${type}s`);
      const filePath = path.join(uploadDir, fileName);

      // Create directory if it doesn't exist
      await mkdir(uploadDir, { recursive: true });

      // Convert File to Buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Return local URL
      const url = `/uploads/${type}s/${fileName}`;
      console.log(`✅ Uploaded ${type} to local storage: ${url} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      return NextResponse.json({
        url,
        fileName,
        success: true
      });
    } else {
      // Production: Upload to Vercel Blob Storage
      const blobPath = `${type}s/${fileName}`;
      const blob = await put(blobPath, file, {
        access: 'public',
      });

      console.log(`✅ Uploaded ${type} to Vercel Blob: ${blob.url}`);

      return NextResponse.json({
        url: blob.url,
        fileName,
        success: true
      });
    }

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
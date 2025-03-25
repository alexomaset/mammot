import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { handleUpload } from '@vercel/blob/client';

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

    // Handle upload with client token generation
    const body = await request.json();
    
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Here you can verify user permissions for this specific upload
        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp',
            'video/mp4', 
            'video/quicktime', 
            'video/x-msvideo', 
            'video/x-matroska'
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB max size
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This will be called once the upload is complete
        console.log('Upload completed:', blob, tokenPayload);
        // Here you could update a database record with the blob URL
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' }, 
      { status: 500 }
    );
  }
} 
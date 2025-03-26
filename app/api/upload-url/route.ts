import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { handleUpload } from '@vercel/blob/client';

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
        console.error('Upload-url unauthorized: No admin_token cookie found');
        return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
      }
      
      try {
        // Verify the JWT token from cookie
        const decoded = verify(tokenCookie.value, JWT_SECRET) as any;
        
        // Check if the token contains admin role
        if (!decoded || decoded.role !== 'admin') {
          console.error('Upload-url unauthorized: Token invalid or not admin role', decoded);
          return NextResponse.json({ error: 'Unauthorized - Invalid credentials' }, { status: 401 });
        }
        
        console.log('Upload-url authentication successful for user:', decoded.username);
      } catch (tokenError) {
        console.error('Upload-url unauthorized: Token verification failed', tokenError);
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
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
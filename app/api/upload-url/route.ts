import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getSupabaseAdmin } from '@/lib/supabase';

// Force development mode for local testing
const isDevelopment = process.env.NODE_ENV === 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-for-local-testing-only';

const BUCKETS = {
  video: 'portfolio-videos',
  image: 'portfolio-images',
} as const;

const ALLOWED_CONTENT_TYPES: Record<'video' | 'image', string[]> = {
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

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

    const { filename, type, contentType } = await request.json();

    if (!filename || (type !== 'video' && type !== 'image')) {
      return NextResponse.json(
        { error: 'Invalid request. Provide "filename" and a "type" of video or image.' },
        { status: 400 }
      );
    }

    if (contentType && !ALLOWED_CONTENT_TYPES[type as 'video' | 'image'].includes(contentType)) {
      return NextResponse.json(
        { error: `Invalid content type ${contentType} for ${type} upload` },
        { status: 400 }
      );
    }

    const bucket = BUCKETS[type as 'video' | 'image'];
    // Sanitize the path: keep it flat and predictable
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(safeName);

    if (error || !data) {
      console.error('Error creating signed upload URL:', error);
      return NextResponse.json(
        { error: error?.message || 'Failed to create upload URL' },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(safeName);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      bucket,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process upload' },
      { status: 500 }
    );
  }
}

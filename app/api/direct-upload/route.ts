import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Force development mode for local testing
const isDevelopment = process.env.NODE_ENV === 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-for-local-testing-only';

// Define the upload directory paths for direct file upload fallback
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
async function ensureDirectory(directoryPath: string) {
  if (!existsSync(directoryPath)) {
    await mkdir(directoryPath, { recursive: true });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Get the token from the cookie for production
      const tokenCookie = request.cookies.get('admin_token');
      
      if (!tokenCookie || !tokenCookie.value) {
        console.error('Direct-upload unauthorized: No admin_token cookie found');
        return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
      }
      
      try {
        // Verify the JWT token from cookie
        const decoded = verify(tokenCookie.value, JWT_SECRET) as any;
        
        // Check if the token contains admin role
        if (!decoded || decoded.role !== 'admin') {
          console.error('Direct-upload unauthorized: Token invalid or not admin role', decoded);
          return NextResponse.json({ error: 'Unauthorized - Invalid credentials' }, { status: 401 });
        }
        
        console.log('Direct-upload authentication successful for user:', decoded.username);
      } catch (tokenError) {
        console.error('Direct-upload unauthorized: Token verification failed', tokenError);
        return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
      }
    }

    // Get the file path from the URL parameters
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({ error: 'Missing file path' }, { status: 400 });
    }

    // Generate the full path for the file
    const fullDirPath = path.join(UPLOAD_DIR, path.dirname(filePath));
    const fullFilePath = path.join(UPLOAD_DIR, filePath);
    
    // Ensure the directory exists
    await ensureDirectory(fullDirPath);
    
    // Save the file
    const bytes = await request.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(fullFilePath, buffer);
    
    // Return success response
    return NextResponse.json({
      success: true,
      url: `/uploads/${filePath}`,
      path: filePath
    });
  } catch (error) {
    console.error('Error in direct upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file directly' }, 
      { status: 500 }
    );
  }
} 
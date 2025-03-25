import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// In a real application, these would be stored securely in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123'; // Changed default password for security
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-for-local-testing-only';

// Debug info for development only
if (process.env.NODE_ENV === 'development') {
  console.log('⚙️ Auth configuration:');
  console.log(`- Admin username: ${ADMIN_USERNAME}`);
  console.log(`- Admin password: ${ADMIN_PASSWORD}`);
  console.log('Use these credentials to log in to the admin panel in development mode');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credentials } = body;
    
    if (!credentials) {
      return NextResponse.json(
        { success: false, message: 'Credentials are required' },
        { status: 400 }
      );
    }
    
    // Decode and verify the credentials
    try {
      const decoded = atob(credentials);
      const [username, password] = decoded.split(':');
      
      // Log authentication attempt in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Auth attempt: ${username} / ${password.replace(/./g, '*')}`);
      }
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create a JWT token
        const token = sign(
          { username, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '1d' }
        );
        
        // Create response
        const response = NextResponse.json({ success: true });
        
        // Set cookie in the response
        response.cookies.set({
          name: 'admin_token',
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });
        
        console.log('✅ Authentication successful');
        return response;
      }
      
      console.log('❌ Authentication failed: Invalid username or password');
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    } catch (error) {
      console.error('Credential decoding error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials format' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 
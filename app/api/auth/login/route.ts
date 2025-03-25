import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// In a real application, these would be stored securely in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        
        return response;
      }
      
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
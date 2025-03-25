import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

// JWT secret (in a real app, this would be in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ valid: false, message: 'No token provided' }, { status: 401 });
    }
    
    // Verify the token
    verify(token, JWT_SECRET);
    
    // If verification passes, return success
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
} 
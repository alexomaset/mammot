import { NextRequest, NextResponse } from 'next/server';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  console.log('Handling OPTIONS request to old mock-upload-url path');
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Handle all other methods
export async function GET(request: NextRequest) {
  return redirectToNewEndpoint(request);
}

export async function POST(request: NextRequest) {
  return redirectToNewEndpoint(request);
}

export async function PUT(request: NextRequest) {
  return redirectToNewEndpoint(request);
}

// Helper function to redirect to the new endpoint
function redirectToNewEndpoint(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const newPath = pathname.replace('/mock-upload-url/', '/api/mock-upload/');
  
  console.log(`Redirecting request from ${pathname} to ${newPath}`);
  
  // Create a new URL with the correct path
  const url = new URL(newPath, request.url);
  
  return NextResponse.redirect(url);
} 
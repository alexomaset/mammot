import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { 
  getPortfolioItems, 
  getPortfolioItemById, 
  createPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem 
} from '@/lib/db';
import { deleteFile } from '@/lib/file-upload';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Force development mode for local testing
const isDevelopment = process.env.NODE_ENV === 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-for-local-testing-only';

// Helper function to verify admin authentication
function verifyAdminAuth(request: NextRequest): { authorized: boolean; message?: string; decoded?: any } {
  // Skip authentication in development mode
  if (isDevelopment) {
    return { authorized: true };
  }
  
  // Get the token from the cookie for production
  const tokenCookie = request.cookies.get('admin_token');
  
  if (!tokenCookie || !tokenCookie.value) {
    console.error('Portfolio API unauthorized: No admin_token cookie found');
    return { 
      authorized: false, 
      message: 'Unauthorized - Please log in' 
    };
  }
  
  try {
    // Verify the JWT token from cookie
    const decoded = verify(tokenCookie.value, JWT_SECRET) as any;
    
    // Check if the token contains admin role
    if (!decoded || decoded.role !== 'admin') {
      console.error('Portfolio API unauthorized: Token invalid or not admin role', decoded);
      return { 
        authorized: false, 
        message: 'Unauthorized - Invalid credentials' 
      };
    }
    
    console.log('Portfolio API authentication successful for user:', decoded.username);
    return { 
      authorized: true, 
      decoded 
    };
  } catch (tokenError) {
    console.error('Portfolio API unauthorized: Token verification failed', tokenError);
    return { 
      authorized: false, 
      message: 'Unauthorized - Invalid token' 
    };
  }
}

// GET all portfolio items
export async function GET(request: NextRequest) {
  try {
    const portfolioItems = await getPortfolioItems();
    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio items' }, { status: 500 });
  }
}

// POST new portfolio item
export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const { title, videoUrl, thumbnail, category } = body;
    if (!title || !videoUrl || !thumbnail || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create item in database
    const newItem = await createPortfolioItem({
      title,
      category,
      videoUrl,
      thumbnail,
      description: body.description || '',
      tags: body.tags || [],
    });

    if (!newItem) {
      return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json({ error: 'Failed to create portfolio item' }, { status: 500 });
  }
}

// PUT (update) portfolio item
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authorization
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Get the existing item
    const existingItem = await getPortfolioItemById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Update the item
    const updatedItem = await updatePortfolioItem(id, body);
    if (!updatedItem) {
      return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
  }
}

// DELETE portfolio item
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authorization
    const auth = verifyAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.message }, { status: 401 });
    }

    // Get the ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Get the item first so we can delete its files
    const item = await getPortfolioItemById(Number(id));
    if (!item) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Delete the thumbnail and maybe the video from Blob storage
    try {
      // Delete thumbnail from blob storage if it's stored there
      if (item.thumbnail.includes('vercel-storage.com')) {
        await deleteFile(item.thumbnail);
      }
      
      // Delete video from blob storage if it's stored there
      if (item.videoUrl.includes('vercel-storage.com')) {
        await deleteFile(item.videoUrl);
      }
    } catch (fileError) {
      console.error('Error deleting files from blob storage:', fileError);
      // Continue with item deletion even if file deletion fails
    }

    // Delete from database
    const deleted = await deletePortfolioItem(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
  }
} 
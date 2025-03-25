import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
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

// Force development mode to bypass authentication
const isDevelopment = true;

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
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Check authentication in production
      const token = await getToken({ req: request as any });
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Check authentication in production
      const token = await getToken({ req: request as any });
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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
    // Skip authentication in development mode
    if (!isDevelopment) {
      // Check authentication in production
      const token = await getToken({ req: request as any });
      if (!token || token.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
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
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

// Ensure the data directory exists
const ensureDataDirExists = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize the data file if it doesn't exist
const initDataFileIfNeeded = () => {
  ensureDataDirExists();
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(
      DATA_FILE_PATH, 
      JSON.stringify([
        {
          id: 1,
          title: "Adventure in Paradise",
          category: "Travel & Lifestyle",
          videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
          thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
          description: "Exploring hidden beaches and tropical destinations",
          tags: ["travel", "nature", "adventure"],
          createdAt: new Date().toISOString()
        }
      ], null, 2)
    );
  }
};

// Read all portfolio items
const getPortfolioItems = (): PortfolioItem[] => {
  initDataFileIfNeeded();
  const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
  return JSON.parse(data);
};

// Write portfolio items to file
const savePortfolioItems = (items: PortfolioItem[]): void => {
  ensureDataDirExists();
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(items, null, 2));
};

// GET handler for retrieving all portfolio items
export async function GET() {
  try {
    const items = getPortfolioItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error reading portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.videoUrl || !body.thumbnail || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const items = getPortfolioItems();
    
    // Generate a new ID
    const newId = items.length > 0 
      ? Math.max(...items.map(item => item.id)) + 1 
      : 1;
    
    // Create new item
    const newItem: PortfolioItem = {
      id: newId,
      title: body.title,
      category: body.category,
      videoUrl: body.videoUrl,
      thumbnail: body.thumbnail,
      description: body.description || '',
      tags: body.tags || [],
      createdAt: new Date().toISOString()
    };
    
    // Add to items and save
    items.push(newItem);
    savePortfolioItems(items);
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a portfolio item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate ID
    if (!body.id) {
      return NextResponse.json(
        { error: 'Missing ID field' },
        { status: 400 }
      );
    }
    
    const items = getPortfolioItems();
    const itemIndex = items.findIndex(item => item.id === body.id);
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Update the item
    const updatedItem: PortfolioItem = {
      ...items[itemIndex],
      title: body.title || items[itemIndex].title,
      category: body.category || items[itemIndex].category,
      videoUrl: body.videoUrl || items[itemIndex].videoUrl,
      thumbnail: body.thumbnail || items[itemIndex].thumbnail,
      description: body.description || items[itemIndex].description,
      tags: body.tags || items[itemIndex].tags,
      updatedAt: new Date().toISOString()
    };
    
    items[itemIndex] = updatedItem;
    savePortfolioItems(items);
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a portfolio item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }
    
    const items = getPortfolioItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    savePortfolioItems(filteredItems);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item' },
      { status: 500 }
    );
  }
} 
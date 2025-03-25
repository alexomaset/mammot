import { sql } from '@vercel/postgres';

// Force development mode without DB since we're seeing connection errors
const isDevelopmentWithoutDB = true;
console.log('🔄 FORCED DEVELOPMENT MODE: Using in-memory database');

// Schema definition
export async function initializeDatabase() {
  // Development fallback if no database is configured
  if (isDevelopmentWithoutDB) {
    console.log('🧠 Using in-memory data storage as fallback');
    return true;
  }

  try {
    // Create the portfolio_items table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        video_url TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        description TEXT,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );
    `;
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// In-memory data storage for development when no DB is available
const inMemoryData: PortfolioItem[] = [
  {
    id: 1,
    title: "Adventure in Paradise",
    category: "Travel & Lifestyle",
    videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
    description: "Exploring hidden beaches and tropical destinations",
    tags: ["travel", "nature", "adventure"],
  }
];

// Portfolio item type
export interface PortfolioItem {
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

// Convert DB row to PortfolioItem
export function rowToPortfolioItem(row: any): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    videoUrl: row.video_url,
    thumbnail: row.thumbnail,
    description: row.description || '',
    tags: row.tags || [],
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
  };
}

// Get all portfolio items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    // Use in-memory data in development if no DB is configured
    if (isDevelopmentWithoutDB) {
      return [...inMemoryData];
    }

    const result = await sql`SELECT * FROM portfolio_items ORDER BY id DESC`;
    return result.rows.map(rowToPortfolioItem);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return isDevelopmentWithoutDB ? [...inMemoryData] : [];
  }
}

// Get portfolio item by ID
export async function getPortfolioItemById(id: number): Promise<PortfolioItem | null> {
  try {
    // Use in-memory data in development if no DB is configured
    if (isDevelopmentWithoutDB) {
      const item = inMemoryData.find(item => item.id === id);
      return item || null;
    }

    const result = await sql`SELECT * FROM portfolio_items WHERE id = ${id}`;
    if (result.rows.length === 0) {
      return null;
    }
    return rowToPortfolioItem(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching portfolio item with id ${id}:`, error);
    return null;
  }
}

// Create a new portfolio item
export async function createPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
  try {
    // Use in-memory data in development if no DB is configured
    if (isDevelopmentWithoutDB) {
      const newId = inMemoryData.length > 0 
        ? Math.max(...inMemoryData.map(item => item.id)) + 1 
        : 1;
      
      const newItem: PortfolioItem = {
        id: newId,
        ...item,
      };
      
      inMemoryData.push(newItem);
      return newItem;
    }

    // For SQL query, convert tags array to a PostgreSQL compatible format
    const tagsParam = item.tags && item.tags.length > 0 
      ? `{${item.tags.join(',')}}` 
      : '{}';

    const result = await sql`
      INSERT INTO portfolio_items (
        title, category, video_url, thumbnail, description, tags, created_at
      ) VALUES (
        ${item.title}, 
        ${item.category}, 
        ${item.videoUrl}, 
        ${item.thumbnail}, 
        ${item.description || ''}, 
        ${tagsParam}::text[], 
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `;
    
    return rowToPortfolioItem(result.rows[0]);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return null;
  }
}

// Update a portfolio item
export async function updatePortfolioItem(id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
  try {
    // Use in-memory data in development if no DB is configured
    if (isDevelopmentWithoutDB) {
      const index = inMemoryData.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      inMemoryData[index] = {
        ...inMemoryData[index],
        ...item,
        title: item.title || inMemoryData[index].title,
        category: item.category || inMemoryData[index].category,
        videoUrl: item.videoUrl || inMemoryData[index].videoUrl,
        thumbnail: item.thumbnail || inMemoryData[index].thumbnail,
        description: item.description !== undefined ? item.description : inMemoryData[index].description,
        tags: item.tags || inMemoryData[index].tags,
      };
      
      return inMemoryData[index];
    }

    // Get the existing item
    const existingItem = await getPortfolioItemById(id);
    if (!existingItem) {
      return null;
    }
    
    // For SQL query, convert tags array to a PostgreSQL compatible format
    const tagsParam = item.tags && item.tags.length > 0 
      ? `{${item.tags.join(',')}}` 
      : existingItem.tags && existingItem.tags.length > 0 
        ? `{${existingItem.tags.join(',')}}` 
        : '{}';
    
    // Update the item
    const result = await sql`
      UPDATE portfolio_items SET
        title = ${item.title || existingItem.title},
        category = ${item.category || existingItem.category},
        video_url = ${item.videoUrl || existingItem.videoUrl},
        thumbnail = ${item.thumbnail || existingItem.thumbnail},
        description = ${item.description !== undefined ? item.description : existingItem.description},
        tags = ${tagsParam}::text[],
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    
    return rowToPortfolioItem(result.rows[0]);
  } catch (error) {
    console.error(`Error updating portfolio item with id ${id}:`, error);
    return null;
  }
}

// Delete a portfolio item
export async function deletePortfolioItem(id: number): Promise<boolean> {
  try {
    // Use in-memory data in development if no DB is configured
    if (isDevelopmentWithoutDB) {
      const initialLength = inMemoryData.length;
      const newItems = inMemoryData.filter(item => item.id !== id);
      inMemoryData.length = 0;
      inMemoryData.push(...newItems);
      return initialLength > inMemoryData.length;
    }

    const result = await sql`DELETE FROM portfolio_items WHERE id = ${id}`;
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error(`Error deleting portfolio item with id ${id}:`, error);
    return false;
  }
} 
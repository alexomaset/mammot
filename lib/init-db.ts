import { initializeDatabase, getPortfolioItems, createPortfolioItem } from './db';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'portfolio.json');

/**
 * Migrates existing portfolio data from JSON file to Postgres database
 */
export async function migratePortfolioData() {
  try {
    // Check if the database is already initialized
    const isInitialized = await initializeDatabase();
    
    if (!isInitialized) {
      console.error('Failed to initialize database');
      return false;
    }
    
    // Check if there's any data in the database already
    const existingItems = await getPortfolioItems();
    if (existingItems.length > 0) {
      console.log('Database already has portfolio items, skipping migration');
      return true;
    }
    
    // Check if the JSON file exists
    if (fs.existsSync(DATA_FILE_PATH)) {
      // Read the file
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const items = JSON.parse(data);
      
      // Migrate each item to the database
      console.log(`Migrating ${items.length} portfolio items to database...`);
      
      for (const item of items) {
        await createPortfolioItem({
          title: item.title,
          category: item.category,
          videoUrl: item.videoUrl,
          thumbnail: item.thumbnail,
          description: item.description || '',
          tags: item.tags || [],
        });
      }
      
      console.log('Portfolio data migration completed successfully');
      return true;
    } else {
      // If no JSON file exists, create a sample item
      console.log('No existing data file found, creating sample item');
      
      await createPortfolioItem({
        title: "Adventure in Paradise",
        category: "Travel & Lifestyle",
        videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
        description: "Exploring hidden beaches and tropical destinations",
        tags: ["travel", "nature", "adventure"],
      });
      
      console.log('Created sample portfolio item');
      return true;
    }
  } catch (error) {
    console.error('Error migrating portfolio data:', error);
    return false;
  }
} 
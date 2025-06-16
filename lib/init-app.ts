import { initializeDatabase } from './db';
import { migratePortfolioData } from './init-db';

let initialized = false;

/**
 * Initialize the application
 * This function should be called once at app startup
 */
export async function initializeApp() {
  if (initialized) {
    return true;
  }
  
  try {
    console.log('Initializing application...');
    
    // Initialize the database (this may fail and fallback to file storage)
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.log('Database initialization failed, but continuing with file storage fallback');
    }
    
    // Migrate data from JSON files if needed
    await migratePortfolioData();
    
    console.log('Application initialization completed');
    initialized = true;
    return true;
  } catch (error) {
    console.error('Application initialization failed:', error);
    // Still mark as initialized to prevent infinite retry loops
    initialized = true;
    return false;
  }
}
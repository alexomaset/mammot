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
    
    // Initialize the database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('Failed to initialize database');
      return false;
    }
    
    // Migrate data from JSON files if needed
    await migratePortfolioData();
    
    console.log('Application initialization completed');
    initialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing application:', error);
    return false;
  }
} 
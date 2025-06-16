import fs from 'fs';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load data from file
function loadData(): PortfolioItem[] {
  try {
    ensureDataDirectory();
    if (!fs.existsSync(DATA_FILE)) {
      // Create file with sample data if it doesn't exist
      const sampleData: PortfolioItem[] = [
        {
          id: 1,
          title: "Adventure in Paradise",
          category: "Travel & Lifestyle",
          videoUrl: "https://player.vimeo.com/external/368763065.sd.mp4?s=308c8c3688ac49b3b307c54f0fa2c894ff2accf2&profile_id=139&oauth2_token_id=57447761",
          thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
          description: "Exploring hidden beaches and tropical destinations",
          tags: ["travel", "nature", "adventure"],
          createdAt: new Date().toISOString(),
        }
      ];
      saveData(sampleData);
      return sampleData;
    }
    
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}

// Save data to file
function saveData(data: PortfolioItem[]): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Get all portfolio items
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return loadData().sort((a, b) => b.id - a.id);
}

// Get portfolio item by ID
export async function getPortfolioItemById(id: number): Promise<PortfolioItem | null> {
  const data = loadData();
  return data.find(item => item.id === id) || null;
}

// Create a new portfolio item
export async function createPortfolioItem(item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
  try {
    const data = loadData();
    const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    
    const newItem: PortfolioItem = {
      id: newId,
      ...item,
      createdAt: new Date().toISOString(),
    };
    
    data.push(newItem);
    saveData(data);
    
    console.log('✅ Portfolio item created and saved to file:', newItem.title);
    return newItem;
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return null;
  }
}

// Update a portfolio item
export async function updatePortfolioItem(id: number, item: Partial<PortfolioItem>): Promise<PortfolioItem | null> {
  try {
    const data = loadData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = {
      ...data[index],
      ...item,
      updatedAt: new Date().toISOString(),
    };
    
    saveData(data);
    
    console.log('✅ Portfolio item updated and saved to file:', data[index].title);
    return data[index];
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return null;
  }
}

// Delete a portfolio item
export async function deletePortfolioItem(id: number): Promise<boolean> {
  try {
    const data = loadData();
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    data.splice(index, 1);
    saveData(data);
    
    console.log('✅ Portfolio item deleted and saved to file');
    return true;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }
}

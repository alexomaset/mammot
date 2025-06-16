#!/usr/bin/env node

/**
 * Debug script to check portfolio data status
 * Run with: node scripts/debug-portfolio.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Portfolio Debug Script');
console.log('==========================');

// Check if file storage exists
const portfolioDataPath = path.join(__dirname, '../data/portfolio.json');
console.log('\n📁 File Storage Status:');
console.log('Path:', portfolioDataPath);

if (fs.existsSync(portfolioDataPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(portfolioDataPath, 'utf8'));
    console.log('✅ File storage exists');
    console.log('📊 Portfolio items in file:', data.length);
    
    data.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title}`);
      console.log(`     Category: ${item.category}`);
      console.log(`     Has Video: ${!!item.videoUrl ? '✅' : '❌'}`);
      console.log(`     Has Thumbnail: ${!!item.thumbnail ? '✅' : '❌'}`);
      console.log(`     Video URL: ${item.videoUrl ? item.videoUrl.substring(0, 50) + '...' : 'None'}`);
      console.log('');
    });
  } catch (error) {
    console.log('❌ Error reading file storage:', error.message);
  }
} else {
  console.log('❌ File storage not found');
}

// Check environment variables
console.log('\n🔧 Environment Variables:');
console.log('USE_FILE_STORAGE:', process.env.USE_FILE_STORAGE || 'undefined');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? '✅ Set' : '❌ Not set');
console.log('BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Not set');

console.log('\n🎯 Recommendations:');
console.log('1. Check server logs during video upload');
console.log('2. Verify API endpoints are accessible');
console.log('3. Test with browser network tab');
console.log('4. Check if file storage fallback is working');

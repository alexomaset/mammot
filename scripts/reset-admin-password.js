#!/usr/bin/env node

/**
 * Admin Password Reset Utility
 * Usage: node scripts/reset-admin-password.js [new-password]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function updateEnvFile(newPassword, newJwtSecret = null) {
  const envPath = path.join(__dirname, '../.env');
  let envContent = '';
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Parse existing env variables
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  
  // Update admin credentials
  envVars['ADMIN_USERNAME'] = envVars['ADMIN_USERNAME'] || 'admin';
  envVars['ADMIN_PASSWORD'] = newPassword;
  
  // Generate new JWT secret if not provided or doesn't exist
  if (!newJwtSecret && !envVars['JWT_SECRET']) {
    newJwtSecret = crypto.randomBytes(64).toString('hex');
  }
  if (newJwtSecret) {
    envVars['JWT_SECRET'] = newJwtSecret;
  }
  
  // Write back to .env file
  const newEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, newEnvContent);
  
  console.log('✅ Admin password updated successfully!');
  console.log(`📝 Username: ${envVars['ADMIN_USERNAME']}`);
  console.log(`🔐 Password: ${newPassword}`);
  console.log('🚀 Restart your development server for changes to take effect.');
}

function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Main execution
const args = process.argv.slice(2);
let newPassword = args[0];

if (!newPassword) {
  console.log('No password provided. Generating a secure password...');
  newPassword = generateSecurePassword();
}

if (newPassword.length < 8) {
  console.error('❌ Error: Password must be at least 8 characters long');
  process.exit(1);
}

try {
  updateEnvFile(newPassword);
} catch (error) {
  console.error('❌ Error updating password:', error.message);
  process.exit(1);
}

import { PutBlobResult, del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Check if we're running in a development environment without blob storage
const isDevelopmentWithoutBlob = process.env.NODE_ENV === 'development' && !process.env.BLOB_READ_WRITE_TOKEN;

// Define the upload directory paths for development
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const VIDEO_DIR = path.join(UPLOAD_DIR, 'videos');
const IMAGE_DIR = path.join(UPLOAD_DIR, 'images');

// Ensure directories exist for development fallback
async function ensureDirectories() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
  if (!fs.existsSync(VIDEO_DIR)) {
    await mkdir(VIDEO_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGE_DIR)) {
    await mkdir(IMAGE_DIR, { recursive: true });
  }
}

export interface FileUploadResult {
  url: string;
  success: boolean;
  message?: string;
  fileName?: string;
}

export async function uploadFile(
  file: File, 
  type: 'image' | 'video'
): Promise<FileUploadResult> {
  try {
    // Validate file type
    const validTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
    };

    if (!validTypes[type].includes(file.type)) {
      return {
        url: '',
        success: false,
        message: `Invalid file type. Allowed types for ${type} are: ${validTypes[type].join(', ')}`
      };
    }

    // Validate file size (10MB for images, 100MB for videos)
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        url: '',
        success: false,
        message: `File too large. Maximum size is ${type === 'image' ? '10MB' : '100MB'}`
      };
    }

    // Development fallback without Vercel Blob
    if (isDevelopmentWithoutBlob) {
      await ensureDirectories();
      
      // Get file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Create a unique filename
      const fileName = `${uuidv4()}.${fileExt}`;
      const dir = type === 'video' ? VIDEO_DIR : IMAGE_DIR;
      const filePath = path.join(dir, fileName);
      
      // Convert file to buffer and save it
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      // Generate the public URL
      const publicUrl = `/uploads/${type}s/${fileName}`;

      return {
        url: publicUrl,
        fileName,
        success: true
      };
    }

    // Generate a unique path for the file
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
    const blobPath = `${type}s/${fileName}`;

    // Upload to Vercel Blob Storage
    const response = await fetch(`/api/upload-url?filename=${encodeURIComponent(blobPath)}`, {
      method: 'POST',
    });
    
    const { url, blobId } = await response.json();
    
    // Upload the file directly to the presigned URL
    const upload = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    
    if (!upload.ok) {
      throw new Error(`Failed to upload file: ${upload.statusText}`);
    }
    
    // The URL to access the file
    const blobUrl = `${process.env.NEXT_PUBLIC_VERCEL_BLOB_URL || ''}/${blobId}`;
    
    return {
      url: blobUrl,
      fileName,
      success: true
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      url: '',
      success: false,
      message: 'Failed to upload file. Please try again.'
    };
  }
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    // Development fallback without Vercel Blob
    if (isDevelopmentWithoutBlob) {
      // For local development, files are in the public directory
      if (url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return true;
        }
      }
      return false;
    }

    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
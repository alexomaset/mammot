import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from './supabase';

export interface FileUploadResult {
  url: string;
  success: boolean;
  message?: string;
  fileName?: string;
}

// Delete a previously uploaded file given its public URL.
// Handles Supabase Storage URLs and local /uploads/ paths (dev fallback).
export async function deleteFile(url: string): Promise<boolean> {
  try {
    // Local development files live in the public directory
    if (url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    }

    // Supabase Storage public URL:
    // https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (match) {
      const [, bucket, objectPath] = match;
      const supabaseAdmin = getSupabaseAdmin();
      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([decodeURIComponent(objectPath)]);
      if (error) {
        console.error('Error deleting file from Supabase Storage:', error);
        return false;
      }
      return true;
    }

    // Unknown/legacy URL (e.g. old Vercel Blob) — nothing we can delete
    console.warn('deleteFile: unrecognized URL, skipping delete:', url);
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

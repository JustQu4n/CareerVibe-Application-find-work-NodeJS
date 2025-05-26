const { adminStorage } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Upload file to Firebase Storage
 * @param {Object} file - File object from multer
 * @param {String} folderName - Folder name in Firebase Storage
 * @returns {Promise<String>} - Download URL
 */
const uploadFile = async (file, folderName = 'cv_files') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const originalName = file.originalname.replace(/\s+/g, '_');
    const timestamp = Date.now();
    const fileExtension = path.extname(originalName);
    const fileName = `${folderName}/${timestamp}_${uuidv4()}${fileExtension}`;

    // Create a file reference in the bucket
    const fileRef = adminStorage.file(fileName);
    
    // Create a write stream and upload
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Error uploading to Firebase:', error);
        reject(error);
      });

      stream.on('finish', async () => {
        // File uploaded successfully, make it publicly accessible
        await fileRef.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${adminStorage.name}/${fileName}`;
        resolve(publicUrl);
      });

      // If file is buffer (from multer.memoryStorage())
      if (file.buffer) {
        stream.end(file.buffer);
      } else {
        // For multer.diskStorage(), we need to read the file from disk
        const fs = require('fs');
        fs.createReadStream(file.path)
          .pipe(stream)
          .on('error', reject);
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

/**
 * Delete file from Firebase Storage
 * @param {String} fileUrl - Full URL of the file
 * @returns {Promise<Boolean>} - Success status
 */
const deleteFile = async (fileUrl) => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(fileUrl);
    const filePath = urlObj.pathname.split(`/${adminStorage.name}/`)[1];
    
    if (!filePath) {
      throw new Error('Invalid file URL');
    }

    // Delete the file
    await adminStorage.file(filePath).delete();
    return true;
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile
};
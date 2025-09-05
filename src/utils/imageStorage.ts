// Image storage utility for handling local image uploads
// Note: In a real application, you would upload to a server or cloud storage

export interface ImageUploadResult {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export const uploadImageToLocal = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        imageUrl: '',
        error: 'Invalid file type. Please select an image file.'
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        imageUrl: '',
        error: 'File too large. Please select an image smaller than 5MB.'
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `product-${timestamp}.${fileExtension}`;
    
    // Convert file to base64 data URL for storage
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    // Store image data in localStorage with a unique key
    const imageKey = `uploaded-image-${timestamp}`;
    localStorage.setItem(imageKey, dataUrl);
    
    // Return the data URL as the image source
    // In a real app, this would be the server URL
    return {
      success: true,
      imageUrl: dataUrl
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      imageUrl: '',
      error: 'Failed to upload image. Please try again.'
    };
  }
};

export const getStoredImage = (imageKey: string): string | null => {
  return localStorage.getItem(imageKey);
};

export const deleteStoredImage = (imageKey: string): void => {
  localStorage.removeItem(imageKey);
};

// Helper function to extract image key from data URL
export const extractImageKey = (dataUrl: string): string | null => {
  // This is a simple implementation - in a real app you'd have proper image management
  const match = dataUrl.match(/uploaded-image-(\d+)/);
  return match ? match[0] : null;
};

// Note: We're using the upload API directly instead of the Node.js SDK
// to avoid browser compatibility issues with Vite

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export interface CloudinaryUploadOptions {
  folder?: string
  public_id?: string
  tags?: string[]
  context?: Record<string, string>
}

class CloudinaryService {
  // Upload a single image
  async uploadImage(
    file: File, 
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'm1_default'
      
      console.log('Cloudinary upload config:', {
        cloudName,
        uploadPreset,
        fileName: file.name,
        fileSize: file.size
      })
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      
      if (options.folder) {
        formData.append('folder', options.folder)
      }
      
      if (options.public_id) {
        formData.append('public_id', options.public_id)
      }
      
      if (options.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','))
      }
      
      if (options.context) {
        const contextString = Object.entries(options.context)
          .map(([key, value]) => `${key}=${value}`)
          .join('|')
        formData.append('context', contextString)
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudinary upload error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: response.url
        })
        throw new Error(`Cloudinary upload failed: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw error
    }
  }

  // Upload multiple images
  async uploadMultipleImages(
    files: File[],
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, options))
    return Promise.all(uploadPromises)
  }

  // Upload family member profile photo with optimization
  async uploadFamilyMemberPhoto(file: File, memberId: string): Promise<string> {
    const result = await this.uploadImage(file, {
      folder: `ancestorlens/family-members/${memberId}`,
      public_id: `member-${memberId}`,
      tags: ['family-member', 'profile-photo'],
      context: {
        alt: `Profile photo for family member ${memberId}`,
        caption: 'Family member profile photo'
      }
    })
    return result.secure_url
  }

  // Upload cultural memory images with optimization
  async uploadCulturalMemoryImages(files: File[], memoryId: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, {
        folder: `ancestorlens/cultural-memories/${memoryId}`,
        public_id: `memory-${memoryId}-${index}`,
        tags: ['cultural-memory', 'heritage'],
        context: {
          alt: `Cultural memory image ${index + 1} for memory ${memoryId}`,
          caption: 'Cultural heritage memory'
        }
      })
    )
    const results = await Promise.all(uploadPromises)
    return results.map(result => result.secure_url)
  }

  // Upload burial site photos
  async uploadBurialSitePhotos(files: File[], siteId: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, {
        folder: `ancestorlens/burial-sites/${siteId}`,
        public_id: `burial-site-${siteId}-${index}`,
        tags: ['burial-site', 'heritage'],
        context: {
          alt: `Burial site photo ${index + 1} for site ${siteId}`,
          caption: 'Ancestral burial site'
        }
      })
    )
    const results = await Promise.all(uploadPromises)
    return results.map(result => result.secure_url)
  }

  // Generate optimized thumbnail URL
  generateThumbnailUrl(publicId: string, width: number = 150, height: number = 150): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto:good,f_auto/${publicId}`
  }

  // Delete an image (requires server-side implementation for security)
  async deleteImage(publicId: string): Promise<void> {
    console.warn('Image deletion requires server-side implementation for security')
    // This would need to be implemented on your backend
  }
}

export const cloudinaryService = new CloudinaryService()
export default cloudinaryService

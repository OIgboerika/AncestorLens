import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cloudinaryService } from '../cloudinaryService'
import { mockCloudinaryResponse, mockFetch } from '../../test/mocks/cloudinary'

// Mock global fetch
global.fetch = vi.fn()

describe('cloudinaryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up environment variables
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME = 'test-cloud'
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET = 'test-preset'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('uploadImage', () => {
    it('should successfully upload an image', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const result = await cloudinaryService.uploadImage(mockFile)

      expect(result).toEqual({
        public_id: 'test-public-id',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-public-id.jpg',
        width: 1920,
        height: 1080,
        format: 'jpg',
        resource_type: 'image',
      })
      expect(mockFetchFn).toHaveBeenCalled()
    })

    it('should upload image with folder option', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      await cloudinaryService.uploadImage(mockFile, { folder: 'test-folder' })

      const callArgs = mockFetchFn.mock.calls[0]
      expect(callArgs?.[0]).toContain('test-cloud/image/upload')
    })

    it('should upload image with tags', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      await cloudinaryService.uploadImage(mockFile, { tags: ['tag1', 'tag2'] })

      expect(mockFetchFn).toHaveBeenCalled()
    })

    it('should handle upload errors', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(false)
      global.fetch = mockFetchFn

      await expect(cloudinaryService.uploadImage(mockFile)).rejects.toThrow()
    })
  })

  describe('uploadAudio', () => {
    it('should successfully upload an audio file', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const result = await cloudinaryService.uploadAudio(mockFile)

      expect(result).toBeDefined()
      expect(mockFetchFn).toHaveBeenCalled()
      const callArgs = mockFetchFn.mock.calls[0]
      expect(callArgs[0]).toContain('video/upload') // Audio uses video endpoint
    })

    it('should handle audio upload errors', async () => {
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' })
      const mockFetchFn = mockFetch(false)
      global.fetch = mockFetchFn

      await expect(cloudinaryService.uploadAudio(mockFile)).rejects.toThrow()
    })
  })

  describe('uploadMultipleImages', () => {
    it('should upload multiple images', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      ]
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const results = await cloudinaryService.uploadMultipleImages(mockFiles)

      expect(results).toHaveLength(2)
      expect(mockFetchFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('uploadFamilyMemberPhoto', () => {
    it('should upload family member photo with correct folder structure', async () => {
      const mockFile = new File(['test'], 'photo.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const result = await cloudinaryService.uploadFamilyMemberPhoto(mockFile, 'member-123')

      expect(result).toBe('https://res.cloudinary.com/test-cloud/image/upload/test-public-id.jpg')
      expect(mockFetchFn).toHaveBeenCalled()
    })
  })

  describe('uploadCulturalMemoryImages', () => {
    it('should upload cultural memory images', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      ]
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const results = await cloudinaryService.uploadCulturalMemoryImages(mockFiles, 'memory-123')

      expect(results).toHaveLength(2)
      expect(results[0]).toContain('https://res.cloudinary.com')
    })
  })

  describe('uploadBurialSitePhotos', () => {
    it('should upload burial site photos', async () => {
      const mockFiles = [
        new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      ]
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      const results = await cloudinaryService.uploadBurialSitePhotos(mockFiles, 'site-123')

      expect(results).toHaveLength(1)
      expect(results[0]).toContain('https://res.cloudinary.com')
    })
  })

  describe('uploadArchiveDocument', () => {
    it('should upload PDF document as raw file', async () => {
      const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' })
      const mockFetchFn = mockFetch(true, {
        ...mockCloudinaryResponse,
        secure_url: 'https://res.cloudinary.com/test-cloud/raw/upload/test-public-id.pdf',
      })
      global.fetch = mockFetchFn

      const result = await cloudinaryService.uploadArchiveDocument(mockFile, 'doc-123')

      expect(result).toBeDefined()
      const callArgs = mockFetchFn.mock.calls[0]
      expect(callArgs?.[0]).toContain('raw/upload') // PDFs use raw endpoint
    })

    it('should upload image document as image', async () => {
      const mockFile = new File(['test'], 'document.jpg', { type: 'image/jpeg' })
      const mockFetchFn = mockFetch(true)
      global.fetch = mockFetchFn

      await cloudinaryService.uploadArchiveDocument(mockFile, 'doc-123')

      const callArgs = mockFetchFn.mock.calls[0]
      expect(callArgs?.[0]).toContain('image/upload')
    })

    it('should remove version number from URL', async () => {
      const mockFile = new File(['test'], 'document.pdf', { type: 'application/pdf' })
      const mockFetchFn = mockFetch(true, {
        ...mockCloudinaryResponse,
        secure_url: 'https://res.cloudinary.com/test-cloud/raw/upload/v123456/test-public-id.pdf',
      })
      global.fetch = mockFetchFn

      const result = await cloudinaryService.uploadArchiveDocument(mockFile, 'doc-123')

      expect(result).not.toContain('/v123456/')
    })
  })

  describe('generateThumbnailUrl', () => {
    it('should generate thumbnail URL with default dimensions', () => {
      const result = cloudinaryService.generateThumbnailUrl('test-public-id')

      expect(result).toContain('w_150')
      expect(result).toContain('h_150')
      expect(result).toContain('test-public-id')
    })

    it('should generate thumbnail URL with custom dimensions', () => {
      const result = cloudinaryService.generateThumbnailUrl('test-public-id', 300, 300)

      expect(result).toContain('w_300')
      expect(result).toContain('h_300')
    })
  })
})


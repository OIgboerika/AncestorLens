import { vi } from 'vitest'

// Mock Cloudinary service responses
export const mockCloudinaryResponse = {
  public_id: 'test-public-id',
  secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/test-public-id.jpg',
  width: 1920,
  height: 1080,
  format: 'jpg',
  resource_type: 'image',
}

export const mockCloudinaryError = {
  error: {
    message: 'Upload failed',
  },
}

// Mock fetch for Cloudinary API calls
export const mockFetch = (shouldSucceed: boolean = true, customResponse?: any) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: shouldSucceed,
      status: shouldSucceed ? 200 : 400,
      statusText: shouldSucceed ? 'OK' : 'Bad Request',
      json: async () => shouldSucceed ? (customResponse || mockCloudinaryResponse) : mockCloudinaryError,
      text: async () => shouldSucceed ? JSON.stringify(customResponse || mockCloudinaryResponse) : JSON.stringify(mockCloudinaryError),
    } as Response)
  )
}


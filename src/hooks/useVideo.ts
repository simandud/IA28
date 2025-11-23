'use client'

import { useState } from 'react'
import { videoAPI } from '@/lib/api'
import type { LegacyVideo } from '@/types'

export const useVideo = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadVideo = async (
    file: File,
    metadata: {
      title: string
      description?: string
      category: 'advice' | 'story' | 'memory' | 'lesson'
    }
  ) => {
    setUploading(true)
    setError(null)

    try {
      const response = await videoAPI.uploadVideo(file, metadata)
      setUploading(false)
      return { success: true, data: response.data as LegacyVideo }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMsg)
      setUploading(false)
      return { success: false, error: errorMsg }
    }
  }

  return { uploadVideo, uploading, error }
}

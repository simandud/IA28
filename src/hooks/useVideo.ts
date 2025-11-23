'use client'

import { useState, useCallback } from 'react'
import axios from 'axios'
import type { LegacyVideo } from '@/types'

export const useVideo = () => {
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadVideo = useCallback(
    async (
      file: File,
      metadata: {
        title: string
        description?: string
        category: 'advice' | 'story' | 'memory' | 'lesson'
        userId: string
      }
    ) => {
      setUploading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', metadata.title)
        formData.append('category', metadata.category)
        formData.append('description', metadata.description || '')
        formData.append('userId', metadata.userId)

        const response = await axios.post('/api/video/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        setUploading(false)
        return { success: true, data: response.data as LegacyVideo }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Upload failed'
        setError(errorMsg)
        setUploading(false)
        return { success: false, error: errorMsg }
      }
    },
    []
  )

  const getVideos = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/video/upload', {
        params: { userId },
      })
      setLoading(false)
      return { success: true, data: response.data as LegacyVideo[] }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch videos'
      setError(errorMsg)
      setLoading(false)
      return { success: false, error: errorMsg }
    }
  }, [])

  return { uploadVideo, getVideos, uploading, loading, error }
}

'use client'

import { useState } from 'react'
import { avatarAPI } from '@/lib/api'

export const useAvatar = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (avatarId: string, message: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await avatarAPI.sendMessage(avatarId, message)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Message failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading, error }
}

'use client'

import { useCallback, useState } from 'react'
import { avatarAPI } from '@/lib/api'

export const useAvatar = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (avatarId: string, message: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await avatarAPI.sendMessage(avatarId, message)
        return { success: true, data: response.data }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Message failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { sendMessage, loading, error }
}

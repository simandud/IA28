'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { userAPI } from '@/lib/api'
import type { User } from '@/types'

export const useUser = () => {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authUser?.id) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await userAPI.getProfile(authUser.id)
        setProfile(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [authUser?.id])

  const updateProfile = async (updates: Partial<User>) => {
    if (!authUser?.id) return

    setLoading(true)
    try {
      const response = await userAPI.updateProfile(authUser.id, updates)
      setProfile(response.data)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}

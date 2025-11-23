'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(response.data.user)
        }
      } catch (err) {
        localStorage.removeItem('auth_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.post('/api/auth/register', {
          email,
          password,
          fullName,
        })
        setUser(response.data.user)
        return { data: response.data, error: null }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Signup failed'
        setError(errorMsg)
        return { data: null, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        })
        const { user: loginUser, session } = response.data

        // Store token
        localStorage.setItem('auth_token', session.access_token)
        localStorage.setItem('refresh_token', session.refresh_token)

        setUser(loginUser)
        router.push('/dashboard')
        return { data: response.data, error: null }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Sign in failed'
        setError(errorMsg)
        return { data: null, error: errorMsg }
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const handleSignOut = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await axios.post('/api/auth/me', {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      router.push('/')
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Sign out failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [router])

  return {
    user,
    loading,
    error,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  }
}

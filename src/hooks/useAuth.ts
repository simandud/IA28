'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, signUp, signIn, signOut, getCurrentUser } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth error')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: signupError } = await signUp(email, password, fullName)
      if (signupError) throw signupError
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: signinError } = await signIn(email, password)
      if (signinError) throw signinError
      router.push('/dashboard')
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      if (error) throw error
      setUser(null)
      router.push('/')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign out failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

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

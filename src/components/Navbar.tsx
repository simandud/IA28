'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from './Button'

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth()

  return (
    <nav className="border-b border-vault-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🏛️</span>
            <span className="font-garamond text-xl font-bold text-vault-900">CHRONOVAULT</span>
          </Link>

          {/* Nav Links */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-vault-700 hover:text-gold-500 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/legacy"
                className="text-vault-700 hover:text-gold-500 transition-colors"
              >
                My Legacy
              </Link>
              <Link
                href="/marketplace"
                className="text-vault-700 hover:text-gold-500 transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/fund"
                className="text-vault-700 hover:text-gold-500 transition-colors"
              >
                Fund
              </Link>
            </div>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profile" className="text-vault-700 hover:text-gold-500">
                  {user.email}
                </Link>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

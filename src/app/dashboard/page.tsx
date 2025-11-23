'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/utils/helpers'

export default function Dashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Videos Created', value: '7', icon: '🎥' },
    { label: 'Avatar Conversations', value: '342', icon: '💬' },
    { label: 'Wisdom NFTs', value: '3', icon: '💎' },
    { label: 'Monthly Earnings', value: formatCurrency(892.5), icon: '💰' },
  ]

  const recentVideos = [
    { id: '1', title: 'How to Raise Confident Kids', category: 'Advice', date: '2 days ago' },
    { id: '2', title: 'My Entrepreneurial Journey', category: 'Story', date: '5 days ago' },
    { id: '3', title: 'Finding Purpose in Life', category: 'Lesson', date: '1 week ago' },
  ]

  return (
    <div className="min-h-screen bg-vault-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-garamond font-bold text-vault-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-vault-600">Your legacy is growing stronger every day</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-vault-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-vault-900 mt-2">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-gold-100 to-gold-50">
            <div className="space-y-4">
              <div className="text-4xl">🎥</div>
              <h3 className="text-xl font-semibold text-vault-900">Record New Video</h3>
              <p className="text-vault-600 text-sm">Share more of your wisdom and stories</p>
              <Link href="/legacy/record">
                <Button variant="primary" fullWidth size="sm">
                  Start Recording
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-legacy-100 to-legacy-50">
            <div className="space-y-4">
              <div className="text-4xl">💎</div>
              <h3 className="text-xl font-semibold text-vault-900">Create NFT</h3>
              <p className="text-vault-600 text-sm">Monetize your most valuable insights</p>
              <Link href="/marketplace/create">
                <Button variant="primary" fullWidth size="sm">
                  Create NFT
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-vault-100 to-vault-50">
            <div className="space-y-4">
              <div className="text-4xl">💬</div>
              <h3 className="text-xl font-semibold text-vault-900">Talk to Avatar</h3>
              <p className="text-vault-600 text-sm">See your AI avatar in action</p>
              <Link href="/legacy/avatar">
                <Button variant="primary" fullWidth size="sm">
                  Chat Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-garamond font-bold text-vault-900">Recent Videos</h2>
            <Link href="/legacy">
              <Button variant="ghost" size="sm">
                View All →
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="p-4 bg-vault-50 border border-vault-200 rounded-lg flex items-center justify-between hover:bg-vault-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🎬</div>
                  <div>
                    <h4 className="font-semibold text-vault-900">{video.title}</h4>
                    <p className="text-sm text-vault-600">{video.date}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 bg-gold-100 text-gold-700 rounded-full">
                  {video.category}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

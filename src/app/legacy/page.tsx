'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

export default function Legacy() {
  const videos = [
    {
      id: '1',
      title: 'How to Raise Confident Kids',
      category: 'Advice',
      views: 1200,
      date: '2 days ago',
    },
    {
      id: '2',
      title: 'My Entrepreneurial Journey',
      category: 'Story',
      views: 850,
      date: '5 days ago',
    },
    {
      id: '3',
      title: 'Finding Purpose in Life',
      category: 'Lesson',
      views: 2300,
      date: '1 week ago',
    },
  ]

  return (
    <div className="min-h-screen bg-vault-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-garamond font-bold text-vault-900 mb-2">My Legacy</h1>
            <p className="text-vault-600">Your recorded wisdom and memories</p>
          </div>
          <Link href="/legacy/record">
            <Button variant="primary">+ Record New Video</Button>
          </Link>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} hoverable>
              <div className="space-y-4">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-vault-200 to-legacy-200 rounded-lg flex items-center justify-center text-5xl">
                  🎬
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-vault-900 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-vault-600">{video.date}</p>

                  <div className="flex items-center gap-4 text-xs text-vault-600 pt-2 border-t border-vault-200">
                    <span>👁️ {video.views} views</span>
                    <span className="bg-gold-100 text-gold-700 px-2 py-1 rounded">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/legacy/${video.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" fullWidth>
                      View
                    </Button>
                  </Link>
                  <Link href={`/legacy/${video.id}/edit`} className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Avatar Section */}
        <div className="mt-16 bg-gradient-to-r from-gold-100 to-legacy-100 rounded-lg p-8 border border-gold-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-garamond font-bold text-vault-900 mb-2">
                Your Avatar is Ready
              </h2>
              <p className="text-vault-700">Talk to your AI avatar and see it respond with your wisdom</p>
            </div>
            <Link href="/legacy/avatar">
              <Button variant="primary">Chat with Avatar</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

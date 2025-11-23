'use client'

import React, { useState } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { formatCurrency } from '@/utils/helpers'
import type { WisdomNFT } from '@/types'

interface NFTMarketplaceProps {
  nfts?: WisdomNFT[]
  onPurchase?: (nftId: string) => void
}

const mockNFTs: WisdomNFT[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'How to Raise Confident Kids',
    description: 'Wisdom from 30 years of parenting',
    video_clip_url: 'https://example.com/video.mp4',
    image_url: 'https://via.placeholder.com/300x300',
    category: 'Parenting',
    price: 15,
    total_sales: 1200,
    royalty_earned: 1800,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Startup Lessons: From Zero to $100M',
    description: 'Lessons from building a unicorn',
    video_clip_url: 'https://example.com/video2.mp4',
    image_url: 'https://via.placeholder.com/300x300',
    category: 'Business',
    price: 49,
    total_sales: 850,
    royalty_earned: 4200,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'Finding Peace in Chaos',
    description: 'Meditation and mindfulness practices',
    video_clip_url: 'https://example.com/video3.mp4',
    image_url: 'https://via.placeholder.com/300x300',
    category: 'Wellness',
    price: 9.99,
    total_sales: 2500,
    royalty_earned: 1200,
    created_at: new Date().toISOString(),
  },
]

export const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({
  nfts = mockNFTs,
  onPurchase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Parenting', 'Business', 'Wellness', 'Health', 'Relationships']

  const filteredNFTs =
    selectedCategory === 'All'
      ? nfts
      : nfts.filter((nft) => nft.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-garamond font-bold text-vault-900 mb-2">
          Wisdom Marketplace
        </h2>
        <p className="text-vault-600">Browse and collect wisdom from the world's greatest minds</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-gold-500 text-white'
                : 'bg-vault-100 text-vault-700 hover:bg-vault-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNFTs.map((nft) => (
          <Card
            key={nft.id}
            hoverable
            className="flex flex-col space-y-4"
          >
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-gold-200 to-legacy-200 rounded-lg flex items-center justify-center text-6xl">
              🎥
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-vault-900 line-clamp-2">{nft.title}</h3>
              <p className="text-sm text-vault-600 line-clamp-2">{nft.description}</p>

              <div className="flex items-center gap-2 pt-2">
                <span className="inline-block px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full font-medium">
                  {nft.category}
                </span>
              </div>

              <div className="pt-2 border-t border-vault-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-vault-500">Sales</p>
                    <p className="font-semibold text-vault-900">{nft.total_sales}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-vault-500">Price</p>
                    <p className="font-bold text-2xl text-gold-500">
                      {formatCurrency(nft.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              onClick={() => onPurchase?.(nft.id)}
              variant="primary"
              fullWidth
            >
              Buy NFT
            </Button>
          </Card>
        ))}
      </div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-vault-600">No wisdom NFTs in this category yet</p>
        </div>
      )}
    </div>
  )
}

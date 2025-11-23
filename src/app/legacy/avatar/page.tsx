'use client'

import React from 'react'
import { AvatarChat } from '@/components/AvatarChat'

export default function AvatarPage() {
  return (
    <div className="min-h-screen bg-vault-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AvatarChat avatarId="demo" avatarName="Your Ancestor" />
      </div>
    </div>
  )
}

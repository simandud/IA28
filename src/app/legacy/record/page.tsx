'use client'

import React from 'react'
import { VideoRecorder } from '@/components/VideoRecorder'
import { useRouter } from 'next/navigation'

export default function RecordVideo() {
  const router = useRouter()

  const handleSuccess = (videoId: string) => {
    router.push('/legacy')
  }

  return (
    <div className="min-h-screen bg-vault-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <VideoRecorder onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

'use client'

import React, { useRef, useState } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { useVideo } from '@/hooks'

interface VideoRecorderProps {
  onSuccess?: (videoId: string) => void
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ onSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'advice' | 'story' | 'memory' | 'lesson'>('advice')
  const { uploadVideo, uploading } = useVideo()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        setVideoBlob(blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Recording failed:', error)
      alert('Could not access camera/microphone')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleUpload = async () => {
    if (!videoBlob || !title) {
      alert('Please record a video and add a title')
      return
    }

    const file = new File([videoBlob], `${title}.webm`, { type: 'video/webm' })
    const result = await uploadVideo(file, { title, category })

    if (result.success && onSuccess) {
      onSuccess(result.data!.id)
      setVideoBlob(null)
      setTitle('')
    }
  }

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-2xl font-garamond font-bold text-vault-900 mb-2">
          Record Your Legacy
        </h2>
        <p className="text-vault-600">Share your wisdom, stories, and memories</p>
      </div>

      <div className="bg-vault-900 rounded-lg overflow-hidden h-96">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
        />
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your message"
          className="w-full px-4 py-2.5 border border-vault-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="w-full px-4 py-2.5 border border-vault-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="advice">Life Advice</option>
          <option value="story">Story</option>
          <option value="memory">Memory</option>
          <option value="lesson">Lesson</option>
        </select>
      </div>

      <div className="flex gap-3">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            variant="primary"
            fullWidth
          >
            🎥 Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="danger"
            fullWidth
          >
            ⏹️ Stop Recording
          </Button>
        )}
      </div>

      {videoBlob && (
        <Button
          onClick={handleUpload}
          isLoading={uploading}
          variant="secondary"
          fullWidth
        >
          ✅ Upload Video
        </Button>
      )}
    </Card>
  )
}

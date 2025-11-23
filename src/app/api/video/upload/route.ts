import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In production, upload to S3/Supabase
    // For now, return mock response
    const mockVideo = {
      id: Math.random().toString(36).substring(7),
      title,
      category,
      description,
      duration: 120,
      video_url: 'https://example.com/video.mp4',
      thumbnail_url: 'https://via.placeholder.com/300x300',
      user_id: 'user-123',
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(mockVideo)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

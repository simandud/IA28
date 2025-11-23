import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const userId = formData.get('userId') as string

    // Validate input
    if (!file || !title || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields (file, title, userId)' },
        { status: 400 }
      )
    }

    if (!['advice', 'story', 'memory', 'lesson'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Upload file to Supabase storage
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${timestamp}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('legacy-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload video' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('legacy-videos')
      .getPublicUrl(fileName)

    const videoUrl = urlData?.publicUrl

    // Create video record in database
    const { data: videoData, error: dbError } = await supabase
      .from('legacy_videos')
      .insert({
        user_id: userId,
        title,
        description,
        category,
        video_url: videoUrl,
        duration: 0,
        is_published: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create video record' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        id: videoData.id,
        title: videoData.title,
        category: videoData.category,
        description: videoData.description,
        video_url: videoData.video_url,
        user_id: videoData.user_id,
        created_at: videoData.created_at,
        message: 'Video uploaded successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/video/upload - Get user videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('legacy_videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch videos' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get videos error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

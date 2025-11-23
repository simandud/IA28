import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - List all NFTs or filter by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('wisdom_nfts')
      .select('*', { count: 'exact' })
      .eq('is_published', true)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (category) {
      query = query.eq('category', category)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      data,
      total: count,
      limit,
      offset,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch NFTs' },
      { status: 500 }
    )
  }
}

// POST - Create new NFT
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      title,
      description,
      videoClipUrl,
      imageUrl,
      category,
      price,
    } = body

    // Validation
    if (!userId || !title || !videoClipUrl || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, videoClipUrl, price' },
        { status: 400 }
      )
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Create NFT record
    const { data, error } = await supabase
      .from('wisdom_nfts')
      .insert({
        user_id: userId,
        title,
        description: description || '',
        video_clip_url: videoClipUrl,
        image_url: imageUrl,
        category: category || 'wisdom',
        price: parseFloat(price),
        is_published: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        id: data.id,
        title: data.title,
        description: data.description,
        videoClipUrl: data.video_clip_url,
        imageUrl: data.image_url,
        category: data.category,
        price: data.price,
        userId: data.user_id,
        createdAt: data.created_at,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create NFT' },
      { status: 500 }
    )
  }
}

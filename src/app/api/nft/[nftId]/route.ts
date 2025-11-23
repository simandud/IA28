import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - Get specific NFT
export async function GET(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const { nftId } = params

    const { data, error } = await supabase
      .from('wisdom_nfts')
      .select('*')
      .eq('id', nftId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'NFT not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      videoClipUrl: data.video_clip_url,
      imageUrl: data.image_url,
      category: data.category,
      price: data.price,
      userId: data.user_id,
      blockchainAddress: data.blockchain_address,
      tokenId: data.token_id,
      totalSales: data.total_sales,
      royaltyEarned: data.royalty_earned,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch NFT' },
      { status: 500 }
    )
  }
}

// PATCH - Update NFT
export async function PATCH(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const { nftId } = params
    const body = await request.json()
    const {
      title,
      description,
      price,
      imageUrl,
      isPublished,
    } = body

    // Verify NFT exists
    const { data: existing, error: fetchError } = await supabase
      .from('wisdom_nfts')
      .select('user_id')
      .eq('id', nftId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) {
      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return NextResponse.json(
          { error: 'Price must be a positive number' },
          { status: 400 }
        )
      }
      updateData.price = parseFloat(price)
    }
    if (imageUrl !== undefined) updateData.image_url = imageUrl
    if (isPublished !== undefined) updateData.is_published = isPublished

    const { data, error } = await supabase
      .from('wisdom_nfts')
      .update(updateData)
      .eq('id', nftId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      id: data.id,
      title: data.title,
      description: data.description,
      videoClipUrl: data.video_clip_url,
      imageUrl: data.image_url,
      category: data.category,
      price: data.price,
      userId: data.user_id,
      blockchainAddress: data.blockchain_address,
      tokenId: data.token_id,
      totalSales: data.total_sales,
      royaltyEarned: data.royalty_earned,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update NFT' },
      { status: 500 }
    )
  }
}

// DELETE - Delete NFT
export async function DELETE(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const { nftId } = params

    const { error } = await supabase
      .from('wisdom_nfts')
      .delete()
      .eq('id', nftId)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'NFT not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete NFT' },
      { status: 500 }
    )
  }
}

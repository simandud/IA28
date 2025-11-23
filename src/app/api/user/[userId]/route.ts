import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/user/:userId - Get user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, avatar_url, bio, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/:userId - Update user profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()

    // Validate that user can only update their own profile
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: body.full_name || undefined,
        avatar_url: body.avatar_url || undefined,
        bio: body.bio || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/user/:userId/metrics - Get user metrics
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // Get video count
    const { count: videoCount } = await supabase
      .from('legacy_videos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get NFT count
    const { count: nftCount } = await supabase
      .from('wisdom_nfts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get NFT sales count
    const { count: salesCount } = await supabase
      .from('nft_sales')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', userId)

    // Get total earnings
    const { data: earnings } = await supabase
      .from('nft_sales')
      .select('amount')
      .eq('seller_id', userId)

    const totalEarnings = earnings?.reduce((sum, sale) => sum + (sale.amount || 0), 0) || 0

    return NextResponse.json({
      videos_recorded: videoCount || 0,
      nfts_created: nftCount || 0,
      nfts_sold: salesCount || 0,
      total_earnings: totalEarnings,
    })
  } catch (error) {
    console.error('Get metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

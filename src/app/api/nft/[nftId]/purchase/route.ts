import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// POST - Purchase NFT
export async function POST(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const { nftId } = params
    const body = await request.json()
    const { buyerId, transactionHash } = body

    // Validation
    if (!buyerId) {
      return NextResponse.json(
        { error: 'Missing required field: buyerId' },
        { status: 400 }
      )
    }

    // Get NFT details
    const { data: nft, error: nftError } = await supabase
      .from('wisdom_nfts')
      .select('*')
      .eq('id', nftId)
      .single()

    if (nftError) {
      return NextResponse.json(
        { error: 'NFT not found' },
        { status: 404 }
      )
    }

    // Verify buyer is not the seller
    if (buyerId === nft.user_id) {
      return NextResponse.json(
        { error: 'Cannot purchase your own NFT' },
        { status: 400 }
      )
    }

    // Create sales record
    const { data: sale, error: saleError } = await supabase
      .from('nft_sales')
      .insert({
        nft_id: nftId,
        buyer_id: buyerId,
        seller_id: nft.user_id,
        amount: nft.price,
        transaction_hash: transactionHash || null,
        is_secondary: nft.total_sales > 0, // Mark as secondary if it has been sold before
      })
      .select()
      .single()

    if (saleError) throw saleError

    // Update NFT sales count
    const newSalesCount = (nft.total_sales || 0) + 1
    await supabase
      .from('wisdom_nfts')
      .update({
        total_sales: newSalesCount,
      })
      .eq('id', nftId)

    // If secondary sale, calculate royalty (10% to creator)
    if (nft.total_sales > 0) {
      const royaltyAmount = nft.price * 0.1
      await supabase
        .from('wisdom_nfts')
        .update({
          royalty_earned: (nft.royalty_earned || 0) + royaltyAmount,
        })
        .eq('id', nftId)
    }

    return NextResponse.json(
      {
        id: sale.id,
        nftId: sale.nft_id,
        buyerId: sale.buyer_id,
        sellerId: sale.seller_id,
        amount: sale.amount,
        transactionHash: sale.transaction_hash,
        isSecondary: sale.is_secondary,
        createdAt: sale.created_at,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process purchase' },
      { status: 500 }
    )
  }
}

// GET - Get NFT sales history
export async function GET(
  request: NextRequest,
  { params }: { params: { nftId: string } }
) {
  try {
    const { nftId } = params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data, count, error } = await supabase
      .from('nft_sales')
      .select('*', { count: 'exact' })
      .eq('nft_id', nftId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      data: data.map((sale: any) => ({
        id: sale.id,
        nftId: sale.nft_id,
        buyerId: sale.buyer_id,
        sellerId: sale.seller_id,
        amount: sale.amount,
        transactionHash: sale.transaction_hash,
        isSecondary: sale.is_secondary,
        createdAt: sale.created_at,
      })),
      total: count,
      limit,
      offset,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales history' },
      { status: 500 }
    )
  }
}

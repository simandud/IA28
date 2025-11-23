import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - Get specific fund with beneficiaries and earnings
export async function GET(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params

    // Get fund details
    const { data: fund, error: fundError } = await supabase
      .from('ancestor_funds')
      .select('*')
      .eq('id', fundId)
      .single()

    if (fundError) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      )
    }

    // Get beneficiaries
    const { data: beneficiaries, error: benError } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('fund_id', fundId)

    if (benError) throw benError

    // Get recent earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('fund_earnings')
      .select('*')
      .eq('fund_id', fundId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (earningsError) throw earningsError

    return NextResponse.json({
      id: fund.id,
      creatorId: fund.creator_id,
      name: fund.name,
      description: fund.description,
      totalValue: fund.total_value,
      monthlyEarnings: fund.monthly_earnings,
      status: fund.status,
      legalDocumentUrl: fund.legal_document_url,
      createdAt: fund.created_at,
      updatedAt: fund.updated_at,
      beneficiaries: beneficiaries.map((b: any) => ({
        id: b.id,
        name: b.name,
        relationship: b.relationship,
        allocationPercentage: b.allocation_percentage,
        monthlyPayout: b.monthly_payout,
        walletAddress: b.wallet_address,
        isVerified: b.is_verified,
      })),
      recentEarnings: earnings.map((e: any) => ({
        id: e.id,
        source: e.source,
        amount: e.amount,
        description: e.description,
        createdAt: e.created_at,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch fund' },
      { status: 500 }
    )
  }
}

// PATCH - Update fund
export async function PATCH(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params
    const body = await request.json()
    const {
      name,
      description,
      status,
      legalDocumentUrl,
      totalValue,
      monthlyEarnings,
    } = body

    // Verify fund exists
    const { data: existing, error: fetchError } = await supabase
      .from('ancestor_funds')
      .select('id')
      .eq('id', fundId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (status !== undefined) {
      if (!['active', 'pending', 'dormant'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be: active, pending, or dormant' },
          { status: 400 }
        )
      }
      updateData.status = status
    }
    if (legalDocumentUrl !== undefined) updateData.legal_document_url = legalDocumentUrl
    if (totalValue !== undefined) {
      if (isNaN(parseFloat(totalValue)) || parseFloat(totalValue) < 0) {
        return NextResponse.json(
          { error: 'totalValue must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.total_value = parseFloat(totalValue)
    }
    if (monthlyEarnings !== undefined) {
      if (isNaN(parseFloat(monthlyEarnings)) || parseFloat(monthlyEarnings) < 0) {
        return NextResponse.json(
          { error: 'monthlyEarnings must be a non-negative number' },
          { status: 400 }
        )
      }
      updateData.monthly_earnings = parseFloat(monthlyEarnings)
    }

    const { data, error } = await supabase
      .from('ancestor_funds')
      .update(updateData)
      .eq('id', fundId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      id: data.id,
      creatorId: data.creator_id,
      name: data.name,
      description: data.description,
      totalValue: data.total_value,
      monthlyEarnings: data.monthly_earnings,
      status: data.status,
      legalDocumentUrl: data.legal_document_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update fund' },
      { status: 500 }
    )
  }
}

// DELETE - Delete fund
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params

    const { error } = await supabase
      .from('ancestor_funds')
      .delete()
      .eq('id', fundId)

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Fund not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete fund' },
      { status: 500 }
    )
  }
}

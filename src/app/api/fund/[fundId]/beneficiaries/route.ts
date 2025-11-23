import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - List beneficiaries for a fund
export async function GET(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params

    // Verify fund exists
    const { data: fund, error: fundError } = await supabase
      .from('ancestor_funds')
      .select('id')
      .eq('id', fundId)
      .single()

    if (fundError) {
      return NextResponse.json(
        { error: 'Fund not found' },
        { status: 404 }
      )
    }

    // Get beneficiaries
    const { data, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('fund_id', fundId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      data: data.map((b: any) => ({
        id: b.id,
        fundId: b.fund_id,
        userId: b.user_id,
        name: b.name,
        relationship: b.relationship,
        allocationPercentage: b.allocation_percentage,
        monthlyPayout: b.monthly_payout,
        walletAddress: b.wallet_address,
        isVerified: b.is_verified,
      })),
      total: data.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch beneficiaries' },
      { status: 500 }
    )
  }
}

// POST - Add beneficiary to fund
export async function POST(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params
    const body = await request.json()
    const {
      name,
      relationship,
      allocationPercentage,
      walletAddress,
    } = body

    // Validation
    if (!name || allocationPercentage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, allocationPercentage' },
        { status: 400 }
      )
    }

    if (isNaN(parseFloat(allocationPercentage)) || parseFloat(allocationPercentage) < 0 || parseFloat(allocationPercentage) > 100) {
      return NextResponse.json(
        { error: 'allocationPercentage must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Verify fund exists
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

    // Check total allocation doesn't exceed 100%
    const { data: existingBens } = await supabase
      .from('beneficiaries')
      .select('allocation_percentage')
      .eq('fund_id', fundId)

    const totalAllocation = (existingBens || []).reduce(
      (sum: number, b: any) => sum + parseFloat(b.allocation_percentage),
      0
    )

    if (totalAllocation + parseFloat(allocationPercentage) > 100) {
      return NextResponse.json(
        {
          error: `Total allocation would exceed 100%. Current: ${totalAllocation}%, Requested: ${allocationPercentage}%`,
        },
        { status: 400 }
      )
    }

    // Create beneficiary
    const { data, error } = await supabase
      .from('beneficiaries')
      .insert({
        fund_id: fundId,
        name,
        relationship: relationship || null,
        allocation_percentage: parseFloat(allocationPercentage),
        wallet_address: walletAddress || null,
        monthly_payout: (fund.monthly_earnings || 0) * (parseFloat(allocationPercentage) / 100),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        id: data.id,
        fundId: data.fund_id,
        userId: data.user_id,
        name: data.name,
        relationship: data.relationship,
        allocationPercentage: data.allocation_percentage,
        monthlyPayout: data.monthly_payout,
        walletAddress: data.wallet_address,
        isVerified: data.is_verified,
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to add beneficiary' },
      { status: 500 }
    )
  }
}

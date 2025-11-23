import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - Get fund earnings history
export async function GET(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

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

    let query = supabase
      .from('fund_earnings')
      .select('*', { count: 'exact' })
      .eq('fund_id', fundId)

    if (source) {
      query = query.eq('source', source)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Calculate totals
    const { data: allEarnings } = await supabase
      .from('fund_earnings')
      .select('amount')
      .eq('fund_id', fundId)

    const totalEarnings = (allEarnings || []).reduce(
      (sum: number, e: any) => sum + parseFloat(e.amount),
      0
    )

    return NextResponse.json({
      data: data.map((earning: any) => ({
        id: earning.id,
        source: earning.source,
        amount: earning.amount,
        description: earning.description,
        createdAt: earning.created_at,
      })),
      total: count,
      totalEarnings,
      limit,
      offset,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch earnings' },
      { status: 500 }
    )
  }
}

// POST - Record new earnings
export async function POST(
  request: NextRequest,
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params
    const body = await request.json()
    const {
      source,
      amount,
      description,
    } = body

    // Validation
    if (!source || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: source, amount' },
        { status: 400 }
      )
    }

    if (!['nft_sales', 'subscriptions', 'licensing', 'other'].includes(source)) {
      return NextResponse.json(
        { error: 'Invalid source. Must be: nft_sales, subscriptions, licensing, or other' },
        { status: 400 }
      )
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number' },
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

    // Record earning
    const { data, error } = await supabase
      .from('fund_earnings')
      .insert({
        fund_id: fundId,
        source,
        amount: parseFloat(amount),
        description: description || null,
      })
      .select()
      .single()

    if (error) throw error

    // Update fund's total_value and monthly_earnings
    const newTotalValue = (fund.total_value || 0) + parseFloat(amount)

    // For monthly_earnings, we'll aggregate from recent earnings (current month)
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const { data: thisMonthEarnings } = await supabase
      .from('fund_earnings')
      .select('amount')
      .eq('fund_id', fundId)
      .gte('created_at', monthStart.toISOString())

    const monthlyTotal = (thisMonthEarnings || []).reduce(
      (sum: number, e: any) => sum + parseFloat(e.amount),
      0
    )

    await supabase
      .from('ancestor_funds')
      .update({
        total_value: newTotalValue,
        monthly_earnings: monthlyTotal,
      })
      .eq('id', fundId)

    // Update beneficiary payouts based on allocation percentages
    const { data: beneficiaries } = await supabase
      .from('beneficiaries')
      .select('id, allocation_percentage')
      .eq('fund_id', fundId)

    for (const ben of beneficiaries || []) {
      const newPayout = monthlyTotal * (ben.allocation_percentage / 100)
      await supabase
        .from('beneficiaries')
        .update({ monthly_payout: newPayout })
        .eq('id', ben.id)
    }

    return NextResponse.json(
      {
        id: data.id,
        source: data.source,
        amount: data.amount,
        description: data.description,
        createdAt: data.created_at,
        fundUpdated: {
          totalValue: newTotalValue,
          monthlyEarnings: monthlyTotal,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to record earnings' },
      { status: 500 }
    )
  }
}

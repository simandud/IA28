import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// PATCH - Update beneficiary
export async function PATCH(
  request: NextRequest,
  { params }: { params: { fundId: string; beneficiaryId: string } }
) {
  try {
    const { fundId, beneficiaryId } = params
    const body = await request.json()
    const {
      name,
      relationship,
      allocationPercentage,
      walletAddress,
      isVerified,
    } = body

    // Verify beneficiary exists and belongs to fund
    const { data: existing, error: existError } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('id', beneficiaryId)
      .eq('fund_id', fundId)
      .single()

    if (existError) {
      return NextResponse.json(
        { error: 'Beneficiary not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (relationship !== undefined) updateData.relationship = relationship
    if (isVerified !== undefined) updateData.is_verified = isVerified
    if (walletAddress !== undefined) updateData.wallet_address = walletAddress

    if (allocationPercentage !== undefined) {
      if (isNaN(parseFloat(allocationPercentage)) || parseFloat(allocationPercentage) < 0 || parseFloat(allocationPercentage) > 100) {
        return NextResponse.json(
          { error: 'allocationPercentage must be between 0 and 100' },
          { status: 400 }
        )
      }

      // Check total allocation doesn't exceed 100%
      const { data: otherBens } = await supabase
        .from('beneficiaries')
        .select('allocation_percentage')
        .eq('fund_id', fundId)
        .neq('id', beneficiaryId)

      const otherAllocation = (otherBens || []).reduce(
        (sum: number, b: any) => sum + parseFloat(b.allocation_percentage),
        0
      )

      if (otherAllocation + parseFloat(allocationPercentage) > 100) {
        return NextResponse.json(
          {
            error: `Total allocation would exceed 100%. Other beneficiaries: ${otherAllocation}%, Requested: ${allocationPercentage}%`,
          },
          { status: 400 }
        )
      }

      updateData.allocation_percentage = parseFloat(allocationPercentage)

      // Update monthly payout based on fund earnings
      const { data: fund } = await supabase
        .from('ancestor_funds')
        .select('monthly_earnings')
        .eq('id', fundId)
        .single()

      if (fund) {
        updateData.monthly_payout = (fund.monthly_earnings || 0) * (parseFloat(allocationPercentage) / 100)
      }
    }

    const { data, error } = await supabase
      .from('beneficiaries')
      .update(updateData)
      .eq('id', beneficiaryId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      id: data.id,
      fundId: data.fund_id,
      userId: data.user_id,
      name: data.name,
      relationship: data.relationship,
      allocationPercentage: data.allocation_percentage,
      monthlyPayout: data.monthly_payout,
      walletAddress: data.wallet_address,
      isVerified: data.is_verified,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update beneficiary' },
      { status: 500 }
    )
  }
}

// DELETE - Remove beneficiary
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fundId: string; beneficiaryId: string } }
) {
  try {
    const { fundId, beneficiaryId } = params

    // Verify beneficiary exists and belongs to fund
    const { error: existError } = await supabase
      .from('beneficiaries')
      .select('id')
      .eq('id', beneficiaryId)
      .eq('fund_id', fundId)
      .single()

    if (existError) {
      return NextResponse.json(
        { error: 'Beneficiary not found' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('beneficiaries')
      .delete()
      .eq('id', beneficiaryId)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete beneficiary' },
      { status: 500 }
    )
  }
}

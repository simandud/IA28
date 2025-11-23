import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// GET - List all funds or filter by creator
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get('creatorId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('ancestor_funds')
      .select('*', { count: 'exact' })

    if (creatorId) {
      query = query.eq('creator_id', creatorId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      data: data.map((fund: any) => ({
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
      })),
      total: count,
      limit,
      offset,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch funds' },
      { status: 500 }
    )
  }
}

// POST - Create new fund
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      creatorId,
      name,
      description,
      legalDocumentUrl,
    } = body

    // Validation
    if (!creatorId || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: creatorId, name' },
        { status: 400 }
      )
    }

    // Check if user already has a fund
    const { data: existing } = await supabase
      .from('ancestor_funds')
      .select('id')
      .eq('creator_id', creatorId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'User already has an Ancestor Fund. Only one fund per user.' },
        { status: 400 }
      )
    }

    // Create fund
    const { data, error } = await supabase
      .from('ancestor_funds')
      .insert({
        creator_id: creatorId,
        name,
        description: description || '',
        legal_document_url: legalDocumentUrl || null,
        status: 'pending',
        total_value: 0,
        monthly_earnings: 0,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
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
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create fund' },
      { status: 500 }
    )
  }
}

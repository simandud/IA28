import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { avatarId: string } }
) {
  try {
    const body = await request.json()
    const { message } = body
    const { avatarId } = params

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    // In production, call Claude API here
    // For now, return mock response
    const responses = [
      'That\'s a great question. Let me share my thoughts...',
      'I\'m glad you asked. In my experience...',
      'That reminds me of a time when...',
      'You know, I\'ve learned that...',
      'That\'s something I\'ve thought a lot about...',
    ]

    const mockResponse = responses[Math.floor(Math.random() * responses.length)]

    return NextResponse.json({
      id: Math.random().toString(36).substring(7),
      role: 'assistant',
      content: mockResponse,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { avatarId: string } }
) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body
    const { avatarId } = params

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    // Fetch avatar data
    const { data: avatar, error: avatarError } = await supabase
      .from('avatars')
      .select('*')
      .eq('id', avatarId)
      .single()

    if (avatarError || !avatar) {
      return NextResponse.json(
        { error: 'Avatar not found' },
        { status: 404 }
      )
    }

    // Fetch user's videos for context
    const { data: videos, error: videosError } = await supabase
      .from('legacy_videos')
      .select('title, description, transcription')
      .eq('user_id', avatar.user_id)
      .limit(5)

    // Build context from videos
    const context = videos
      ?.map((v) => `${v.title}: ${v.transcription || v.description}`)
      .join('\n\n') || 'No video context available'

    // Create system prompt
    const systemPrompt = `You are a digital avatar of a real person.
Respond as if you ARE this person based on their recorded wisdom and videos.

Person's Information:
Name: ${avatar.name}
Bio: ${avatar.bio || 'Not specified'}
Personality: ${JSON.stringify(avatar.personality_data || {})}

Context from their videos:
${context}

Guidelines:
- Respond as if you ARE this person
- Use their speaking style
- Draw from their experiences
- Keep responses concise (2-3 sentences)
- If asked something you wouldn't know, admit it honestly
- Be warm and personable`

    // For now, return intelligent mock response (Claude integration can be added)
    // In production, you would call Claude API here
    const response = generateIntelligentResponse(message, avatar)

    // Save conversation to database
    const { error: saveError } = await supabase
      .from('avatar_conversations')
      .insert({
        avatar_id: avatarId,
        user_id: avatar.user_id,
        conversation_data: {
          message,
          response,
          timestamp: new Date().toISOString(),
        },
      })

    if (saveError) {
      console.error('Save conversation error:', saveError)
    }

    // Update conversation count
    await supabase
      .from('avatars')
      .update({
        total_conversations: (avatar.total_conversations || 0) + 1,
      })
      .eq('id', avatarId)

    return NextResponse.json({
      id: Math.random().toString(36).substring(7),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Chat failed' },
      { status: 500 }
    )
  }
}

// Intelligent mock response generator (replace with Claude API later)
function generateIntelligentResponse(message: string, avatar: any): string {
  const responses: Record<string, string[]> = {
    greeting: [
      `Hello! It's wonderful to see you. I'm ${avatar.name}. How can I help you today?`,
      `Hey there! I'm happy to chat with you about anything on your mind.`,
      `Welcome! It's great to connect with you.`,
    ],
    advice: [
      `Based on my experiences, I'd say the most important thing is to stay true to your values.`,
      `In my life, I've learned that persistence and kindness go a long way.`,
      `My advice would be to listen more than you speak, and question what you assume.`,
    ],
    personal: [
      `That's something I've thought deeply about. For me, it comes down to what matters most.`,
      `I remember facing something similar. The key was staying patient with myself.`,
      `That's a great question. I've evolved my thinking on this over the years.`,
    ],
  }

  // Simple categorization
  const lowerMessage = message.toLowerCase()
  let category = 'personal'

  if (['hello', 'hi', 'hey', 'greetings', 'good morning'].some((w) => lowerMessage.includes(w))) {
    category = 'greeting'
  } else if (['advice', 'help', 'tips', 'how to', 'should i'].some((w) => lowerMessage.includes(w))) {
    category = 'advice'
  }

  const responseList = responses[category]
  return responseList[Math.floor(Math.random() * responseList.length)]
}

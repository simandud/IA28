# Claude API Integration Guide

## Overview

CHRONOVAULT uses Claude (via Anthropic API) to power the conversational AI avatar. The avatar learns from recorded videos and transcriptions to provide personalized responses as if the original person is speaking.

## Setup

### 1. Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Add to `.env.local`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Install Dependencies

```bash
npm install @anthropic-ai/sdk
```

## Architecture

### Avatar Creation Flow

```
1. Video Upload
   ↓
2. Transcription (via Whisper)
   ↓
3. Personality Extraction (Claude)
   - Extracts speaking style
   - Identifies key values
   - Captures tone and mannerisms
   ↓
4. Embedding Storage (Pinecone/Supabase pgvector)
   ↓
5. Avatar Ready for Conversations
```

### Conversation Flow

```
User Message
   ↓
Retrieve Context (from videos + previous conversations)
   ↓
Build System Prompt (personality + values + speaking style)
   ↓
Call Claude API with context
   ↓
Generate Response
   ↓
Optional: Voice Synthesis (ElevenLabs)
   ↓
Return to User
```

## Implementation

### Avatar Creation

```typescript
// src/app/api/avatar/create/route.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const { userId, videoTranscription, videoMetadata } = await request.json()

  // Extract personality from video transcription
  const personalityAnalysis = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: `You are an expert in analyzing personality and communication styles from text.
Analyze the following transcription and extract:
1. Key personality traits
2. Speaking patterns and mannerisms
3. Core values and beliefs
4. Common phrases and idioms
5. Emotional patterns

Return as JSON.`,
    messages: [
      {
        role: 'user',
        content: videoTranscription,
      },
    ],
  })

  const personality = JSON.parse(
    personalityAnalysis.content[0].type === 'text'
      ? personalityAnalysis.content[0].text
      : '{}'
  )

  // Save to database
  const avatar = await db.avatars.create({
    user_id: userId,
    personality_data: personality,
    name: `Avatar of ${videoMetadata.creatorName}`,
  })

  return Response.json(avatar)
}
```

### Conversation Endpoint

```typescript
// src/app/api/avatar/[avatarId]/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const client = new Anthropic()

export async function POST(
  request: Request,
  { params }: { params: { avatarId: string } }
) {
  const { message, conversationHistory = [] } = await request.json()

  // Fetch avatar and user's videos
  const avatar = await supabase
    .from('avatars')
    .select('*')
    .eq('id', params.avatarId)
    .single()

  const videos = await supabase
    .from('legacy_videos')
    .select('transcription')
    .eq('user_id', avatar.user_id)
    .limit(5)

  // Build context from videos
  const context = videos.data
    ?.map((v) => v.transcription)
    .join('\n\n')

  // Create system prompt with personality
  const systemPrompt = `You are a conversational avatar of a real person.
Use the following information about this person to respond authentically:

Personality: ${JSON.stringify(avatar.personality_data)}

Context from their life:
${context}

Guidelines:
- Respond as if you ARE this person
- Use their speaking style and mannerisms
- Draw from their values and experiences
- Be warm and personable
- Keep responses concise (2-3 sentences usually)
- If asked about something you wouldn't know, say so honestly`

  // Call Claude API
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      {
        role: 'user',
        content: message,
      },
    ],
  })

  const assistantMessage =
    response.content[0].type === 'text' ? response.content[0].text : ''

  // Save conversation
  await supabase.from('avatar_conversations').insert({
    avatar_id: params.avatarId,
    conversation_data: {
      message,
      response: assistantMessage,
    },
  })

  return Response.json({
    role: 'assistant',
    content: assistantMessage,
  })
}
```

## Advanced Features

### 1. Memory Management

```typescript
// Store important facts from conversations
async function rememberFact(avatarId: string, fact: string) {
  const embedding = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: fact,
  })

  await supabase
    .from('avatar_memories')
    .insert({
      avatar_id: avatarId,
      fact,
      embedding: embedding.data[0].embedding,
    })
}
```

### 2. Multi-Turn Conversations

```typescript
async function extendedConversation(avatarId: string, messages: any[]) {
  // Keep full conversation history
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages, // Pass full history
  })

  return response
}
```

### 3. Emotional Intelligence

```typescript
// Analyze emotional tone and respond appropriately
async function analyzeAndRespond(userMessage: string, avatar: any) {
  const emotionalAnalysis = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    system: 'Analyze the emotional tone. Return: emotion, intensity, suggested_response_tone',
    messages: [{ role: 'user', content: userMessage }],
  })

  // Use emotion data to shape response
  // ...
}
```

## Costs & Rate Limits

### Claude 3.5 Sonnet Pricing (as of 2024)
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens

### Estimated Costs
- Avatar creation: ~2000 input tokens = $0.006
- Per conversation: ~500 tokens average = $0.002-0.005
- Target margin: Keep user paying more than API cost

### Rate Limits
- Free tier: 5 requests/min
- Pro: 100 requests/min
- Enterprise: Custom

Implement queue system for handling spikes.

## Best Practices

### 1. Prompt Engineering

```typescript
// Use clear, specific system prompts
const systemPrompt = `You are speaking as [NAME], born in [YEAR].
Your core values are: [VALUES].
You speak with [TONE].
When you don't know something, say: "I don't recall that, but..."
Never break character unless explicitly asked.`
```

### 2. Context Management

```typescript
// Keep recent conversation history only (last 10 messages)
const recentHistory = conversationHistory.slice(-10)
```

### 3. Fallback Responses

```typescript
try {
  const response = await client.messages.create(...)
} catch (error) {
  return {
    content: "I'm having trouble responding right now. Please try again.",
  }
}
```

### 4. Caching

```typescript
// Cache avatar personality analysis for 24 hours
const cached = await redis.get(`avatar:${avatarId}:personality`)
if (cached) return JSON.parse(cached)
```

## Testing

```bash
# Test API connectivity
npm run test:api

# Test avatar creation
npm run test:avatar:create

# Test conversation
npm run test:avatar:chat
```

## Monitoring

### Key Metrics
- API latency (target: <2s)
- Error rate (target: <0.1%)
- Token usage per user
- Conversation satisfaction rating

### Logging

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // API call
} catch (error) {
  Sentry.captureException(error)
}
```

## Future Enhancements

1. **Fine-tuning**: Use LoRA to customize Claude for specific individuals
2. **Streaming**: Use streaming API for real-time responses
3. **Vision**: Analyze facial expressions and gestures from videos
4. **Multimodal**: Generate response videos with avatar synthesis
5. **Memory**: Persistent long-term memory system

## Documentation

- [Anthropic API Docs](https://docs.anthropic.com)
- [Claude 3.5 Sonnet Model Card](https://huggingface.co/meta-llama/Meta-Llama-3-8B)
- [Best Practices](https://docs.anthropic.com/prompt-engineering)

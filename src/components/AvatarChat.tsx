'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { useAvatar } from '@/hooks'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AvatarChatProps {
  avatarId: string
  avatarName: string
}

export const AvatarChat: React.FC<AvatarChatProps> = ({ avatarId, avatarName }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { sendMessage, loading } = useAvatar()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const result = await sendMessage(avatarId, input)

    if (result.success) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.data?.response || 'I understand...',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }
  }

  const quickQuestions = [
    'Tell me about your life',
    'What advice would you give me?',
    'What was your proudest moment?',
    'How did you overcome challenges?',
  ]

  return (
    <Card className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-garamond font-bold text-vault-900 mb-2">
          Chat with {avatarName}
        </h2>
        <p className="text-vault-600">Ask anything and receive personalized responses</p>
      </div>

      {/* Avatar Display */}
      <div className="bg-gradient-to-b from-gold-200 to-legacy-200 rounded-lg h-48 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">👤</div>
          <p className="text-vault-700 font-semibold">{avatarName}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto space-y-4 p-4 bg-vault-50 rounded-lg">
        {messages.length === 0 && (
          <div className="text-center text-vault-500 mt-8">
            <p>Start a conversation...</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2.5 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gold-500 text-white rounded-br-none'
                  : 'bg-white text-vault-900 border border-vault-200 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-sm text-vault-600 mb-3">Quick questions:</p>
          <div className="grid gap-2">
            {quickQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(question)
                }}
                className="text-left text-sm p-3 bg-vault-50 hover:bg-vault-100 border border-vault-200 rounded-lg transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage()
          }}
          placeholder="Ask anything..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 border border-vault-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <Button
          onClick={handleSendMessage}
          isLoading={loading}
          variant="primary"
        >
          Send
        </Button>
      </div>
    </Card>
  )
}

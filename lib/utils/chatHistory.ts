import { ChatMessage } from './chat'

export const compileChatHistory = (messages: ChatMessage[]) => {
  return messages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.message
  }))
}
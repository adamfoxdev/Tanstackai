import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
        }`}
      >
        <div className="text-sm font-semibold mb-1 opacity-70">
          {isUser ? 'You' : '🤖 Assistant'}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        <div className="text-xs opacity-50 mt-1 text-right">
          {message.timestamp instanceof Date
            ? message.timestamp.toLocaleTimeString()
            : new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

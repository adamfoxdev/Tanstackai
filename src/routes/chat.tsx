import { createFileRoute } from '@tanstack/react-router';
import { useRef, useEffect, useState, type FormEvent } from 'react';
import { ChatMessage } from '../components/ChatMessage';
import { useChat } from '../hooks/useChat';

export const Route = createFileRoute('/chat')({
  component: ChatPage,
});

function ChatPage() {
  const {
    conversations,
    activeConversation,
    streamingContent,
    isStreaming,
    startNewConversation,
    selectConversation,
    sendMessage,
    isSending,
  } = useChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, streamingContent]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending || isStreaming) return;
    setInput('');
    sendMessage(trimmed);
  };

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

  return (
    <div className="flex flex-1 h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-3 gap-2 overflow-y-auto">
        <button
          onClick={() => startNewConversation()}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors mb-2"
        >
          + New Chat
        </button>
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => selectConversation(conv.id)}
            className={`text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
              activeConversation?.id === conv.id
                ? 'bg-gray-600'
                : 'hover:bg-gray-700'
            }`}
          >
            {conv.title}
          </button>
        ))}
        {conversations.length === 0 && (
          <p className="text-gray-400 text-xs text-center mt-4">No conversations yet</p>
        )}
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {!hasApiKey && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 text-yellow-800 text-sm">
            ⚠️ No OpenAI API key detected. Set{' '}
            <code className="font-mono bg-yellow-100 px-1 rounded">VITE_OPENAI_API_KEY</code> in your{' '}
            <code className="font-mono bg-yellow-100 px-1 rounded">.env</code> file.
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-6xl mb-4">🤖</span>
              <h2 className="text-xl font-semibold mb-2">TanStack AI Chat</h2>
              <p className="text-sm">Start a conversation by typing a message below</p>
            </div>
          ) : (
            <>
              {activeConversation.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isStreaming && streamingContent && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm bg-white text-gray-800 border border-gray-200">
                    <div className="text-sm font-semibold mb-1 opacity-70">🤖 Assistant</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{streamingContent}</div>
                    <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1 align-middle" />
                  </div>
                </div>
              )}
              {isStreaming && !streamingContent && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 bg-white border-t border-gray-200 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending || isStreaming}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending || isStreaming}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending || isStreaming ? 'Sending…' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

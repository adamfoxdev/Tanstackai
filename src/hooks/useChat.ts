import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { openai, DEFAULT_MODEL } from '../lib/openai';
import type { Message, Conversation } from '../types/chat';

const CONVERSATIONS_KEY = 'tanstack-ai-conversations';

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Conversation[];
    return parsed.map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function useChat() {
  const queryClient = useQueryClient();
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const updateConversations = useCallback((updated: Conversation[]) => {
    setConversations(updated);
    saveConversations(updated);
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  }, [queryClient]);

  const startNewConversation = useCallback(() => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [newConv, ...conversations];
    updateConversations(updated);
    setActiveConversationId(newConv.id);
    return newConv;
  }, [conversations, updateConversations]);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      let conv = activeConversation;
      if (!conv) {
        conv = {
          id: uuidv4(),
          title: content.slice(0, 50) || 'New Conversation',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...conv.messages, userMessage];
      const updatedConv: Conversation = {
        ...conv,
        messages: updatedMessages,
        title: conv.messages.length === 0 ? content.slice(0, 50) || 'New Conversation' : conv.title,
        updatedAt: new Date(),
      };

      const convList = conversations.filter((c) => c.id !== updatedConv.id);
      updateConversations([updatedConv, ...convList]);
      setActiveConversationId(updatedConv.id);
      setIsStreaming(true);
      setStreamingContent('');

      const stream = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      });

      let fullContent = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? '';
        fullContent += delta;
        setStreamingContent(fullContent);
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
      };

      const finalConv: Conversation = {
        ...updatedConv,
        messages: [...updatedMessages, assistantMessage],
        updatedAt: new Date(),
      };

      const latestConvs = loadConversations();
      const finalList = [finalConv, ...latestConvs.filter((c) => c.id !== finalConv.id)];
      updateConversations(finalList);
      setStreamingContent('');
      setIsStreaming(false);

      return finalConv;
    },
    onError: () => {
      setIsStreaming(false);
      setStreamingContent('');
    },
  });

  return {
    conversations,
    activeConversation,
    streamingContent,
    isStreaming,
    startNewConversation,
    selectConversation,
    sendMessage: sendMessageMutation.mutate,
    sendMessageAsync: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { COLORS, FONT_FAMILY } from '@/lib/constants';
import { getDefaultModel, getAvailableModels } from '@/lib/environment';
import { generateId } from '@/lib/utils';
import { streamResponse } from '@/lib/streaming';
import type { Message, ChatContext } from '@/types/message';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

const availableModels = getAvailableModels();
const defaultModel = getDefaultModel();

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const abortRef = useRef<AbortController | null>(null);
  const { isUserScrolling, handleScroll } = useAutoScroll();

  // Build context from message history for the API
  const buildContext = useCallback(
    (msgs: Message[]): ChatContext[] =>
      msgs
        .filter((m) => !m.isError)
        .map((m) => ({ role: m.role, content: m.content })),
    [],
  );

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: text,
    };

    const assistantId = generateId();
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      reasoning: '',
      isReasoningExpanded: false,
    };

    const nextMessages = [...messages, userMsg, assistantMsg];
    setMessages(nextMessages);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const context = buildContext([...messages, userMsg]);

    await streamResponse(context, controller.signal, {
      onReasoningDelta: (delta) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, reasoning: (m.reasoning || '') + delta }
              : m,
          ),
        );
      },
      onOutputDelta: (delta) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + delta } : m,
          ),
        );
      },
      onComplete: () => {
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (error) => {
        setMessages((prev) => {
          // Replace the empty assistant message with an error message
          const filtered = prev.filter((m) => m.id !== assistantId);
          return [
            ...filtered,
            {
              id: generateId(),
              role: 'assistant' as const,
              content: error,
              isError: true,
            },
          ];
        });
        setIsStreaming(false);
        abortRef.current = null;
      },
    }, { model: selectedModel });
  }, [input, isStreaming, messages, buildContext, selectedModel]);

  const handleStop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleToggleReasoning = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, isReasoningExpanded: !m.isReasoningExpanded }
          : m,
      ),
    );
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: COLORS.background,
        fontFamily: FONT_FAMILY,
      }}
    >
      <ChatHeader
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        isStreaming={isStreaming}
        models={availableModels}
      />

      <ChatMessages
        messages={messages}
        isUserScrolling={isUserScrolling}
        onToggleReasoning={handleToggleReasoning}
        onScroll={handleScroll}
      />

      <ChatInput
        input={input}
        isStreaming={isStreaming}
        onInputChange={setInput}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        onStop={handleStop}
      />
    </div>
  );
}

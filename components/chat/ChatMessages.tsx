'use client';

import React, { useRef, useEffect } from 'react';
import { COLORS, FONT_FAMILY, MAX_CONTENT_WIDTH } from '@/lib/constants';
import type { Message } from '@/types/message';
import ChatBubble from './ChatBubble';

interface ChatMessagesProps {
  messages: Message[];
  isUserScrolling: boolean;
  onToggleReasoning: (id: string) => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export default function ChatMessages({
  messages,
  isUserScrolling,
  onToggleReasoning,
  onScroll,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change (unless user is scrolling up)
  useEffect(() => {
    if (!isUserScrolling && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isUserScrolling]);

  const isEmpty = messages.length === 0;

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      style={{
        flex: 1,
        overflowY: 'auto',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: 20,
        }}
      >
        {isEmpty ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              color: COLORS.textSecondary,
              fontFamily: FONT_FAMILY,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {'\uD83D\uDCAC'}
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              Silvy Web Chat
            </h2>
            <p style={{ margin: '8px 0 0', fontSize: 14 }}>
              Mulai percakapan dengan mengetik pesan di bawah
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              onToggleReasoning={onToggleReasoning}
            />
          ))
        )}
      </div>
    </div>
  );
}

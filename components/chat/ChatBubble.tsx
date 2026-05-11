'use client';

import React from 'react';
import { COLORS, FONT_FAMILY } from '@/lib/constants';
import type { Message } from '@/types/message';

interface ChatBubbleProps {
  message: Message;
  onToggleReasoning: (id: string) => void;
}

export default function ChatBubble({ message, onToggleReasoning }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  // Reasoning bubble (shown before AI content)
  const reasoningBlock = message.reasoning ? (
    <div
      style={{
        background: COLORS.reasoningBubble,
        borderLeft: `3px solid ${COLORS.accent}`,
        borderRadius: '0 8px 8px 0',
        padding: '10px 14px',
        marginBottom: 6,
        maxWidth: '80%',
        cursor: 'pointer',
        overflow: 'hidden',
        maxHeight: message.isReasoningExpanded ? 'none' : 40,
        transition: 'max-height 0.3s ease',
      }}
      onClick={() => onToggleReasoning(message.id)}
    >
      <div
        style={{
          fontSize: 11,
          color: COLORS.accent,
          marginBottom: 4,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
        }}
      >
        Thinking...
      </div>
      <div
        style={{
          color: COLORS.textSecondary,
          fontStyle: 'italic',
          fontSize: 13,
          fontFamily: FONT_FAMILY,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.reasoning}
      </div>
    </div>
  ) : null;

  // Error bubble
  if (isError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
        <div
          style={{
            background: COLORS.errorBubble,
            color: COLORS.errorText,
            borderRadius: 12,
            padding: '10px 16px',
            maxWidth: '80%',
            fontSize: 14,
            fontFamily: FONT_FAMILY,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      {/* Reasoning block appears before AI content */}
      {!isUser && reasoningBlock}

      <div
        style={{
          background: isUser ? COLORS.userBubble : COLORS.aiBubble,
          color: COLORS.textPrimary,
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          padding: '10px 16px',
          maxWidth: '80%',
          fontSize: 14,
          fontFamily: FONT_FAMILY,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

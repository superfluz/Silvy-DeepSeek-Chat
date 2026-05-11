'use client';

import React, { useRef, useEffect } from 'react';
import { COLORS, FONT_FAMILY, MAX_CONTENT_WIDTH, ICONS } from '@/lib/constants';

interface ChatInputProps {
  input: string;
  isStreaming: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onStop: () => void;
}

export default function ChatInput({
  input,
  isStreaming,
  onInputChange,
  onKeyDown,
  onSend,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = '44px';
      const scrollH = el.scrollHeight;
      el.style.height = `${Math.min(scrollH, 200)}px`;
    }
  }, [input]);

  const showSend = input.trim().length > 0 && !isStreaming;
  const showStop = isStreaming;

  return (
    <div
      style={{
        flexShrink: 0,
        width: '100%',
        borderTop: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
      }}
    >
      <div
        style={{
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isStreaming ? 'Silvy sedang merespons...' : 'Ketik pesan...'}
          rows={1}
          style={{
            flex: 1,
            minHeight: 44,
            maxHeight: 200,
            resize: 'none',
            background: COLORS.background,
            color: COLORS.textPrimary,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: '10px 14px',
            fontFamily: FONT_FAMILY,
            fontSize: 14,
            lineHeight: 1.5,
            outline: 'none',
            overflow: 'auto',
          }}
          disabled={isStreaming}
        />

        {showSend && (
          <button
            onClick={onSend}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: 'none',
              background: COLORS.accent,
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Send message"
          >
            {ICONS.send}
          </button>
        )}

        {showStop && (
          <button
            onClick={onStop}
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.surface,
              color: COLORS.errorText,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            aria-label="Stop streaming"
          >
            {ICONS.stop}
          </button>
        )}
      </div>
    </div>
  );
}

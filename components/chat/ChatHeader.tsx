'use client';

import React from 'react';
import { COLORS, FONT_FAMILY, MAX_CONTENT_WIDTH } from '@/lib/constants';
import ModelSelector from './ModelSelector';

interface ChatHeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  isStreaming: boolean;
  models: string[];
}

export default function ChatHeader({
  selectedModel,
  onModelChange,
  isStreaming,
  models,
}: ChatHeaderProps) {
  return (
    <header
      style={{
        flexShrink: 0,
        width: '100%',
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.surface,
      }}
    >
      <div
        style={{
          maxWidth: MAX_CONTENT_WIDTH,
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: FONT_FAMILY,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            Silvy Web Chat
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: COLORS.textSecondary,
            }}
          >
            AI Chat dengan DeepSeek-R1
          </p>
        </div>

        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          disabled={isStreaming}
          models={models}
        />
      </div>
    </header>
  );
}

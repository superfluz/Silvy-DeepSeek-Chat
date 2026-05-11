'use client';

import React from 'react';
import { COLORS, FONT_FAMILY } from '@/lib/constants';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled: boolean;
  models: string[];
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  disabled,
  models,
}: ModelSelectorProps) {
  return (
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      disabled={disabled}
      style={{
        background: COLORS.surface,
        color: COLORS.textPrimary,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: '6px 10px',
        fontFamily: FONT_FAMILY,
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        outline: 'none',
      }}
    >
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  );
}

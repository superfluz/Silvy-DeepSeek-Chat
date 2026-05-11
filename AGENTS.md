# Silvy DeepSeek Chat - Development Documentation

## Overview

Silvy Web Chat is a Next.js web application that provides a chat interface for AI models,
primarily targeting DeepSeek-R1. It supports SSE streaming, reasoning display, and
multiple model selection.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Inline styles (no Tailwind, no CSS modules)
- **Font**: System font stack (no CDN)
- **Icons**: Unicode characters (no SVG)

## Project Structure

```
app/              - Next.js App Router pages and API routes
  api/chat/       - Server-side API route (proxies to external AI endpoint)
  globals.css     - Global dark theme styles
  layout.tsx      - Root layout
  page.tsx        - Main chat page (client component)
components/chat/  - UI components
  ChatBubble.tsx  - Message bubble (user, AI, reasoning, error)
  ChatHeader.tsx  - Header with title and model selector
  ChatInput.tsx   - Textarea with send/stop button
  ChatMessages.tsx - Message list container with auto-scroll
  ModelSelector.tsx - Model dropdown
hooks/            - Custom React hooks
  useAutoScroll.ts - Auto-scroll with manual scroll detection
lib/              - Shared utilities
  constants.ts    - Colors, fonts, layout constants
  environment.ts  - Environment variable accessors
  prompts.ts      - System prompt definitions
  streaming.ts    - SSE streaming logic
  utils.ts        - ID generation and helpers
types/            - TypeScript type definitions
  message.ts      - Message and ChatContext interfaces
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_DEFAULT_MODEL` | Client | Default model name |
| `NEXT_PUBLIC_AVAILABLE_MODELS` | Client | Comma-separated model list |
| `API_ENDPOINT` | Server | External AI API endpoint |
| `API_KEY` | Server | API key for external endpoint |
| `SYSTEM_PROMPT_KEY` | Server | Key into SYSTEM_PROMPTS map |

## Security

- `API_ENDPOINT` and `API_KEY` are server-side only (no `NEXT_PUBLIC_` prefix)
- The frontend calls `/api/chat` which proxies to the external API
- All message content is rendered via `textContent` (XSS prevention)
- No `innerHTML` or `dangerouslySetInnerHTML` used

## Streaming Flow

1. User sends a message
2. Frontend POSTs to `/api/chat` with `{ messages, model }`
3. API route reads server-side env vars and system prompt
4. API route forwards request to external AI endpoint with Authorization header
5. SSE stream is piped back to the frontend
6. Frontend parses events: `response.reasoning_summary_text.delta`,
   `response.output_text.delta`, `response.completed`
7. UI updates in real-time as deltas arrive

## Development

```bash
npm install
cp .env.example .env.local  # Configure your environment
npm run dev                  # Start dev server
npm run build                # Production build
npm run lint                 # Lint check
```

## Key Design Decisions

- **Inline styles**: Chosen for simplicity and to avoid build-tool dependencies
- **No external fonts/icons**: Reduces network requests and improves load times
- **Server-side proxy**: Keeps API keys secure and avoids CORS issues
- **AbortController**: Allows users to cancel streaming responses
- **Message IDs**: Used for stable React keys and reasoning toggle (not array indices)

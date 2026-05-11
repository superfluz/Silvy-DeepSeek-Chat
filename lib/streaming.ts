import type { ChatContext } from '@/types/message';

export interface StreamCallbacks {
  onReasoningDelta: (delta: string) => void;
  onOutputDelta: (delta: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}

export interface StreamOptions {
  model: string;
}

/**
 * Stream a chat response from the internal /api/chat route.
 * Parses SSE events and invokes callbacks for each delta.
 */
export async function streamResponse(
  context: ChatContext[],
  signal: AbortSignal,
  callbacks: StreamCallbacks,
  options: StreamOptions,
): Promise<void> {
  const { onReasoningDelta, onOutputDelta, onComplete, onError } = callbacks;

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: context, model: options.model }),
      signal,
    });
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') return;
    onError(`Network error: ${(err as Error).message}`);
    return;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    onError(`API error ${response.status}: ${text}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError('No response body');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      // Keep last potentially incomplete line in the buffer
      buffer = lines.pop() || '';

      let currentEvent = '';

      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);

          if (currentEvent === 'response.completed') {
            onComplete();
            return;
          }

          try {
            const data = JSON.parse(dataStr);

            if (
              currentEvent === 'response.reasoning_summary_text.delta' &&
              data.delta
            ) {
              onReasoningDelta(data.delta);
            } else if (
              currentEvent === 'response.output_text.delta' &&
              data.delta
            ) {
              onOutputDelta(data.delta);
            }
          } catch {
            // Ignore non-JSON data lines
          }
        } else if (line.trim() === '') {
          // Empty line resets event context per SSE spec
          currentEvent = '';
        }
      }
    }

    // If stream ends without explicit completed event
    onComplete();
  } catch (err: unknown) {
    if ((err as Error).name === 'AbortError') return;
    onError(`Stream error: ${(err as Error).message}`);
  }
}

import { NextRequest } from 'next/server';
import { getApiEndpoint, getApiKey, getSystemPromptKey } from '@/lib/environment';
import { getSystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model } = body as {
      messages: { role: string; content: string }[];
      model: string;
    };

    if (!messages || !model) {
      return new Response(
        JSON.stringify({ error: 'Missing messages or model' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const endpoint = getApiEndpoint();
    const apiKey = getApiKey();
    const promptKey = getSystemPromptKey();
    const systemPrompt = getSystemPrompt(promptKey);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        instructions: systemPrompt,
        input: messages,
        stream: true,
        reasoning: {
          effort: 'medium',
          summary: 'auto',
        },
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => 'Unknown upstream error');
      return new Response(errText, { status: upstream.status });
    }

    // Pipe the SSE stream back to the client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

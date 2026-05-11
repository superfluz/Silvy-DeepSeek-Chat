// Client-side environment helpers (NEXT_PUBLIC_ prefixed only)

export function getDefaultModel(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'deepseek-r1';
}

export function getAvailableModels(): string[] {
  const raw =
    process.env.NEXT_PUBLIC_AVAILABLE_MODELS ||
    'deepseek-r1,deepseek-r1:14b,deepseek-r1:32b,llama3.2,qwen2.5';
  return raw.split(',').map((m) => m.trim()).filter(Boolean);
}

// Server-side only helpers -- these will be undefined on the client
export function getApiEndpoint(): string {
  return process.env.API_ENDPOINT || 'http://localhost:11434/v1/responses';
}

export function getApiKey(): string {
  return process.env.API_KEY || '';
}

export function getSystemPromptKey(): string {
  return process.env.SYSTEM_PROMPT_KEY || 'default';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  isReasoningExpanded?: boolean;
  isError?: boolean;
}

export interface ChatContext {
  role: string;
  content: string;
}

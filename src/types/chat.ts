export type ModelType = 'gemini' | 'mixtral' | 'llama';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  model?: ModelType;
}

export interface ChatState {
  messages: Message[];
  isTyping: Record<ModelType, boolean>;
  error: Record<ModelType, string | null>;
  enabledModels: Record<ModelType, boolean>;
}
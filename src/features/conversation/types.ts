export type MessageSender = 'signer' | 'reply' | 'assistant';

export interface McpToolCall {
  tool: string;
  arguments?: Record<string, unknown>;
  result?: any;
  durationMs?: number;
  transport?: string;
  success?: boolean;
}

export interface McpMetadata {
  toolsDiscovered?: string[];
  toolCalls?: McpToolCall[];
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: number;
  status?: 'confirmed' | 'draft' | 'error';
  editedAt?: number;
  mcp?: McpMetadata;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

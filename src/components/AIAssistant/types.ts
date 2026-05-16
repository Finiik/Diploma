import type { AssistantResponse } from '../../types/domain';

/** A message in the chat transcript: a user query or a bot answer. */
export type ChatMessage =
  | { role: 'user'; text: string; timestamp: number }
  | ({ role: 'bot'; timestamp: number } & AssistantResponse);

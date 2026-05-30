import { axiosInstance } from '../../lib/axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  const { data } = await axiosInstance.post<{ reply: string }>('/api/ai/chat', {
    message,
    history,
  });
  return data.reply;
}

import { apiService } from "./api";
import type { ToolCallResult } from "@/types/shared";

export interface ChatApiResponse {
  data: {
    message: string;
    toolCalls: ToolCallResult[];
    conversationId: string;
    isError?: boolean;
  };
}

export interface ConversationHistoryResponse {
  data: {
    conversationId: string;
    messages: Array<{
      role: string;
      content: string;
      timestamp: string;
      tool_call_id?: string;
      tool_calls?: Array<{
        id: string;
        function: {
          name: string;
          arguments: string;
        };
      }>;
    }>;
    total: number;
  };
}

export const chatAPI = {
  sendMessage: async (data: { message: string; conversationId?: string }) => {
    return apiService.post<ChatApiResponse>("/chat/message", data);
  },

  getConversationHistory: async (conversationId: string) => {
    return apiService.get<ConversationHistoryResponse>(
      `/chat/conversation/${conversationId}`
    );
  },

  clearConversation: async (conversationId: string) => {
    return apiService.delete(`/chat/conversation/${conversationId}`);
  },
};

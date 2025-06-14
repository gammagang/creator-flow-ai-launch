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
  sendMessage: async (data: { message: string }) => {
    return apiService.post<ChatApiResponse>("/chat/message", data);
  },

  // Get user's conversation (no conversation ID needed - server uses user from JWT)
  getUserConversation: async () => {
    return apiService.get<ConversationHistoryResponse>(
      "/chat/user/conversation"
    );
  },

  // Delete user's conversation
  clearUserConversation: async () => {
    return apiService.delete("/chat/user/conversation");
  },
};

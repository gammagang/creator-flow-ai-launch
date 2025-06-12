import { apiService } from "./api";

export interface ToolCallResult {
  toolCallId: string;
  functionName: string;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

export interface ChatApiResponse {
  data: {
    message: string;
    toolCalls: ToolCallResult[];
    conversationId: string;
  };
}

export const chatAPI = {
  sendMessage: async (data: { message: string; conversationId?: string }) => {
    return apiService.post<ChatApiResponse>("/chat/message", data);
  },
};

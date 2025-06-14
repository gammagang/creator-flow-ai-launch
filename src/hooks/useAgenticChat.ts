import { chatAPI } from "@/services/chatApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ToolCall {
  id: string;
  functionName: string;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

export interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCall?: ToolCall;
}

export function useAgenticChat() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Load user's conversation history (no conversation ID needed)
  const {
    data: conversationHistory,
    isLoading: isLoadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["userConversation"],
    queryFn: () => chatAPI.getUserConversation(),
    retry: 2,
    retryDelay: 1000,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Effect to load conversation history into messages
  useEffect(() => {
    console.log("History effect triggered:", {
      hasHistory: !!conversationHistory?.data?.messages,
      isLoadingHistory,
      historyError,
      messagesCount: conversationHistory?.data?.messages?.length,
    });

    // Wait for loading to complete before processing
    if (isLoadingHistory) {
      return;
    }

    // If we have conversation history data, process it
    if (
      conversationHistory?.data?.messages &&
      conversationHistory.data.messages.length > 0
    ) {
      const rawMessages = conversationHistory.data.messages.filter(
        (msg) => msg.role !== "system"
      );

      if (rawMessages.length === 0) {
        // No non-system messages, set default message
        console.log("No user/assistant messages found, setting default");
        setMessages([
          { role: "assistant", content: "Hello! How can I help you today?" },
        ]);
        return;
      }

      const processedMessages: Message[] = [];

      // Group messages by conversation turns to maintain proper ordering
      let i = 0;
      while (i < rawMessages.length) {
        const currentMsg = rawMessages[i];

        if (currentMsg.role === "user") {
          // Add user message
          processedMessages.push({
            role: "user",
            content: currentMsg.content,
          });
          i++;
        } else if (currentMsg.role === "assistant") {
          // First look for related tool calls that come after this assistant message
          let j = i + 1;
          while (j < rawMessages.length && rawMessages[j].role === "tool") {
            const toolMsg = rawMessages[j];
            if (toolMsg.tool_call_id) {
              try {
                const result = JSON.parse(toolMsg.content);

                // Find the function name from the assistant message's tool_calls
                let functionName = "unknown";
                if (currentMsg.tool_calls) {
                  const matchingToolCall = currentMsg.tool_calls.find(
                    (tc) => tc.id === toolMsg.tool_call_id
                  );
                  if (matchingToolCall?.function?.name) {
                    functionName = matchingToolCall.function.name;
                  }
                }

                processedMessages.push({
                  role: "tool",
                  content: `Tool call: ${functionName}`,
                  toolCall: {
                    id: toolMsg.tool_call_id,
                    functionName: functionName,
                    result: result,
                  },
                });
              } catch (e) {
                // If JSON parsing fails, treat as regular message
                processedMessages.push({
                  role: "tool",
                  content: toolMsg.content,
                });
              }
            }
            j++;
          }

          // Then add assistant message after tool calls
          if (currentMsg.content && currentMsg.content.trim()) {
            processedMessages.push({
              role: "assistant",
              content: currentMsg.content,
            });
          }

          i = j; // Move past all processed tool calls
        } else {
          // Handle any other message types
          processedMessages.push({
            role: currentMsg.role as "user" | "assistant" | "tool",
            content: currentMsg.content,
          });
          i++;
        }
      }

      console.log("Setting messages from history:", processedMessages.length);
      setMessages(processedMessages);
    } else if (!historyError) {
      // No conversation history found, set default message
      console.log("No conversation history found, setting default message");
      setMessages([
        { role: "assistant", content: "Hello! How can I help you today?" },
      ]);
    }
  }, [conversationHistory, isLoadingHistory, historyError]);

  // Debug effect to monitor component mount/unmount and conversation state
  useEffect(() => {
    console.log("useAgenticChat hook mounted/updated:", {
      messagesCount: messages.length,
      isLoadingHistory,
      hasHistoryData: !!conversationHistory?.data?.messages,
      historyError: !!historyError,
    });
  }, [messages.length, isLoadingHistory, conversationHistory, historyError]);

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onSuccess: (response) => {
      const {
        message,
        toolCalls,
        conversationId: responseConversationId,
        isError,
      } = response.data;

      // Handle error responses
      if (isError) {
        toast.error(
          message || "An error occurred while processing your request."
        );
        // Still add the error message to the chat so user can see it
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: message || "An error occurred." },
        ]);
        return;
      }

      const newMessages: Message[] = [];

      // Add tool call results first
      if (toolCalls) {
        toolCalls.forEach((toolCall) => {
          newMessages.push({
            role: "tool",
            content: `Tool call: ${toolCall.functionName}`,
            toolCall: {
              id: toolCall.toolCallId,
              functionName: toolCall.functionName,
              result: toolCall.result,
            },
          });
        });
      }

      // Add assistant message after tool calls
      if (message) {
        newMessages.push({ role: "assistant", content: message });
      }

      setMessages((prev) => [...prev, ...newMessages]);

      // Invalidate and refetch conversation history to stay in sync
      queryClient.invalidateQueries({
        queryKey: ["userConversation"],
      });
    },
    onError: (error: unknown) => {
      toast.error("Failed to send message. Please try again.");
      if (error instanceof Error) {
        console.error("Chat error:", error.message);
      } else {
        console.error("Chat error:", error);
      }
    },
  });

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const payload = { message: input };
    setInput("");
    sendMessageMutation.mutate(payload);
  };

  const clearConversationMutation = useMutation({
    mutationFn: chatAPI.clearUserConversation,
    onSuccess: () => {
      console.log("User conversation cleared on backend successfully");
      // Invalidate and refetch to get fresh state
      queryClient.invalidateQueries({
        queryKey: ["userConversation"],
      });
    },
    onError: (error: unknown) => {
      console.warn("Failed to clear user conversation on backend:", error);
      // Don't show error to user since frontend clearing still works
    },
  });

  const loading = sendMessageMutation.isPending;

  const clearChat = () => {
    console.log("Clearing chat");

    // Clear the conversation on the backend
    clearConversationMutation.mutate();

    // Clear frontend state immediately
    setMessages([
      { role: "assistant", content: "Hello! How can I help you today?" },
    ]);
  };

  const refreshConversation = () => {
    console.log("Manually refreshing user conversation");
    refetchHistory();
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    handleSend,
    clearChat,
    refreshConversation,
    loading: loading || clearConversationMutation.isPending,
    isLoadingHistory,
    historyError,
  };
}

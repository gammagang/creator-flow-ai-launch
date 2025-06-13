import ToolCallResultCard from "@/components/ToolCallResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgenticChat } from "@/hooks/useAgenticChat";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCall?: {
    id: string;
    functionName: string;
    result: {
      success: boolean;
      data?: unknown;
      error?: string;
    };
  };
}

const AgenticManager = () => {
  const {
    messages,
    input,
    setInput,
    handleSend,
    clearChat,
    refreshConversation,
    loading,
    isLoadingHistory,
    historyError,
  } = useAgenticChat();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const renderMessage = (msg: Message, idx: number) => {
    // Handle tool call messages
    if (msg.toolCall) {
      // Generic tool call result display
      return (
        <div key={idx} className="flex justify-start">
          <div className="w-full max-w-4xl">
            <ToolCallResultCard
              toolCall={{
                toolCallId: msg.toolCall.id,
                functionName: msg.toolCall.functionName,
                result: msg.toolCall.result,
              }}
            />
          </div>
        </div>
      );
    }

    // Skip rendering if message content is empty or just whitespace
    if (!msg.content || !msg.content.trim()) {
      return null;
    }

    // Regular chat messages
    return (
      <div
        key={idx}
        className={`flex ${
          msg.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 max-w-[75%] text-base shadow-sm break-words ${
            msg.role === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          {msg.role === "assistant" ? (
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          ) : (
            msg.content
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {" "}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agentic Manager</h1>
          <p className="text-gray-600 mt-1">
            AI-powered assistant for campaign management and creator discovery
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={refreshConversation}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
            disabled={isLoadingHistory}
          >
            {isLoadingHistory ? "Loading..." : "Refresh"}
          </Button>
          <Button
            onClick={clearChat}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Chat
          </Button>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden bg-background border rounded-lg">
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-4xl flex flex-col overflow-hidden">
            {" "}
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {isLoadingHistory && messages.length === 0 && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading conversation...</div>
                </div>
              )}
              {historyError && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-red-500">
                    Failed to load conversation history.
                    <Button
                      variant="link"
                      onClick={refreshConversation}
                      className="p-0 ml-1 h-auto"
                    >
                      Try again
                    </Button>
                  </div>
                </div>
              )}
              {messages.map(renderMessage).filter(Boolean)}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              className="flex gap-2 p-4 border-t bg-background flex-shrink-0"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSend(e);
                  }
                }}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgenticManager;

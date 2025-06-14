import ToolCallResultCard from "@/components/ToolCallResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgenticChat } from "@/hooks/useAgenticChat";
import { RefreshCw, Trash2 } from "lucide-react";
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Always focus input after any message is added
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [messages]);

  // Wrap handleSend to refocus input after sending
  const handleSendWithFocus = (e: React.FormEvent | React.KeyboardEvent) => {
    handleSend(e);
    // Refocus input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

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
        </div>{" "}
        <div className="flex items-center gap-4">
          <Button
            onClick={refreshConversation}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
            disabled={isLoadingHistory}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isLoadingHistory ? "animate-spin" : ""
              }`}
            />
            {isLoadingHistory ? "Loading..." : "Refresh"}
          </Button>
          <Button
            onClick={clearChat}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
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
              {loading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 max-w-[75%] bg-gray-100 text-gray-900">
                      <span className="shimmer-text block relative">
                        Assistant is thinking...
                      </span>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendWithFocus}
              className="flex gap-2 p-4 border-t bg-background flex-shrink-0"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSendWithFocus(e);
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

// Add custom CSS for the shimmer effect on text
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    .shimmer-text {
      position: relative;
      display: inline-block;
      color: #444;
      background: linear-gradient(90deg, #444 0%, #bbb 50%, #444 100%);
      background-size: 200% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      animation: shimmer-text 1.5s infinite linear;
    }
    @keyframes shimmer-text {
      0% {
        background-position: -100% 0;
      }
      100% {
        background-position: 100% 0;
      }
    }
  `;
  if (!document.head.querySelector("style[data-agentic-shimmer-text]")) {
    style.setAttribute("data-agentic-shimmer-text", "true");
    document.head.appendChild(style);
  }
}

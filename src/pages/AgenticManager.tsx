import ToolCallResultCard from "@/components/ToolCallResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgenticChat } from "@/hooks/useAgenticChat";
import { RefreshCw, Trash2, Bot } from "lucide-react";
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
    } // Regular chat messages
    return (
      <div
        key={idx}
        className={`flex ${
          msg.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {" "}
        <div
          className={`rounded-xl px-4 py-3 max-w-[70%] text-sm font-medium break-words ${
            msg.role === "user"
              ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white border-2 border-transparent"
              : "bg-white/90 backdrop-blur-sm text-gray-800 border-2 border-gray-200"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative sparkles */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl flex items-center justify-center relative">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Agentic Manager
                  </span>
                </h1>
                <p className="text-lg text-gray-600 font-medium mt-1">
                  AI-powered assistant for campaign management and creator
                  discovery
                </p>
              </div>
            </div>{" "}
            <div className="flex items-center gap-4">
              <Button
                onClick={refreshConversation}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-orange-600 hover:bg-white/50 rounded-xl px-4 py-2 transition-all duration-200"
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
                className="text-red-600 hover:text-red-700 border-2 border-red-200 hover:border-red-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-3xl shadow-[2px_2px_0px_0px_#000]">
            <div className="flex-1 flex justify-center overflow-hidden">
              <div className="w-full max-w-4xl flex flex-col overflow-hidden">
                {" "}
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 p-3">
                  {isLoadingHistory && messages.length === 0 && (
                    <div className="flex justify-center items-center py-16">
                      <div className="text-gray-500 text-lg font-medium">
                        Loading conversation...
                      </div>
                    </div>
                  )}
                  {historyError && (
                    <div className="flex justify-center items-center py-16">
                      <div className="text-red-500 text-lg font-medium">
                        Failed to load conversation history.
                        <Button
                          variant="link"
                          onClick={refreshConversation}
                          className="p-0 ml-2 h-auto text-orange-600 hover:text-pink-600"
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
                        <div className="rounded-xl px-4 py-3 max-w-[70%] bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-200">
                          <span className="shimmer-text block relative text-gray-700 text-sm font-medium">
                            Assistant is thinking...
                          </span>
                        </div>
                      </div>
                    )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Input Area */}
                <form
                  onSubmit={handleSendWithFocus}
                  className="flex gap-4 p-3 border-t-2 border-gray-200 bg-white/95 backdrop-blur-sm flex-shrink-0 rounded-b-3xl"
                >
                  {" "}
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1 h-12 text-base rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-0 bg-white/80 backdrop-blur-sm font-medium"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        handleSendWithFocus(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="h-12 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold px-8 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                  >
                    {loading ? "Sending..." : "Send"}
                  </Button>
                </form>
              </div>
            </div>
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
      color: #6b7280;
      background: linear-gradient(90deg, #6b7280 0%, #f97316 50%, #ec4899 100%);
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

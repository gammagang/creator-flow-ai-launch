import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { chatAPI, ToolCallResult } from "@/services/chatApi";
import { toast } from "sonner";
import type { DiscoveredCreator } from "@/services/creatorApi";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CreatorCard = ({ creator }: { creator: DiscoveredCreator }) => (
  <div className="border rounded-lg p-4 shadow bg-white flex flex-col gap-2 w-full max-w-xs min-w-0">
    <div className="flex items-center gap-3">
      {creator.profileImageUrl ? (
        <img
          src={creator.profileImageUrl}
          alt={creator.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          ?
        </div>
      )}
      <div>
        <div className="font-semibold text-lg">{creator.name}</div>
        <div className="text-xs text-gray-500">
          @{creator.handle} • {creator.platform}
        </div>
      </div>
    </div>
    <div className="text-sm text-gray-700">
      {creator.category || "No category"}
    </div>
    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
      <span>
        Followers: {creator.followersCount?.toLocaleString?.() ?? "-"}
      </span>
      <span>ER: {creator.engagement_rate ?? "-"}</span>
      <span>Tier: {creator.tier ?? "-"}</span>
      {creator.country && <span>Country: {creator.country}</span>}
    </div>
    {creator.profileUrl && (
      <a
        href={creator.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-xs"
      >
        View Profile
      </a>
    )}
  </div>
);

const AgenticManager = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  console.log(" messages:", messages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined
  );

  const formatToolCallResult = (toolCall: ToolCallResult) => {
    const { functionName, result } = toolCall;
    if (!result.success) {
      return `Tool call (${functionName}) failed: ${
        result.error || "Unknown error"
      }`;
    }
    return `Tool call (${functionName}) result:\n${JSON.stringify(
      result.data,
      null,
      2
    )}`;
  };

  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onSuccess: (response) => {
      const { message, toolCalls, conversationId } = response.data;
      setMessages((prev) => [
        ...prev,
        ...(message ? [{ role: "assistant" as const, content: message }] : []),
        ...(toolCalls || []).map((toolCall) => ({
          role: "assistant" as const,
          content: formatToolCallResult(toolCall),
        })),
      ]);
      setConversationId(conversationId);
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
    const payload = { message: input, conversationId };
    setInput("");
    sendMessageMutation.mutate(payload);
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loading = sendMessageMutation.isPending;

  // Extract creators from toolCalls for display
  const creators: DiscoveredCreator[] = [];
  // Track which message indices contain discover_creators tool call results
  const discoverCreatorsMsgIndices = new Set<number>();
  messages.forEach((msg, idx) => {
    if (
      msg.role === "assistant" &&
      msg.content.startsWith("Tool call (discover_creators)") &&
      msg.content.includes("creators")
    ) {
      try {
        // Extract the JSON from the message content
        const match = msg.content.match(/result:\n([\s\S]*)$/);
        if (match) {
          const data = JSON.parse(match[1]);
          if (Array.isArray(data.creators)) {
            creators.push(...data.creators);
            discoverCreatorsMsgIndices.add(idx);
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agentic Manager</h1>
          <p className="text-gray-600 mt-1">
            AI-powered assistant for campaign management and creator discovery
          </p>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden bg-background border rounded-lg">
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="w-full max-w-4xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg, idx) => {
                // Inline rendering for discover_creators tool call result
                if (
                  msg.role === "assistant" &&
                  msg.content.startsWith("Tool call (discover_creators)") &&
                  msg.content.includes("creators")
                ) {
                  try {
                    const match = msg.content.match(/result:\n([\s\S]*)$/);
                    if (match) {
                      const data = JSON.parse(match[1]);
                      if (
                        Array.isArray(data.creators) &&
                        data.creators.length > 0
                      ) {
                        return (
                          <div key={idx} className="flex justify-start">
                            <div className="w-full">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {data.creators.map(
                                  (
                                    creator: DiscoveredCreator,
                                    cidx: number
                                  ) => (
                                    <CreatorCard
                                      key={creator.id || cidx}
                                      creator={creator}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }
                  } catch (e) {
                    // ignore parse errors
                  }
                  // If no creators or parse error, render nothing
                  return null;
                }
                // Otherwise, render normal chat bubble
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
                      {msg.role === "assistant" &&
                      !msg.content.startsWith("Tool call (") ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                );
              })}
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

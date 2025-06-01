import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConversation } from "@elevenlabs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
  userName?: string;
  conversationId?: string;
  budget_from?: number;
  budget_to?: number;
}

export default function AIAssistant({
  userName = "Mario",
  conversationId = "1",
  budget_from = 1100,
  budget_to = 1500,
}: AIAssistantProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [showMicDialog, setShowMicDialog] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => setIsConnected(true),
    onDisconnect: () => setIsConnected(false),
    onMessage: (message) => {
      console.log("Message received:", message);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  useEffect(() => {
    // Load the widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const dynamicVariables = {
    user_name: userName,
    conversation_id: conversationId,
    budget_from,
    budget_to,
  };

  const requestMicrophoneAccess = async () => {
    try {
      setMicError(null);
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setShowMicDialog(false);
      // After successful microphone access, start the conversation
      //   await conversation.startSession({
      //     agentId: "agent_01jwh13zh1eras2zsfwfc4n8d5",
      //   });
    } catch (error) {
      setMicError(
        "Failed to access microphone. Please ensure you have granted microphone permissions."
      );
      console.error("Error accessing microphone:", error);
    }
  };

  const handleStartConversation = () => {
    setShowMicDialog(true);
  };

  const handleEndConversation = async () => {
    await conversation.endSession();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">
          Get help with your campaigns and negotiations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chat Assistant (Widget)</CardTitle>
            <CardDescription>
              Ask about campaigns, negotiations, or get help
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <elevenlabs-convai
              agent-id="agent_01jwh13zh1eras2zsfwfc4n8d5"
              dynamic-variables={JSON.stringify(dynamicVariables)}
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Chat Assistant (React SDK)</CardTitle>
            <CardDescription>
              Ask about campaigns, negotiations, or get help
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <button
                  onClick={handleStartConversation}
                  disabled={isConnected}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  Start Conversation
                </button>
                <button
                  onClick={handleEndConversation}
                  disabled={!isConnected}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md disabled:opacity-50"
                >
                  End Conversation
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                Status: {isConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showMicDialog} onOpenChange={setShowMicDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Microphone Access Required</DialogTitle>
            <DialogDescription>
              To enable voice conversation with the AI assistant, we need access
              to your microphone. This allows you to speak naturally with the
              assistant and receive voice responses.
            </DialogDescription>
          </DialogHeader>
          {micError && (
            <div className="text-sm text-destructive mt-2">{micError}</div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMicDialog(false)}>
              Cancel
            </Button>
            <Button onClick={requestMicrophoneAccess}>
              Allow Microphone Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

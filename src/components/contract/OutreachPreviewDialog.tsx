import React, { useEffect, useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";

interface OutreachPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emailContent: string;
  mappingId: string;
  onEmailSent: () => void;
  creatorEmail: string;
}

const OutreachPreviewDialog: React.FC<OutreachPreviewDialogProps> = ({
  isOpen,
  onClose,
  emailContent: initialEmailContent,
  mappingId,
  onEmailSent,
  creatorEmail,
}) => {
  const [editedContent, setEditedContent] = useState(initialEmailContent);
  const [receiverEmail, setReceiverEmail] = useState(
    creatorEmail || "gammagang100x@gmail.com"
  );
  const [isSending, setIsSending] = useState(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedContent(initialEmailContent);
  }, [initialEmailContent]);

  // Auto-resize effect for body textarea
  useEffect(() => {
    if (bodyTextareaRef.current) {
      bodyTextareaRef.current.style.height = "auto";
      bodyTextareaRef.current.style.height =
        bodyTextareaRef.current.scrollHeight + "px";
    }
  }, [editedContent]);

  const sendOutreachMutation = useMutation({
    mutationFn: async () => {
      const [subject, ...bodyLines] = editedContent.split("\n\n");
      return await campaignCreatorAPI.sendOutreach(mappingId, {
        subject,
        body: bodyLines.join("\n\n"),
        receiverEmail,
      });
    },
    onSuccess: () => {
      toast.success("Outreach email sent successfully!");
      onEmailSent();
      onClose();
    },
    onError: (error: unknown) => {
      toast.error("Failed to send outreach email. Please try again.");
      console.error("Error sending outreach:", error);
    },
    onSettled: () => {
      setIsSending(false);
    },
  });

  const handleSend = () => {
    setIsSending(true);
    sendOutreachMutation.mutate();
  };

  // Prevent background scroll when dialog is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="max-w-2xl w-full rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] p-0 relative">
        {/* X Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center bg-white border-2 border-gray-200 shadow-[2px_2px_0px_0px_#000] rounded-full hover:bg-orange-50 hover:shadow-[3px_3px_0px_0px_#000] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800 mb-1">
            Outreach Email Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Receiver Email Input */}
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Receiver Email
              </label>
              <input
                type="email"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl font-mono text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter recipient email..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Subject
              </label>
              <Textarea
                value={editedContent.split("\n\n")[0]}
                onChange={(e) => {
                  const [_, ...bodyLines] = editedContent.split("\n\n");
                  setEditedContent(
                    `${e.target.value}\n\n${bodyLines.join("\n\n")}`
                  );
                }}
                className="min-h-[50px] font-mono text-sm rounded-xl border-2 border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-gray-700">
                Body
              </label>
              <Textarea
                value={editedContent.split("\n\n").slice(1).join("\n\n")}
                onChange={(e) => {
                  const subject = editedContent.split("\n\n")[0];
                  setEditedContent(`${subject}\n\n${e.target.value}`);
                }}
                className="font-mono text-sm rounded-xl border-2 border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                ref={bodyTextareaRef}
                style={{ overflowY: "hidden" }}
                placeholder="Email body..."
              />
            </div>
          </div>
        </CardContent>
        {/* Actions Row */}
        <div className="flex justify-end gap-3 px-8 pb-8 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSending}
            className="rounded-xl border-2 border-gray-200 bg-white/80 hover:bg-orange-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl shadow-[3px_3px_0px_0px_#000] text-white px-6 py-2 text-base font-semibold"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OutreachPreviewDialog;

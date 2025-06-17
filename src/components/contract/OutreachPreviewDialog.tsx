import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  ); // New state for receiver email
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setEditedContent(initialEmailContent);
  }, [initialEmailContent]);

  const sendOutreachMutation = useMutation({
    mutationFn: async () => {
      const [subject, ...bodyLines] = editedContent.split("\n\n");
      return await campaignCreatorAPI.sendOutreach(mappingId, {
        subject,
        body: bodyLines.join("\n\n"),
        receiverEmail, // Pass the receiverEmail along to the API
      });
    },
    onSuccess: () => {
      toast.success("Outreach email sent successfully!");
      // Only call onEmailSent to update the state when email is actually sent
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Outreach Email Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {/* New Receiver Email Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Receiver Email
            </label>
            <input
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono text-sm"
              placeholder="Enter recipient email..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Subject</label>
            <Textarea
              value={editedContent.split("\n\n")[0]}
              onChange={(e) => {
                const [_, ...bodyLines] = editedContent.split("\n\n");
                setEditedContent(
                  `${e.target.value}\n\n${bodyLines.join("\n\n")}`
                );
              }}
              className="min-h-[50px] font-mono text-sm"
              placeholder="Email subject..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Body</label>
            <Textarea
              value={editedContent.split("\n\n").slice(1).join("\n\n")}
              onChange={(e) => {
                const subject = editedContent.split("\n\n")[0];
                setEditedContent(`${subject}\n\n${e.target.value}`);
              }}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Email body..."
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => {
              // Just close the dialog without updating any state
              onClose();
            }}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutreachPreviewDialog;

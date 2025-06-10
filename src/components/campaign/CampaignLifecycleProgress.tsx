import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle, Send } from "lucide-react";
import ContractDialog from "@/components/ContractDialog";
import ContractSigningDialog from "@/components/ContractSigningDialog";
import {
  CampaignCreatorMapping,
  campaignCreatorAPI,
  OutreachPreviewResponse,
} from "@/services/campaignCreatorApi";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ContractData {
  campaignName: string;
  creatorName: string;
  agreedBudget: string;
  deliverables: string;
  timeline: string;
  additionalTerms: string;
}

interface CampaignLifecycleProgressProps {
  mappingData: CampaignCreatorMapping;
  campaignId: string | undefined;
  creatorId: string | undefined;
  mappingId: string | undefined;
}

interface EmailContent {
  subject: string;
  body: string;
}

const OutreachPreviewDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  emailContent: string;
  mappingId: string;
  onEmailSent: () => void;
}> = ({
  isOpen,
  onClose,
  emailContent: initialEmailContent,
  mappingId,
  onEmailSent,
}) => {
  const [editedContent, setEditedContent] = useState(initialEmailContent);
  const [receiverEmail, setReceiverEmail] = useState("gammagang100x@gmail.com"); // New state for receiver email
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
          <Button variant="outline" onClick={onClose} disabled={isSending}>
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

const CampaignLifecycleProgress: React.FC<CampaignLifecycleProgressProps> = ({
  mappingData,
  campaignId,
  creatorId,
  mappingId,
}) => {
  const navigate = useNavigate();
  const [showOutreachPreview, setShowOutreachPreview] = useState(false);
  const [outreachEmailContent, setOutreachEmailContent] = useState("");

  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null as ContractData | null,
  });

  const sendOutreachMutation = useMutation({
    mutationFn: () => campaignCreatorAPI.getOutreachPreview(mappingId!),
    onSuccess: (response: OutreachPreviewResponse) => {
      setCreatorState((prev) => ({
        ...prev,
        outreachSent: true,
        currentStage: "outreached",
      }));
      setOutreachEmailContent(
        `${response.data.subject}\n\n${response.data.body}`
      );
      setShowOutreachPreview(true);
    },
    onError: (error: unknown) => {
      console.error("Error sending outreach:", error);
    },
  });

  useEffect(() => {
    if (mappingData) {
      setCreatorState({
        currentStage: mappingData.campaign_creator_current_state,
        outreachSent:
          mappingData.campaign_creator_current_state !== "discovered",
        contractGenerated: false,
        contractSent: [
          "waiting for signature",
          "onboarded",
          "fulfilled",
        ].includes(mappingData.campaign_creator_current_state),
        contractSigned: ["onboarded", "fulfilled"].includes(
          mappingData.campaign_creator_current_state
        ),
        contractData: null,
      });
    }
  }, [mappingData]);

  const lifecycleStages = [
    { key: "discovered", label: "Discovered" },
    { key: "outreached", label: "Outreached" },
    { key: "call complete", label: "Call Complete" },
    { key: "waiting for contract", label: "Waiting for Contract" },
    { key: "waiting for signature", label: "Waiting for Signature" },
    { key: "fulfilled", label: "Fulfilled" },
  ];

  // Determine active state for call complete's three actions
  let callCompleteAction: "generate" | "send" | "view" = "generate";
  if (creatorState.currentStage === "call complete") {
    if (creatorState.contractGenerated) {
      callCompleteAction = creatorState.contractSent ? "view" : "send";
    }
  }

  const handlePreviewOutreach = () => {
    if (!mappingId) return;
    sendOutreachMutation.mutate();
  };

  const handleSendContract = () => {
    setCreatorState((prev) => ({
      ...prev,
      contractSent: true,
      currentStage: "waiting for signature",
    }));
  };

  const handleContractSigned = () => {
    setCreatorState((prev) => ({
      ...prev,
      contractSigned: true,
      currentStage: "onboarded",
    }));
  };

  const handleEmailSent = () => {
    setCreatorState((prev) => ({
      ...prev,
      outreachSent: true,
      currentStage: "outreached",
    }));
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="mb-2">Campaign Lifecycle Progress</CardTitle>
            <div className="text-sm text-gray-600">
              Current stage:{" "}
              <span className="ml-2 inline-block">
                <Badge>{creatorState.currentStage}</Badge>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-8">
            {lifecycleStages.map((stage, index) => (
              <div key={stage.key} className="flex flex-col">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium 
                      ${
                        creatorState.currentStage === stage.key
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-lg">{stage.label}</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {stage.key === "discovered" && (
                    <Button
                      size="sm"
                      onClick={handlePreviewOutreach}
                      disabled={creatorState.currentStage !== "discovered"}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Preview Outreach E-mail
                    </Button>
                  )}
                  {stage.key === "outreached" && (
                    <Button size="sm" disabled className="cursor-not-allowed">
                      Negotiation underway
                    </Button>
                  )}
                  {stage.key === "call complete" && (
                    <>
                      <ContractDialog
                        trigger={
                          <Button
                            size="sm"
                            disabled={
                              creatorState.currentStage !== "call complete" ||
                              callCompleteAction !== "generate"
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Generate Contract
                          </Button>
                        }
                        creatorName={mappingData.creator_name || ""}
                        campaignName={mappingData.campaign_name || ""}
                        onContractGenerated={(data: ContractData) => {
                          setCreatorState((prev) => ({
                            ...prev,
                            contractGenerated: true,
                            contractData: data,
                          }));
                        }}
                      />
                      <Button
                        size="sm"
                        disabled={
                          creatorState.currentStage !== "call complete" ||
                          callCompleteAction !== "send"
                        }
                        onClick={handleSendContract}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Send Contract
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          creatorState.currentStage !== "call complete" ||
                          callCompleteAction !== "view"
                        }
                        className="border border-gray-400 cursor-not-allowed"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        View Contract
                      </Button>
                    </>
                  )}
                  {stage.key === "waiting for contract" && (
                    <Button size="sm" disabled className="cursor-not-allowed">
                      No Action
                    </Button>
                  )}
                  {stage.key === "waiting for signature" && (
                    <ContractSigningDialog
                      trigger={
                        <Button
                          size="sm"
                          disabled={
                            creatorState.currentStage !==
                            "waiting for signature"
                          }
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          E-Sign Contract
                        </Button>
                      }
                      contractData={creatorState.contractData}
                      onContractSigned={handleContractSigned}
                    />
                  )}
                  {stage.key === "fulfilled" && (
                    <Button size="sm" disabled className="cursor-not-allowed">
                      No Action
                    </Button>
                  )}
                </div>
                {index < lifecycleStages.length - 1 && (
                  <div className="ml-4 border-l-2 border-dashed border-gray-300 h-8"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <OutreachPreviewDialog
        isOpen={showOutreachPreview}
        onClose={() => setShowOutreachPreview(false)}
        emailContent={outreachEmailContent}
        mappingId={mappingId!}
        onEmailSent={handleEmailSent}
      />
    </div>
  );
};

export default CampaignLifecycleProgress;

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

const CampaignLifecycleProgress: React.FC<CampaignLifecycleProgressProps> = ({
  mappingData,
  campaignId,
  creatorId,
  mappingId,
}) => {
  const navigate = useNavigate();
  const [showOutreachPreview, setShowOutreachPreview] = useState(false);
  const [outreachEmailContent, setOutreachEmailContent] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null as ContractData | null,
  });

  const refreshMappingData = () => {
    if (mappingId) {
      setIsUpdatingState(true);
      fetchMappingData.mutate();
    }
  };

  const sendOutreachMutation = useMutation({
    mutationFn: () => campaignCreatorAPI.getOutreachPreview(mappingId!),
    onSuccess: (response: OutreachPreviewResponse) => {
      // Only set the email content and show the preview dialog
      // Don't change the state yet - it will be changed only after email is actually sent
      setOutreachEmailContent(
        `${response.data.subject}\n\n${response.data.body}`
      );
      setShowOutreachPreview(true);
      setIsUpdatingState(false); // Reset loading state
    },
    onError: (error: unknown) => {
      toast.error("Failed to generate outreach email preview.");
      console.error("Error generating outreach preview:", error);
      setIsUpdatingState(false); // Reset loading state on error
    },
  });

  // Function to fetch the latest mapping data
  const fetchMappingData = useMutation({
    mutationFn: async () => {
      if (!mappingId) throw new Error("Mapping ID is required");
      return await campaignCreatorAPI.getCampaignCreatorMapping(mappingId);
    },
    onSuccess: (response) => {
      // Update the parent component with the latest mapping data
      // This will trigger a re-render with the latest state
      if (response?.data) {
        setCreatorState((prev) => ({
          ...prev,
          currentStage: response.data.campaign_creator_current_state,
          outreachSent: response.data.campaign_creator_current_state !== "discovered",
          contractSent: [
            "waiting for signature",
            "onboarded",
            "fulfilled",
          ].includes(response.data.campaign_creator_current_state),
          contractSigned: ["onboarded", "fulfilled"].includes(
            response.data.campaign_creator_current_state
          ),
        }));
        
        // Only show toast when manually refreshing, not on initial load
        if (isUpdatingState) {
          toast.success("Data refreshed successfully");
        }
      }
    },
    onError: (error: unknown) => {
      toast.error("Failed to refresh data. Please try again.");
      console.error("Error refreshing mapping data:", error);
    },
    onSettled: () => {
      setIsUpdatingState(false);
    }
  });

  // Refresh mapping data when component mounts
  useEffect(() => {
    if (mappingId) {
      // Only call this once when component mounts
      fetchMappingData.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappingId]);

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
    setIsUpdatingState(true);
    sendOutreachMutation.mutate();
  };

  // Update campaign creator state mutation
  const updateCampaignCreatorStateMutation = useMutation({
    mutationFn: async (newState: string) => {
      if (!mappingId) throw new Error("Mapping ID is required");
      return await campaignCreatorAPI.updateCampaignCreatorState(mappingId, newState);
    },
    onSuccess: () => {
      // Refresh mapping data to get the latest state
      fetchMappingData.mutate();
      toast.success("Campaign status updated successfully");
      // Reset loading state
      setIsUpdatingState(false);
    },
    onError: (error: unknown) => {
      toast.error("Failed to update campaign state. Please try again.");
      console.error("Error updating campaign state:", error);
      // Reset loading state
      setIsUpdatingState(false);
    },
  });

  const handleSendContract = () => {
    // Show loading state
    setIsUpdatingState(true);
    // Update the state to "waiting for signature" when sending contract
    updateCampaignCreatorStateMutation.mutate("waiting for signature");
  };

  const handleContractSigned = () => {
    // Show loading state
    setIsUpdatingState(true);
    // Update the state to "onboarded" when contract is signed
    updateCampaignCreatorStateMutation.mutate("onboarded");
  };

  const handleEmailSent = () => {
    // Show loading state
    setIsUpdatingState(true);
    // Update the state to "outreached" when email is sent successfully
    updateCampaignCreatorStateMutation.mutate("outreached");
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {(updateCampaignCreatorStateMutation.isPending || isUpdatingState) && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
            <p className="text-gray-700 font-medium">Updating campaign status...</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={refreshMappingData}
          disabled={fetchMappingData.isPending || isUpdatingState}
        >
          {fetchMappingData.isPending || isUpdatingState ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              Refreshing...
            </span>
          ) : (
            "Refresh"
          )}
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
                      disabled={creatorState.currentStage !== "discovered" || sendOutreachMutation.isPending || isUpdatingState}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {sendOutreachMutation.isPending || isUpdatingState ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                          Loading...
                        </span>
                      ) : (
                        <>
                          <Mail className="w-3 h-3 mr-1" />
                          Preview Outreach E-mail
                        </>
                      )}
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
                          // Only update the local state when contract is actually generated
                          // This doesn't change the backend state yet
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
                          callCompleteAction !== "send" ||
                          updateCampaignCreatorStateMutation.isPending ||
                          isUpdatingState
                        }
                        onClick={handleSendContract}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {updateCampaignCreatorStateMutation.isPending || isUpdatingState ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                            Sending...
                          </span>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            Send Contract
                          </>
                        )}
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
                      trigger={                          <Button
                          size="sm"
                          disabled={
                            creatorState.currentStage !== "waiting for signature" ||
                            updateCampaignCreatorStateMutation.isPending ||
                            isUpdatingState
                          }
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {updateCampaignCreatorStateMutation.isPending || isUpdatingState ? (
                            <span className="flex items-center">
                              <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                              Processing...
                            </span>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              E-Sign Contract
                            </>
                          )}
                        </Button>
                      }
                      contractData={creatorState.contractData}
                      // This will call handleContractSigned which uses the API to update state
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

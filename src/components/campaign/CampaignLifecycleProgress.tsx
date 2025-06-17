import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusTag from "@/components/StatusTag";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle, Send, ExternalLink } from "lucide-react";
import ContractDialog from "@/components/contract/ContractDialog";
import ContractSigningDialog from "@/components/ContractSigningDialog";
import {
  CampaignCreatorMapping,
  campaignCreatorAPI,
  OutreachPreviewResponse,
  Contract,
  DocusealSubmission,
  Submitter,
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

// Contract View Dialog component
const ContractViewDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
}> = ({ isOpen, onClose, contract }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying text:", error);
        toast.error("Failed to copy link");
      });
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contract Details</DialogTitle>
        </DialogHeader>
        {contract ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-green-100 text-green-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium">
                Contract {contract.status === "sent" ? "Sent" : contract.status}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Sent on{" "}
                {formatDate(
                  contract.sent_at instanceof Date
                    ? contract.sent_at.toString()
                    : String(contract.sent_at)
                )}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Contract Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Contract ID</p>
                    <p className="font-medium">{contract.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium capitalize">{contract.status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recipients</h4>
                <div className="divide-y">
                  {contract.meta?.docusealSubmission?.submitters?.map(
                    (submitter: Submitter, index: number) => (
                      <div key={index} className="py-3 text-sm">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{submitter.name}</p>
                              <p className="text-gray-500">{submitter.email}</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs font-medium uppercase px-2 py-1 rounded bg-gray-100">
                                {submitter.role}
                              </span>
                              {submitter.completed_at ? (
                                <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                  Signed
                                </span>
                              ) : (
                                <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                  {submitter.status}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">
                              Signing Link:
                            </p>
                            <div className="flex items-center">
                              <a
                                href={submitter.embed_src}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 break-all text-sm flex items-center mr-2 flex-1"
                              >
                                {submitter.embed_src}
                                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                              </a>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-shrink-0 h-7 px-2"
                                onClick={() =>
                                  copyToClipboard(submitter.embed_src)
                                }
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>No contract data available.</p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
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
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [outreachEmailContent, setOutreachEmailContent] = useState("");
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null as ContractData | null,
    contract: null as Contract | null,
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
          outreachSent:
            response.data.campaign_creator_current_state !== "discovered",
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
    },
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
        contractGenerated: mappingData.contract !== null,
        contractSent: [
          "waiting for signature",
          "onboarded",
          "fulfilled",
        ].includes(mappingData.campaign_creator_current_state),
        contractSigned: ["onboarded", "fulfilled"].includes(
          mappingData.campaign_creator_current_state
        ),
        contractData: mappingData.contract
          ? {
              campaignName: mappingData.campaign_name,
              creatorName: mappingData.creator_name,
              agreedBudget: String(mappingData.assigned_budget || 0),
              deliverables:
                mappingData.campaign_meta?.contentDeliverables || "",
              timeline: `${mappingData.campaign_start_date || ""} - ${
                mappingData.campaign_end_date || ""
              }`,
              additionalTerms: "",
            }
          : null,
        contract: mappingData.contract,
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
      return await campaignCreatorAPI.updateCampaignCreatorState(
        mappingId,
        newState
      );
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
            <p className="text-gray-700 font-medium">
              Updating campaign status...
            </p>
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
                <StatusTag status={creatorState.currentStage} />
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative flex">
            {/* Vertical dashed line (full height, behind circles) */}
            <div className="absolute left-4 top-8 bottom-10 w-px border-l-2 border-dashed border-gray-300 z-0"></div>

            <div className="flex flex-col space-y-8 z-10">
              {lifecycleStages.map((stage, index) => (
                <div key={stage.key} className="flex">
                  {/* Step circle */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium 
                      ${
                        creatorState.currentStage === stage.key
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-200 text-gray-500 border-gray-300"
                      }`}
                    style={{ zIndex: 1 }}
                  >
                    {index + 1}
                  </div>
                  {/* Content */}
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-lg">{stage.label}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {/* Action buttons go here */}
                      {stage.key === "discovered" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handlePreviewOutreach}
                          disabled={
                            creatorState.currentStage !== "discovered" ||
                            sendOutreachMutation.isPending ||
                            isUpdatingState
                          }
                          className="font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {sendOutreachMutation.isPending || isUpdatingState ? (
                            <>
                              <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                              Loading...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Preview Outreach E-mail
                            </>
                          )}
                        </Button>
                      )}
                      {stage.key === "outreached" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="opacity-60 cursor-not-allowed"
                        >
                          Negotiation underway
                        </Button>
                      )}
                      {stage.key === "call complete" && (
                        <>
                          <ContractDialog
                            mappingId={mappingId}
                            trigger={
                              <Button
                                size="sm"
                                variant="default"
                                disabled={
                                  creatorState.currentStage !==
                                    "call complete" ||
                                  callCompleteAction !== "generate"
                                }
                                className="font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <FileText className="w-4 h-4 mr-2" />
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
                        </>
                      )}
                      {stage.key === "waiting for contract" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="opacity-60 cursor-not-allowed"
                        >
                          No Action
                        </Button>
                      )}
                      {stage.key === "waiting for signature" && (
                        <>
                          <ContractSigningDialog
                            trigger={
                              <Button
                                size="sm"
                                variant="default"
                                disabled={
                                  creatorState.currentStage !==
                                    "waiting for signature" ||
                                  updateCampaignCreatorStateMutation.isPending ||
                                  isUpdatingState
                                }
                                className="font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                {updateCampaignCreatorStateMutation.isPending ||
                                isUpdatingState ? (
                                  <>
                                    <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    E-Sign Contract
                                  </>
                                )}
                              </Button>
                            }
                            contractData={creatorState.contractData}
                            onContractSigned={handleContractSigned}
                          />

                          {creatorState.contract && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowContractDetails(true)}
                              className="border-blue-400 text-blue-600 hover:bg-blue-50"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Contract
                            </Button>
                          )}
                        </>
                      )}
                      {stage.key === "fulfilled" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="opacity-60 cursor-not-allowed"
                        >
                          No Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      <ContractViewDialog
        isOpen={showContractDetails}
        onClose={() => setShowContractDetails(false)}
        contract={creatorState.contract}
      />
    </div>
  );
};

export default CampaignLifecycleProgress;

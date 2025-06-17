import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusTag from "@/components/StatusTag";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle } from "lucide-react";
import ContractDialog from "@/components/contract/ContractDialog";
import OutreachPreviewDialog from "@/components/contract/OutreachPreviewDialog";
import ContractViewDialog from "@/components/contract/ContractViewDialog";
import {
  CampaignCreatorMapping,
  campaignCreatorAPI,
  OutreachPreviewResponse,
  Contract,
} from "@/services/campaignCreatorApi";
import { useMutation } from "@tanstack/react-query";
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

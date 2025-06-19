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
          contractGenerated: response.data.contract !== null,
          contractSent: [
            "waiting for signature",
            "onboarded",
            "fulfilled",
          ].includes(response.data.campaign_creator_current_state),
          contractSigned: ["onboarded", "fulfilled"].includes(
            response.data.campaign_creator_current_state
          ),
          contract: response.data.contract,
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
    { key: "waiting for signature", label: "Waiting for Signature" },
    { key: "signatures complete", label: "Signatures Complete" },
    { key: "fulfilled", label: "Fulfilled" },
  ];

  // Determine active state for call complete's three actions
  let callCompleteAction: "generate" | "send" | "view" = "generate";
  if (creatorState.currentStage === "call complete") {
    if (creatorState.contract) {
      callCompleteAction = "view";
    } else if (creatorState.contractGenerated) {
      callCompleteAction = "send";
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
          className="bg-white/80 border border-gray-300 text-gray-700 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-100 transition-all duration-200"
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

      <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
        <CardHeader>
          <div>
            <CardTitle className="text-xl font-bold text-gray-800 mb-2">
              Campaign Lifecycle Progress
            </CardTitle>
            <div className="text-base text-gray-500">
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
                          className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                        >
                          {sendOutreachMutation.isPending || isUpdatingState ? (
                            <>
                              <span className="animate-spin mr-2 w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
                              Loading...
                            </>
                          ) : (
                            <>Preview Outreach E-mail</>
                          )}
                        </Button>
                      )}
                      {stage.key === "outreached" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 rounded-xl px-4 py-2 text-sm font-semibold"
                        >
                          Negotiation underway
                        </Button>
                      )}
                      {stage.key === "call complete" && (
                        <>
                          <ContractDialog
                            mappingId={mappingId}
                            deliverables={
                              mappingData.campaign_creator_meta?.campaignInfo
                                ?.contentDeliverables ||
                              mappingData.campaign_meta?.contentDeliverables ||
                              ""
                            }
                            trigger={
                              <Button
                                size="sm"
                                variant="default"
                                disabled={
                                  creatorState.currentStage !==
                                    "call complete" ||
                                  callCompleteAction !== "generate"
                                }
                                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                              >
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
                            onContractSent={(contract: Contract) => {
                              // Update local state with new contract data
                              setCreatorState((prev) => ({
                                ...prev,
                                contractGenerated: true,
                                contractSent: true,
                                contract: contract,
                              }));

                              // Update campaign creator state to "waiting for signature"
                              setIsUpdatingState(true);
                              updateCampaignCreatorStateMutation.mutate(
                                "waiting for signature"
                              );

                              // Refresh mapping data to get the latest state
                              refreshMappingData();
                            }}
                          />

                          {/* Show View Contract button when contract is available */}
                          {creatorState.contract && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowContractDetails(true)}
                              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                            >
                              View Contract
                            </Button>
                          )}
                        </>
                      )}
                     
                      {stage.key === "waiting for signature" && (
                        <>
                          {creatorState.contract?.status ===
                          "submission.completed" ? (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center text-green-600 font-medium">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Contract signed by both parties
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowContractDetails(true)}
                                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                              >
                                View Contract
                              </Button>
                            </div>
                          ) : creatorState.contract?.pdf_url ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                window.open(
                                  creatorState.contract?.pdf_url,
                                  "_blank"
                                )
                              }
                              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-4 py-2 text-sm font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                            >
                              Sign Contract
                            </Button>
                          ) : null}
                        </>
                      )}
                      {stage.key === "fulfilled" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 rounded-xl px-4 py-2 text-sm font-semibold"
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
        creatorEmail={mappingData.creator_email || ""}
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

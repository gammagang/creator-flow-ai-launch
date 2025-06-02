import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, FileText, CheckCircle } from "lucide-react";
import ContractDialog from "@/components/ContractDialog";
import ContractSigningDialog from "@/components/ContractSigningDialog";
import { CampaignCreatorMapping } from "@/services/campaignCreatorApi";

interface CampaignLifecycleProgressProps {
  mappingData: CampaignCreatorMapping;
  campaignId: string | undefined;
  creatorId: string | undefined;
  mappingId: string | undefined;
}

const CampaignLifecycleProgress: React.FC<CampaignLifecycleProgressProps> = ({
  mappingData,
  campaignId,
  creatorId,
  mappingId,
}) => {
  const navigate = useNavigate();

  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null,
  });

  useEffect(() => {
    if (mappingData) {
      setCreatorState({
        currentStage: mappingData.campaign_creator_current_state,
        outreachSent: mappingData.campaign_creator_current_state !== "discovered",
        contractGenerated: false,
        contractSent: ["waiting for signature", "onboarded", "fulfilled"].includes(
          mappingData.campaign_creator_current_state
        ),
        contractSigned: ["onboarded", "fulfilled"].includes(mappingData.campaign_creator_current_state),
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

  // Determine active state for call complete’s three actions
  let callCompleteAction: "generate" | "send" | "view" = "generate";
  if (creatorState.currentStage === "call complete") {
    if (creatorState.contractGenerated) {
      callCompleteAction = creatorState.contractSent ? "view" : "send";
    }
  }

  const handleSendOutreach = () => {
    navigate(`/agent-call?campaign=${campaignId}&creator=${creatorId}&action=outreach`);
    setCreatorState((prev) => ({
      ...prev,
      outreachSent: true,
      currentStage: "outreached",
    }));
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Lifecycle Progress</CardTitle>
        <div className="text-sm text-gray-600">
          Current stage:{" "}
          <span className="ml-2 inline-block">
            <Badge>{creatorState.currentStage}</Badge>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-8">
          {lifecycleStages.map((stage, index) => (
            <div key={stage.key} className="flex flex-col">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium 
                    ${creatorState.currentStage === stage.key ? "bg-green-500 text-white border-green-500" : "bg-gray-200 text-gray-500 border-gray-300"}`}
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
                    onClick={handleSendOutreach}
                    disabled={creatorState.currentStage !== "discovered"}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Send Outreach E-mail
                  </Button>
                )}
                {stage.key === "outreached" && (
                  <Button size="sm" disabled className="cursor-not-allowed">
                    No Action
                  </Button>
                )}
                {stage.key === "call complete" && (
                  <>
                    <ContractDialog
                      trigger={
                        <Button
                          size="sm"
                          disabled={creatorState.currentStage !== "call complete" || callCompleteAction !== "generate"}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Generate Contract
                        </Button>
                      }
                      creatorName={mappingData.creator_name || ""}
                      campaignName={mappingData.campaign_name || ""}
                      onContractGenerated={(data: any) => {
                        setCreatorState((prev) => ({
                          ...prev,
                          contractGenerated: true,
                          contractData: data,
                        }));
                      }}
                    />
                    <Button
                      size="sm"
                      disabled={creatorState.currentStage !== "call complete" || callCompleteAction !== "send"}
                      onClick={handleSendContract}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Send Contract
                    </Button>
                    <Button
                      size="sm"
                      disabled={creatorState.currentStage !== "call complete" || callCompleteAction !== "view"}
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
                        disabled={creatorState.currentStage !== "waiting for signature"}
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
  );
};

export default CampaignLifecycleProgress;

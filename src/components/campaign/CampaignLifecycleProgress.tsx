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

  // Local state derived from mappingData
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

  const currentStageIndex = lifecycleStages.findIndex(
    (stage) => stage.key === creatorState.currentStage
  );

  const getStageColor = (index: number) => {
    if (index <= currentStageIndex) {
      return "bg-green-500 text-white border-green-500";
    }
    return "bg-gray-200 text-gray-500 border-gray-300";
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStageIndex) {
      return "bg-green-500";
    }
    return "bg-gray-300";
  };

  const handleSendOutreach = () => {
    navigate(
      `/agent-call?campaign=${campaignId}&creator=${creatorId}&action=outreach`
    );
    setCreatorState((prev) => ({
      ...prev,
      outreachSent: true,
      currentStage: "outreached",
    }));
  };

  const handleContractGenerated = (contractData: any) => {
    setCreatorState((prev) => ({
      ...prev,
      contractGenerated: true,
      contractData,
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

  const getStageActions = (stage: any, index: number) => {
    const actions = [];

    // Stage 1: Discovered
    if (
      stage.key === "discovered" &&
      currentStageIndex === 0 &&
      !creatorState.outreachSent
    ) {
      actions.push(
        <Button
          key="outreach"
          size="sm"
          onClick={handleSendOutreach}
          className="ml-4 bg-blue-600 hover:bg-blue-700"
        >
          <Mail className="w-3 h-3 mr-1" />
          Send Outreach E-mail
        </Button>
      );
    }

    // Stage 3: Call Complete
    if (stage.key === "call complete" && currentStageIndex === 3) {
      if (!creatorState.contractGenerated) {
        actions.push(
          <ContractDialog
            key="generate-contract"
            trigger={
              <Button
                size="sm"
                className="ml-4 bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-3 h-3 mr-1" />
                Generate Contract
              </Button>
            }
            creatorName={mappingData.creator_name || ""}
            campaignName={mappingData.campaign_name || ""}
            onContractGenerated={handleContractGenerated}
          />
        );
      } else if (!creatorState.contractSent) {
        actions.push(
          <Button
            key="send-contract"
            size="sm"
            onClick={handleSendContract}
            className="ml-4 bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="w-3 h-3 mr-1" />
            Send Contract
          </Button>
        );
      } else {
        actions.push(
          <Button
            key="view-contract"
            size="sm"
            variant="outline"
            className="ml-4"
          >
            <FileText className="w-3 h-3 mr-1" />
            View Contract
          </Button>
        );
      }
    }

    // Stage 5: Waiting for Signature
    if (
      stage.key === "waiting for signature" &&
      currentStageIndex === 5 &&
      !creatorState.contractSigned
    ) {
      actions.push(
        <ContractSigningDialog
          key="sign-contract"
          trigger={
            <Button
              size="sm"
              className="ml-4 bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              E-Sign Contract
            </Button>
          }
          contractData={creatorState.contractData}
          onContractSigned={handleContractSigned}
        />
      );
    }

    return actions;
  };

  const getStageMessage = (stage: any) => {
    if (stage.key === "discovered" && creatorState.outreachSent) {
      return <span className="text-green-600 text-sm ml-4">Outreach sent</span>;
    }
    if (stage.key === "call complete" && creatorState.contractSent) {
      return (
        <span className="text-green-600 text-sm ml-4">Contract sent!</span>
      );
    }
    return null;
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
        <div className="flex flex-col space-y-4">
          {lifecycleStages.map((stage, index) => (
            <div key={stage.key} className="flex items-center relative">
              <div className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${getStageColor(
                    index
                  )}`}
                >
                  {index + 1}
                </div>
                <div className="ml-4 flex-1">
                  <div
                    className={`font-medium ${
                      index <= currentStageIndex
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.label}
                  </div>
                  {getStageMessage(stage)}
                </div>
                <div className="flex items-center gap-2">
                  {getStageActions(stage, index)}
                </div>
              </div>
              {index < lifecycleStages.length - 1 && (
                <div className="absolute left-4 mt-8 ml-0.5">
                  <div
                    className={`w-0.5 h-6 ${getConnectorColor(index)}`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignLifecycleProgress;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  Heart,
  MessageCircle,
  Eye,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";
import ContractDialog from "@/components/ContractDialog";
import ContractSigningDialog from "@/components/ContractSigningDialog";
import {
  campaignCreatorAPI,
  CampaignCreatorMapping,
} from "@/services/campaignCreatorApi";

const CampaignCreatorMappingDetails = () => {
  const { campaignId, creatorId, mappingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mappingData, setMappingData] = useState<CampaignCreatorMapping | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lifecycle state management for the creator
  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null,
  });

  // Fetch mapping data from API using mappingId
  useEffect(() => {
    if (!mappingId) return;
    const fetchMapping = async () => {
      try {
        setLoading(true);
        const response = await campaignCreatorAPI.getCampaignCreatorMapping(
          mappingId
        );
        // Note: the API response shape is { data: CampaignCreatorMapping }
        setMappingData(response.data);
      } catch (err: any) {
        console.error("Error fetching mapping data:", err);
        setError("Failed to fetch creator mapping details");
      } finally {
        setLoading(false);
      }
    };

    fetchMapping();
  }, [mappingId]);

  // Once mappingData is available, initialize creatorState based on the current stage
  useEffect(() => {
    if (mappingData) {
      setCreatorState((prev) => ({
        ...prev,
        currentStage: mappingData.campaign_creator_current_state,
        outreachSent:
          mappingData.campaign_creator_current_state !== "discovered",
        contractSent: [
          "waiting for signature",
          "onboarded",
          "fulfilled",
        ].includes(mappingData.campaign_creator_current_state),
        contractSigned: ["onboarded", "fulfilled"].includes(
          mappingData.campaign_creator_current_state
        ),
      }));
    }
  }, [mappingData]);

  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/creator-management")) return "creator-management";
    if (path.includes("/content-management")) return "content-management";
    if (path.includes("/analytics")) return "analytics";
    return "overview";
  };

  const handleTabChange = (value: string) => {
    const basePath = `/campaigns/${campaignId}/creators/${creatorId}`;
    switch (value) {
      case "overview":
        navigate(basePath);
        break;
      case "creator-management":
        navigate(`${basePath}/creator-management`);
        break;
      case "content-management":
        navigate(`${basePath}/content-management`);
        break;
      case "analytics":
        navigate(`${basePath}/analytics`);
        break;
      default:
        navigate(basePath);
    }
  };

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

    // Stage 4: Call Complete
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
            creatorName={mappingData?.creator_name || ""}
            campaignName={mappingData?.campaign_name || ""}
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

    // Stage 6: Waiting for Signature
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading creator details...</p>
        </div>
      </div>
    );
  }

  if (error || !mappingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600">{error || "Creator details not found"}</p>
          <Button
            variant="outline"
            onClick={() => navigate(`/campaigns/${campaignId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/campaigns/${campaignId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mappingData.creator_name}
          </h1>
          <p className="text-gray-600">
            {mappingData.creator_platform} Creator
          </p>
        </div>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mappingData.creator_meta.followersCount || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Total followers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Likes</CardTitle>
            <Heart className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mappingData.creator_meta.averageViews ||
                mappingData.creator_meta.postsCount ||
                "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Comments</CardTitle>
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <Eye className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mappingData.creator_engagement_rate
                ? `${(+mappingData.creator_engagement_rate * 100).toFixed(1)}%`
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="creator-management">
                Creator Management
              </TabsTrigger>
              <TabsTrigger value="content-management">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {getActiveTab() === "overview" && (
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
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default CampaignCreatorMappingDetails;

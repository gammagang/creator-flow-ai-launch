import CampaignLifecycleProgress from "@/components/campaign/CampaignLifecycleProgress";
import ContentDeliverablesCard from "@/components/campaign/ContentDeliverablesCard";
import StatusTag from "@/components/StatusTag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  campaignCreatorAPI,
  CampaignCreatorMapping,
} from "@/services/campaignCreatorApi";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

interface Stage {
  key: string;
  label: string;
}

interface ContractData {
  id: string;
  content: string;
  status: string;
}

const CampaignCreatorMappingDetails = () => {
  const { campaignId, creatorId, mappingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [mappingData, setMappingData] = useState<CampaignCreatorMapping | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [contentDeliverables, setContentDeliverables] = useState("");

  // Lifecycle state management for the creator
  const [creatorState, setCreatorState] = useState({
    currentStage: "",
    outreachSent: false,
    contractGenerated: false,
    contractSent: false,
    contractSigned: false,
    contractData: null as ContractData | null,
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
        setMappingData(response.data);
      } catch (err: unknown) {
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

  // Initialize contentDeliverables from mappingData
  useEffect(() => {
    if (mappingData) {
      const deliverables = (mappingData.campaign_creator_meta
        ?.contentDeliverables ||
        mappingData.campaign_meta?.contentDeliverables ||
        "") as string;
      setContentDeliverables(deliverables);
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

  const handleContractGenerated = (contractData: ContractData) => {
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

  // Refresh mapping data from API
  const refreshMappingData = async () => {
    if (!mappingId) return;
    try {
      setLoading(true);
      const response = await campaignCreatorAPI.getCampaignCreatorMapping(
        mappingId
      );
      setMappingData(response.data);
      toast.success("Data refreshed successfully");
    } catch (err: unknown) {
      console.error("Error refreshing mapping data:", err);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  // Delete creator from campaign mutation
  const deleteCreatorMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return await campaignCreatorAPI.deleteCampaignCreatorLink(linkId);
    },
    onSuccess: () => {
      toast.success("Creator removed from campaign successfully");
      // Navigate back to campaign page
      navigate(`/campaigns/${campaignId}`);
    },
    onError: (error: unknown) => {
      console.error("Error removing creator:", error);
      toast.error("Failed to remove creator from campaign");
    },
  });
  const handleRemoveCreator = () => {
    if (!mappingId) return;
    deleteCreatorMutation.mutate(mappingId);
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
      {" "}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/campaigns/${campaignId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {mappingData.creator_name}
              </h1>
              <StatusTag status={mappingData.campaign_creator_current_state} />
            </div>
            <p className="text-gray-600">
              {mappingData.creator_platform} Creator
            </p>
          </div>
        </div>
        {/* Remove Creator Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={deleteCreatorMutation.isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleteCreatorMutation.isPending
                ? "Removing..."
                : "Remove Creator"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Creator from Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove{" "}
                <strong>{mappingData.creator_name}</strong> from this campaign?
                This action cannot be undone and will permanently delete all
                associated data including outreach history, contracts, and
                payments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveCreator}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Creator
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
          <>
            {/* Content Deliverables Card */}
            <ContentDeliverablesCard
              mappingId={mappingId}
              initialContentDeliverables={contentDeliverables}
              onDeliverablesUpdated={refreshMappingData}
            />

            {/* Campaign Lifecycle Progress */}
            <CampaignLifecycleProgress
              mappingData={mappingData}
              campaignId={campaignId}
              creatorId={creatorId}
              mappingId={mappingId}
            />
          </>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default CampaignCreatorMappingDetails;

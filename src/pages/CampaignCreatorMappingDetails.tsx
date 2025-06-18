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
      const deliverables = (mappingData.campaign_creator_meta?.campaignInfo
        ?.contentDeliverables ||
        mappingData.campaign_meta?.contentDeliverables ||
        "") as string;
      setContentDeliverables(deliverables);
    }
  }, [mappingData]);

  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/negotiation-transcription"))
      return "negotiation-transcription";
    return "overview";
  };
  const handleTabChange = (value: string) => {
    const basePath = `/dashboard/campaigns/${campaignId}/creators/${creatorId}/mapping/${mappingId}`;
    switch (value) {
      case "overview":
        navigate(basePath);
        break;
      case "negotiation-transcription":
        navigate(`${basePath}/negotiation-transcription`);
        break;
      default:
        navigate(basePath);
    }
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
      navigate(`/dashboard/campaigns/${campaignId}`);
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
      <div className="flex items-center justify-center py-12 min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading creator details...</p>
        </div>
      </div>
    );
  }

  if (error || !mappingData) {
    return (
      <div className="flex items-center justify-center py-12 min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-600">{error || "Creator details not found"}</p>{" "}
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/campaigns/${campaignId}`)}
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/campaigns/${campaignId}`)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-4 py-2 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                  {mappingData.creator_name}
                </h1>
                <StatusTag
                  status={mappingData.campaign_creator_current_state}
                />
              </div>
              <p className="text-gray-600 text-lg font-medium">
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
                className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-6 py-2 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                {deleteCreatorMutation.isPending
                  ? "Removing..."
                  : "Remove Creator"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Remove Creator from Campaign
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{" "}
                  <strong>{mappingData.creator_name}</strong> from this
                  campaign? This action cannot be undone and will permanently
                  delete all associated data including outreach history,
                  contracts, and payments.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-base font-semibold text-gray-700">
                Followers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mappingData.creator_meta.followersCount || "N/A"}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Total followers
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-base font-semibold text-gray-700">
                Avg Likes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mappingData.creator_meta.averageViews ||
                  mappingData.creator_meta.postsCount ||
                  "N/A"}
              </div>
              <p className="text-sm text-gray-500 font-medium">Per post</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-base font-semibold text-gray-700">
                Avg Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">N/A</div>
              <p className="text-sm text-gray-500 font-medium">Per post</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-base font-semibold text-gray-700">
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {mappingData.creator_engagement_rate
                  ? `${(+mappingData.creator_engagement_rate * 100).toFixed(
                      1
                    )}%`
                  : "N/A"}
              </div>
              <p className="text-sm text-gray-500 font-medium">Overall rate</p>
            </CardContent>
          </Card>
        </div>
        {/* Navigation Tabs */}
        <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="negotiation-transcription">
                  Negotiation Transcription
                </TabsTrigger>
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
    </div>
  );
};

export default CampaignCreatorMappingDetails;

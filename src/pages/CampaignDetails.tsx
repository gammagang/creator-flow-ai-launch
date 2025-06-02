import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import CampaignStats from "@/components/campaign/CampaignStats";
import CreatorManagement from "@/pages/CreatorManagement";
import CampaignOverview from "@/components/campaign/CampaignOverview";
import CampaignAnalytics from "@/components/campaign/CampaignAnalytics";
import { campaignAPI } from "@/services/campaignApi";
import { toast } from "sonner";
import CampaignContent from "@/components/campaign/CampaignContent";

// Define the campaign type based on what the components expect
interface CampaignData {
  id: number;
  name: string;
  status: string;
  budget: string;
  spent: string;
  creatorsContacted: number;
  creatorsResponded: number;
  contractsSigned: number;
  contentDelivered: number;
  startDate: string;
  endDate: string;
  progress: number;
}

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State for campaign data
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get active tab from URL path or default to 'overview'
  const pathname = location.pathname;
  let activeTab = "overview";

  if (pathname.includes("/creators")) {
    activeTab = "creators";
  } else if (pathname.includes("/content")) {
    activeTab = "content";
  } else if (pathname.includes("/analytics")) {
    activeTab = "analytics";
  } else if (pathname.includes("/overview")) {
    activeTab = "overview";
  }

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await campaignAPI.getCampaign(id);

        // Transform API response to match component expectations
        const campaignData = response.data;

        const transformedCampaign: CampaignData = {
          id: parseInt(campaignData.id),
          name: campaignData.name,
          status: campaignData.state,
          budget: campaignData.meta.budget.total || "$0",
          spent: "$0", // This would need to come from a separate API endpoint
          creatorsContacted: 0, // These metrics would need to come from separate API endpoints
          creatorsResponded: 0,
          contractsSigned: 0,
          contentDelivered: 0,
          startDate: campaignData.start_date,
          endDate: campaignData.end_date,
          progress: 0, // This would need to be calculated or come from separate API
        };

        setCampaign(transformedCampaign);
      } catch (err: unknown) {
        console.error("Error fetching campaign:", err);
        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message || "Failed to fetch campaign data"
            : "Failed to fetch campaign data";
        setError(errorMessage);
        toast.error("Failed to load campaign data");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const getLifecycleStageColor = (stage: string) => {
    switch (stage) {
      case "discovered":
        return "bg-gray-100 text-gray-800";
      case "outreached":
        return "bg-blue-100 text-blue-800";
      case "call initiated":
        return "bg-yellow-100 text-yellow-800";
      case "call complete":
        return "bg-orange-100 text-orange-800";
      case "waiting for contract":
        return "bg-purple-100 text-purple-800";
      case "waiting for signature":
        return "bg-pink-100 text-pink-800";
      case "onboarded":
        return "bg-green-100 text-green-800";
      case "fulfilled":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading campaign data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      )}

      {campaign && !loading && !error && (
        <>
          <CampaignHeader campaign={campaign} getStatusColor={getStatusColor} />

          <CampaignProgress progress={campaign.progress} />

          <CampaignStats campaign={campaign} />

          <Tabs
            value={activeTab}
            className="space-y-4"
            onValueChange={(value) => {
              navigate(`/campaigns/${id}/${value}`, { replace: true });
            }}
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="creators">Creators</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <CampaignOverview campaign={campaign} />
            </TabsContent>

            <TabsContent value="creators">
              <CreatorManagement campaignId={campaign.id} />
            </TabsContent>

            <TabsContent value="content">
              <CampaignContent />
            </TabsContent>

            <TabsContent value="analytics">
              <CampaignAnalytics />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default CampaignDetails;

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import CampaignStats from "@/components/campaign/CampaignStats";
import CampaignOverview from "@/components/campaign/CampaignOverview";
import CampaignCreators from "@/components/campaign/CampaignCreators";
import CampaignContent from "@/components/campaign/CampaignContent";
import CampaignAnalytics from "@/components/campaign/CampaignAnalytics";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the active tab from URL or default to 'overview'
  const activeTab = location.hash.replace("#", "") || "overview";

  // TODO: Replace with real campaign data based on ID
  const campaigns = [
    {
      id: 1,
      name: "Summer Launch 2024",
      status: "active",
      budget: "$15,000",
      spent: "$8,200",
      creatorsContacted: 24,
      creatorsResponded: 16,
      contractsSigned: 12,
      contentDelivered: 8,
      startDate: "2024-06-01",
      endDate: "2024-07-31",
      progress: 65,
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "draft",
      budget: "$8,500",
      spent: "$0",
      creatorsContacted: 0,
      creatorsResponded: 0,
      contractsSigned: 0,
      contentDelivered: 0,
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      progress: 0,
    },
    {
      id: 3,
      name: "Holiday Collection",
      status: "completed",
      budget: "$22,000",
      spent: "$22,000",
      creatorsContacted: 35,
      creatorsResponded: 28,
      contractsSigned: 25,
      contentDelivered: 25,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      progress: 100,
    },
  ];

  // Find the campaign based on the ID parameter
  const campaign =
    campaigns.find((c) => c.id === parseInt(id || "1")) || campaigns[0];

  // TODO: Fetch creators data for this specific campaign
  const allCampaignCreators = {
    1: [
      {
        id: 1,
        creatorName: "Sarah Johnson",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "fulfilled",
      },
      {
        id: 2,
        creatorName: "Mike Chen",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "onboarded",
      },
      {
        id: 3,
        creatorName: "Emma Davis",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "waiting for signature",
      },
      {
        id: 4,
        creatorName: "Alex Rodriguez",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "call complete",
      },
      {
        id: 5,
        creatorName: "Lisa Thompson",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "outreached",
      },
      {
        id: 6,
        creatorName: "David Kim",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "discovered",
      },
    ],
    2: [
      {
        id: 7,
        creatorName: "Jessica Martinez",
        campaignName: "Back to School Campaign",
        lifecycleStage: "discovered",
      },
      {
        id: 8,
        creatorName: "Ryan Lee",
        campaignName: "Back to School Campaign",
        lifecycleStage: "discovered",
      },
    ],
    3: [
      {
        id: 9,
        creatorName: "Amanda White",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 10,
        creatorName: "Chris Brown",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 11,
        creatorName: "Taylor Swift",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 12,
        creatorName: "John Doe",
        campaignName: "Holiday Collection",
        lifecycleStage: "onboarded",
      },
    ],
  };

  const creatorsInCampaign = allCampaignCreators[parseInt(id || "1")] || [];

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
      <CampaignHeader campaign={campaign} getStatusColor={getStatusColor} />

      <CampaignProgress progress={campaign.progress} />

      <CampaignStats campaign={campaign} />

      <Tabs
        value={activeTab}
        className="space-y-4"
        onValueChange={(value) => {
          navigate(`#${value}`, { replace: true });
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
          <CampaignCreators
            creators={creatorsInCampaign}
            campaignId={id || "1"}
            getLifecycleStageColor={getLifecycleStageColor}
          />
        </TabsContent>

        <TabsContent value="content">
          <CampaignContent />
        </TabsContent>

        <TabsContent value="analytics">
          <CampaignAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetails;

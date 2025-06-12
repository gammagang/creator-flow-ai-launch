import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  IndianRupee,
  Info,
  User,
  Hash,
  MapPin,
  BarChart,
} from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AGENT_ID = import.meta.env.VITE_AGENT_ID;

const AgentCall = () => {
  const [searchParams] = useSearchParams();
  const campaignCreatorId = searchParams.get("id");

  const {
    data: campaignCreatorData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["campaignCreatorDetails", campaignCreatorId],
    queryFn: async () => {
      if (!campaignCreatorId) throw new Error("Link ID is required");
      const response = await campaignCreatorAPI.getCampaignCreatorDetails(
        campaignCreatorId
      );
      return response.data;
    },
    enabled: !!campaignCreatorId,
  });

  useEffect(() => {
    // Only load the widget if currentState is "discovered"
    if (
      !campaignCreatorData ||
      campaignCreatorData.campaignCreator.currentState !== "outreached"
    ) {
      return;
    }

    // Load the widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [campaignCreatorData]);

  const RenderStatusBadge = (status: string) => {
    const statusConfig = {
      discovered: { label: "Discovered", color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
      accepted: { label: "Accepted", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", color: "bg-purple-100 text-purple-800" },
    };

    const config = statusConfig[status.toLowerCase()] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };

    return <Badge className={`${config.color}`}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-600">
          Error loading campaign details
        </div>
      </div>
    );
  }

  if (!campaignCreatorData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">No campaign data found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Agent Call</h1>
        <p className="text-muted-foreground mt-2">
          Campaign details for agent call
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Creator Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Creator Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-lg">
                  {campaignCreatorData.creator.name}
                </p>
                <p className="text-sm text-gray-500">
                  {campaignCreatorData.creator.platform}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Hash className="w-4 h-4" />
                  <span>Category</span>
                </div>
                <p className="font-medium">
                  {campaignCreatorData.creator.category}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <BarChart className="w-4 h-4" />
                  <span>Engagement</span>
                </div>
                <p className="font-medium">
                  {campaignCreatorData.creator.engagementRate}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">
                  {campaignCreatorData.creator.location || "Not specified"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Info className="w-4 h-4" />
                  <span>Tier</span>
                </div>
                <p className="font-medium">
                  {campaignCreatorData.creator.tier}
                </p>
              </div>
            </div>

            {typeof campaignCreatorData.creator.meta?.handle === "string" && (
              <div className="text-sm">
                <span className="text-gray-500">Handle: </span>
                <span className="font-medium">
                  @{campaignCreatorData.creator.meta.handle as string}
                </span>
              </div>
            )}

            {typeof campaignCreatorData.creator.meta?.followersCount ===
              "number" && (
              <div className="text-sm">
                <span className="text-gray-500">Followers: </span>
                <span className="font-medium">
                  {new Intl.NumberFormat().format(
                    campaignCreatorData.creator.meta.followersCount as number
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  {campaignCreatorData.campaign.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                {RenderStatusBadge(
                  campaignCreatorData.campaignCreator.currentState
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700">
                {campaignCreatorData.campaign.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <IndianRupee className="w-4 h-4" />
                  <span>Budget</span>
                </div>
                <p className="font-medium text-lg">
                  ₹{campaignCreatorData.campaignCreator.assignedBudget || "TBD"}
                </p>
              </div>
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Timeline</span>
              </div>
              <p className="text-gray-700">
                {new Date(
                  campaignCreatorData.campaign.startDate
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  campaignCreatorData.campaign.endDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Deliverables</p>
              <div className="flex flex-wrap gap-2">
                {campaignCreatorData.campaignCreator.contentDeliverables}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaignCreatorData.campaignCreator.currentState === "outreached" && (
        <Card>
          <CardContent className="pt-6">
            <elevenlabs-convai
              agent-id={AGENT_ID}
              dynamic-variables={JSON.stringify({
                campaign_creator_id: campaignCreatorId,
                campaign_name: campaignCreatorData.campaign.name,
                creator_name: campaignCreatorData.creator.name,
                budget: campaignCreatorData.campaignCreator.assignedBudget,
                deliverables:
                  campaignCreatorData.campaignCreator.contentDeliverables,
                timeline: `${new Date(
                  campaignCreatorData.campaign.startDate
                ).toLocaleDateString()} - ${new Date(
                  campaignCreatorData.campaign.endDate
                ).toLocaleDateString()}`,
              })}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentCall;

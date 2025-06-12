import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import { useQuery } from "@tanstack/react-query";
import { Calendar, IndianRupee, Info } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AGENT_ID = import.meta.env.VITE_AGENT_ID;

const AgentCall = () => {
  const [searchParams] = useSearchParams();
  const campaignCreatorId = searchParams.get("id");

  const {
    data: campaignData,
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
      !campaignData ||
      campaignData.campaignCreator.currentState !== "outreached"
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
  }, [campaignData]);

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

  if (!campaignData) {
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">
                {campaignData.campaign.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              {RenderStatusBadge(campaignData.campaignCreator.currentState)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <p className="text-gray-700 text-lg">
              {campaignData.campaign.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <IndianRupee className="w-4 h-4" />
                <span>Budget</span>
              </div>
              <p className="font-medium text-lg">
                ₹{campaignData.campaignCreator.assignedBudget || "TBD"}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Timeline</span>
            </div>
            <p className="text-gray-700 text-lg">
              {new Date(campaignData.campaign.startDate).toLocaleDateString()} -{" "}
              {new Date(campaignData.campaign.endDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Deliverables</p>
            <div className="flex flex-wrap gap-2">
              {campaignData.campaignCreator.contentDeliverables}
            </div>
          </div>

          {campaignData.campaignCreator.currentState === "discovered" && (
            <div className="mt-6">
              <elevenlabs-convai
                agent-id={AGENT_ID}
                dynamic-variables={JSON.stringify({
                  campaign_creator_id: campaignCreatorId,
                  campaign_name: campaignData.campaign.name,
                  budget: campaignData.campaignCreator.assignedBudget,
                  deliverables:
                    campaignData.campaignCreator.contentDeliverables,
                  timeline: `${new Date(
                    campaignData.campaign.startDate
                  ).toLocaleDateString()} - ${new Date(
                    campaignData.campaign.endDate
                  ).toLocaleDateString()}`,
                })}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCall;

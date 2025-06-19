import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusTag from "@/components/StatusTag";
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
  Loader2,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const AGENT_ID = import.meta.env.VITE_AGENT_ID;
console.log(" AGENT_ID:", AGENT_ID);

const AgentCall = () => {
  const [searchParams] = useSearchParams();
  const campaignCreatorId = searchParams.get("id");
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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
  console.log(" campaignCreatorData:", campaignCreatorData);

  useEffect(() => {
    if (
      !campaignCreatorData ||
      campaignCreatorData.campaignCreator.currentState !== "outreached" ||
      scriptRef.current
    ) {
      return;
    }

    const loadScript = () => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => {
        console.log("ElevenLabs widget script loaded successfully");
      };
      script.onerror = (error) => {
        console.error("Error loading ElevenLabs widget script:", error);
      };
      scriptRef.current = script;
      document.head.appendChild(script);
    };

    // Check if the script is already loaded
    if (!document.querySelector('script[src*="convai-widget-embed"]')) {
      loadScript();
    }

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [campaignCreatorData]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex items-center gap-2 text-orange-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-red-600 font-medium">
          Error loading campaign details
        </div>
      </div>
    );
  }

  if (!campaignCreatorData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-gray-600 font-medium">No campaign data found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Agent Call
        </h1>
        <p className="text-gray-500 mt-2">Campaign details for agent call</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Creator Info Card */}
        <Card className="border-0 shadow-[0_2px_8px_0_rgba(251,191,36,0.10)] backdrop-blur-xl bg-white/90 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Creator Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {campaignCreatorData.creator.name}
                </p>
                <p className="text-sm text-gray-500">
                  {campaignCreatorData.creator.platform}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <span>Category</span>
                </div>
                <p className="font-medium text-gray-800">
                  {campaignCreatorData.creator.category}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BarChart className="w-4 h-4 text-orange-400" />
                  <span>Engagement</span>
                </div>
                <p className="font-medium text-gray-800">
                  {campaignCreatorData.creator.engagementRate}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Location</span>
                </div>
                <p className="font-medium text-gray-800">
                  {campaignCreatorData.creator.location || "Not specified"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Info className="w-4 h-4 text-orange-400" />
                  <span>Tier</span>
                </div>
                <p className="font-medium text-gray-800">
                  {campaignCreatorData.creator.tier}
                </p>
              </div>
            </div>

            {typeof campaignCreatorData.creator.meta?.handle === "string" && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <span className="text-gray-600">Handle: </span>
                <span className="font-medium text-gray-800">
                  @{campaignCreatorData.creator.meta.handle as string}
                </span>
              </div>
            )}

            {typeof campaignCreatorData.creator.meta?.followersCount ===
              "number" && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <span className="text-gray-600">Followers: </span>
                <span className="font-medium text-gray-800">
                  {new Intl.NumberFormat().format(
                    campaignCreatorData.creator.meta.followersCount as number
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Info Card */}
        <Card className="border-0 shadow-[0_2px_8px_0_rgba(251,191,36,0.10)] backdrop-blur-xl bg-white/90 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {campaignCreatorData.campaign.name}
                </CardTitle>
              </div>
              <StatusTag
                status={campaignCreatorData.campaignCreator.currentState}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-800">
                {campaignCreatorData.campaign.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <IndianRupee className="w-4 h-4 text-orange-400" />
                <span>Budget</span>
              </div>
              <p className="font-semibold text-lg text-gray-800">
                ₹{campaignCreatorData.campaignCreator.assignedBudget || "TBD"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>Timeline</span>
              </div>
              <p className="text-gray-800">
                {new Date(
                  campaignCreatorData.campaign.startDate
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  campaignCreatorData.campaign.endDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-pink-50">
              <p className="text-sm text-gray-600 mb-2">Deliverables</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(
                  campaignCreatorData.campaignCreator.contentDeliverables
                ) ? (
                  campaignCreatorData.campaignCreator.contentDeliverables.map(
                    (deliverable, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium"
                      >
                        {deliverable}
                      </span>
                    )
                  )
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium">
                    {campaignCreatorData.campaignCreator.contentDeliverables}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaignCreatorData.campaignCreator.currentState === "outreached" && (
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
      )}
    </div>
  );
};

export default AgentCall;

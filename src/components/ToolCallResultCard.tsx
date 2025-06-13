import CreatorCard from "@/components/CreatorCard";
import { Card, CardContent } from "@/components/ui/card";
import type { DiscoveredCreator } from "@/services/creatorApi";
import type { Campaign, ToolCallResult } from "@/types/shared";

interface ToolCallResultCardProps {
  toolCall: ToolCallResult;
}

const ToolCallResultCard: React.FC<ToolCallResultCardProps> = ({
  toolCall,
}) => {
  const { functionName, result } = toolCall;

  // Compact card styles
  const cardClass =
    "border border-blue-200 bg-white shadow-sm rounded-md max-w-md text-sm";
  const headerClass =
    "flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100 rounded-t-md";
  const badgeClass =
    "bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide";
  const titleClass = "text-xs font-bold text-blue-800 mr-2";

  if (!result.success) {
    return (
      <Card className={cardClass + " border-red-300"}>
        <div className={headerClass + " bg-red-50 border-red-100"}>
          <span className={badgeClass + " bg-red-100 text-red-700"}>
            Tool Call
          </span>
          <span className={titleClass + " text-red-800"}>{functionName}</span>
        </div>
        <CardContent className="py-2 px-3">
          <div className="text-red-700 font-mono text-xs">
            {result.error || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom rendering for known tool calls
  if (
    functionName === "create_campaign" &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    "campaign" in result.data &&
    typeof (result.data as { campaign?: unknown }).campaign === "object" &&
    (result.data as { campaign?: unknown }).campaign !== null
  ) {
    const campaign = (result.data as { campaign: Campaign }).campaign;
    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        <CardContent className="py-2 px-3">
          <div className="space-y-1">
            <div className="font-semibold text-base">{campaign.name}</div>
            <div className="text-xs text-gray-600">{campaign.description}</div>
            <div className="text-xs text-gray-500">
              {campaign.startDate && campaign.endDate && (
                <span>
                  {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                  {new Date(campaign.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-700">
              Deliverables: {campaign.deliverables?.join(", ") || "-"}
            </div>
            <div className="text-xs text-gray-700">
              Status: <span className="font-medium">{campaign.status}</span>
            </div>
            <div className="text-xs text-gray-400">ID: {campaign.id}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  // Custom rendering for discover_creators tool call
  if (
    functionName === "discover_creators" &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    "creators" in result.data &&
    Array.isArray((result.data as { creators?: unknown }).creators)
  ) {
    const discoverData = result.data as {
      creators: DiscoveredCreator[];
      total: number;
      searchParams?: {
        limit?: number;
        skip?: number;
        connector?: string;
      };
    };
    const { creators } = discoverData;

    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>{" "}
        <CardContent className="py-2 px-3">
          {creators.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {creators.map((creator) => (
                <div key={creator.id} className="transform scale-90 origin-top">
                  <CreatorCard creator={creator} onAddToCampaign={() => {}} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">
              No creators found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Custom rendering for list_campaigns tool call
  if (
    functionName === "list_campaigns" &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    "campaigns" in result.data &&
    Array.isArray((result.data as { campaigns?: unknown }).campaigns)
  ) {
    const campaigns = (result.data as { campaigns: Campaign[] }).campaigns;
    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        <CardContent className="py-2 px-3">
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border-b last:border-b-0 pb-2 mb-2 last:pb-0 last:mb-0"
              >
                <div className="font-semibold text-base">{campaign.name}</div>
                <div className="text-xs text-gray-600">
                  {campaign.description}
                </div>
                <div className="text-xs text-gray-500">
                  {campaign.startDate && campaign.endDate && (
                    <span>
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-700">
                  Deliverables: {campaign.deliverables?.join(", ") || "-"}
                </div>
                <div className="text-xs text-gray-700">
                  Status: <span className="font-medium">{campaign.status}</span>
                </div>
                {campaign.totalBudget !== undefined &&
                  campaign.totalBudget !== null && (
                    <div className="text-xs text-gray-700">
                      Budget:{" "}
                      <span className="font-medium">
                        ${campaign.totalBudget}
                      </span>
                    </div>
                  )}
                <div className="text-xs text-gray-400">ID: {campaign.id}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom rendering for add_creators_to_campaign tool call
  if (functionName === "add_creators_to_campaign") {
    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        {/* No card content for this tool call */}
      </Card>
    );
  }

  // Fallback: generic display
  return (
    <Card className={cardClass}>
      <div className={headerClass}>
        <span className={badgeClass}>Tool Call</span>
        <span className={titleClass}>{functionName}</span>
      </div>
      <CardContent className="py-2 px-3">
        <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

export default ToolCallResultCard;

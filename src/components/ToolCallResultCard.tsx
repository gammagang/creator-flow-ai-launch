import DiscoverCreatorCard from "@/components/DiscoverCreatorCard";
import CampaignCard from "@/components/campaign/CampaignCard";
import StatusTag from "@/components/StatusTag";
import { Card, CardContent } from "@/components/ui/card";
import type { DiscoveredCreator } from "@/services/creatorApi";
import type {
  Campaign,
  CampaignCreatorDetailsResult,
  ToolCallResult,
} from "@/types/shared";

// Type for bulk outreach tool result
interface BulkOutreachResult {
  templatePreview?: boolean;
  campaignName?: string;
  eligibleCreatorsCount?: number;
  sampleEmail?: {
    subject: string;
    body: string;
  };
  eligibleCreators?: Array<{
    id: string;
    name: string;
    handle: string;
    currentState: string;
  }>;
}

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

  // Sustainable approach: Check for explicit step type
  const isIntermediaryStep =
    result.success &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    (result.data as { stepType?: string }).stepType === "intermediary";

  // Show minimal card for intermediary steps
  if (isIntermediaryStep) {
    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        {/* No card content for intermediary steps */}
      </Card>
    );
  }

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
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {creators.map((creator) => (
                <DiscoverCreatorCard
                  key={creator.id}
                  creator={creator}
                  onViewProfile={() => {
                    // TODO: Implement view profile functionality
                    console.log("View profile for creator:", creator.id);
                  }}
                />
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
              <CampaignCard key={campaign.id} campaign={campaign} />
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
  // Custom rendering for delete_campaign tool call
  if (functionName === "delete_campaign") {
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
  // Custom rendering for bulk_outreach tool call
  if (functionName === "bulk_outreach") {
    const bulkData = result.data as BulkOutreachResult;

    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        {bulkData && (
          <CardContent className="py-2 px-3">
            {bulkData.templatePreview && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    Email Template Preview
                  </h4>
                  {bulkData.sampleEmail && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div>
                        <span className="font-medium text-xs text-gray-600">
                          Subject:
                        </span>
                        <div className="text-sm">
                          {bulkData.sampleEmail.subject}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-xs text-gray-600">
                          Message:
                        </span>
                        <div className="text-sm whitespace-pre-line">
                          {bulkData.sampleEmail.body}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {bulkData.eligibleCreators && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Eligible Creators ({bulkData.eligibleCreatorsCount})
                    </h4>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  }

  // Custom rendering for get_campaign_creator_details tool call
  if (
    functionName === "get_campaign_creator_details" &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    "creators" in result.data &&
    Array.isArray((result.data as { creators?: unknown }).creators)
  ) {
    const detailsData = result.data as CampaignCreatorDetailsResult;
    const { creators, campaignName, statusSummary, lastUpdated } = detailsData;

    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        <CardContent className="py-2 px-3">
          <div className="mb-2">
            <div className="font-semibold text-base">{campaignName}</div>
            {statusSummary && (
              <div className="text-xs text-gray-500 mb-1">
                {Object.entries(statusSummary).map(([status, count]) => (
                  <span key={status} className="mr-2">
                    <span className="font-medium">{count}</span> {status}
                  </span>
                ))}
              </div>
            )}
            {lastUpdated && (
              <div className="text-xs text-gray-400">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
          {creators.length > 0 ? (
            <div className="space-y-2">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-2 border-b last:border-b-0 py-1"
                >
                  <span className="font-medium text-blue-900">
                    {creator.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{creator.handle}
                  </span>
                  <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                    {creator.currentState}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">
              No creators found for this campaign.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Custom rendering for smart_campaign_status tool call (multiple campaigns)
  if (
    functionName === "smart_campaign_status" &&
    result.data &&
    typeof result.data === "object" &&
    result.data !== null &&
    (result.data as { type?: string }).type === "multiple_campaigns" &&
    Array.isArray((result.data as { campaigns?: Campaign[] }).campaigns)
  ) {
    type MultipleCampaignsResult = {
      type: "multiple_campaigns";
      message: string;
      campaigns: Campaign[];
      totalCampaigns: number;
    };
    const { message, campaigns, totalCampaigns } =
      result.data as MultipleCampaignsResult;
    return (
      <Card className={cardClass}>
        <div className={headerClass}>
          <span className={badgeClass}>Tool Call</span>
          <span className={titleClass}>{functionName}</span>
        </div>
        <CardContent className="py-2 px-3">
          <div className="mb-2 text-sm text-blue-900 font-semibold">
            {message}
          </div>
          <div className="mb-2 text-xs text-gray-500">
            Total campaigns: {totalCampaigns}
          </div>
          <div className="space-y-3">
            {campaigns.map((campaign: Campaign) => (
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
              </div>
            ))}
          </div>
        </CardContent>
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

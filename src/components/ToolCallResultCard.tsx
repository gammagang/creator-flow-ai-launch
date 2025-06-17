import { Card, CardContent } from "@/components/ui/card";
import CampaignCard from "@/components/campaign/CampaignCard";
import type { ToolCallResult, Campaign } from "@/types/shared";
import type { DiscoveredCreator } from "@/services/creatorApi";

interface ToolCallResultCardProps {
  toolCall: ToolCallResult;
}

// Simple, focused component - under 100 lines total
export const ToolCallResultCard: React.FC<ToolCallResultCardProps> = ({
  toolCall,
}) => {
  const { functionName, result } = toolCall;

  // Handle intermediary steps (no UI needed)
  if (
    result.data &&
    typeof result.data === "object" &&
    "stepType" in result.data
  ) {
    return null;
  }

  // Handle errors
  if (!result.success) {
    return (
      <Card className="border-red-300 bg-red-50 max-w-md">
        <CardContent className="p-3">
          <div className="text-red-700 text-sm font-medium">
            {result.error || "Unknown error"}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Common card wrapper
  const CardWrapper = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <Card className="border-blue-200 bg-white shadow-sm rounded-md max-w-md">
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100">
        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded uppercase">
          {title}
        </span>
      </div>
      <CardContent className="p-3">{children}</CardContent>
    </Card>
  );
  // Handle specific tool results
  switch (functionName) {
    case "list_campaigns": {
      const campaigns =
        (result.data as { campaigns: Campaign[] })?.campaigns || [];
      return (
        <CardWrapper title="Campaigns">
          <div className="space-y-2">
            {campaigns.map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </CardWrapper>
      );
    }
    case "create_campaign": {
      const campaign = (result.data as { campaign: Campaign })?.campaign;
      if (!campaign) return null;

      return (
        <CardWrapper title="Campaign Created">
          <div className="space-y-1">
            <div className="font-semibold">{campaign.name}</div>
            <div className="text-sm text-gray-600">{campaign.description}</div>
            <div className="text-xs text-gray-500">
              Status: {campaign.status}
            </div>
          </div>
        </CardWrapper>
      );
    }

    case "create_campaign_from_website": {
      const data = result.data as {
        extractedInfo?: {
          companyName?: string;
          productDescription?: string;
          targetAudience?: string;
          campaignGoals?: string[];
        };
        missingRequiredFields?: string[];
        canCreateCampaign?: boolean;
        campaign?: {
          id: number;
          name: string;
          description: string;
          startDate: string;
          endDate: string;
          deliverables: string[];
          status: string;
        };
      };

      // Campaign successfully created
      if (data?.campaign) {
        return (
          <CardWrapper title="Campaign Created from Website">
            <div className="space-y-2">
              <div className="font-semibold">{data.campaign.name}</div>
              <div className="text-sm text-gray-600">
                {data.campaign.description}
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Status: {data.campaign.status}</div>
                <div>
                  Start:{" "}
                  {new Date(data.campaign.startDate).toLocaleDateString()}
                </div>
                <div>
                  End: {new Date(data.campaign.endDate).toLocaleDateString()}
                </div>
              </div>
              {data.campaign.deliverables &&
                data.campaign.deliverables.length > 0 && (
                  <div className="text-xs">
                    <div className="font-medium text-gray-700">
                      Deliverables:
                    </div>
                    <ul className="list-disc list-inside text-gray-600">
                      {data.campaign.deliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </CardWrapper>
        );
      }

      // Website analyzed but needs more info
      if (data?.extractedInfo) {
        return (
          <CardWrapper title="Website Analysis">
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-700">
                Website analyzed successfully!
              </div>

              {/* Show extracted info */}
              <div className="space-y-1 text-xs">
                {data.extractedInfo.companyName && (
                  <div>
                    <span className="font-medium">Company:</span>{" "}
                    {data.extractedInfo.companyName}
                  </div>
                )}
                {data.extractedInfo.productDescription && (
                  <div>
                    <span className="font-medium">Product:</span>{" "}
                    {data.extractedInfo.productDescription}
                  </div>
                )}
                {data.extractedInfo.targetAudience && (
                  <div>
                    <span className="font-medium">Audience:</span>{" "}
                    {data.extractedInfo.targetAudience}
                  </div>
                )}
                {data.extractedInfo.campaignGoals &&
                  data.extractedInfo.campaignGoals.length > 0 && (
                    <div>
                      <span className="font-medium">Goals:</span>
                      <ul className="list-disc list-inside ml-2">
                        {data.extractedInfo.campaignGoals.map((goal, index) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              {/* Show missing fields */}
              {data.missingRequiredFields &&
                data.missingRequiredFields.length > 0 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-xs font-medium text-yellow-800">
                      Additional info needed:
                    </div>
                    <div className="text-xs text-yellow-700 mt-1">
                      {data.missingRequiredFields.join(", ")}
                    </div>
                  </div>
                )}
            </div>
          </CardWrapper>
        );
      }
      return null;
    }
    case "discover_creators": {
      const data = result.data as {
        creators?: Array<DiscoveredCreator & { profileUrl?: string }>;
        total?: number;
        searchParams?: {
          country?: string;
          tier?: string;
          language?: string;
          category?: string;
          er?: string;
          gender?: string;
          bio?: string;
          limit?: number;
        };
      };

      if (!data?.creators || data.creators.length === 0) {
        return (
          <CardWrapper title="Creator Discovery">
            <div className="text-sm text-gray-600">
              No creators found matching your criteria. Try adjusting your
              search parameters.
            </div>
          </CardWrapper>
        );
      }

      return (
        <CardWrapper title="Discovered Creators">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Found {data.total} creator{data.total === 1 ? "" : "s"}
            </div>

            {/* Search parameters summary */}
            {data.searchParams && (
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                <div className="font-medium mb-1">Search filters:</div>
                <div className="grid grid-cols-2 gap-1">
                  {data.searchParams.country && (
                    <div>Country: {data.searchParams.country}</div>
                  )}
                  {data.searchParams.tier && (
                    <div>Tier: {data.searchParams.tier}</div>
                  )}
                  {data.searchParams.category && (
                    <div>Category: {data.searchParams.category}</div>
                  )}
                  {data.searchParams.language && (
                    <div>Language: {data.searchParams.language}</div>
                  )}
                  {data.searchParams.gender && (
                    <div>Gender: {data.searchParams.gender}</div>
                  )}
                </div>
              </div>
            )}

            {/* Creator list */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.creators.map((creator) => (
                <div
                  key={creator.id}
                  className="p-2 border rounded-md space-y-1"
                >
                  {" "}
                  <div className="flex items-center gap-2">
                    {creator.profileImageUrl && (
                      <img
                        src={creator.profileImageUrl}
                        alt={creator.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {creator.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        @{creator.handle}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs font-medium">
                          {creator.tier}
                        </div>
                        <div className="text-xs text-gray-500">
                          {creator.followersCount >= 1000000
                            ? `${(creator.followersCount / 1000000).toFixed(
                                1
                              )}M`
                            : creator.followersCount >= 1000
                            ? `${(creator.followersCount / 1000).toFixed(1)}K`
                            : creator.followersCount}{" "}
                          followers
                        </div>
                      </div>{" "}
                      {creator.profileUrl && (
                        <button
                          onClick={() =>
                            window.open(creator.profileUrl, "_blank")
                          }
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="View Profile"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex gap-3">
                      {creator.engagement_rate && (
                        <span>
                          ER: {(creator.engagement_rate * 100).toFixed(1)}%
                        </span>
                      )}
                      {creator.category && (
                        <span className="text-gray-600">
                          {creator.category}
                        </span>
                      )}
                    </div>
                    {creator.location && (
                      <span className="text-gray-500">{creator.location}</span>
                    )}
                  </div>
                  {creator.interests && creator.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {creator.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {creator.interests.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{creator.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardWrapper>
      );
    }

    case "bulk_outreach": {
      const data = result.data as {
        templatePreview?: boolean;
        campaignName?: string;
        eligibleCreatorsCount?: number;
        sampleEmail?: {
          subject: string;
          body: string;
        };
        totalEligible?: number;
        totalSent?: number;
        successfulOutreach?: Array<{
          creatorName: string;
          status: string;
        }>;
        errors?: string[];
      };

      // Template preview case
      if (data?.templatePreview) {
        return (
          <CardWrapper title="Email Template Preview">
            <div className="space-y-3">
              <div className="font-semibold">{data.campaignName}</div>
              <div className="text-sm text-green-700">
                Ready to send to {data.eligibleCreatorsCount} eligible creator
                {data.eligibleCreatorsCount === 1 ? "" : "s"}
              </div>

              {/* Email preview */}
              <div className="p-3 bg-gray-50 border rounded-md space-y-2">
                <div className="text-xs font-medium text-gray-700">
                  Email Preview:
                </div>
                <div className="text-sm">
                  <div className="font-medium">Subject:</div>
                  <div className="text-gray-600 italic">
                    {data.sampleEmail?.subject}
                  </div>
                </div>{" "}
                <div className="text-sm">
                  <div className="font-medium mb-1">Body:</div>
                  <div className="text-gray-600 text-xs whitespace-pre-wrap">
                    {data.sampleEmail?.body}
                  </div>{" "}
                </div>
              </div>
            </div>
          </CardWrapper>
        );
      }

      // Bulk outreach results case
      if (data?.totalSent !== undefined) {
        return (
          <CardWrapper title="Bulk Outreach Results">
            <div className="space-y-3">
              <div className="font-semibold">{data.campaignName}</div>

              {/* Results summary */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">
                    Sent Successfully
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {data.totalSent}
                  </div>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800">
                    Total Eligible
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {data.totalEligible}
                  </div>
                </div>
              </div>

              {/* Success list */}
              {data.successfulOutreach &&
                data.successfulOutreach.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-700">
                      Sent to:
                    </div>{" "}
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {data.successfulOutreach.map((outreach, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs p-1 bg-green-50 border border-green-200 rounded"
                        >
                          <span className="font-medium">
                            {outreach.creatorName}
                          </span>
                          <span className="text-green-600">
                            ✓ {outreach.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Errors */}
              {data.errors && data.errors.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-red-700">
                    Errors:
                  </div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {data.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-xs p-2 bg-red-50 border border-red-200 rounded text-red-700"
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardWrapper>
        );
      }

      return null;
    }

    case "campaign_status": {
      const data = result.data as {
        type?: string;
        message?: string;
        campaigns?: Campaign[];
        campaignName?: string;
        totalCreators?: number;
        statusSummary?: Record<string, number>;
        lastUpdated?: string;
      };

      // Multiple campaigns case
      if (data?.type === "multiple_campaigns") {
        return (
          <CardWrapper title="Select Campaign">
            <div className="space-y-2">
              <div className="text-sm font-medium">{data.message}</div>
              {data.campaigns?.map((campaign: Campaign) => (
                <div key={campaign.id} className="p-2 border rounded">
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-xs text-gray-600">
                    Status: {campaign.status}
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>
        );
      } // Single campaign status
      if (data?.type === "single_campaign_status") {
        const totalCreators = data.totalCreators || 0;
        const statusSummary = data.statusSummary || {};

        return (
          <CardWrapper title="Campaign Status">
            <div className="space-y-3">
              <div className="font-semibold">{data.campaignName}</div>

              {/* Total creators summary */}
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-center">
                <div className="font-medium text-blue-800">Total Creators</div>
                <div className="text-xl font-bold text-blue-700">
                  {totalCreators}
                </div>
              </div>

              {/* Status breakdown */}
              {Object.keys(statusSummary).length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Creator Status Breakdown:
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(statusSummary).map(([status, count]) => {
                      const percentage =
                        totalCreators > 0
                          ? Math.round((count / totalCreators) * 100)
                          : 0;
                      const statusColor =
                        status === "content_delivered" ||
                        status === "payment_processed"
                          ? "green"
                          : status === "outreached" ||
                            status === "call_initiated"
                          ? "blue"
                          : status === "contract_signed"
                          ? "purple"
                          : status === "discovered"
                          ? "gray"
                          : "yellow";

                      return (
                        <div
                          key={status}
                          className={`p-2 rounded border ${
                            statusColor === "green"
                              ? "bg-green-50 border-green-200"
                              : statusColor === "blue"
                              ? "bg-blue-50 border-blue-200"
                              : statusColor === "purple"
                              ? "bg-purple-50 border-purple-200"
                              : statusColor === "gray"
                              ? "bg-gray-50 border-gray-200"
                              : "bg-yellow-50 border-yellow-200"
                          }`}
                        >
                          <div
                            className={`text-xs font-medium capitalize ${
                              statusColor === "green"
                                ? "text-green-800"
                                : statusColor === "blue"
                                ? "text-blue-800"
                                : statusColor === "purple"
                                ? "text-purple-800"
                                : statusColor === "gray"
                                ? "text-gray-800"
                                : "text-yellow-800"
                            }`}
                          >
                            {status.replace(/_/g, " ")}
                          </div>
                          <div
                            className={`font-bold ${
                              statusColor === "green"
                                ? "text-green-700"
                                : statusColor === "blue"
                                ? "text-blue-700"
                                : statusColor === "purple"
                                ? "text-purple-700"
                                : statusColor === "gray"
                                ? "text-gray-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {count} ({percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Last updated */}
              {data.lastUpdated && (
                <div className="text-xs text-gray-500 text-center">
                  Last updated:{" "}
                  {new Date(data.lastUpdated).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardWrapper>
        );
      }
      return null;
    }

    case "get_campaign_creator_details": {
      const data = result.data as {
        type?: string;
        message?: string;
        campaigns?: Campaign[];
        campaignName?: string;
        statusSummary?: Record<string, number>;
        creators?: Array<{
          id: string;
          name: string;
          handle: string;
          currentState: string;
        }>;
        totalCampaigns?: number;
      };

      // No campaigns case
      if (data?.type === "no_campaigns") {
        return (
          <CardWrapper title="No Campaigns">
            <div className="text-sm text-gray-600">{data.message}</div>
          </CardWrapper>
        );
      }

      // Multiple campaigns case
      if (data?.type === "multiple_campaigns") {
        return (
          <CardWrapper title="Select Campaign">
            <div className="space-y-2">
              <div className="text-sm font-medium">{data.message}</div>
              {data.campaigns?.map((campaign: Campaign) => (
                <div key={campaign.id} className="p-2 border rounded">
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-xs text-gray-600">
                    Status: {campaign.status}
                  </div>
                </div>
              ))}
            </div>
          </CardWrapper>
        );
      }

      // Single campaign creator details
      if (data?.type === "single_campaign_creator_details") {
        return (
          <CardWrapper title="Creator Details">
            <div className="space-y-3">
              <div className="font-semibold">{data.campaignName}</div>

              {/* Status Summary */}
              <div className="text-sm">
                <div className="font-medium text-gray-700 mb-1">
                  Status Summary:
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(data.statusSummary || {}).map(
                    ([status, count]) => (
                      <div key={status} className="flex justify-between">
                        <span className="capitalize">{status}:</span>
                        <span className="font-medium">{String(count)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Creator List */}
              {data.creators && data.creators.length > 0 && (
                <div className="space-y-2">
                  <div className="font-medium text-gray-700 text-sm">
                    Creators:
                  </div>
                  <div className="space-y-1">
                    {data.creators.map((creator) => (
                      <div
                        key={creator.id}
                        className="flex justify-between items-center p-1 border rounded text-xs"
                      >
                        <div>
                          <div className="font-medium">{creator.name}</div>
                          <div className="text-gray-500">@{creator.handle}</div>
                        </div>
                        <div className="capitalize text-right">
                          <span
                            className={`px-1 py-0.5 rounded text-xs ${
                              creator.currentState === "approved"
                                ? "bg-green-100 text-green-700"
                                : creator.currentState === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : creator.currentState === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {creator.currentState}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardWrapper>
        );
      }

      return null;
    }

    // Default case - just show the function name
    default:
      return (
        <CardWrapper title={functionName}>
          <div className="text-sm text-gray-600">
            Tool executed successfully
          </div>
        </CardWrapper>
      );
  }
};

export default ToolCallResultCard;

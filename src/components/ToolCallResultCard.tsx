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
  } // Handle errors
  if (!result.success) {
    return (
      <Card className="border border-red-300 bg-red-50/90 backdrop-blur-sm rounded-2xl max-w-md">
        {" "}
        <CardContent className="p-4">
          <div className="text-red-700 text-sm font-semibold">
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
    <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm rounded-2xl max-w-md">
      {" "}
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-pink-100 border-b border-gray-200 rounded-t-2xl">
        <div className="w-6 h-6 bg-gradient-to-br from-orange-300 to-pink-300 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">•</span>
        </div>
        <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent text-xs font-bold uppercase tracking-wide">
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
          <div className="space-y-3">
            <div className="font-bold text-lg text-gray-800">
              {campaign.name}
            </div>
            <div className="text-sm text-gray-700 font-medium leading-relaxed">
              {campaign.description}
            </div>{" "}
            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">
                Status: {campaign.status}
              </span>
            </div>
          </div>
        </CardWrapper>
      );
    }

    case "create_campaign_from_profile": {
      const data = result.data as {
        campaign?: {
          id: number;
          name: string;
          description: string;
          startDate: string;
          endDate: string;
          deliverables: string[];
          status: string;
        };
        brandInfo?: {
          companyName: string;
          description?: string;
          category?: string;
          targetAudience?: string;
        };
      };

      if (!data?.campaign) return null;
      return (
        <CardWrapper title="Campaign Created from Brand Profile">
          <div className="space-y-4">
            <div className="font-bold text-lg text-gray-800">
              {data.campaign.name}
            </div>
            <div className="text-sm text-gray-700 font-medium leading-relaxed">
              {data.campaign.description}
            </div>{" "}
            {/* Brand info */}
            {data.brandInfo && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                {" "}
                <div className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                  Created for: {data.brandInfo.companyName}
                </div>
                {data.brandInfo.category && (
                  <div className="text-sm text-blue-700 font-medium">
                    Industry: {data.brandInfo.category}
                  </div>
                )}
                {data.brandInfo.targetAudience && (
                  <div className="text-sm text-blue-700 font-medium">
                    Target: {data.brandInfo.targetAudience}
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-green-50 border border-green-200 rounded-xl text-center">
                <div className="font-bold text-green-700">Status</div>
                <div className="text-green-600">{data.campaign.status}</div>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <div className="font-bold text-blue-700">Duration</div>
                <div className="text-blue-600 text-xs">
                  {new Date(data.campaign.startDate).toLocaleDateString()} -{" "}
                  {new Date(data.campaign.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            {data.campaign.deliverables &&
              data.campaign.deliverables.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-gray-800 flex items-center gap-2">
                    Deliverables:
                  </div>
                  <div className="space-y-1">
                    {data.campaign.deliverables.map((deliverable, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                        <span className="text-sm text-gray-700 font-medium">
                          {deliverable}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <div className="space-y-4">
              <div className="font-bold text-lg text-gray-800">
                {data.campaign.name}
              </div>
              <div className="text-sm text-gray-700 font-medium leading-relaxed">
                {data.campaign.description}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-green-50 border border-green-200 rounded-xl text-center">
                  <div className="font-bold text-green-700">Status</div>
                  <div className="text-green-600">{data.campaign.status}</div>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="font-bold text-blue-700">Duration</div>
                  <div className="text-blue-600 text-xs">
                    {new Date(data.campaign.startDate).toLocaleDateString()} -{" "}
                    {new Date(data.campaign.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {data.campaign.deliverables &&
                data.campaign.deliverables.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      Deliverables:
                    </div>
                    <div className="space-y-1">
                      {data.campaign.deliverables.map((deliverable, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl"
                        >
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          <span className="text-sm text-gray-700 font-medium">
                            {deliverable}
                          </span>
                        </div>
                      ))}
                    </div>
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
            <div className="space-y-4">
              {" "}
              <div className="flex items-center gap-2 text-sm font-bold text-green-700 p-3 bg-green-50 border border-green-200 rounded-2xl">
                Website analyzed successfully!
              </div>
              {/* Show extracted info */}
              <div className="space-y-3">
                {data.extractedInfo.companyName && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-blue-600 font-bold">•</span>
                    <div>
                      <span className="font-bold text-blue-800">Company:</span>
                      <div className="text-blue-700 font-medium">
                        {data.extractedInfo.companyName}
                      </div>
                    </div>
                  </div>
                )}
                {data.extractedInfo.productDescription && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-purple-600 font-bold">•</span>
                    <div>
                      <span className="font-bold text-purple-800">
                        Product:
                      </span>
                      <div className="text-purple-700 font-medium">
                        {data.extractedInfo.productDescription}
                      </div>
                    </div>
                  </div>
                )}
                {data.extractedInfo.targetAudience && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <span className="text-orange-600 font-bold">•</span>
                    <div>
                      <span className="font-bold text-orange-800">
                        Audience:
                      </span>
                      <div className="text-orange-700 font-medium">
                        {data.extractedInfo.targetAudience}
                      </div>
                    </div>
                  </div>
                )}
                {data.extractedInfo.campaignGoals &&
                  data.extractedInfo.campaignGoals.length > 0 && (
                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span className="font-bold text-pink-800">Goals:</span>
                      </div>
                      <div className="space-y-1">
                        {data.extractedInfo.campaignGoals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                            <span className="text-pink-700 font-medium">
                              {goal}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>{" "}
              {/* Show missing fields */}
              {data.missingRequiredFields &&
                data.missingRequiredFields.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-2xl">
                    {" "}
                    <div className="flex items-center gap-2 text-sm font-bold text-yellow-800 mb-2">
                      Additional info needed:
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">
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
            {" "}
            <div className="text-center p-4">
              <div className="text-sm text-gray-600 font-medium">
                No creators found matching your criteria. Try adjusting your
                search parameters.
              </div>
            </div>
          </CardWrapper>
        );
      }
      return (
        <CardWrapper title="Discovered Creators">
          <div className="space-y-4">
            {" "}
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
              <div className="text-sm font-bold text-green-700">
                Found {data.total} creator{data.total === 1 ? "" : "s"}
              </div>
            </div>{" "}
            {/* Search parameters summary */}
            {data.searchParams && (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl">
                {" "}
                <div className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  Search filters:
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {data.searchParams.country && (
                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl">
                      <span className="text-blue-600">•</span>
                      <span className="font-medium text-gray-700">
                        Country: {data.searchParams.country}
                      </span>
                    </div>
                  )}
                  {data.searchParams.tier && (
                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl">
                      <span className="text-purple-600">•</span>
                      <span className="font-medium text-gray-700">
                        Tier: {data.searchParams.tier}
                      </span>
                    </div>
                  )}
                  {data.searchParams.category && (
                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl">
                      <span className="text-orange-600">•</span>
                      <span className="font-medium text-gray-700">
                        Category: {data.searchParams.category}
                      </span>
                    </div>
                  )}
                  {data.searchParams.language && (
                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl">
                      <span className="text-green-600">•</span>
                      <span className="font-medium text-gray-700">
                        Language: {data.searchParams.language}
                      </span>
                    </div>
                  )}
                  {data.searchParams.gender && (
                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl">
                      <span className="text-pink-600">•</span>
                      <span className="font-medium text-gray-700">
                        Gender: {data.searchParams.gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Creator list */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.creators.map((creator) => (
                <div
                  key={creator.id}
                  className="p-4 border border-gray-200 rounded-2xl bg-white/90 backdrop-blur-sm hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {" "}
                    {creator.profileImageUrl && (
                      <img
                        src={creator.profileImageUrl}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full object-cover border border-orange-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate">
                        {creator.name}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        @{creator.handle}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl">
                          <div className="text-xs font-bold text-purple-700">
                            {creator.tier}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium mt-1">
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
                          className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 hover:text-blue-800 hover:from-blue-200 hover:to-indigo-200 rounded-xl border border-blue-200 transition-all duration-200"
                          title="View Profile"
                        >
                          <svg
                            className="w-4 h-4"
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
                  <div className="flex justify-between items-center text-sm mb-2">
                    <div className="flex gap-4">
                      {creator.engagement_rate && (
                        <span className="px-2 py-1 bg-green-100 border border-green-200 rounded-lg font-medium text-green-700">
                          ER: {(creator.engagement_rate * 100).toFixed(1)}%
                        </span>
                      )}
                      {creator.category && (
                        <span className="px-2 py-1 bg-orange-100 border border-orange-200 rounded-lg font-medium text-orange-700">
                          {creator.category}
                        </span>
                      )}
                    </div>
                    {creator.location && (
                      <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-600">
                        {creator.location}
                      </span>
                    )}
                  </div>
                  {creator.interests && creator.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {creator.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border border-pink-200 rounded-lg text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {creator.interests.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-500">
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
    } // Default case - just show the function name
    default:
      return (
        <CardWrapper title={functionName}>
          <div className="text-center p-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm text-gray-600 font-medium">
              Tool executed successfully
            </div>
          </div>
        </CardWrapper>
      );
  }
};

export default ToolCallResultCard;

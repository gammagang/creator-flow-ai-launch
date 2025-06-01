import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CreatorSearchFilters from "@/components/CreatorSearchFilters";
import CreatorGrid from "@/components/CreatorGrid";
import { campaignAPI, CampaignResponse } from "@/services/campaignApi";
import {
  useAddCreatorToCampaign,
  useDiscoverCreatorsQuery,
  type DiscoveredCreator,
  type DiscoverCreatorsRequest,
} from "@/services/creatorApi";
import { useToast } from "@/hooks/use-toast";

interface DiscoverCreatorsQuery {
  country?: string[];
  tier?: string[];
  er?: string[];
  gender?: string[];
  category?: string[];
  language?: string[];
  bio?: string[];
}

const CreatorDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DiscoverCreatorsQuery>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add creator to campaign mutation
  const addCreatorToCampaignMutation = useAddCreatorToCampaign();
  // Transform filters to API format
  const apiParams: DiscoverCreatorsRequest = {
    country: filters.country?.[0], // Take first country if multiple selected
    tier: filters.tier,
    language: filters.language,
    category: filters.category,
    er: filters.er,
    gender: filters.gender,
    bio: searchQuery || undefined,
    platform: "instagram", // Default to Instagram for now
    limit: 20,
    skip: 0,
  };

  // Fetch creators using the API
  const {
    data: creatorsData,
    isLoading: isLoadingCreators,
    error: creatorsError,
  } = useDiscoverCreatorsQuery(apiParams, Object.keys(apiParams).length > 3); // Enable only if we have filters

  // Transform API creators to match CreatorGrid expected format
  const transformCreator = (creator: DiscoveredCreator) => ({
    id: parseInt(creator.id), // Convert string id to number for compatibility
    username: creator.handle.startsWith("@")
      ? creator.handle
      : `@${creator.handle}`,
    displayName: creator.name,
    followers: formatFollowerCount(creator.followersCount),
    engagement: `${(creator.engagement_rate * 100).toFixed(1)}%`,
    niche: creator.category || "General",
    avatar: creator.profileImageUrl || "/placeholder.svg",
    verified: creator.qualityScore ? creator.qualityScore > 80 : false, // Use quality score as verification indicator
    recentPosts: creator.postsCount,
    avgLikes: creator.averageViews ? formatNumber(creator.averageViews) : "N/A",
    avgComments: "N/A", // Not available in API response
  });

  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const creators = creatorsData?.creators?.map(transformCreator) || [];

  // Fetch campaigns using React Query
  const { data: campaignsData } = useQuery<CampaignResponse>({
    queryKey: ["campaigns"],
    queryFn: () => campaignAPI.getCampaigns(),
  });
  const campaigns =
    campaignsData?.data?.items.map((campaign) => ({
      id: campaign.id, // Keep as string UUID from backend
      name: campaign.name,
    })) || [];

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const parsedFilters: DiscoverCreatorsQuery = {};

    // Parse each filter parameter
    ["country", "tier", "er", "gender", "category", "language", "bio"].forEach(
      (param) => {
        const value = searchParams.get(param);
        if (value) {
          parsedFilters[param as keyof DiscoverCreatorsQuery] =
            value.split(",");
        }
      }
    );

    setFilters(parsedFilters);
  }, [location.search]);

  // Update URL when filters change
  const handleFiltersChange = (newFilters: DiscoverCreatorsQuery) => {
    setFilters(newFilters);

    const searchParams = new URLSearchParams();

    // Add non-empty filter arrays to URL
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        searchParams.set(key, values.join(","));
      }
    });

    // Update URL without triggering a page reload
    const newUrl = searchParams.toString() ? `?${searchParams.toString()}` : "";
    navigate(`${location.pathname}${newUrl}`, { replace: true });
  };
  // TODO: Replace with real Instagram creator data from API
  // This should be filtered based on the current filters state
  const handleAddToCampaign = async (creatorId: number, campaignId: string) => {
    try {
      // Find the creator data from the API response
      const apiCreator = creatorsData?.creators?.find(
        (c) => parseInt(c.id) === creatorId
      );
      const creator = creators.find((c) => c.id === creatorId);

      if (!creator || !apiCreator) {
        throw new Error("Creator not found");
      }

      const result = await addCreatorToCampaignMutation.mutateAsync({
        campaignId: campaignId,
        creatorData: {
          name: apiCreator.name,
          platform: apiCreator.platform as
            | "instagram"
            | "tiktok"
            | "youtube"
            | "twitter"
            | "facebook",
          email: apiCreator.email,
          age: apiCreator.age,
          gender: apiCreator.gender,
          location: apiCreator.location,
          tier: apiCreator.tier,
          engagement_rate: apiCreator.engagement_rate,
          phone: apiCreator.phone,
          language: apiCreator.language,
          category: apiCreator.category,
          meta: {
            ...apiCreator.meta,
            handle: apiCreator.handle,
            followersCount: apiCreator.followersCount,
            postsCount: apiCreator.postsCount,
            averageViews: apiCreator.averageViews,
            profileImageUrl: apiCreator.profileImageUrl,
            profileUrl: apiCreator.profileUrl,
            qualityScore: apiCreator.qualityScore,
          },
        },
        notes: `Added from creator discovery for ${
          apiCreator.category || "general"
        } category`,
      });

      toast({
        title: "Creator Added Successfully",
        description: `${result.creatorName} has been added to ${result.campaignName}`,
      });

      console.log(
        `Successfully added creator ${creatorId} to campaign ${campaignId}`,
        result
      );
    } catch (error) {
      toast({
        title: "Error Adding Creator",
        description: "Failed to add creator to campaign. Please try again.",
        variant: "destructive",
      });

      console.error("Failed to add creator to campaign:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Creator Discovery
          </h1>
          <p className="text-gray-600 mt-1">
            Find the perfect Instagram creators for your campaigns
          </p>
        </div>
      </div>{" "}
      {/* Search and Filters */}
      <CreatorSearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersChange={handleFiltersChange}
      />
      {/* Loading State */}
      {isLoadingCreators && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Discovering creators...</p>
        </div>
      )}
      {/* Error State */}
      {creatorsError && (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Error loading creators. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
      {/* Creator Results and Load More */}
      {!isLoadingCreators && !creatorsError && (
        <CreatorGrid
          creators={creators}
          campaigns={campaigns}
          onAddToCampaign={handleAddToCampaign}
        />
      )}
      {/* No Results State */}
      {!isLoadingCreators &&
        !creatorsError &&
        creators.length === 0 &&
        Object.keys(apiParams).length > 3 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              No creators found matching your criteria.
            </p>
            <p className="text-sm text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
    </div>
  );
};

export default CreatorDiscovery;

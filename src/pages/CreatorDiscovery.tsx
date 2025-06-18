import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import CreatorSearchFilters from "@/components/CreatorSearchFilters";
import CreatorGrid from "@/components/CreatorGrid";
import { campaignAPI, CampaignResponse } from "@/services/campaignApi";
import {
  useAddCreatorToCampaign,
  useDiscoverCreators,
  type DiscoveredCreator,
  type DiscoverCreatorsRequest,
} from "@/services/creatorApi";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [creatorsData, setCreatorsData] = useState<{
    creators: DiscoveredCreator[];
    total: number;
    pagination: {
      skip: number;
      limit: number;
      hasMore: boolean;
    };
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add creator to campaign mutation
  const addCreatorToCampaignMutation = useAddCreatorToCampaign();

  // Discover creators mutation (triggered manually)
  const discoverCreatorsMutation = useDiscoverCreators();

  // Fetch creators on component mount
  useEffect(() => {
    const fetchInitialCreators = async () => {
      try {
        const result = await discoverCreatorsMutation.mutateAsync({
          platform: "instagram",
          limit: 12,
          skip: 0,
        });
        setCreatorsData(result);
      } catch (error) {
        console.error("Failed to fetch initial creators:", error);
        toast({
          title: "Error",
          description: "Failed to load creators. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchInitialCreators();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Transform filters to API format
  const buildApiParams = (): DiscoverCreatorsRequest => ({
    country: filters.country?.[0], // Take the most recently selected country
    tier: filters.tier,
    language: filters.language,
    category: filters.category,
    er: filters.er,
    gender:
      filters.gender?.[0] && filters.gender[0] !== "all"
        ? filters.gender[0]
        : undefined,
    bio: searchQuery || undefined,
    platform: "instagram",
    limit: 20,
    skip: 0,
  });

  // Handle search button click
  const handleSearch = async () => {
    const apiParams = buildApiParams();
    try {
      const result = await discoverCreatorsMutation.mutateAsync(apiParams);
      setCreatorsData(result);
    } catch (error) {
      console.error("Failed to discover creators:", error);
      toast({
        title: "Search Failed",
        description: "Failed to search creators. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get loading and error states from the mutation
  const isLoadingCreators = discoverCreatorsMutation.isPending;
  const creatorsError = discoverCreatorsMutation.error;

  // Use creators directly from API response without transformation
  const creators = creatorsData?.creators || []; // Fetch campaigns using React Query
  const { data: campaignsData, error: campaignsError } =
    useQuery<CampaignResponse>({
      queryKey: ["campaigns"],
      queryFn: () => campaignAPI.getCampaigns(),
      retry: false,
      // Don't throw errors to the UI for campaigns - handle gracefully
      throwOnError: false,
    });
  // Check if campaigns failed with 400 error and handle gracefully
  const isCampaignsBadRequest =
    campaignsError &&
    (campaignsError as { response?: { status: number } }).response?.status ===
      400;

  // Log warning for 400 errors to help with debugging
  if (isCampaignsBadRequest) {
    console.warn(
      "Campaigns API returned 400 - Bad Request. This might be expected for new users or companies without campaigns."
    );
  }

  // Only show campaigns if data loaded successfully and no 400 error
  const campaigns =
    campaignsData?.data?.items && !isCampaignsBadRequest
      ? campaignsData.data.items.map((campaign) => ({
          id: campaign.id, // Keep as string UUID from backend
          name: campaign.name,
        }))
      : undefined; // Return undefined when campaigns can't be loaded (including 400 errors)
  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const parsedFilters: DiscoverCreatorsQuery = {};

    // Parse each filter parameter - handle multiple values correctly
    ["country", "tier", "er", "gender", "category", "language", "bio"].forEach(
      (param) => {
        const values = searchParams.getAll(param);
        if (values.length > 0) {
          parsedFilters[param as keyof DiscoverCreatorsQuery] = values;
        }
      }
    );

    setFilters(parsedFilters);
  }, [location.search]);
  // Update URL when filters change
  const handleFiltersChange = (newFilters: DiscoverCreatorsQuery) => {
    setFilters(newFilters);

    const searchParams = new URLSearchParams();

    // Add non-empty filter arrays to URL - use append for multiple values
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        values.forEach((value) => {
          searchParams.append(key, value);
        });
      }
    });

    // Update URL without triggering a page reload
    const newUrl = searchParams.toString() ? `?${searchParams.toString()}` : "";
    navigate(`${location.pathname}${newUrl}`, { replace: true });
  };
  // Handle adding creator to campaign - work directly with API data
  const handleAddToCampaign = async (creatorId: string, campaignId: string) => {
    try {
      // Find the creator data from the API response
      const apiCreator = creatorsData?.creators?.find(
        (c) => c.id === creatorId
      );

      if (!apiCreator) {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Creator Discovery
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Find the perfect Instagram creators for your campaigns
            </p>
          </div>
        </div>
        <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CreatorSearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />
          </CardContent>
        </Card>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Creator Results
          </h2>
          {/* Loading State */}
          {isLoadingCreators && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="mt-2 text-gray-600">Discovering creators...</p>
            </div>
          )}
          {/* Error State */}
          {creatorsError && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-600 mb-4 text-center">
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
          {!isLoadingCreators && !creatorsError && creators.length > 0 && (
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
            creatorsData !== null && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-600 mb-4 text-center">
                  No creators found matching your criteria.
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          {/* Initial State - No search performed yet */}
          {!isLoadingCreators && !creatorsError && creatorsData === null && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Ready to discover creators?
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Use the search filters above and click "Search Creators" to find
                the perfect Instagram creators for your campaigns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDiscovery;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CreatorSearchFilters from "@/components/CreatorSearchFilters";
import CreatorGrid from "@/components/CreatorGrid";
import { campaignAPI, CampaignResponse } from "@/services/campaignApi";
import { useAddCreatorToCampaign } from "@/services/creatorApi";
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
  const mockCreators = [
    {
      id: 1,
      username: "@fashionista_jane",
      displayName: "Jane Fashion",
      followers: "125K",
      engagement: "4.2%",
      niche: "Fashion",
      avatar: "/placeholder.svg",
      verified: true,
      recentPosts: 12,
      avgLikes: "5.2K",
      avgComments: "234",
    },
    {
      id: 2,
      username: "@fitness_guru_mike",
      displayName: "Mike Strong",
      followers: "89K",
      engagement: "6.1%",
      niche: "Fitness",
      avatar: "/placeholder.svg",
      verified: false,
      recentPosts: 18,
      avgLikes: "4.8K",
      avgComments: "156",
    },
    // Add more mock creators...
  ];
  const handleAddToCampaign = async (creatorId: number, campaignId: string) => {
    try {
      // Find the creator data from mockCreators
      const creator = mockCreators.find((c) => c.id === creatorId);
      if (!creator) {
        throw new Error("Creator not found");
      }

      const result = await addCreatorToCampaignMutation.mutateAsync({
        campaignId: campaignId,
        creatorData: {
          name: creator.displayName,
          platform: "instagram", // Assuming all mock creators are Instagram for now
          email: `${creator.username.replace("@", "")}@example.com`, // Generate email from username
          category: creator.niche,
          engagement_rate:
            parseFloat(creator.engagement.replace("%", "")) / 100,
          meta: {
            username: creator.username,
            followers: creator.followers,
            avgLikes: creator.avgLikes,
            avgComments: creator.avgComments,
            verified: creator.verified,
            recentPosts: creator.recentPosts,
          },
        },
        notes: `Added from creator discovery for ${creator.niche} niche`,
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
      </div>
      {/* Search and Filters */}
      <CreatorSearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersChange={handleFiltersChange}
      />{" "}
      {/* Creator Results and Load More */}
      <CreatorGrid
        creators={mockCreators}
        campaigns={campaigns}
        onAddToCampaign={handleAddToCampaign}
      />
    </div>
  );
};

export default CreatorDiscovery;

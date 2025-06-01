
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CreatorSearchFilters from "@/components/CreatorSearchFilters";
import CreatorGrid from "@/components/CreatorGrid";

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

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const parsedFilters: DiscoverCreatorsQuery = {};

    // Parse each filter parameter
    ['country', 'tier', 'er', 'gender', 'category', 'language', 'bio'].forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        parsedFilters[param as keyof DiscoverCreatorsQuery] = value.split(',');
      }
    });

    setFilters(parsedFilters);
  }, [location.search]);

  // Update URL when filters change
  const handleFiltersChange = (newFilters: DiscoverCreatorsQuery) => {
    setFilters(newFilters);

    const searchParams = new URLSearchParams();
    
    // Add non-empty filter arrays to URL
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        searchParams.set(key, values.join(','));
      }
    });

    // Update URL without triggering a page reload
    const newUrl = searchParams.toString() ? `?${searchParams.toString()}` : '';
    navigate(`${location.pathname}${newUrl}`, { replace: true });
  };

  // TODO: Replace with real campaign data from API
  const mockCampaigns = [
    { id: 1, name: "Summer Launch 2024" },
    { id: 2, name: "Back to School Campaign" },
    { id: 3, name: "Holiday Collection" }
  ];

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
      avgComments: "234"
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
      avgComments: "156"
    },
    // Add more mock creators...
  ];

  const handleAddToCampaign = (creatorId: number, campaignId: number) => {
    // TODO: Implement API call to add creator to campaign
    console.log(`Adding creator ${creatorId} to campaign ${campaignId}`);
    console.log('Current filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Creator Discovery</h1>
          <p className="text-gray-600 mt-1">Find the perfect Instagram creators for your campaigns</p>
        </div>
      </div>

      {/* Search and Filters */}
      <CreatorSearchFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersChange={handleFiltersChange}
      />

      {/* Creator Results and Load More */}
      <CreatorGrid 
        creators={mockCreators}
        campaigns={mockCampaigns}
        onAddToCampaign={handleAddToCampaign}
      />
    </div>
  );
};

export default CreatorDiscovery;

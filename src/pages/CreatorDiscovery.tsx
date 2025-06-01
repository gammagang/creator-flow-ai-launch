
import { useState } from "react";
import CreatorSearchFilters from "@/components/CreatorSearchFilters";
import CreatorGrid from "@/components/CreatorGrid";

const CreatorDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Replace with real campaign data from API
  const mockCampaigns = [
    { id: 1, name: "Summer Launch 2024" },
    { id: 2, name: "Back to School Campaign" },
    { id: 3, name: "Holiday Collection" }
  ];

  // TODO: Replace with real Instagram creator data from API
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

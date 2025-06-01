
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Users, Heart, MessageCircle, Eye, Plus } from "lucide-react";

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
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search by username, niche, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search Creators
              </Button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary">Fashion</Badge>
            <Badge variant="secondary">Fitness</Badge>
            <Badge variant="secondary">Food</Badge>
            <Badge variant="secondary">Tech</Badge>
            <Badge variant="secondary">Travel</Badge>
            <Badge variant="secondary">Beauty</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Creator Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCreators.map((creator) => (
          <Card key={creator.id} className="hover:shadow-lg transition-shadow cursor-pointer relative">
            <div className="absolute top-3 right-3 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Plus className="w-3 h-3 mr-1" />
                    Add to Campaign
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {mockCampaigns.map((campaign) => (
                    <DropdownMenuItem 
                      key={campaign.id}
                      onClick={() => handleAddToCampaign(creator.id, campaign.id)}
                    >
                      {campaign.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={creator.avatar} 
                  alt={creator.displayName}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{creator.displayName}</h3>
                    {creator.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{creator.username}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{creator.followers}</span>
                </div>
                <Badge variant="outline">{creator.niche}</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span className="text-xs">{creator.avgLikes}</span>
                  </div>
                  <p className="text-xs text-gray-500">Avg Likes</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="w-3 h-3 text-blue-500" />
                    <span className="text-xs">{creator.avgComments}</span>
                  </div>
                  <p className="text-xs text-gray-500">Avg Comments</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3 text-green-500" />
                    <span className="text-xs">{creator.engagement}</span>
                  </div>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Creators</Button>
      </div>
    </div>
  );
};

export default CreatorDiscovery;

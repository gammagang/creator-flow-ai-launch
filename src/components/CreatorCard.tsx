import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Heart, MessageCircle, Eye, Plus } from "lucide-react";

interface DiscoveredCreator {
  id: string;
  name: string;
  platform: string;
  category?: string;
  age?: number;
  gender?: string;
  location?: string | null;
  tier: string;
  engagement_rate: number;
  email?: string;
  phone?: string;
  language?: string;
  followersCount: number;
  postsCount: number;
  averageViews?: number;
  handle: string;
  profileImageUrl?: string;
  profileUrl?: string;
  insightsUrl?: string;
  interests?: string[];
  country?: string;
  state?: string;
  qualityScore?: number;
  effectiveFollowerRate?: number;
  createdAt: string;
  updatedAt: string;
  meta: Record<string, unknown>;
}

interface Campaign {
  id: string;
  name: string;
}

interface CreatorCardProps {
  creator: DiscoveredCreator;
  campaigns?: Campaign[];
  onAddToCampaign: (creatorId: string, campaignId: string) => void;
}

const CreatorCard = ({
  creator,
  campaigns,
  onAddToCampaign,
}: CreatorCardProps) => {
  // Helper functions to format data
  const formatFollowerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatNumber = (num?: number): string => {
    if (!num) return "N/A";
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const username = creator.handle.startsWith("@")
    ? creator.handle
    : `@${creator.handle}`;
  const verified = creator.qualityScore ? creator.qualityScore > 80 : false;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={creator.profileImageUrl || "/placeholder.svg"}
              alt={creator.name}
              className="w-12 h-12 rounded-full bg-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{creator.name}</h3>
                {verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{username}</p>
            </div>
          </div>
          {campaigns && campaigns.length > 0 && (
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border shadow-lg z-50"
                >
                  {campaigns.map((campaign) => (
                    <DropdownMenuItem
                      key={campaign.id}
                      onClick={() => onAddToCampaign(creator.id, campaign.id)}
                      className="hover:bg-gray-100"
                    >
                      {campaign.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">
              {formatFollowerCount(creator.followersCount)}
            </span>
          </div>
          <Badge variant="outline">{creator.category || "General"}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-red-500" />
              <span className="text-xs">
                {formatNumber(creator.averageViews)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Avg Views</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="w-3 h-3 text-blue-500" />
              <span className="text-xs">{creator.postsCount}</span>
            </div>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-green-500" />
              <span className="text-xs">
                {(creator.engagement_rate * 100).toFixed(1)}%
              </span>
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
  );
};

export default CreatorCard;

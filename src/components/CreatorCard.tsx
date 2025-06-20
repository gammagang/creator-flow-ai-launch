import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DiscoveredCreator } from "@/services/creatorApi";
import type { Campaign } from "@/types/shared";
import { formatFollowerCount, formatNumber } from "@/utils/formatters";
import {
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Users,
  CheckCircle2,
} from "lucide-react";

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
  const username = creator.handle.startsWith("@")
    ? creator.handle
    : `@${creator.handle}`;
  const verified = creator.qualityScore ? creator.qualityScore > 80 : false;

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-md shadow-md group cursor-pointer relative transition-transform duration-200 hover:scale-[1.025] hover:shadow-lg">
      <CardHeader className="pb-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {creator.profileImageUrl ? (
              <img
                src={creator.profileImageUrl}
                alt={creator.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Avatar placeholder"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold truncate min-w-0 max-w-[120px] text-base text-gray-900">
                  {creator.name}
                </h3>
                {verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
              </div>
              <p className="text-xs text-gray-500 truncate font-mono">
                {username}
              </p>
            </div>
          </div>
          {campaigns && campaigns.length > 0 && (
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0 bg-white border border-orange-200 text-orange-600 rounded-full shadow-sm hover:bg-orange-50 transition"
                  >
                    <Plus className="w-4 h-4 text-orange-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white border border-orange-100 rounded-xl shadow-lg z-50"
                >
                  {campaigns.map((campaign) => (
                    <DropdownMenuItem
                      key={campaign.id}
                      onClick={() => onAddToCampaign(creator.id, campaign.id)}
                      className="rounded-lg"
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
      <CardContent className="space-y-4 p-5 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" aria-label="Followers" />
              <span className="text-sm font-medium text-gray-800">
                {formatFollowerCount(creator.followersCount)}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs px-3 py-0.5 rounded-full border-gray-200 bg-gray-50 text-gray-700 font-medium"
            >
              {creator.category || "General"}
            </Badge>
          </div>
          <div className="grid gap-2 text-center grid-cols-1 sm:grid-cols-3">
            <div>
              <div
                className="flex items-center justify-center gap-1.5"
                title="Average Views"
              >
                <Eye
                  className="w-4 h-4 text-green-500"
                  aria-label="Avg Views"
                />
                <span className="text-xs text-gray-700 font-medium">
                  {formatNumber(creator.averageViews)}
                </span>
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-center gap-1.5"
                title="Posts"
              >
                <MessageCircle
                  className="w-4 h-4 text-blue-500"
                  aria-label="Posts"
                />
                <span className="text-xs text-gray-700 font-medium">
                  {creator.postsCount}
                </span>
              </div>
            </div>
            <div>
              <div
                className="flex items-center justify-center gap-1.5"
                title="Engagement Rate"
              >
                <Heart
                  className="w-4 h-4 text-red-500"
                  aria-label="Engagement"
                />
                <span className="text-xs text-gray-700 font-medium">
                  {(creator.engagement_rate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            {creator.profileUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 max-w-xs rounded-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-sm transition"
                onClick={() => window.open(creator.profileUrl, "_blank")}
                aria-label="View Profile"
              >
                View Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;

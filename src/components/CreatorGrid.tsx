import { Button } from "@/components/ui/button";
import CreatorCard from "./CreatorCard";

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

interface CreatorGridProps {
  creators: DiscoveredCreator[];
  campaigns: Campaign[];
  onAddToCampaign: (creatorId: string, campaignId: string) => void;
}

const CreatorGrid = ({
  creators,
  campaigns,
  onAddToCampaign,
}: CreatorGridProps) => {
  return (
    <>
      {/* Creator Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            campaigns={campaigns}
            onAddToCampaign={onAddToCampaign}
          />
        ))}
      </div>
    </>
  );
};

export default CreatorGrid;

import { Button } from "@/components/ui/button";
import CreatorCard from "./CreatorCard";

interface Creator {
  id: number;
  username: string;
  displayName: string;
  followers: string;
  engagement: string;
  niche: string;
  avatar: string;
  verified: boolean;
  recentPosts: number;
  avgLikes: string;
  avgComments: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface CreatorGridProps {
  creators: Creator[];
  campaigns: Campaign[];
  onAddToCampaign: (creatorId: number, campaignId: string) => void;
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

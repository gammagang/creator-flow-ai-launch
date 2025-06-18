import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: number;
  name: string;
  status: string;
  progress: number;
}

interface CampaignHeaderProps {
  campaign: Campaign;
  getStatusColor: (status: string) => string;
}

const CampaignHeader = ({ campaign, getStatusColor }: CampaignHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{campaign.progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignHeader;

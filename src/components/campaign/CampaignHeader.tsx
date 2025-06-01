
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <div className="flex gap-2">
        <Button variant="outline">Edit Campaign</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default CampaignHeader;

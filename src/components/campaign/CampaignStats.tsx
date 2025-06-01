
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText, Target } from "lucide-react";

interface Campaign {
  spent: string;
  budget: string;
  creatorsContacted: number;
  creatorsResponded: number;
  contractsSigned: number;
  contentDelivered: number;
}

interface CampaignStatsProps {
  campaign: Campaign;
}

const CampaignStats = ({ campaign }: CampaignStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaign.spent}</div>
          <p className="text-xs text-muted-foreground">
            of {campaign.budget}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Creators Contacted
          </CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {campaign.creatorsContacted}
          </div>
          <p className="text-xs text-muted-foreground">
            {campaign.creatorsResponded} responded
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Contracts Signed
          </CardTitle>
          <FileText className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{campaign.contractsSigned}</div>
          <p className="text-xs text-muted-foreground">
            of {campaign.creatorsResponded} responses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Content Delivered
          </CardTitle>
          <Target className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {campaign.contentDelivered}
          </div>
          <p className="text-xs text-muted-foreground">
            of {campaign.contractsSigned} contracts
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignStats;

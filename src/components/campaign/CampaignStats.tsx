import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {campaign.spent}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contacted</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {campaign.creatorsContacted}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Signed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {campaign.contractsSigned}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {campaign.contentDelivered}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignStats;

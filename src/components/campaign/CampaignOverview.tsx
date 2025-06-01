
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Campaign {
  startDate: string;
  endDate: string;
}

interface CampaignOverviewProps {
  campaign: Campaign;
}

const CampaignOverview = ({ campaign }: CampaignOverviewProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                Campaign launched - {campaign.startDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Creator outreach completed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Contracts being signed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">
                Campaign ends - {campaign.endDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">@fitness_guru_mike</span> delivered content
              <span className="text-gray-500 block">2 hours ago</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">@fashionista_jane</span> signed contract
              <span className="text-gray-500 block">1 day ago</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">AI Outreach</span> sent to 5 new creators
              <span className="text-gray-500 block">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignOverview;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Users, DollarSign, MoreHorizontal, Mail, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const CampaignList = () => {
  // TODO: Replace with real campaign data
  const campaigns = [
    {
      id: 1,
      name: "Summer Launch 2024",
      status: "active",
      budget: "$15,000",
      creatorsContacted: 24,
      creatorsResponded: 16,
      startDate: "2024-06-01",
      endDate: "2024-07-31",
      deliverables: ["Posts", "Stories", "Reels"]
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "draft",
      budget: "$8,500",
      creatorsContacted: 0,
      creatorsResponded: 0,
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      deliverables: ["Posts", "Stories"]
    },
    {
      id: 3,
      name: "Holiday Collection",
      status: "completed",
      budget: "$22,000",
      creatorsContacted: 35,
      creatorsResponded: 28,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      deliverables: ["Posts", "Reels", "IGTV"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage your influencer marketing campaigns</p>
        </div>
        <Link to="/campaigns/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge className={`mt-2 ${getStatusColor(campaign.status)}`}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <DollarSign className="w-3 h-3" />
                    <span>Budget</span>
                  </div>
                  <p className="font-medium">{campaign.budget}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>Creators</span>
                  </div>
                  <p className="font-medium">{campaign.creatorsContacted} contacted</p>
                </div>
              </div>

              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>Timeline</span>
                </div>
                <p className="text-gray-700">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-1">
                  {campaign.deliverables.map((deliverable) => (
                    <Badge key={deliverable} variant="outline" className="text-xs">
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to={`/campaigns/${campaign.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Manage
                </Button>
              </div>

              {/* Campaign-specific Outreach and Negotiation */}
              <div className="flex gap-2 pt-2 border-t">
                <Link to={`/outreach?campaign=${campaign.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-3 h-3 mr-1" />
                    Outreach
                  </Button>
                </Link>
                <Link to={`/negotiation?campaign=${campaign.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Negotiation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;

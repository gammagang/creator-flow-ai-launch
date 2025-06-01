import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { campaignAPI, CampaignResponse } from "@/services/campaignApi";

const CampaignList = () => {
  // Fetch campaigns using React Query
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useQuery<CampaignResponse>({
    queryKey: ["campaigns"],
    queryFn: () => campaignAPI.getCampaigns(),
  });

  const apiCampaigns = campaignsData?.data?.items || [];

  // Format API data to match the expected UI structure
  const campaigns = apiCampaigns.map((apiCampaign) => ({
    id: apiCampaign.id,
    name: apiCampaign.name,
    status: apiCampaign.state || "draft",
    budget: "$0",
    creatorsContacted: 0,
    creatorsResponded: 0,
    startDate: apiCampaign.start_date,
    endDate: apiCampaign.end_date,
    deliverables: ["Posts"],
  }));
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your influencer marketing campaigns
            </p>
          </div>
          <Link to="/campaigns/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading campaigns...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your influencer marketing campaigns
            </p>
          </div>
          <Link to="/campaigns/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load campaigns</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Manage your influencer marketing campaigns
          </p>
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
                    {campaign.status.charAt(0).toUpperCase() +
                      campaign.status.slice(1)}
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
                  <p className="font-medium">
                    {campaign.creatorsContacted} contacted
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>Timeline</span>
                </div>
                <p className="text-gray-700">
                  {campaign.startDate && campaign.endDate
                    ? `${new Date(
                        campaign.startDate
                      ).toLocaleDateString()} - ${new Date(
                        campaign.endDate
                      ).toLocaleDateString()}`
                    : "No dates set"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-1">
                  {campaign.deliverables.map((deliverable) => (
                    <Badge
                      key={deliverable}
                      variant="outline"
                      className="text-xs"
                    >
                      {deliverable}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;

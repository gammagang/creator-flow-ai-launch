
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Heart, MessageCircle, Eye } from "lucide-react";

const CreatorDetails = () => {
  const { id, campaignId } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with real creator data based on ID
  const allCreators = [
    {
      id: 1,
      creatorName: "Sarah Johnson",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "fulfilled",
      followers: "125K",
      avgLikes: "3.2K",
      avgComments: "245",
      engagement: "2.8%",
      platform: "Instagram"
    },
    {
      id: 2,
      creatorName: "Mike Chen",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "onboarded",
      followers: "89K",
      avgLikes: "2.1K",
      avgComments: "180",
      engagement: "3.1%",
      platform: "TikTok"
    },
    {
      id: 3,
      creatorName: "Emma Davis",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "waiting for signature",
      followers: "156K",
      avgLikes: "4.5K",
      avgComments: "320",
      engagement: "3.5%",
      platform: "Instagram"
    },
    {
      id: 4,
      creatorName: "Alex Rodriguez",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "call complete",
      followers: "203K",
      avgLikes: "5.8K",
      avgComments: "410",
      engagement: "3.2%",
      platform: "YouTube"
    },
    {
      id: 5,
      creatorName: "Lisa Thompson",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "outreached",
      followers: "67K",
      avgLikes: "1.8K",
      avgComments: "125",
      engagement: "2.9%",
      platform: "Instagram"
    },
    {
      id: 6,
      creatorName: "David Kim",
      campaignName: "Summer Launch 2024",
      lifecycleStage: "discovered",
      followers: "298K",
      avgLikes: "8.2K",
      avgComments: "650",
      engagement: "3.8%",
      platform: "TikTok"
    },
    {
      id: 7,
      creatorName: "Jessica Martinez",
      campaignName: "Back to School Campaign",
      lifecycleStage: "discovered",
      followers: "45K",
      avgLikes: "1.2K",
      avgComments: "89",
      engagement: "2.7%",
      platform: "Instagram"
    },
    {
      id: 8,
      creatorName: "Ryan Lee",
      campaignName: "Back to School Campaign",
      lifecycleStage: "discovered",
      followers: "78K",
      avgLikes: "2.3K",
      avgComments: "156",
      engagement: "3.2%",
      platform: "TikTok"
    },
    {
      id: 9,
      creatorName: "Amanda White",
      campaignName: "Holiday Collection",
      lifecycleStage: "fulfilled",
      followers: "187K",
      avgLikes: "5.1K",
      avgComments: "380",
      engagement: "3.1%",
      platform: "Instagram"
    },
    {
      id: 10,
      creatorName: "Chris Brown",
      campaignName: "Holiday Collection",
      lifecycleStage: "fulfilled",
      followers: "234K",
      avgLikes: "6.8K",
      avgComments: "520",
      engagement: "3.4%",
      platform: "YouTube"
    },
    {
      id: 11,
      creatorName: "Taylor Swift",
      campaignName: "Holiday Collection",
      lifecycleStage: "fulfilled",
      followers: "1.2M",
      avgLikes: "45K",
      avgComments: "2.8K",
      engagement: "4.2%",
      platform: "Instagram"
    },
    {
      id: 12,
      creatorName: "John Doe",
      campaignName: "Holiday Collection",
      lifecycleStage: "onboarded",
      followers: "112K",
      avgLikes: "3.1K",
      avgComments: "210",
      engagement: "2.9%",
      platform: "TikTok"
    }
  ];

  const creator = allCreators.find(c => c.id === parseInt(id || "1"));

  if (!creator) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/campaigns/${campaignId}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaign
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Creator not found</h2>
        </div>
      </div>
    );
  }

  const lifecycleStages = [
    { key: "discovered", label: "Discovered" },
    { key: "outreached", label: "Outreached" },
    { key: "call initiated", label: "Call Initiated" },
    { key: "call complete", label: "Call Complete" },
    { key: "waiting for contract", label: "Waiting for Contract" },
    { key: "waiting for signature", label: "Waiting for Signature" },
    { key: "onboarded", label: "Onboarded" },
    { key: "fulfilled", label: "Fulfilled" }
  ];

  const currentStageIndex = lifecycleStages.findIndex(stage => stage.key === creator.lifecycleStage);

  const getStageColor = (index: number) => {
    if (index <= currentStageIndex) {
      return "bg-green-500 text-white border-green-500";
    }
    return "bg-gray-200 text-gray-500 border-gray-300";
  };

  const getConnectorColor = (index: number) => {
    if (index < currentStageIndex) {
      return "bg-green-500";
    }
    return "bg-gray-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/campaigns/${campaignId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaign
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{creator.creatorName}</h1>
          <p className="text-gray-600">{creator.platform} Creator</p>
        </div>
      </div>

      {/* Creator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creator.followers}</div>
            <p className="text-xs text-muted-foreground">Total followers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Likes</CardTitle>
            <Heart className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creator.avgLikes}</div>
            <p className="text-xs text-muted-foreground">Per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Comments</CardTitle>
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creator.avgComments}</div>
            <p className="text-xs text-muted-foreground">Per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Eye className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creator.engagement}</div>
            <p className="text-xs text-muted-foreground">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Lifecycle */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Lifecycle Progress</CardTitle>
          <p className="text-sm text-gray-600">Current stage: <Badge className="ml-2">{creator.lifecycleStage}</Badge></p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {lifecycleStages.map((stage, index) => (
              <div key={stage.key} className="flex items-center">
                <div className="flex items-center flex-1">
                  {/* Stage Circle */}
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${getStageColor(index)}`}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Stage Label */}
                  <div className="ml-4">
                    <div className={`font-medium ${index <= currentStageIndex ? 'text-gray-900' : 'text-gray-500'}`}>
                      {stage.label}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < lifecycleStages.length - 1 && (
                  <div className="absolute left-4 mt-8 ml-0.5">
                    <div className={`w-0.5 h-6 ${getConnectorColor(index)}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorDetails;

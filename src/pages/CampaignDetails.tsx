import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  DollarSign,
  Calendar,
  Target,
  Mail,
  FileText,
} from "lucide-react";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: Replace with real campaign data based on ID
  const campaigns = [
    {
      id: 1,
      name: "Summer Launch 2024",
      status: "active",
      budget: "$15,000",
      spent: "$8,200",
      creatorsContacted: 24,
      creatorsResponded: 16,
      contractsSigned: 12,
      contentDelivered: 8,
      startDate: "2024-06-01",
      endDate: "2024-07-31",
      progress: 65,
    },
    {
      id: 2,
      name: "Back to School Campaign",
      status: "draft",
      budget: "$8,500",
      spent: "$0",
      creatorsContacted: 0,
      creatorsResponded: 0,
      contractsSigned: 0,
      contentDelivered: 0,
      startDate: "2024-08-15",
      endDate: "2024-09-30",
      progress: 0,
    },
    {
      id: 3,
      name: "Holiday Collection",
      status: "completed",
      budget: "$22,000",
      spent: "$22,000",
      creatorsContacted: 35,
      creatorsResponded: 28,
      contractsSigned: 25,
      contentDelivered: 25,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      progress: 100,
    },
  ];

  // Find the campaign based on the ID parameter
  const campaign =
    campaigns.find((c) => c.id === parseInt(id || "1")) || campaigns[0];

  // TODO: Fetch creators data for this specific campaign
  const allCampaignCreators = {
    1: [
      {
        id: 1,
        creatorName: "Sarah Johnson",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "fulfilled",
      },
      {
        id: 2,
        creatorName: "Mike Chen",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "onboarded",
      },
      {
        id: 3,
        creatorName: "Emma Davis",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "waiting for signature",
      },
      {
        id: 4,
        creatorName: "Alex Rodriguez",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "call complete",
      },
      {
        id: 5,
        creatorName: "Lisa Thompson",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "outreached",
      },
      {
        id: 6,
        creatorName: "David Kim",
        campaignName: "Summer Launch 2024",
        lifecycleStage: "discovered",
      },
    ],
    2: [
      {
        id: 7,
        creatorName: "Jessica Martinez",
        campaignName: "Back to School Campaign",
        lifecycleStage: "discovered",
      },
      {
        id: 8,
        creatorName: "Ryan Lee",
        campaignName: "Back to School Campaign",
        lifecycleStage: "discovered",
      },
    ],
    3: [
      {
        id: 9,
        creatorName: "Amanda White",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 10,
        creatorName: "Chris Brown",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 11,
        creatorName: "Taylor Swift",
        campaignName: "Holiday Collection",
        lifecycleStage: "fulfilled",
      },
      {
        id: 12,
        creatorName: "John Doe",
        campaignName: "Holiday Collection",
        lifecycleStage: "onboarded",
      },
    ],
  };

  const creatorsInCampaign = allCampaignCreators[parseInt(id || "1")] || [];

  const getLifecycleStageColor = (stage: string) => {
    switch (stage) {
      case "discovered":
        return "bg-gray-100 text-gray-800";
      case "outreached":
        return "bg-blue-100 text-blue-800";
      case "call initiated":
        return "bg-yellow-100 text-yellow-800";
      case "call complete":
        return "bg-orange-100 text-orange-800";
      case "waiting for contract":
        return "bg-purple-100 text-purple-800";
      case "waiting for signature":
        return "bg-pink-100 text-pink-800";
      case "onboarded":
        return "bg-green-100 text-green-800";
      case "fulfilled":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const handleCreatorRowClick = (creatorId: number) => {
    navigate(`/campaigns/${id}/creators/${creatorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() +
                campaign.status.slice(1)}
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

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Campaign Progress</span>
            <span>{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
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

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                    <span className="font-medium">@fitness_guru_mike</span>{" "}
                    delivered content
                    <span className="text-gray-500 block">2 hours ago</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">@fashionista_jane</span>{" "}
                    signed contract
                    <span className="text-gray-500 block">1 day ago</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">AI Outreach</span> sent to 5
                    new creators
                    <span className="text-gray-500 block">2 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="creators">
          <Card>
            <CardHeader>
              <CardTitle>Creator Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator Name</TableHead>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Campaign Lifecycle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorsInCampaign.map((creator) => (
                    <TableRow
                      key={creator.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleCreatorRowClick(creator.id)}
                    >
                      <TableCell className="font-medium">
                        {creator.creatorName}
                      </TableCell>
                      <TableCell>{creator.campaignName}</TableCell>
                      <TableCell>
                        <Badge
                          className={getLifecycleStageColor(
                            creator.lifecycleStage
                          )}
                        >
                          {creator.lifecycleStage}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Content gallery and approval workflow will be implemented here.
              </p>
              {/* TODO: Implement content gallery */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Campaign analytics and metrics will be implemented here.
              </p>
              {/* TODO: Implement analytics dashboard */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetails;

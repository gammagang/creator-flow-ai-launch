
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Calendar, Target, Mail, FileText } from "lucide-react";

const CampaignDetails = () => {
  const { id } = useParams();

  // TODO: Fetch campaign data based on ID
  const campaign = {
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
    progress: 65
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-green-100 text-green-800">Active</Badge>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{campaign.progress}% Complete</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Campaign</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Generate Report</Button>
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
            <p className="text-xs text-muted-foreground">of {campaign.budget}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators Contacted</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.creatorsContacted}</div>
            <p className="text-xs text-muted-foreground">{campaign.creatorsResponded} responded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracts Signed</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.contractsSigned}</div>
            <p className="text-xs text-muted-foreground">of {campaign.creatorsResponded} responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Delivered</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.contentDelivered}</div>
            <p className="text-xs text-muted-foreground">of {campaign.contractsSigned} contracts</p>
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
                    <span className="text-sm">Campaign launched - {campaign.startDate}</span>
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
                    <span className="text-sm text-gray-500">Campaign ends - {campaign.endDate}</span>
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
        </TabsContent>

        <TabsContent value="creators">
          <Card>
            <CardHeader>
              <CardTitle>Creator Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Creator list and management tools will be implemented here.</p>
              {/* TODO: Implement creator management table */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Content gallery and approval workflow will be implemented here.</p>
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
              <p className="text-gray-500">Campaign analytics and metrics will be implemented here.</p>
              {/* TODO: Implement analytics dashboard */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetails;

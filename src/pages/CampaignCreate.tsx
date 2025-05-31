
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Target, Users } from "lucide-react";

const CampaignCreate = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600">Set up your influencer marketing campaign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input id="campaignName" placeholder="Summer Launch 2024" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your campaign goals and messaging..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageRange">Age Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-44">35-44</SelectItem>
                      <SelectItem value="45+">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="interests">Interests/Niches</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Fashion</Badge>
                  <Badge variant="secondary">Beauty</Badge>
                  <Badge variant="secondary">Fitness</Badge>
                  <Badge variant="secondary">Food</Badge>
                  <Badge variant="secondary">Travel</Badge>
                  <Badge variant="secondary">Tech</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle>Content Deliverables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="posts" />
                  <Label htmlFor="posts">Instagram Posts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="stories" />
                  <Label htmlFor="stories">Instagram Stories</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reels" />
                  <Label htmlFor="reels">Instagram Reels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="igtv" />
                  <Label htmlFor="igtv">IGTV Videos</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="contentGuidelines">Content Guidelines</Label>
                <Textarea 
                  id="contentGuidelines" 
                  placeholder="Specific requirements for creator content..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="totalBudget">Total Budget</Label>
                <Input id="totalBudget" placeholder="$10,000" />
              </div>
              <div>
                <Label htmlFor="budgetPerCreator">Budget Per Creator</Label>
                <Input id="budgetPerCreator" placeholder="$500 - $2,000" />
              </div>
              <div>
                <Label htmlFor="paymentModel">Payment Model</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Fee</SelectItem>
                    <SelectItem value="performance">Performance Based</SelectItem>
                    <SelectItem value="milestone">Milestone Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Creator Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Creator Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="followerRange">Follower Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">1K - 10K (Nano)</SelectItem>
                    <SelectItem value="small">10K - 100K (Micro)</SelectItem>
                    <SelectItem value="medium">100K - 1M (Macro)</SelectItem>
                    <SelectItem value="large">1M+ (Mega)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minEngagement">Min Engagement Rate</Label>
                <Input id="minEngagement" placeholder="3%" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="United States" />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Create Campaign
            </Button>
            <Button variant="outline" className="w-full">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCreate;

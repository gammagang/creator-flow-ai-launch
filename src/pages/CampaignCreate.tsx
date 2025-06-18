import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { campaignAPI } from "@/services/campaignApi";
import { useMutation } from "@tanstack/react-query";
import { IndianRupee, Target, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CampaignFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  ageRange: string;
  gender: string;
  interests: string[];
  deliverables: string[];
  contentDeliverables: string;
  totalBudget: string;
  followerRange: string;
  minEngagement: string;
  location: string;
}

const CampaignCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: 0,
    ageRange: "",
    gender: "",
    interests: [],
    deliverables: [],
    contentDeliverables: "Instagram posts, Stories, Reels",
    totalBudget: "10000",
    followerRange: "",
    minEngagement: "",
    location: "",
  });

  const createCampaignMutation = useMutation({
    mutationFn: (data: CampaignFormData) => campaignAPI.createCampaign(data),
    onSuccess: () => {
      toast.success("Campaign created successfully!");
      navigate("/dashboard/campaigns");
    },
    onError: (error) => {
      toast.error("Failed to create campaign. Please try again.");
      console.error("Campaign creation error:", error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: checked
        ? [...prev.deliverables, name]
        : prev.deliverables.filter((d) => d !== name),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiData = {
      ...formData,
      budget: parseFloat(formData.totalBudget.replace(/[^0-9.-]+/g, "")) || 0,
    };
    createCampaignMutation.mutate(apiData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4 md:px-10 lg:px-24">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Create New Campaign
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Set up your influencer marketing campaign
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Basic Information */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Summer Launch 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign goals and messaging..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Deliverables */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Content Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contentDeliverables">
                    Specify deliverables
                  </Label>
                  <Textarea
                    id="contentDeliverables"
                    name="contentDeliverables"
                    value={formData.contentDeliverables}
                    onChange={handleInputChange}
                    placeholder="Specific requirements for creator content..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageRange">Age Range</Label>
                    <Select
                      value={formData.ageRange}
                      onValueChange={(value) =>
                        handleSelectChange("ageRange", value)
                      }
                    >
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
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                    >
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
                    {[
                      "Fashion",
                      "Beauty",
                      "Fitness",
                      "Food",
                      "Travel",
                      "Tech",
                    ].map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          formData.interests.includes(interest)
                            ? "default"
                            : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            interests: prev.interests.includes(interest)
                              ? prev.interests.filter((i) => i !== interest)
                              : [...prev.interests, interest],
                          }));
                        }}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Budget */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="totalBudget">Total Budget</Label>
                  <Input
                    id="totalBudget"
                    name="totalBudget"
                    value={formData.totalBudget}
                    onChange={handleInputChange}
                    placeholder="₹10,000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Creator Criteria */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Creator Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="followerRange">Follower Range</Label>
                  <Select
                    value={formData.followerRange}
                    onValueChange={(value) =>
                      handleSelectChange("followerRange", value)
                    }
                  >
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
                  <Input
                    id="minEngagement"
                    name="minEngagement"
                    value={formData.minEngagement}
                    onChange={handleInputChange}
                    placeholder="3%"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="United States"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-6 py-2 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] transition-all duration-200"
                disabled={createCampaignMutation.isPending}
              >
                {createCampaignMutation.isPending
                  ? "Creating..."
                  : "Create Campaign"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white/80 border border-gray-300 text-gray-700 rounded-xl px-6 py-2 text-lg font-semibold shadow-sm hover:bg-gray-100 transition-all duration-200"
                onClick={() => navigate("/dashboard/campaigns")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampaignCreate;

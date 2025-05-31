
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Globe, Loader2 } from "lucide-react";
import { useState } from "react";

const BrandProfile = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [website, setWebsite] = useState("");

  const handleAnalyzeWebsite = async () => {
    setIsAnalyzing(true);
    // TODO: Implement AI website analysis
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Building className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Profile</h1>
          <p className="text-gray-600">Build your brand identity for personalized outreach</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Brand Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="website">Website URL</Label>
              <Input 
                id="website"
                placeholder="https://your-brand.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleAnalyzeWebsite}
              disabled={!website || isAnalyzing}
              className="mt-6"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Analyze Website
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Our AI will scrape your website to understand your brand identity, values, and target audience.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brandName">Brand Name</Label>
              <Input id="brandName" placeholder="Your Brand Name" />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" placeholder="e.g., Fashion, Tech, Food" />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input id="targetAudience" placeholder="e.g., Young professionals, 25-35" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Voice & Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Input id="brandVoice" placeholder="e.g., Professional, Friendly, Bold" />
            </div>
            <div>
              <Label htmlFor="brandValues">Core Values</Label>
              <Textarea 
                id="brandValues" 
                placeholder="What does your brand stand for?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="typicalBudget">Typical Campaign Budget</Label>
              <Input id="typicalBudget" placeholder="$5,000 - $15,000" />
            </div>
            <div>
              <Label htmlFor="preferredDeliverables">Preferred Deliverables</Label>
              <Input id="preferredDeliverables" placeholder="Posts, Stories, Reels" />
            </div>
          </div>
          <div>
            <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
            <Textarea 
              id="brandGuidelines" 
              placeholder="Any specific requirements for creator content..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Brand Profile
        </Button>
      </div>
    </div>
  );
};

export default BrandProfile;

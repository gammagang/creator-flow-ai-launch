
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BrandProfile = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    brandName: "",
    websiteUrl: "",
    contactName: "",
    phone: "",
    description: "",
    industry: "",
    targetAudience: "",
    brandVoice: "",
    brandValues: "",
    typicalBudget: "",
    preferredDeliverables: "",
    brandGuidelines: ""
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.user_metadata) {
        const metadata = user.user_metadata;
        setFormData({
          brandName: metadata.brand_name || "",
          websiteUrl: metadata.website_url || "",
          contactName: metadata.contact_name || "",
          phone: metadata.phone || "",
          description: metadata.description || "",
          industry: "",
          targetAudience: "",
          brandVoice: "",
          brandValues: "",
          typicalBudget: "",
          preferredDeliverables: "",
          brandGuidelines: ""
        });
        setWebsite(metadata.website_url || "");
      }
    } catch (error) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnalyzeWebsite = async () => {
    setIsAnalyzing(true);
    // TODO: Implement AI website analysis
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          brand_name: formData.brandName,
          website_url: formData.websiteUrl,
          contact_name: formData.contactName,
          phone: formData.phone,
          description: formData.description,
          industry: formData.industry,
          target_audience: formData.targetAudience,
          brand_voice: formData.brandVoice,
          brand_values: formData.brandValues,
          typical_budget: formData.typicalBudget,
          preferred_deliverables: formData.preferredDeliverables,
          brand_guidelines: formData.brandGuidelines
        }
      });

      if (error) {
        toast.error("Failed to save profile");
      } else {
        toast.success("Profile saved successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
              <Input 
                id="brandName" 
                name="brandName"
                placeholder="Your Brand Name" 
                value={formData.brandName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input 
                id="websiteUrl" 
                name="websiteUrl"
                placeholder="https://your-brand.com" 
                value={formData.websiteUrl}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="contactName">Contact Person</Label>
              <Input 
                id="contactName" 
                name="contactName"
                placeholder="Contact Person Name" 
                value={formData.contactName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                placeholder="+1 (555) 123-4567" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input 
                id="industry" 
                name="industry"
                placeholder="e.g., Fashion, Tech, Food" 
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input 
                id="targetAudience" 
                name="targetAudience"
                placeholder="e.g., Young professionals, 25-35" 
                value={formData.targetAudience}
                onChange={handleInputChange}
              />
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
              <Input 
                id="brandVoice" 
                name="brandVoice"
                placeholder="e.g., Professional, Friendly, Bold" 
                value={formData.brandVoice}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="brandValues">Core Values</Label>
              <Textarea 
                id="brandValues" 
                name="brandValues"
                placeholder="What does your brand stand for?"
                rows={3}
                value={formData.brandValues}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Brand Description</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Tell us about your brand..."
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
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
              <Input 
                id="typicalBudget" 
                name="typicalBudget"
                placeholder="$5,000 - $15,000" 
                value={formData.typicalBudget}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="preferredDeliverables">Preferred Deliverables</Label>
              <Input 
                id="preferredDeliverables" 
                name="preferredDeliverables"
                placeholder="Posts, Stories, Reels" 
                value={formData.preferredDeliverables}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
            <Textarea 
              id="brandGuidelines" 
              name="brandGuidelines"
              placeholder="Any specific requirements for creator content..."
              rows={3}
              value={formData.brandGuidelines}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
          Save Brand Profile
        </Button>
      </div>
    </div>
  );
};

export default BrandProfile;

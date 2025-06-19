import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/services/api";
import { companyApi } from "@/services/companyApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  brandName: string;
  websiteUrl: string;
  contactName: string;
  phone: string;
  description: string;
  industry: string;
  targetAudience: string;
}

const BrandProfile = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [website, setWebsite] = useState("");
  const [formData, setFormData] = useState({
    brandName: "",
    websiteUrl: "",
    contactName: "",
    phone: "",
    description: "",
    industry: "",
    targetAudience: "",
  });

  // React Query hook for fetching company profile
  const { data: companyData, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: async () => {
      const response = await companyApi.getMyCompany();
      return response.data;
    },
  });

  // Update form when company data is loaded
  useEffect(() => {
    if (companyData) {
      setFormData({
        brandName: companyData.name || "",
        websiteUrl: companyData.website || "",
        contactName: companyData.owner_name || "",
        phone: companyData.meta?.phone || "",
        description: companyData.description || "",
        industry: companyData.category || "",
        targetAudience: "", // Not available in company data
      });
    }
  }, [companyData]);

  // React Query hook for website analysis
  const {
    data: analysisData,
    refetch: analyzeWebsite,
    isFetching,
  } = useQuery<AnalysisResult>({
    queryKey: ["websiteAnalysis", website],
    queryFn: async () => {
      const response = await apiService.get<{ data: AnalysisResult }>(
        `/company/analyze?url=${encodeURIComponent(website)}`
      );
      return response.data;
    },
    enabled: false, // Don't run automatically
    retry: false,
  });

  // Add mutation for saving brand details
  const saveBrandMutation = useMutation({
    mutationFn: async (brandData: {
      name: string;
      website: string;
      description: string;
      category: string;
      phone: string;
    }) => {
      const response = await apiService.post("/company", brandData);
      return response;
    },
    onSuccess: () => {
      toast({ title: "Brand profile saved successfully!", variant: "default" });
    },
    onError: (error) => {
      toast({ title: "Failed to save brand profile", variant: "destructive" });
      console.error("Save error:", error);
    },
  });

  // Update form data when analysis results are received
  useEffect(() => {
    if (analysisData) {
      setFormData((prev) => ({
        brandName: analysisData.brandName || prev.brandName,
        websiteUrl: analysisData.websiteUrl || prev.websiteUrl,
        contactName: analysisData.contactName || prev.contactName,
        phone: analysisData.phone || prev.phone,
        description: analysisData.description || prev.description,
        industry: analysisData.industry || prev.industry,
        targetAudience: analysisData.targetAudience || prev.targetAudience,
      }));
      toast({ title: "Website analysis completed!", variant: "default" });
    }
  }, [analysisData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAnalyzeWebsite = async () => {
    if (!website) {
      toast({ title: "Please enter a website URL", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    try {
      await analyzeWebsite();
    } catch (error) {
      toast({ title: "Failed to analyze website", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveProfile = async () => {
    // Save to company database
    saveBrandMutation.mutate({
      name: formData.brandName,
      website: formData.websiteUrl,
      description: formData.description,
      category: formData.industry,
      phone: formData.phone,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Brand Profile
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Build your brand identity for personalized outreach
            </p>
          </div>
        </div>

        {isLoadingCompany && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 mr-2 animate-spin text-blue-600" />
            <span>Loading your brand profile...</span>
          </div>
        )}

        <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              AI-Powered Brand Analysis
            </CardTitle>
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
                disabled={!website || isAnalyzing || isFetching}
                className="mt-6 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              >
                {isAnalyzing || isFetching ? (
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
              Our AI will analyze your website to understand your brand
              identity, values, and target audience.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">
              Basic Information
            </CardTitle>
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

        <div className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
            disabled={saveBrandMutation.isPending}
          >
            {saveBrandMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Brand Profile"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;

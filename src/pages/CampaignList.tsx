import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { campaignAPI, CampaignResponse } from "@/services/campaignApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Calendar,
  IndianRupee,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CampaignList = () => {
  // Fetch campaigns using React Query
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useQuery<CampaignResponse>({
    queryKey: ["campaigns"],
    queryFn: () => campaignAPI.getCampaigns(),
    retry: false,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache data
    refetchOnMount: "always", // Always refetch on component mount
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const navigate = useNavigate();

  const apiCampaigns = campaignsData?.data?.items || [];
  const errorDetail = (error as AxiosError<{ detail: string }>)?.response?.data
    ?.detail;
  const isNoCompanyError = errorDetail === "No company found for the user";

  // Format API data to match the expected UI structure
  const campaigns = apiCampaigns.map((apiCampaign) => {
    const budget = apiCampaign.meta?.budget?.total || "0";
    const contentDeliverables = (apiCampaign.meta?.contentDeliverables ||
      "Social Media Content") as string;

    return {
      id: apiCampaign.id,
      name: apiCampaign.name,
      status: apiCampaign.state || "draft",
      budget,
      creatorsContacted: 0,
      creatorsResponded: 0,
      startDate: apiCampaign.start_date,
      endDate: apiCampaign.end_date,
      contentDeliverables,
    };
  });

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

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<null | {
    id: string;
    name: string;
  }>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => campaignAPI.deleteCampaign(id),
    onSuccess: (_, id) => {
      toast.success("Campaign deleted successfully");
      setDeletingId(null);
      setConfirmOpen(false);
      setSelectedCampaign(null);
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: unknown) => {
      const errMsg = error as AxiosError<{ message?: string }>;
      toast.error(
        errMsg?.response?.data?.message || "Failed to delete campaign"
      );
      setDeletingId(null);
      setConfirmOpen(false);
      setSelectedCampaign(null);
    },
  });

  const handleDeleteClick = (campaign: { id: string; name: string }) => {
    setSelectedCampaign(campaign);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCampaign) {
      setDeletingId(selectedCampaign.id);
      deleteMutation.mutate(selectedCampaign.id);
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
            </p>{" "}
          </div>
          <Link to="/dashboard/campaigns/create">
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
    // Check for specific "No company found" error
    const errorDetail = (error as AxiosError<{ detail: string }>)?.response
      ?.data?.detail;
    const isNoCompanyError = errorDetail === "No company found for the user";

    if (isNoCompanyError) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
              <p className="text-gray-600 mt-1">
                Manage your influencer marketing campaigns
              </p>
            </div>
            <Link to="/dashboard/campaigns/create">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isNoCompanyError}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No brand found</p>
            <p className="text-gray-500 text-sm mb-6">
              Create a brand first to start managing campaigns
            </p>{" "}
            <Link to="/dashboard/brand-profile">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Brand
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {" "}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600 mt-1">
              Manage your influencer marketing campaigns
            </p>
          </div>
          <Link to="/dashboard/campaigns/create">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isNoCompanyError}
            >
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

  const campaignsJSX = campaigns.length ? (
    <>
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
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-700"
                      onClick={() =>
                        handleDeleteClick({
                          id: campaign.id,
                          name: campaign.name,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1 text-gray-500">
                  <IndianRupee className="w-3 h-3" />
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
                <p className="text-sm max-w-md">
                  {campaign.contentDeliverables || " "}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 w-full"
                onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold">{selectedCampaign?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) : (
    <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="mb-4">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No campaigns yet
      </h3>
      <p className="text-gray-500 max-w-md mb-6">
        Get started by creating your first campaign to connect with creators and
        launch your influencer marketing strategy.
      </p>{" "}
      <Link to="/dashboard/campaigns/create">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Campaign
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">
            Manage your influencer marketing campaigns
          </p>{" "}
        </div>
        <Link to="/dashboard/campaigns/create">
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isNoCompanyError}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaignsJSX}
      </div>
    </div>
  );
};

export default CampaignList;

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
        <div
          key={campaign.id}
          className="flex flex-col flex-1 basis-full lg:basis-1/2 xl:basis-1/3"
        >
          <Card className="flex flex-col flex-1 w-full rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 px-6 py-4">
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
            <CardContent className="flex-1 flex flex-col pt-2 space-y-4">
              <div className="flex-1 flex flex-col space-y-4">
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
              </div>
              <div className="flex gap-2 pt-2 mt-auto">
                <Button
                  size="sm"
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 font-semibold rounded-xl w-full text-base py-2 transition-all duration-200"
                  onClick={() =>
                    navigate(`/dashboard/campaigns/${campaign.id}`)
                  }
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Campaigns
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              Manage your influencer marketing campaigns
            </p>
          </div>
          <Link to="/dashboard/campaigns/create">
            <Button
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
              disabled={isNoCompanyError}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-6 items-stretch">
          {Array.isArray(campaigns) && campaigns.length > 0
            ? campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex flex-col flex-1 basis-full lg:basis-1/2 xl:basis-1/3"
                >
                  <Card className="flex flex-col flex-1 w-full rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 px-6 py-4">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {campaign.name}
                          </CardTitle>
                          <Badge
                            className={`mt-2 ${getStatusColor(
                              campaign.status
                            )}`}
                          >
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
                    <CardContent className="flex-1 flex flex-col pt-2 space-y-4">
                      <div className="flex-1 flex flex-col space-y-4">
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
                          <p className="text-sm text-gray-500 mb-2">
                            Deliverables
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <p className="text-sm max-w-md">
                              {campaign.contentDeliverables || " "}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 mt-auto">
                        <Button
                          size="sm"
                          className="bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200 font-semibold rounded-xl w-full text-base py-2 transition-all duration-200"
                          onClick={() =>
                            navigate(`/dashboard/campaigns/${campaign.id}`)
                          }
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            : campaignsJSX}
        </div>
      </div>
    </div>
  );
};

export default CampaignList;

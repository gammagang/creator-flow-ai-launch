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

const PageHeader = ({ isNoCompanyError }: { isNoCompanyError: boolean }) => (
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
);

const CampaignList = () => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<null | {
    id: string;
    name: string;
  }>(null);
  const queryClient = useQueryClient();

  // Fetch campaigns using React Query
  const {
    data: campaignsData,
    isLoading,
    error,
  } = useQuery<CampaignResponse>({
    queryKey: ["campaigns"],
    queryFn: () => campaignAPI.getCampaigns(),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const apiCampaigns = campaignsData?.data?.items || [];
  const errorDetail = (error as AxiosError<{ detail: string }>)?.response?.data
    ?.detail;
  const isNoCompanyError = errorDetail === "No company found for the user";

  // Format API data to match the expected UI structure
  const campaigns = apiCampaigns.map((apiCampaign) => ({
    id: apiCampaign.id,
    name: apiCampaign.name,
    status: apiCampaign.state || "draft",
    budget: apiCampaign.meta?.budget?.total || "0",
    creatorsContacted: 0,
    creatorsResponded: 0,
    startDate: apiCampaign.start_date,
    endDate: apiCampaign.end_date,
    contentDeliverables: (apiCampaign.meta?.contentDeliverables ||
      "Social Media Content") as string,
  }));

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

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading campaigns...</span>
      </div>
    );
  } else if (isNoCompanyError) {
    content = (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No brand found</p>
        <p className="text-gray-500 text-sm mb-6">
          Create a brand first to start managing campaigns
        </p>
        <Link to="/dashboard/brand-profile">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Brand
          </Button>
        </Link>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load campaigns</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="flex flex-col rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] transition-all duration-200 px-6 py-4"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge
                      className={`mt-2 ${getStatusColor(campaign.status)}`}
                    >
                      {campaign.status.charAt(0).toUpperCase() +
                        campaign.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-orange-100 rounded-xl transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[160px] rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] p-2"
                      >
                        <DropdownMenuItem
                          className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 cursor-pointer px-3 py-2 text-sm font-medium transition-colors"
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
                        {campaign.contentDeliverables}
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
          ))
        ) : (
          <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="mb-4">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns yet
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              Get started by creating your first campaign to connect with
              creators and launch your influencer marketing strategy.
            </p>
            <Link to="/dashboard/campaigns/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden py-12 px-4 md:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto space-y-10">
        <PageHeader isNoCompanyError={isNoCompanyError} />
        {content}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-3xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000] p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              Delete Campaign
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">
                {selectedCampaign?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-200 font-semibold transition-all hover:-translate-y-0.5"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-[2px_2px_0px_0px_#991b1b] hover:shadow-[3px_3px_0px_0px_#991b1b] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default CampaignList;

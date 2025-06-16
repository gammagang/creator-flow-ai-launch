/* eslint-disable @typescript-eslint/no-explicit-any */
import StatusTag from "@/components/StatusTag";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiService } from "@/services/api";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import { useMutation } from "@tanstack/react-query";
import { Building, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import { toast } from "sonner";

export interface Creator {
  id: number;
  name: string;
  platform: string;
  category?: string;
  age?: number;
  gender?: string;
  location?: string;
  tier?: string;
  engagement_rate?: number;
  email?: string;
  phone?: string;
  language?: string;
  meta?: any;
}

export interface CampaignCreator extends Creator {
  campaign_creator_id: number;
  current_state:
    | "discovered"
    | "outreached"
    | "call complete"
    | "waiting for contract"
    | "waiting for signature"
    | "fulfilled";
  assigned_budget?: number;
  last_state_change_at?: string;
  campaign_creator_meta?: any;
}

interface Company {
  id: string;
  name: string;
  description?: string;
}

const CreatorManagement = ({ campaignId }: { campaignId: number }) => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [creators, setCreators] = useState<CampaignCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete creator from campaign mutation
  const deleteCreatorMutation = useMutation({
    mutationFn: async (linkId: string) => {
      return await campaignCreatorAPI.deleteCampaignCreatorLink(linkId);
    },
    onSuccess: () => {
      toast.success("Creator removed from campaign successfully");
      // Refetch creators data
      fetchData();
    },
    onError: (error: unknown) => {
      console.error("Error removing creator:", error);
      toast.error("Failed to remove creator from campaign");
    },
  });
  const handleRemoveCreator = (creator: CampaignCreator) => {
    deleteCreatorMutation.mutate(creator.campaign_creator_id.toString());
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const creatorsResponse = await apiService.get<{
        data: CampaignCreator[];
      }>(`/campaign/${campaignId}/creator`);
      setCreators(creatorsResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      fetchData();
    }
  }, [campaignId, fetchData]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading creator data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Creator Management
          </h1>
        </div>
        {company && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="w-4 h-4" />
            <span>{company.name}</span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border">
        <div className="flex-1 text-center">
          <div className="text-xl font-bold">{creators.length}</div>
          <div className="text-xs text-gray-500">Total Creators</div>
        </div>
        <div className="w-px h-8 bg-gray-200 mx-4" />
        <div className="flex-1 text-center">
          <div className="text-xl font-bold">
            {creators.filter((c) => c.current_state === "fulfilled").length}
          </div>
          <div className="text-xs text-gray-500">Fulfilled</div>
        </div>
        <div className="w-px h-8 bg-gray-200 mx-4" />
        <div className="flex-1 text-center">
          <div className="text-xl font-bold">
            {formatCurrency(
              creators.reduce(
                (sum, creator) => sum + (creator.assigned_budget || 0),
                0
              )
            )}
          </div>
          <div className="text-xs text-gray-500">Total Budget</div>
        </div>
      </div>

      {/* Creators Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Creators</CardTitle>
        </CardHeader>
        <CardContent>
          {creators.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No creators found for this campaign.
              </p>{" "}
              <Button
                onClick={() => navigate("/dashboard/creators")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Discover Creators
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Current State</TableHead>
                  <TableHead>Engagement Rate</TableHead>
                  <TableHead>Assigned Budget</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => (
                  <TableRow
                    key={creator.campaign_creator_id}
                    onClick={() =>
                      navigate(
                        `/dashboard/campaigns/${campaignId}/creators/${creator.id}/mapping/${creator.campaign_creator_id}`
                      )
                    }
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div>{creator.name}</div>
                        {creator.tier && (
                          <div className="text-sm text-gray-500">
                            {creator.tier}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{creator.platform}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusTag status={creator.current_state} />
                    </TableCell>
                    <TableCell>
                      {creator.engagement_rate
                        ? `${(creator.engagement_rate * 100).toFixed(1)}%`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(creator.assigned_budget)}
                    </TableCell>
                    <TableCell>
                      {formatDate(creator.last_state_change_at)}
                    </TableCell>{" "}
                    <TableCell className="text-right">
                      <div onClick={(e) => e.stopPropagation()}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove Creator from Campaign
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{" "}
                                <strong>{creator.name}</strong> from this
                                campaign? This action cannot be undone and will
                                permanently delete all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveCreator(creator)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Creator
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatorManagement;

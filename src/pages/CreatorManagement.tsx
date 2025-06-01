/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Building } from "lucide-react";
import { apiService } from "@/services/api";

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
  console.log("CreatorManagement component rendered", campaignId);

  const [company, setCompany] = useState<Company | null>(null);
  const [creators, setCreators] = useState<CampaignCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
    };

    if (campaignId) {
      fetchData();
    }
  }, [campaignId]);

  const getStateColor = (state: string) => {
    switch (state) {
      case "discovered":
        return "bg-gray-100 text-gray-800";
      case "outreached":
        return "bg-blue-100 text-blue-800";
      case "call complete":
        return "bg-orange-100 text-orange-800";
      case "waiting for contract":
        return "bg-purple-100 text-purple-800";
      case "waiting for signature":
        return "bg-pink-100 text-pink-800";
      case "fulfilled":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Creators
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creators.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creators.filter((c) => c.current_state === "fulfilled").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Users className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                creators.reduce(
                  (sum, creator) => sum + (creator.assigned_budget || 0),
                  0
                )
              )}
            </div>
          </CardContent>
        </Card>
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
              <p className="text-gray-500">
                No creators found for this campaign.
              </p>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => (
                  <TableRow key={creator.campaign_creator_id}>
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
                      <Badge className={getStateColor(creator.current_state)}>
                        {creator.current_state}
                      </Badge>
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

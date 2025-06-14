import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignStats from "@/components/campaign/CampaignStats";
import CreatorManagement from "@/pages/CreatorManagement";
import { campaignAPI } from "@/services/campaignApi";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

// Define the campaign type based on what the components expect
interface CampaignData {
  id: number;
  name: string;
  status: string;
  budget: string;
  spent: string;
  creatorsContacted: number;
  creatorsResponded: number;
  contractsSigned: number;
  contentDelivered: number;
  startDate: string;
  endDate: string;
  progress: number;
}

const CampaignDetails = () => {
  const { id } = useParams();

  // State for campaign data
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await campaignAPI.getCampaign(id);

        // Transform API response to match component expectations
        const campaignData = response.data;

        const transformedCampaign: CampaignData = {
          id: parseInt(campaignData.id),
          name: campaignData.name,
          status: campaignData.state,
          budget: campaignData.meta.budget.total || "$0",
          spent: "$0", // This would need to come from a separate API endpoint
          creatorsContacted: 0, // These metrics would need to come from separate API endpoints
          creatorsResponded: 0,
          contractsSigned: 0,
          contentDelivered: 0,
          startDate: campaignData.start_date,
          endDate: campaignData.end_date,
          progress: 0, // This would need to be calculated or come from separate API
        };

        setCampaign(transformedCampaign);
      } catch (err: unknown) {
        console.error("Error fetching campaign:", err);
        const errorMessage =
          err instanceof Error && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response
                ?.data?.message || "Failed to fetch campaign data"
            : "Failed to fetch campaign data";
        setError(errorMessage);
        toast.error("Failed to load campaign data");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

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

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading campaign data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      )}

      {campaign && !loading && !error && (
        <div className="space-y-8">
          <section>
            <CampaignHeader
              campaign={campaign}
              getStatusColor={getStatusColor}
            />
          </section>

          <section>
            <CampaignStats campaign={campaign} />
          </section>

          <section>
            <CreatorManagement campaignId={campaign.id} />
          </section>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;

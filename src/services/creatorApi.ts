import { useMutation } from "@tanstack/react-query";
import apiService from "./api";

interface CreatorData {
  name: string;
  platform: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";
  email?: string;
  age?: number;
  gender?: string;
  location?: string;
  tier?: string;
  engagement_rate?: number;
  phone?: string;
  language?: string;
  category?: string;
  meta?: Record<string, unknown>;
}

interface AddCreatorToCampaignRequest {
  campaignId: string;
  creatorData: CreatorData;
  assignedBudget?: number;
  notes?: string;
}

interface AddCreatorToCampaignResponse {
  campaignCreatorId: string;
  campaignId: string;
  creatorId: number;
  creatorName: string;
  creatorPlatform: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";
  campaignName: string;
  currentState: string;
  assignedBudget?: number;
  notes?: string;
  lastStateChangeAt: string;
}

const addCreatorToCampaign = async (data: AddCreatorToCampaignRequest) => {
  const response = await apiService.post<AddCreatorToCampaignResponse>(
    "/creator/add-creator-to-campaign",
    data
  );
  return response; // Backend wraps response in data property
};

export const useAddCreatorToCampaign = () => {
  return useMutation({
    mutationFn: addCreatorToCampaign,
    onError: (error) => {
      console.error("Error adding creator to campaign:", error);
    },
  });
};

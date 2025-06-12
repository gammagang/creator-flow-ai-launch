import { useMutation } from "@tanstack/react-query";
import { apiService } from "./api";

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
  const { campaignId, ...rest } = data;
  const response = await apiService.put<AddCreatorToCampaignResponse>(
    `/campaign/${campaignId}/creator`,
    rest
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

interface DiscoverCreatorsRequest {
  country?: string;
  tier?: string[];
  language?: string[];
  category?: string[];
  er?: string[];
  gender?: string; // Single string value, not array
  bio?: string;
  platform?: "instagram" | "tiktok" | "youtube" | "twitter" | "facebook";
  limit?: number;
  skip?: number;
}

interface DiscoveredCreator {
  id: string;
  name: string;
  platform: string;
  category?: string;
  age?: number;
  gender?: string;
  location?: string | null;
  tier: string;
  engagement_rate: number;
  email?: string;
  phone?: string;
  language?: string;
  followersCount: number;
  postsCount: number;
  averageViews?: number;
  handle: string;
  profileImageUrl?: string;
  profileUrl?: string;
  insightsUrl?: string;
  interests?: string[];
  country?: string;
  state?: string;
  qualityScore?: number;
  effectiveFollowerRate?: number;
  createdAt: string;
  updatedAt: string;
  meta: Record<string, unknown>;
}

interface DiscoverCreatorsResponse {
  creators: DiscoveredCreator[];
  total: number;
  pagination: {
    skip: number;
    limit: number;
    hasMore: boolean;
  };
}

const discoverCreators = async (params: DiscoverCreatorsRequest) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  const response = await apiService.get<{ data: DiscoverCreatorsResponse }>(
    `/creator/discover?${queryParams.toString()}`
  );
  return response.data; // Extract the data property from the wrapper
};

export const useDiscoverCreators = () => {
  return useMutation({
    mutationFn: discoverCreators,
    onError: (error) => {
      console.error("Error discovering creators:", error);
    },
  });
};

// Export types for use in components
export type {
  DiscoverCreatorsRequest,
  DiscoverCreatorsResponse,
  DiscoveredCreator,
};

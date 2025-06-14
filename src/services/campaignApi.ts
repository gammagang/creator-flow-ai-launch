import { apiService } from "./api";

export type CampaignResponse = {
  data: {
    items: Array<{
      id: string;
      company_id: string;
      name: string;
      description?: string;
      start_date: string;
      end_date: string;
      state: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meta: Record<string, any>;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

export interface CampaignData {
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

// Campaign meta structure
interface CampaignMeta {
  budget: {
    total: string;
    perCreator: string;
  };
  deliverables: string[];
  targetAudience: {
    gender: string;
    ageRange: string;
    location: string;
    interests: string[];
  };
  creatorCriteria: {
    followerRange: string;
    minEngagement: string;
  };
  contentDeliverables: string;
}

// Single campaign response type
export type SingleCampaignResponse = {
  data: {
    id: string;
    company_id: string;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    state: string;
    meta: CampaignMeta;
  };
};

// Campaign API functions
export const campaignAPI = {
  // Get all campaigns
  getCampaigns: async () => {
    return apiService.get<CampaignResponse>("/campaign");
  },

  // Get single campaign by ID
  getCampaign: async (campaignId: string) => {
    return apiService.get<SingleCampaignResponse>(`/campaign/${campaignId}`);
  },

  // Create new campaign
  createCampaign: async (campaignData: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget: number;
    ageRange?: string;
    gender?: string;
    interests?: string[];
    deliverables?: string[];
    contentDeliverables?: string;
    totalBudget?: string;
    followerRange?: string;
    minEngagement?: string;
    location?: string;
  }) => {
    return apiService.post<{
      data: {
        id: string;
        name: string;
        description?: string;
        startDate: string;
        endDate: string;
        budget: number;
        companyId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    }>("/campaign", {
      ...campaignData,
      totalBudget: parseFloat(campaignData.totalBudget),
    });
  },

  // GET Creators in Campaign by ID
  getCreatorsInCampaign: async (campaignId: string) => {
    return apiService.get<{
      data: Array<{ id: string; name: string; platform: string }>;
    }>(`/campaign/${campaignId}/creators`);
  },

  // DELETE campaign by ID
  deleteCampaign: async (campaignId: string) => {
    return apiService.delete<{ message: string }>(`/campaign/${campaignId}`);
  },
};

import { apiService, publicAxiosInstance } from "./api";

export type CampaignCreator = {
  id: string;
  campaignId: string;
  creatorId: string;
  currentState: string;
  lastStateChangeAt: string;
  assignedBudget: number;
  notes: string;
  agreedDeliverables: string[];
  contractId: string | null;
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  companyId: string;
  state: string;
  meta: string;
};

export type CampaignCreatorDetailsResponse = {
  campaignCreator: CampaignCreator;
  campaign: Campaign;
};

export type CampaignCreatorLink = {
  id: string;
  campaignId: string;
  creatorId: string;
  status: string;
  agreedDeliverables: string[];
  negotiatedRate: number;
  contractId: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string;
    notes: string;
  }>;
};

export type CampaignCreatorResponse = {
  data: CampaignCreatorLink;
};

export type CampaignCreatorListResponse = {
  data: {
    items: CampaignCreatorLink[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};

// Campaign-Creator API functions
export const campaignCreatorAPI = {
  // Get campaign-creator details with campaign info
  getCampaignCreatorDetails: async (linkId: string) => {
    const response = await publicAxiosInstance.get<{
      data: CampaignCreatorDetailsResponse;
    }>(`/public/campaign_creator_details/${linkId}`);

    return response.data;
  },

  // Get campaign-creator links with filters
  getCampaignCreatorLinks: async (params?: {
    campaignId?: string;
    creatorId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.campaignId) queryParams.append("campaignId", params.campaignId);
    if (params?.creatorId) queryParams.append("creatorId", params.creatorId);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const endpoint = `/campaign-creator${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return apiService.get<CampaignCreatorListResponse>(endpoint);
  },

  // Create campaign-creator link
  createCampaignCreatorLink: async (data: {
    campaignId: string;
    creatorId: string;
    status?: string;
    agreedDeliverables?: string[];
    negotiatedRate?: number;
    notes?: string;
  }) => {
    return apiService.post<CampaignCreatorResponse>("/campaign-creator", data);
  },

  // Update campaign-creator link
  updateCampaignCreatorLink: async (
    linkId: string,
    data: Partial<{
      status: string;
      agreedDeliverables: string[];
      negotiatedRate: number;
      notes: string;
    }>
  ) => {
    return apiService.put<CampaignCreatorResponse>(
      `/campaign-creator/${linkId}`,
      data
    );
  },

  // Delete campaign-creator link
  deleteCampaignCreatorLink: async (linkId: string) => {
    return apiService.delete(`/campaign-creator/${linkId}`);
  },

  // Create payment for campaign-creator
  createPayment: async (
    linkId: string,
    data: {
      amount: number;
      paymentMethod: string;
      notes?: string;
    }
  ) => {
    return apiService.post(`/campaign-creator/${linkId}/payments`, data);
  },

  // GET campaign creator mapping by campaign_creator_id
  getCampaignCreatorMapping: async (mappingId: string) => {
    return apiService.get<{
      data: any;
    }>(`/campaign-creator/${mappingId}`);
  },
};

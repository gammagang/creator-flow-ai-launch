import { apiService, publicAxiosInstance } from "./api";

export type CampaignCreator = {
  id: string;
  campaignId: string;
  creatorId: string;
  currentState:
    | "discovered"
    | "outreached"
    | "call complete"
    | "waiting for contract"
    | "waiting for signature"
    | "fulfilled";
  lastStateChangeAt: string;
  assignedBudget: number;
  notes: string;
  contentDeliverables: string;
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

export type CreatorMeta = {
  handle: string;
  source: string;
  status: string;
  quality: {
    profile_quality_score: number;
    profile_quality_rating: number;
  };
  audience: null;
  ylyticId: string;
  postsCount: number;
  profileUrl: string;
  averageViews: number;
  inMyCreators: boolean;
  qualityScore: number;
  followersCount: number;
  profileImageUrl: string;
};

export type Creator = {
  id: string;
  name: string;
  platform: string;
  category: string;
  age: number;
  gender: string;
  location: string | null;
  tier: string;
  engagementRate: string;
  email: string | null;
  phone: string | null;
  language: string;
  meta: CreatorMeta;
};

export type CampaignCreatorDetailsResponse = {
  campaignCreator: CampaignCreator;
  campaign: Campaign;
  creator: Creator;
};

export type CampaignCreatorLink = {
  id: string;
  campaignId: string;
  creatorId: string;
  status: string;
  negotiatedRate: number;
  contentDeliverables: string;
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

// Define types based on the API response
export type CampaignCreatorMapping = {
  cc_id: string;
  campaign_creator_current_state: string;
  assigned_budget: number | null;
  cc_notes: string | null;
  campaign_creator_meta: Record<string, unknown>;
  campaign_id: string;
  company_id: string;
  campaign_name: string;
  campaign_description: string;
  campaign_start_date: string;
  campaign_end_date: string;
  campaign_state: string;
  campaign_meta: {
    budget: {
      total: string;
      perCreator: string;
    };
    deliverables: Array<{
      type: string;
      description: string;
      quantity: number;
    }>;
    targetAudience: {
      gender: string;
      ageRange: string;
      location: string;
      interests: Array<{
        name: string;
        category: string;
      }>;
    };
    creatorCriteria: {
      followerRange: string;
      minEngagement: string;
    };
    contentDeliverables: string;
  };
  creator_id: string;
  creator_name: string;
  creator_platform: string;
  creator_category: string;
  creator_age: number;
  creator_gender: string;
  creator_location: string | null;
  creator_tier: string;
  creator_engagement_rate: string;
  creator_email: string | null;
  creator_phone: string | null;
  creator_language: string;
  creator_meta: {
    ylyticId?: string;
    source?: string;
    status?: string;
    inMyCreators?: boolean;
    audience?: {
      demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
      };
      interests: Array<{
        name: string;
        percentage: number;
      }>;
    };
    quality?: {
      profile_quality_score: number;
      profile_quality_rating: number;
    };
    handle?: string;
    followersCount?: number;
    postsCount?: number;
    averageViews?: number;
    profileImageUrl?: string;
    profileUrl?: string;
    qualityScore?: number;
  };
};

export type OutreachPreviewResponse = {
  data: {
    message: string;
    subject: string;
    body: string;
  };
};

export type SendOutreachResponse = {
  data: {
    success: boolean;
    message: string;
  };
};

// Campaign-Creator API functions
export const campaignCreatorAPI = {
  // Get campaign-creator details with campaign info
  getCampaignCreatorDetails: async (linkId: string) => {
    const response = await publicAxiosInstance.get<{
      data: CampaignCreatorDetailsResponse;
    }>(`/public/campaign-creator-details/${linkId}`);

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
      negotiatedRate: number;
      notes: string;
      contentDeliverables: string;
    }>
  ) => {
    return apiService.put<CampaignCreatorResponse>(
      `/campaign-creator/${linkId}`,
      data
    );
  },

  // Update campaign-creator state specifically
  updateCampaignCreatorState: async (linkId: string, newState: string) => {
    return apiService.put<CampaignCreatorResponse>(
      `/campaign-creator/${linkId}`,
      { status: newState }
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

  // Send outreach to creator
  getOutreachPreview: async (campaignCreatorMappingId: string) => {
    return apiService.get<OutreachPreviewResponse>(
      `/campaign-creator/${campaignCreatorMappingId}/outreach/preview`
    );
  },

  // Send outreach email to creator
  sendOutreach: async (
    campaignCreatorMappingId: string,
    data: { subject: string; body: string; receiverEmail: string }
  ) => {
    return apiService.post<SendOutreachResponse>(
      `/campaign-creator/${campaignCreatorMappingId}/outreach/send`,
      data
    );
  },

  // GET campaign creator mapping by campaign_creator_id
  getCampaignCreatorMapping: async (mappingId: string) => {
    return apiService.get<{
      data: CampaignCreatorMapping;
    }>(`/campaign-creator/${mappingId}`);
  },
};

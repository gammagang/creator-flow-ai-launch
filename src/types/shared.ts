export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  deliverables?: string[];
  status?: string;
  totalBudget?: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: string;
  category?: string;
  followersCount: number;
  tier: string;
  engagement_rate: number;
  location?: string | null;
  country?: string;
  state?: string;
  gender?: string;
  language?: string;
  profileImageUrl?: string;
  profileUrl?: string;
  interests?: string[];
  qualityScore?: number;
  averageViews?: number;
  postsCount?: number;
  age?: number;
  email?: string;
  phone?: string;
  insightsUrl?: string;
  effectiveFollowerRate?: number;
  createdAt?: string;
  updatedAt?: string;
  meta?: Record<string, unknown>;
}

export interface ToolCallResult {
  toolCallId: string;
  functionName: string;
  result: {
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

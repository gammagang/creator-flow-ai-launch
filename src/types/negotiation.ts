export interface TranscriptMessage {
  role: "assistant" | "ai" | "agent" | "user" | "creator" | string;
  message: string;
  timeInCall?: number;
}

export interface NegotiationTranscription {
  id: string;
  campaignCreatorId: string;
  negotiationType: string;
  startedAt: string;
  endedAt: string;
  outcome: string;
  transcript: TranscriptMessage[] | string;
  summary: string;
  deliverables: string;
  agreedPrice: number;
  timeline: string;
  callRecordingUrl: string | null;
  meta: Record<string, unknown>;
  campaignCreatorState: string;
  campaignName: string;
  creatorName: string;
}

export interface NegotiationTranscriptionsResponse {
  negotiations: NegotiationTranscription[];
  totalCount: number;
  message?: string;
}

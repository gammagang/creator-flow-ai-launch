import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { campaignCreatorAPI } from "@/services/campaignCreatorApi";
import type {
  NegotiationTranscription,
  TranscriptMessage,
} from "@/types/negotiation";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const NegotiationTranscription = () => {
  const { mappingId } = useParams();
  const [selectedNegotiation, setSelectedNegotiation] =
    useState<NegotiationTranscription | null>(null);
  // Use React Query to fetch negotiation transcriptions
  const {
    data: negotiationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["negotiation-transcriptions", mappingId],
    queryFn: async () => {
      if (!mappingId) throw new Error("No mapping ID provided");
      const response = await campaignCreatorAPI.getNegotiationTranscriptions(
        mappingId
      );
      return response.data;
    },
    enabled: !!mappingId,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
  });
  // Extract negotiations from response data
  const negotiations = useMemo(
    () => negotiationsData?.negotiations || [],
    [negotiationsData?.negotiations]
  );

  // Auto-select the first negotiation when data loads
  useEffect(() => {
    if (negotiations.length > 0 && !selectedNegotiation) {
      setSelectedNegotiation(negotiations[0]);
    }
  }, [negotiations, selectedNegotiation]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load negotiation transcriptions"
      );
    }
  }, [error]);
  const formatDate = (dateString: string, includeTime = false) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "successful":
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
      case "failure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "successful":
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
      case "failure":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDuration = (startedAt: string, endedAt: string) => {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };
  const renderTranscript = (transcript: TranscriptMessage[] | string) => {
    if (typeof transcript === "string") {
      try {
        const parsed = JSON.parse(transcript);
        if (Array.isArray(parsed)) {
          return renderTranscriptMessages(parsed);
        }
      } catch {
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 max-w-md">{transcript}</p>
            </div>
          </div>
        );
      }
    }

    if (Array.isArray(transcript)) {
      return renderTranscriptMessages(transcript);
    }

    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No transcript available</p>
        </div>
      </div>
    );
  };
  const renderTranscriptMessages = (messages: TranscriptMessage[]) => {
    const isAgentRole = (role: string) => {
      return role === "assistant" || role === "ai" || role === "agent";
    };

    const getRoleDisplayName = (role: string) => {
      return isAgentRole(role) ? "AI Agent" : "Creator";
    };

    const formatTimeInCall = (timeInCall: number) => {
      const minutes = Math.floor(timeInCall / 60);
      const seconds = timeInCall % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
      <div className="space-y-4 p-4">
        {messages.map((msg, index) => {
          const isAgent = isAgentRole(msg.role);
          return (
            <div
              key={index}
              className={`flex ${
                isAgent ? "justify-start" : "justify-end"
              } w-full`}
            >
              <div
                className={`flex max-w-[80%] ${
                  isAgent ? "flex-row" : "flex-row-reverse"
                } gap-3 items-end`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isAgent ? "bg-orange-500" : "bg-purple-500"
                    }`}
                  >
                    {isAgent ? (
                      <Bot className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Message bubble */}
                <div
                  className={`flex flex-col ${
                    isAgent ? "items-start" : "items-end"
                  }`}
                >
                  {/* Sender name and time */}
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      isAgent ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {getRoleDisplayName(msg.role)}
                    </span>
                    {typeof msg.timeInCall === "number" && (
                      <span className="text-xs text-gray-400">
                        {formatTimeInCall(msg.timeInCall)}
                      </span>
                    )}
                  </div>

                  {/* Message content */}
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-full break-words ${
                      isAgent
                        ? "bg-orange-50 text-gray-800 rounded-bl-sm border border-orange-200"
                        : "bg-purple-500 text-white rounded-br-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            Loading negotiation transcriptions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to fetch negotiation transcriptions"}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isRefetching}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            {isRefetching ? "Retrying..." : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Negotiations Found
          </h3>
          <p className="text-gray-600 mb-4">
            This creator hasn't had any negotiation calls yet.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            disabled={isRefetching}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Sidebar - Negotiation List */}
      <div className="lg:col-span-1">
        <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Negotiation History
              </CardTitle>
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isRefetching}
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white rounded-xl shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {negotiations.map((negotiation) => (
                  <div
                    key={negotiation.id}
                    onClick={() => setSelectedNegotiation(negotiation)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedNegotiation?.id === negotiation.id
                        ? "bg-orange-50 border-orange-300 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getOutcomeColor(negotiation.outcome)}>
                        {getOutcomeIcon(negotiation.outcome)}
                        <span className="ml-1">{negotiation.outcome}</span>
                      </Badge>
                      <Badge variant="outline">
                        {negotiation.negotiationType}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />{" "}
                        <span className="text-gray-600">
                          {formatDate(negotiation.startedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatDuration(
                            negotiation.startedAt,
                            negotiation.endedAt
                          )}
                        </span>
                      </div>

                      {negotiation.agreedPrice && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            ${negotiation.agreedPrice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Right Side - Selected Negotiation Details */}
      <div className="lg:col-span-2">
        {isRefetching && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-800">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Refreshing negotiations...</span>
            </div>
          </div>
        )}

        {selectedNegotiation ? (
          <div className="space-y-6">
            {/* Negotiation Overview */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Negotiation Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Call Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Time:</span>{" "}
                        <span className="font-medium">
                          {formatDate(selectedNegotiation.startedAt, true)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Time:</span>{" "}
                        <span className="font-medium">
                          {formatDate(selectedNegotiation.endedAt, true)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {formatDuration(
                            selectedNegotiation.startedAt,
                            selectedNegotiation.endedAt
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">
                          {selectedNegotiation.negotiationType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Negotiation Results
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedNegotiation.agreedPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Agreed Price:</span>
                          <span className="font-medium text-green-600">
                            ${selectedNegotiation.agreedPrice}
                          </span>
                        </div>
                      )}
                      {selectedNegotiation.deliverables && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deliverables:</span>
                          <span className="font-medium">
                            {selectedNegotiation.deliverables}
                          </span>
                        </div>
                      )}
                      {selectedNegotiation.timeline && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium">
                            {selectedNegotiation.timeline}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Outcome:</span>
                        <Badge
                          className={getOutcomeColor(
                            selectedNegotiation.outcome
                          )}
                        >
                          {getOutcomeIcon(selectedNegotiation.outcome)}
                          <span className="ml-1">
                            {selectedNegotiation.outcome}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedNegotiation.summary && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {selectedNegotiation.summary}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversation Transcript
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] w-full rounded-b-3xl">
                  <div className="min-h-full bg-gray-50 rounded-b-3xl">
                    {renderTranscript(selectedNegotiation.transcript)}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="rounded-3xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-[4px_4px_0px_0px_#000]">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select a negotiation to view details
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NegotiationTranscription;

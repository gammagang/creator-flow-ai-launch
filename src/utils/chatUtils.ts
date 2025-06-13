import type { ToolCallResult } from "@/services/chatApi";

export const formatToolCallResult = (toolCall: ToolCallResult) => {
  const { functionName, result } = toolCall;
  if (!result.success) {
    return `Tool call (${functionName}) failed: ${
      result.error || "Unknown error"
    }`;
  }
  return `Tool call (${functionName}) result:\n${JSON.stringify(
    result.data,
    null,
    2
  )}`;
};

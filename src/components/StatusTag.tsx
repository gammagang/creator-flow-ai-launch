import React from "react";
import { Badge } from "@/components/ui/badge";

export type CreatorState =
  | "discovered"
  | "outreached"
  | "call complete"
  | "waiting for contract"
  | "waiting for signature"
  | "fulfilled";

interface StatusTagProps {
  status: CreatorState | string;
  className?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, className = "" }) => {
  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      discovered: {
        label: "Discovered",
        color: "bg-emerald-100 text-emerald-800",
      },
      outreached: {
        label: "Outreached",
        color: "bg-blue-100 text-blue-800",
      },
      "call complete": {
        label: "Call Complete",
        color: "bg-indigo-100 text-indigo-800",
      },
      "waiting for contract": {
        label: "Contract Pending",
        color: "bg-amber-100 text-amber-800",
      },
      "waiting for signature": {
        label: "Signature Pending",
        color: "bg-orange-100 text-orange-800",
      },
      fulfilled: {
        label: "Fulfilled",
        color: "bg-green-500 text-white",
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
      },
      accepted: {
        label: "Accepted",
        color: "bg-blue-100 text-blue-800",
      },
      completed: {
        label: "Completed",
        color: "bg-purple-100 text-purple-800",
      },
    };

    return (
      statusMap[status.toLowerCase()] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={`${config.color} ${className}`}>{config.label}</Badge>
  );
};

export default StatusTag;

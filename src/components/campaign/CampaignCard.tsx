import React from "react";
import type { Campaign } from "@/types/shared";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-sm text-gray-900 truncate">
              {campaign.name}
            </div>
            <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide">
              {campaign.status}
            </div>
          </div>
          {campaign.startDate && campaign.endDate && (
            <div className="text-xs text-gray-500 mt-2">
              {new Date(campaign.startDate).toLocaleDateString()} -{" "}
              {new Date(campaign.endDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;

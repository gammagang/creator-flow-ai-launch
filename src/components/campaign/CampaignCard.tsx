import React from "react";
import type { Campaign } from "@/types/shared";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white/90 backdrop-blur-sm hover:bg-white hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="font-bold text-base text-gray-800 truncate">
              {campaign.name}
            </div>
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-xl border border-blue-200 uppercase tracking-wide">
              {campaign.status}
            </div>
          </div>
          {campaign.description && (
            <div className="text-sm text-gray-600 font-medium mb-2 line-clamp-2">
              {campaign.description}
            </div>
          )}
          {campaign.startDate && campaign.endDate && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 p-2 bg-gray-50 border border-gray-200 rounded-xl">
              <span className="font-medium">
                {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;

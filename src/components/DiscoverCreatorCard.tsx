import React from "react";
import type { DiscoveredCreator } from "@/services/creatorApi";

interface DiscoverCreatorCardProps {
  creator: DiscoveredCreator;
  onViewProfile?: (creator: DiscoveredCreator) => void;
}

const DiscoverCreatorCard: React.FC<DiscoverCreatorCardProps> = ({
  creator,
  onViewProfile,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {creator.profileImageUrl ? (
              <img
                src={creator.profileImageUrl}
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base border border-gray-200">
                {creator.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-semibold text-sm text-gray-900 truncate">
                {creator.name}
              </div>
              <div className="text-xs text-gray-500">@{creator.handle}</div>
            </div>
          </div>
          <div className="text-xs text-gray-600 mb-2 line-clamp-2">
            {creator.category || "No category specified"}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              {creator.followersCount?.toLocaleString() || 0} followers
            </span>
            {creator.averageViews && (
              <span>{creator.averageViews.toLocaleString()} avg views</span>
            )}
            {creator.engagement_rate && (
              <span>
                {(creator.engagement_rate * 100).toFixed(1)}% engagement
              </span>
            )}
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            if (creator.profileUrl) {
              window.open(creator.profileUrl, "_blank", "noopener,noreferrer");
            }
          }}
          disabled={!creator.profileUrl}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DiscoverCreatorCard;

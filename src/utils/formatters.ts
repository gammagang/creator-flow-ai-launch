/**
 * Formats large numbers into readable format (K, M)
 */
export const formatNumber = (num?: number): string => {
  if (!num && num !== 0) return "N/A";
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formats follower count with optional handling for undefined values
 */
export const formatFollowerCount = (count?: number): string => {
  return formatNumber(count);
};

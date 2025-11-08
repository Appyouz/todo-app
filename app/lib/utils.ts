/**
 * Formats duration in milliseconds to a human-readable string (e.g., "20m 15s").
 * Returns an empty string if the duration is null or zero.
 */
export const formatDuration = (ms: number | null): string => {
  if (ms === null || ms === 0) return "";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const minutePart = minutes > 0 ? `${minutes}m ` : "";
  const secondPart = `${remainingSeconds}s`;

  return `${minutePart}${secondPart}`;
};

// Formats a number of seconds as m:ss for the audio player's time label, e.g. 65 -> '1:05'.
export function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds}`;
}

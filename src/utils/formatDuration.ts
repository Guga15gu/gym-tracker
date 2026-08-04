export function formatDuration(timeMs: number): string {
  const totalSeconds = Math.floor(timeMs / 1000);
  const seconds = totalSeconds % 60;

  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;

  const totalHours = Math.floor(totalMinutes / 60);

  const secondsStr = String(seconds).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const hoursStr = String(totalHours).padStart(2, "0");

  return `${hoursStr}h${minutesStr}min${secondsStr}s`;
}

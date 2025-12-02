// Progress display utilities for long-running operations

const SPINNER_FRAMES = ["|", "/", "-", "\\"];

export function showProgress(elapsed: number, status: string): void {
  const frame = SPINNER_FRAMES[Math.floor(elapsed) % SPINNER_FRAMES.length];
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  process.stdout.write(`\r${frame} ${status} (${timeStr} elapsed)`);
}

export function clearProgress(): void {
  process.stdout.write("\r\x1b[K"); // Clear the line
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

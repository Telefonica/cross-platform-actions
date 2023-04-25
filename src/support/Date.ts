export function formattedNow(): string {
  // Format YYYY-MM-DDTHH:MM
  return new Date().toJSON().slice(0, 16);
}

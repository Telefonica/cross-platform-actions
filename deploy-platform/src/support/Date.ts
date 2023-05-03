export function formattedNow(): string {
  // cspell: disable-next-line
  // Format "YYYY-MM-DDTHH:MM"
  return new Date().toJSON().slice(0, 16);
}

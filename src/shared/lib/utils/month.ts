export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
}

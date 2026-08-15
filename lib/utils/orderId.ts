export function generateOrderId(date: Date, sequence: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const seq = String(sequence).padStart(3, "0");
  return `JACK-${y}${m}${d}-${seq}`;
}

export function formatCurrency(amount: number): string {
  return `\u09f3${amount.toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

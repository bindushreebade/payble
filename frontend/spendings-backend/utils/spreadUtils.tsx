export function getSpreadColor(dates: string[]): "green" | "yellow" | "red" {
  const parsedDates = dates.map(date => new Date(date).getTime());
  parsedDates.sort((a, b) => a - b);

  const gaps = parsedDates.slice(1).map((d, i) => d - parsedDates[i]);
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;

  const variance = gaps.reduce((sum, g) => sum + (g - avg) ** 2, 0) / gaps.length;

  if (variance < 3 * 24 * 60 * 60 * 1000) return "green";
  if (variance < 7 * 24 * 60 * 60 * 1000) return "yellow";
  return "red";
}

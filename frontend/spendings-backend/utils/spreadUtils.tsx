export function getSpreadColor(dates) {
  if (!dates || dates.length === 0) return 'green';

  // Convert to timestamps
  const timestamps = dates.map(date => new Date(date).getTime());

  // Find min and max
  const minDate = Math.min(...timestamps);
  const maxDate = Math.max(...timestamps);

  // Difference in days
  const diffDays = Math.floor((maxDate - minDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 10) return 'red';      // Clumped
  if (diffDays <= 20) return 'yellow';   // Somewhat okay
  return 'green';                        // Evenly spread
}

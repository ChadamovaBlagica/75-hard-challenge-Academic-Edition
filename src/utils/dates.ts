
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDayNumber(startDate: string, currentDate = new Date()): number {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const difference = Math.floor(
    (current.getTime() - start.getTime()) / 86_400_000
  );

  return difference + 1;
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

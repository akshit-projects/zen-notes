
// Helper to format date to 'YYYY-MM-DD'
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get all dates for the week of a given date (Mon-Sun)
export const getWeekDates = (currentDate: Date): Date[] => {
  const dates: Date[] = [];
  const date = new Date(currentDate);
  const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, ...
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(date.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(monday);
    weekDate.setDate(monday.getDate() + i);
    dates.push(weekDate);
  }
  return dates;
};

// Helper to get month and year string, e.g., "July 2024"
export const getMonthYear = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

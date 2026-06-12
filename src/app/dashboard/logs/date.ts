import { format } from "date-fns";

/**
 * Formats a date into a long date and time string.
 * e.g., "October 26, 2023 at 10:30:00 AM"
 * @param date - The date to format (can be a Firebase Timestamp, Date object, or string).
 * @returns The formatted date string, or "Just now" if the date is null/undefined.
 */
export const formatLongDateTime = (date: any): string => {
  if (!date) return "Just now";
  
  const d = date.toDate ? date.toDate() : new Date(date);
  
  return format(d, "MMMM d, yyyy 'at' h:mm:ss a");
};
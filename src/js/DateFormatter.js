// src/js/DateFormatter.js
import { format, parseISO, isValid } from 'date-fns';
export class DateFormatter {
  formatDate(dateString) {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy') : dateString;
  }
}

/**
 * Utility class for date formatting operations
 * - Uses date-fns library for date manipulation
 * - Handles date parsing and formatting
 * - Ensures consistent date display across the application
 */

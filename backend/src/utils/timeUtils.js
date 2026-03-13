// Utilities for working with dates and times.
// All stored times are UTC in the DB.

function toDateOnlyString(date) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:MM) treating
 * them as UTC (used for server-side rule calculations where times are
 * stored as UTC-normalized values from the availability schedule).
 */
function combineDateAndTimeUtc(dateString, timeString) {
  // dateString: 'YYYY-MM-DD', timeString: 'HH:MM'
  const [year, month, day] = dateString.split('-').map(Number);
  const [hour, minute] = timeString.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
}

/**
 * Combines a date string (YYYY-MM-DD) and time string (HH:MM) treating
 * them as local time in the given IANA timezone, then converts to UTC.
 * This is used when the user selects a slot in their local timezone.
 *
 * @param {string} dateString - 'YYYY-MM-DD'
 * @param {string} timeString - 'HH:MM'
 * @param {string} timezone - IANA timezone string e.g. 'Asia/Kolkata'
 * @returns {Date} UTC Date object
 */
function combineDateAndTimeInTz(dateString, timeString, timezone) {
  try {
    // Build an ISO-like string and parse it in the given timezone using Intl
    const localStr = `${dateString}T${timeString}:00`;

    // Use the trick of formatting epoch 0 in target TZ to get its UTC offset
    // We use the Temporal-polyfill-free approach: parse using Intl.DateTimeFormat
    // to determine the UTC offset for that specific date/time in that timezone.

    // Step 1: Assume the time is UTC and then figure out what UTC time corresponds
    // to that local time in the given timezone.
    const naiveUtc = new Date(localStr + 'Z'); // treat as UTC initially

    // Step 2: Get the formatter to interpret the naive UTC time in the target TZ
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(naiveUtc);
    const getPart = (type) => parts.find((p) => p.type === type)?.value ?? '0';

    const localYear = parseInt(getPart('year'), 10);
    const localMonth = parseInt(getPart('month'), 10) - 1;
    const localDay = parseInt(getPart('day'), 10);
    const localHour = parseInt(getPart('hour'), 10) % 24; // handle 24 -> 0
    const localMinute = parseInt(getPart('minute'), 10);

    // Step 3: Calculate offset = (naive UTC time) - (local time interpreted as UTC)
    const localAsUtc = new Date(Date.UTC(localYear, localMonth, localDay, localHour, localMinute, 0));
    const offsetMs = naiveUtc.getTime() - localAsUtc.getTime();

    // Step 4: The actual UTC time = naive UTC time + offset
    return new Date(naiveUtc.getTime() + offsetMs);
  } catch {
    // Fallback: treat as UTC
    return combineDateAndTimeUtc(dateString, timeString);
  }
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function formatTimeHHMM(date) {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a UTC date to display HH:MM in the given timezone.
 */
function formatTimeInTz(date, timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
    const hour = parseInt(h, 10) % 24;
    return `${String(hour).padStart(2, '0')}:${m}`;
  } catch {
    return formatTimeHHMM(date);
  }
}

module.exports = {
  toDateOnlyString,
  combineDateAndTimeUtc,
  combineDateAndTimeInTz,
  addMinutes,
  formatTimeHHMM,
  formatTimeInTz,
};

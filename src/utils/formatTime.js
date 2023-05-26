import { format, getTime, formatDistanceToNow } from 'date-fns';
import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
    return date
        ? formatDistanceToNow(new Date(date), {
            addSuffix: true,
        })
        : '';}

function formatTime(timeArr) {
    let [year, month, day, hour, minute, second] = timeArr;
    month -= 1; // adjust month index to JavaScript Date's 0-11
    hour -= 3; // adjust hour for Turkey's timezone (UTC+3)

    const dateObj = new Date(Date.UTC(year, month, day, hour, minute, second));

    return formatDistanceToNow(dateObj, {addSuffix: true});
}


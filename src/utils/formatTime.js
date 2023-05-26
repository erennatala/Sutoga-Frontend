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
    if (!date) return '';

    try {
        const dateArray = Array.isArray(date) ? date : [date];
        const parsedDates = dateArray.map((d) => {
            if (typeof d === 'string') {
                return new Date(d);
            } else if (Array.isArray(d) && d.length >= 5) {
                const month = d[1] - 1;  // adjust month index to JavaScript Date's 0-11
                const hour = d[3] - 3;  // adjust hour for Turkey's timezone (UTC+3)
                return new Date(d[0], month, d[2], hour, d[4]);
            } else {
                return null;
            }
        });

        return parsedDates.map((parsedDate) => {
            return formatDistanceToNow(parsedDate, {addSuffix: true});
        }).join(', ');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}


function formatTime(timeArr) {
    let [year, month, day, hour, minute, second] = timeArr;
    month -= 1; // adjust month index to JavaScript Date's 0-11
    hour -= 3; // adjust hour for Turkey's timezone (UTC+3)

    const dateObj = new Date(Date.UTC(year, month, day, hour, minute, second));

    return formatDistanceToNow(dateObj, {addSuffix: true});
}


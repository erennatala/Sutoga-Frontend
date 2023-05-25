import { format, getTime, formatDistanceToNow } from 'date-fns';


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
            } else if (Array.isArray(d) && d.length === 7) {
                const month = d[1] - 1;
                return new Date(d[0], month, d[2], d[3], d[4], d[5], d[6]);
            } else {
                return null;
            }
        });

        return parsedDates.map((parsedDate) => {
            const now = new Date();
            const diff = Math.floor((now.getTime() - parsedDate.getTime()) / (1000 * 60));
            return `${-diff} minutes ago`;
        }).join(', ');
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

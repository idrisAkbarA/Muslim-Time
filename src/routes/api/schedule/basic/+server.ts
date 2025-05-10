import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const LATITUDE = -0.5071;   // Pekanbaru
    const LONGITUDE = 101.4478;
    const METHOD = 2;           // Muslim World League
    const today = dayjs();
    const year = today.year();
    const month = today.month() + 1; // month() is 0-indexed

    let calendar = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//My Prayer Calendar//EN'
    ];

    // Fetch monthly prayer times
    const res = await fetch(`https://api.aladhan.com/v1/calendar?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=${METHOD}&month=${month}&year=${year}`);
    const data = await res.json();
    const days = data.data;

    for (const day of days) {
        const dateStr = day.date.gregorian.date; // "YYYY-MM-DD"
        const timings = day.timings;

        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        prayers.forEach(name => {
            const time = timings[name].split(' ')[0]; // "HH:MM"
            const [hour, minute] = time.split(':');
            const dt = dayjs.utc(`${dateStr}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00Z`);

            const start = dt.format('YYYYMMDDTHHmmss') + 'Z';
            const end = dt.add(10, 'minute').format('YYYYMMDDTHHmmss') + 'Z';

            calendar.push(
                'BEGIN:VEVENT',
                `UID:${name.toLowerCase()}-${dateStr}@homelab`,
                `DTSTAMP:${start}`,
                `DTSTART:${start}`,
                `DTEND:${end}`,
                `SUMMARY:${name} Prayer`,
                'END:VEVENT'
            );
        });

        // Fasting Days (Monday or Thursday)
        const weekday = dayjs(dateStr).day(); // 0 = Sunday
        if (weekday === 1 || weekday === 4) {
            calendar.push(
                'BEGIN:VEVENT',
                `UID:fasting-${dateStr}@homelab`,
                `DTSTAMP:${dayjs(dateStr).format('YYYYMMDD')}T000000Z`,
                `DTSTART;VALUE=DATE:${dateStr.replace(/-/g, '')}`,
                `SUMMARY:Fasting Day (Monday/Thursday)`,
                'END:VEVENT'
            );
        }
    }

    calendar.push('END:VCALENDAR');

    const icsContent = calendar.join('\r\n');

    return new Response(icsContent, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename="prayer-schedule.ics"'
        }
    });
}
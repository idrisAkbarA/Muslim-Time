import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { createEvents} from 'ics';

dayjs.extend(customParseFormat)
dayjs.extend(utc);

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const LATITUDE = -0.5071;   // Pekanbaru
    const LONGITUDE = 101.4478;
    const METHOD = 20;           // Muslim World League
    const today = dayjs();
    const year = today.year();
    const month = today.month() + 1; // month() is 0-indexed

    // let calendar = [
    //     'BEGIN:VCALENDAR',
    //     'VERSION:2.0',
    //     'PRODID:-//My Prayer Calendar//EN'
    // ];

    // Fetch monthly prayer times
    const url = `https://api.aladhan.com/v1/calendar?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=${METHOD}&month=${month}&year=${year}`
    console.log(url);
    
    const res = await fetch(url);
    const data = await res.json();
    const days = data.data;
    
    let events = [];
    for (const day of days) {
        // console.log(day);
        const dateStr = day.date.gregorian.date; // "YYYY-MM-DD"
        const timings = day.timings;
        const dateFormat = day.date.gregorian.format;
        const apiDate = dayjs(dateStr,dateFormat)
        
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        prayers.forEach(name => {
            const time = timings[name].split(' ')[0]; // "HH:MM"
            const [hour, minute] = time.split(':');
            const prayerDate = dayjs(`${dateStr} ${hour.padStart(2,'0')}:${minute.padStart(2,'0')}`,`${dateFormat} H:mm`)
            const prepPrayerDate =  prayerDate.clone().subtract(10,'minutes')

            // console.log(`${name}: ${prayerDate.format('YYYY-MM-DD')}`);
            console.log(prayerDate.format(`${dateFormat} H:mm`))
            // console.log(`${dateStr} ${hour.padStart(2,'0')}:${minute.padStart(2,'0')}`, `${dateFormat} H:mm`);
            
            const eventPrayerPrep = {
                start: [prepPrayerDate.year(), prepPrayerDate.month(), prepPrayerDate.date(), prepPrayerDate.hour() , prepPrayerDate.minute()],
                duration: { hours: 0, minutes: 10 },
                title: `Prepare for ${name} Prayer`,
                description: 'Lets take wudhu, put on prayer clothes and start to go to the mosque!',
                location: 'Mosque',
                // url: 'http://www.bolderboulder.com/',
                // geo: { lat: 40.0095, lon: 105.2669 },
                categories: ['Mandatory Prayer'],
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
                // attendees: [
                //   { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
                //   { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
                // ]
              }
            
            const eventPrayer = {
                start:  [prayerDate.year(), prayerDate.month(), prayerDate.date(), prayerDate.hour() , prayerDate.minute()],
                duration: { hours: 0, minutes: 30 },
                title: `${name} Prayer`,
                description: 'Lets go to pray!',
                location: 'Mosque',
                // url: 'http://www.bolderboulder.com/',
                // geo: { lat: 40.0095, lon: 105.2669 },
                categories: ['Mandatory Prayer'],
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
                // attendees: [
                //   { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
                //   { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
                // ]
              }

              events.push(eventPrayerPrep);
              events.push(eventPrayer);
        });

        // Fasting Days (Monday or Thursday)
        const weekday = apiDate.day(); // 0 = Sunday
        
        if (weekday === 1 || weekday === 4) {
            const event = {
                start:[apiDate.year(), apiDate.month(), apiDate.date(), 0, 0],
                duration: { days: 1 },
                title: `Fasting Day!`,
                description: 'Monday/Thursday Fasting',
                // location: 'Mosque',
                // url: 'http://www.bolderboulder.com/',
                // geo: { lat: 40.0095, lon: 105.2669 },
                categories: ['Fasting'],
                status: 'CONFIRMED',
                busyStatus: 'BUSY',
                // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
                // attendees: [
                //   { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
                //   { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
                // ]
              }

              events.push(event);

        }
    }

    // calendar.push('END:VCALENDAR');

    // const icsContent = calendar.join('\r\n');
    const { error, value } = createEvents(events)
      
      if (error) {
        console.log(error)
        return
      }
    //   console.log(value);
      
    // return new Response();
    return new Response(value, {
        headers: {
            'Content-Type': 'text/calendar',
            'Content-Disposition': 'attachment; filename="prayer-schedule.ics"'
        }
    });
}
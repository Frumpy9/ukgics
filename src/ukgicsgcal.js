/**
 * work-schedule-ics — Google-redirect version
 * Same as work_schedule.js but opens Google Calendar import page.
 */

const CAL_REDIRECT = 'https://calendar.google.com/calendar/u/0/r/settings/export';
const EVENT_TITLE  = 'Work';
const FILE_NAME    = 'work_schedule';

function icsBuilder() {
  const pad = n => String(n).padStart(2,'0');
  const utc = d =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const items = [];

  return {
    add(summary, desc, start, end) {
      items.push(
`BEGIN:VEVENT
UID:${start.getTime()}@work-schedule
DTSTAMP:${utc(new Date())}
SUMMARY:${summary}
DESCRIPTION:${desc.replace(/,/g,'\\,')}
DTSTART:${utc(start)}
DTEND:${utc(end)}
END:VEVENT`);
    },
    save(fileBase) {
      if (!items.length) { alert('No upcoming shifts found.'); return false; }
      const blob = new Blob(
[`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:-//work-schedule-ics//EN\r\n${items.join('\r\n')}\r\nEND:VCALENDAR\r\n`],
{ type:'text/calendar;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${fileBase}.ics`;
      a.click();
      return true;
    }
  };
}

(() => {
  const today = new Date(), cal = icsBuilder();

  document.querySelectorAll('li[id^="myschedule-day_"]').forEach(li => {
    const n = li.querySelector('.listEntity');
    if (!n || n.classList.contains('isToday')) return;
    const dt = n.querySelector('time')?.getAttribute('datetime');
    if (!dt) return;
    const day = new Date(dt);
    if (day < today) return;

    n.querySelectorAll('time.label').forEach(t => {
      const m = t.textContent.match(/(\d{1,2}:\d{2} [AP]M)-(\d{1,2}:\d{2} [AP]M)/);
      if (!m) return;
      const [ , s, e ] = m;
      cal.add(EVENT_TITLE, t.textContent.trim(),
              new Date(`${day.toDateString()} ${s}`),
              new Date(`${day.toDateString()} ${e}`));
    });
  });

  if (cal.save(FILE_NAME)) window.open(CAL_REDIRECT, '_blank');
})();

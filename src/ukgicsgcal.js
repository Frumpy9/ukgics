/**
 * work-schedule-ics
 * VIBE-CODED — fully written by AI
 *
 * Scrapes your UKG/Kronos **My Schedule** page, gathers every **future**
 * shift, downloads an .ics file, then pops open Google Calendar’s
 * import / export screen in a new tab.
 */

/* ─────────────────────────── Tweaks ─────────────────────────── */
const CAL_REDIRECT = 'https://calendar.google.com/calendar/u/0/r/settings/export'; // open after download
const EVENT_TITLE  = 'Work';          // title for each event
const FILE_NAME    = 'work_schedule'; // base name of the downloaded .ics file

/* ───────────── Minimal inline ICS builder (no deps) ─────────── */
function createIcsBuilder() {
  const pad = n => String(n).padStart(2, '0');
  const toUTC = d =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const events = [];

  return {
    add(summary, description, start, end) {
      events.push(
`BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).slice(2)}@local
DTSTAMP:${toUTC(new Date())}
SUMMARY:${summary}
DESCRIPTION:${description.replace(/,/g, '\\\\,')}
DTSTART:${toUTC(start)}
DTEND:${toUTC(end)}
END:VEVENT`);
    },
    save(fileBase) {
      if (!events.length) {
        alert('No upcoming shifts found.');
        return false;
      }
      const ics =
`BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//work-schedule-ics//EN
${events.join('\r\n')}
END:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileBase}.ics`;
      link.click();
      return true;
    }
  };
}

/* ───────────────────── Main routine ────────────────────────── */
(() => {
  const today = new Date();
  const cal   = createIcsBuilder();

  /* iterate through every “day” node */
  document.querySelectorAll('li[id^="myschedule-day_"]').forEach(li => {
    const row = li.querySelector('.listEntity');
    if (!row || row.classList.contains('isToday')) return;            // skip blanks / today

    const dtAttr = li.querySelector('time')?.getAttribute('datetime');
    if (!dtAttr) return;
    const day = new Date(dtAttr);
    if (day < today) return;                                          // skip past days

    /* extract each shift on that day */
    li.querySelectorAll('time.label').forEach(label => {
      const m = label.textContent.match(/(\d{1,2}:\d{2} [AP]M)-(\d{1,2}:\d{2} [AP]M)/);
      if (!m) return;

      const [ , startStr, endStr ] = m;
      const start = new Date(`${day.toDateString()} ${startStr}`);
      const end   = new Date(`${day.toDateString()} ${endStr}`);

      cal.add(EVENT_TITLE, label.textContent.trim(), start, end);
    });
  });

  /* download .ics and jump to Google Calendar */
  if (cal.save(FILE_NAME)) {
    window.open(CAL_REDIRECT, '_blank');
  }
})();

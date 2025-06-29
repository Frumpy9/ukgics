# UKGICS 📅

Convert your UKG **My Schedule** page into a clean iCalendar file in one click.

> **VIBE‑CODED** – generated by AI.  No warranty.  Test before trusting.

---

## What it does

- Scans the schedule page for **future** shifts.
- Generates a standards‑compliant `.ics` file (named `work_schedule.ics`).
- Variant A: just downloads the file.
- Variant B: downloads the file **and** opens Google Calendar’s import page. (Can be customized)

---

## Installing the bookmarklet

1. **Create a new bookmark** in your browser’s bookmarks bar.
2. Copy one of the single‑line snippets below.
3. Paste it into the bookmark’s **URL / Location** field and save.

That’s it—open your schedule, click the bookmark, and the file downloads.

---

### ▶️ Plain download

```javascript
javascript:(function(){const T='Work',F='work_schedule',pad=n=>String(n).padStart(2,'0'),utc=d=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`,out=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//work-schedule-ics//EN'];document.querySelectorAll('li[id^="myschedule-day_"]').forEach(li=>{const row=li.querySelector('.listEntity');if(!row||row.classList.contains('isToday'))return;const dt=row.querySelector('time')?.getAttribute('datetime');if(!dt)return;const day=new Date(dt);if(day<new Date())return;row.querySelectorAll('time.label').forEach(t=>{const m=t.textContent.match(/(\d{1,2}:\d{2} [AP]M)-(\d{1,2}:\d{2} [AP]M)/);if(!m)return;const[s,e]=m.slice(1),S=new Date(`${day.toDateString()} ${s}`),E=new Date(`${day.toDateString()} ${e}`);out.push('BEGIN:VEVENT',`UID:${S.getTime()}@work-schedule`,`DTSTAMP:${utc(new Date())}`,`SUMMARY:${T}`,`DESCRIPTION:${t.textContent.trim().replace(/,/g,'\\,')}`,`DTSTART:${utc(S)}`,`DTEND:${utc(E)}`,'END:VEVENT');});});if(out.length===4){alert('No upcoming shifts found.');return;}out.push('END:VCALENDAR');const blob=new Blob([out.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${F}.ics`;a.click();})();
```

---

### ▶️ Download **and** open Google Calendar › Import

```javascript
javascript:(function(){const G='https://calendar.google.com/calendar/u/0/r/settings/export',T='Work',F='work_schedule',pad=n=>String(n).padStart(2,'0'),utc=d=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`,out=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//work-schedule-ics//EN'];document.querySelectorAll('li[id^="myschedule-day_"]').forEach(li=>{const row=li.querySelector('.listEntity');if(!row||row.classList.contains('isToday'))return;const dt=row.querySelector('time')?.getAttribute('datetime');if(!dt)return;const day=new Date(dt);if(day<new Date())return;row.querySelectorAll('time.label').forEach(t=>{const m=t.textContent.match(/(\d{1,2}:\d{2} [AP]M)-(\d{1,2}:\d{2} [AP]M)/);if(!m)return;const[s,e]=m.slice(1),S=new Date(`${day.toDateString()} ${s}`),E=new Date(`${day.toDateString()} ${e}`);out.push('BEGIN:VEVENT',`UID:${S.getTime()}@work-schedule`,`DTSTAMP:${utc(new Date())}`,`SUMMARY:${T}`,`DESCRIPTION:${t.textContent.trim().replace(/,/g,'\\,')}`,`DTSTART:${utc(S)}`,`DTEND:${utc(E)}`,'END:VEVENT');});});if(out.length===4){alert('No upcoming shifts found.');return;}out.push('END:VCALENDAR');const blob=new Blob([out.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${F}.ics`;a.click();window.open(G,'_blank');})();
```
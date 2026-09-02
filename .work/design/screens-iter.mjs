import {
  C, SERIF, doc, svg, I, label, card, pill, av, btn, chev, iconBtn, chip,
  phone, body, topbar, rows, row, navMember, stack, iconAv, dateBlock,
  tierPill, avExternal, bodyPushed,
} from './lib.mjs';

export const iter = {};

/* =====================================================================
   ATTENDANCE - the leader marks who came, including people who will
   never install the app. Without this the RSVP numbers stay fiction.
   ===================================================================== */
const tick = (on) =>
  on
    ? `<div style="width:26px;height:26px;flex:0 0 26px;border-radius:999px;background:${C.sage};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${svg(I.check, 15, 2.6)}</div>`
    : `<div style="width:26px;height:26px;flex:0 0 26px;border-radius:999px;border:1.5px solid ${C.line};"></div>`;

/*
 * After iteration 33, "not in the app" stopped being a category: a
 * member with WhatsApp answers with a reply button and never installs
 * anything. What remains is only "no phone at all", which is genuinely
 * manual - and the dashed avatar is NOT used here, because in this
 * design system dashed means not on our roll, which is a different fact.
 */
const attRow = (init, name, said, on, manual = false, via = '') =>
  `<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;">
    ${tick(on)}
    ${av(init, 34)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:600;">${name}</div>
      <div style="font-size:12px;color:${manual ? C.amber : C.ink3};margin-top:2px;">${said}</div>
    </div>
    ${via ? `<span style="display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:999px;background:${C.sageTint};color:${C.sage};font-size:10px;font-weight:700;">${svg(I.chat, 12)}<span>${via}</span></span>` : ''}
  </div>`;

iter['Attendance.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Attendance</div>
  <span style="font-size:14px;font-weight:700;color:${C.accent};">Save</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:18px 20px 0;">
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Wednesday, 12 March</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:5px;">Anugerah &middot; Halim household</div>
  </div>

  <div style="display:flex;gap:8px;">
    ${pill('4 of 6 marked', C.sageTint, C.sage)}${pill('1 answered by WhatsApp', C.surface, C.ink2, `border:1px solid ${C.line};`)}${pill('1 with no phone', C.amberTint, C.amber)}
  </div>

  ${card(rows([
    attRow('BH', 'Budi Halim', 'Said going', true),
    attRow('MH', 'Melisa Halim', 'Said going', true),
    attRow('DP', 'Dedi Prasetyo', 'Said he could not', false),
    attRow('IP', 'Intan Prasetyo', 'Said going', true, false, 'WhatsApp'),
    attRow('GS', 'Grace Sutanto', 'No answer', true),
    attRow('TS', 'Tigor Simanjuntak', 'No phone on file &mdash; only you can answer for him', false, true),
  ]))}

  <div style="display:flex;align-items:center;gap:11px;padding:13px 14px;border:1.5px dashed ${C.line};border-radius:12px;">
    <span style="color:${C.accent};display:flex;">${svg(I.userPlus, 19)}</span>
    <div style="flex:1 1 auto;"><div style="font-size:13px;font-weight:600;">Someone came who is not listed</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;">First-timers count too &mdash; name only</div></div>
    ${chev()}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    <div style="display:flex;">${btn('Save attendance', { h: 52, icon: I.check })}</div>
    <div style="text-align:center;font-size:12px;color:${C.ink3};margin-top:11px;line-height:1.5;">Two taps per person, no typing. Only Tigor needs you to answer for him &mdash; everyone else replied from wherever they already are.</div>
  </div>
</div>`));

/* =====================================================================
   SHARE - churches here announce on WhatsApp, not through push
   notifications. So the app composes the message instead of competing.
   ===================================================================== */
const toggleRow = (title, on) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    <div style="flex:1 1 auto;font-size:13px;font-weight:600;">${title}</div>
    <div style="width:42px;height:25px;flex:0 0 42px;border-radius:999px;background:${on ? C.accent : C.disabled};display:flex;align-items:center;padding:0 3px;${on ? 'justify-content:flex-end;' : ''}">
      <div style="width:19px;height:19px;border-radius:999px;background:#FFFFFF;"></div>
    </div>
  </div>`;

iter['ShareService.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Share this week</div>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:15px;padding:18px 20px 0;">
  <div style="font-size:13px;color:${C.ink2};line-height:1.5;">Ready to paste into a group chat. Edit it there if you want.</div>

  ${card(`<div style="padding:16px;">
    <div style="font-size:13px;line-height:1.75;">
      <span style="font-weight:700;">*Service &mdash; Saturday, 14 March*</span><br>
      09.00&ndash;11.30 &middot; Grace Hall<br>
      Jl. Cihampelas 42, Bandung<br><br>
      Speaker: Samuel Kartono<br>
      <span style="font-style:italic;">Growing in Prayer</span>, part 3<br><br>
      <span style="color:${C.accent};">grace-bdg.jemaat.app</span>
    </div>
  </div>`)}

  ${card(rows([
    toggleRow('Attach the poster', true),
    toggleRow('Add a map link', true),
    toggleRow('Add the sign-up link', false),
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;display:flex;flex-direction:column;gap:11px;">
    ${btn('Share to WhatsApp', { h: 52, icon: I.chat, grow: false })}
    ${btn('Copy text', { kind: 'ghost', h: 50, icon: I.grid, grow: false })}
    <div style="text-align:center;font-size:12px;color:${C.ink3};line-height:1.5;margin-top:2px;">The link opens public information only &mdash; no names, no contacts.</div>
  </div>
</div>`));

/* =====================================================================
   THE SAME HOME SCREEN IN INDONESIAN - a layout check, not a translation
   exercise. Indonesian runs longer, and the tab strip is where it breaks.
   ===================================================================== */
const navID = (active) => {
  const items = [['Beranda', I.home], ['Khotbah', I.video], ['Komsel', I.group], ['Saya', I.user]];
  return `<div style="display:flex;border-top:1px solid ${C.line};background:${C.surfaceAlt};padding:9px 4px 20px;">${items
    .map(([t, ic]) => {
      const on = t === active;
      return `<div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:5px;color:${on ? C.accent : C.ink3};"><span style="display:flex;">${svg(ic, 22, on ? 2 : 1.7)}</span><span style="font-size:10px;font-weight:${on ? 700 : 600};letter-spacing:0.01em;">${t}</span></div>`;
    })
    .join('')}</div>`;
};

iter['HomeID.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      ${label('Selasa, 10 Maret')}
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:6px;line-height:1.15;">Selamat siang,<br>Andreas</div>
      <div style="margin-top:9px;">${pill('Peserta', C.accentTint, C.accent)}</div>
    </div>
    ${iconBtn(I.search)}
    ${av('AW', 44)}
  </div>

  ${card(row(
    dateBlock('SAB', '14'),
    'Ibadah &middot; 09.00',
    'Grace Hall &middot; Samuel Kartono',
  ))}

  ${card(`
    <div style="padding:15px 16px 13px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        ${pill('KOMSEL ANDA', C.accentTint, C.accent)}
        <span style="font-size:12px;font-weight:700;color:${C.ink3};">2 hari lagi</span>
      </div>
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;margin-top:11px;line-height:1.2;">Anugerah &middot; Rab 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:9px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Rumah Kel. Halim &middot; Sunter</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;">
      <div style="font-size:12px;font-weight:700;color:${C.ink2};">Bisa hadir?</div>
      <div style="display:flex;gap:10px;margin-top:10px;">
        ${btn('Hadir', { icon: I.check })}
        ${btn('Tidak bisa', { kind: 'ghost' })}
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 16px;display:flex;align-items:center;gap:10px;">
      ${stack(['MH', 'BH', 'GS', 'RS'])}
      <span style="font-size:12px;color:${C.ink2};">8 dari 14 sudah menjawab</span>
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    <div style="display:flex;align-items:baseline;gap:10px;">
      ${label('Anda bertugas')}
      <div style="flex:1 1 auto;"></div>
      <span style="font-size:11px;font-weight:700;color:${C.accent};">Semua tugas</span>
    </div>
    ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
      ${dateBlock('SAB', '14')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:600;">Tim Multimedia</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Hadir 08.30 &middot; operator slide</div>
      </div>
      <span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:1px solid ${C.line};color:${C.ink2};font-size:12px;font-weight:700;">${svg(I.swap, 15)}<span>Tukar</span></span>
    </div>`)}
  </div>

  <div style="flex:1 1 auto;"></div>
  ${card(row(iconAv(I.cal, C.amberTint, C.amber), '2 slot tuan rumah kosong di April', 'Komsel Anda butuh tuan rumah'))}
  <div style="height:2px;"></div>
`)}
${navID('Beranda')}`));

/* =====================================================================
   HOME WITH NO SIGNAL. Concrete church buildings eat mobile data, and
   the moment you most need your call time is the moment you are inside
   one. So the screen that matters offline is this one, and an RSVP tap
   must not be lost - it queues.
   ===================================================================== */
iter['HomeOffline.dc.html'] = doc(phone(`
<div style="height:54px;"></div>
<div style="display:flex;align-items:center;gap:10px;padding:9px 20px;background:${C.amberTint};color:${C.amber};">
  ${svg(I.offline, 17)}
  <div style="flex:1 1 auto;font-size:12px;font-weight:700;">No signal &mdash; showing your saved copy</div>
  <span style="font-size:11px;font-weight:600;opacity:0.8;">Sat 09.12</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:18px;padding:20px 20px 0;">
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      ${label('Saturday, 14 March')}
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:6px;line-height:1.15;">Good morning,<br>Andreas</div>
    </div>
    ${av('AW', 44)}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Your duty today')}
    ${card(`<div style="padding:14px 16px;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${dateBlock('SAT', '14')}
        <div style="flex:1 1 auto;">
          <div style="font-size:15px;font-weight:700;">Media team &middot; slides</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Call time 08.30 &middot; Grace Hall</div>
        </div>
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${C.lineSoft};font-size:12px;color:${C.ink2};line-height:1.5;">Slides with you: Gavriel H. &middot; Sound: Fandi Tobing</div>
    </div>`, `border-color:#B4562F55;`)}
  </div>

  ${card(`
    <div style="padding:14px 16px;">
      <div style="font-family:${SERIF};font-size:17px;font-weight:500;line-height:1.2;">Anugerah &middot; Wed 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Halim household &middot; Sunter</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;display:flex;align-items:center;gap:10px;">
      <span style="display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 14px;border-radius:999px;background:${C.accent};color:#FFFFFF;font-size:13px;font-weight:700;">${svg(I.check, 16)}<span>Going</span></span>
      <div style="flex:1 1 auto;display:flex;align-items:center;gap:7px;color:${C.ink3};">${svg(I.clock, 14)}<span style="font-size:11px;font-weight:600;line-height:1.35;">Saved. Sends when<br>you have signal.</span></div>
    </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;align-items:center;gap:11px;padding:13px 14px;border:1px dashed ${C.line};border-radius:12px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.offline, 18)}</span>
    <div style="flex:1 1 auto;font-size:12px;color:${C.ink3};line-height:1.5;">Sermons and the directory need a connection. Everything above is stored on your phone.</div>
  </div>
  <div style="height:2px;"></div>
</div>
${navMember('Home')}`));

/* =====================================================================
   HOME AT A TYPE SCALE A 65-YEAR-OLD CAN READ.
   Not an accessibility mode - a check of whether the DEFAULT is too small.
   Body 17px (iOS default), meta 15px, controls 56px, tab labels 12px.
   The finding is the point: at readable type, Home holds four blocks,
   not five. Something has to leave, and it should be the nudge.
   ===================================================================== */
const navLarge = (active) => {
  const items = [['Home', I.home], ['Sermons', I.video], ['Groups', I.group], ['Me', I.user]];
  return `<div style="display:flex;border-top:1px solid ${C.line};background:${C.surfaceAlt};padding:11px 4px 22px;">${items
    .map(([t, ic]) => {
      const on = t === active;
      return `<div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:6px;color:${on ? C.accent : C.ink3};"><span style="display:flex;">${svg(ic, 25, on ? 2 : 1.7)}</span><span style="font-size:12px;font-weight:${on ? 700 : 600};">${t}</span></div>`;
    })
    .join('')}</div>`;
};

const btnLarge = (t, ghost = false) =>
  `<div style="flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:9px;height:56px;border-radius:12px;${ghost ? `background:${C.surface};color:${C.ink};border:1px solid ${C.line};` : `background:${C.accent};color:#FFFFFF;`}font-size:17px;font-weight:600;">${ghost ? '' : svg(I.check, 20)}<span>${t}</span></div>`;

iter['HomeLarge.dc.html'] = doc(phone(`
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:18px;padding:54px 20px 0;">
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${C.ink3};">Tuesday, 10 March</div>
      <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;margin-top:7px;line-height:1.15;">Good afternoon,<br>Andreas</div>
    </div>
    <div style="width:48px;height:48px;flex:0 0 48px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center;color:${C.ink};">${svg(I.search, 22)}</div>
    ${av('AW', 48)}
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:14px;padding:15px 16px;">
    ${dateBlock('SAT', '14')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:17px;font-weight:600;">Service &middot; 09.00</div>
      <div style="font-size:15px;color:${C.ink2};margin-top:4px;">Grace Hall &middot; Samuel Kartono</div>
    </div>
    <span style="color:${C.ink3};display:flex;">${svg(I.chevR, 22, 1.9)}</span>
  </div>`)}

  ${card(`
    <div style="padding:16px;">
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;line-height:1.2;">Anugerah &middot; Wed 19.30</div>
      <div style="display:flex;align-items:center;gap:9px;margin-top:10px;color:${C.ink2};">${svg(I.pin, 19)}<span style="font-size:15px;">Halim household &middot; Sunter</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:14px 16px;">
      <div style="font-size:15px;font-weight:700;color:${C.ink2};">Can you make it?</div>
      <div style="display:flex;gap:10px;margin-top:11px;">
        ${btnLarge('Going')}${btnLarge('Can&rsquo;t', true)}
      </div>
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:10px;">
    <div style="display:flex;align-items:baseline;gap:10px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${C.ink3};">You are serving</div>
      <div style="flex:1 1 auto;"></div>
      <span style="font-size:13px;font-weight:700;color:${C.accent};">All serving</span>
    </div>
    ${card(`<div style="display:flex;align-items:center;gap:14px;padding:14px 16px;">
      ${dateBlock('SAT', '14')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:17px;font-weight:600;">Media team</div>
        <div style="font-size:15px;color:${C.ink2};margin-top:4px;">Call time 08.30</div>
      </div>
      <span style="color:${C.ink3};display:flex;">${svg(I.chevR, 22, 1.9)}</span>
    </div>`)}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;align-items:center;gap:9px;padding-bottom:8px;color:${C.ink3};">
    ${svg(I.offline, 15)}<span style="font-size:12px;line-height:1.4;">The hosting nudge no longer fits here &mdash; it moved to Groups.</span>
  </div>
</div>
${navLarge('Home')}`));

import {
  C, SERIF, doc, svg, I, label, card, pill, av, btn, iconBtn,
  phone, body, navMember, row, iconAv, dateBlock, tierPill,
} from './lib.mjs';

/*
 * HOME ON MEETING NIGHT, SEEN BY THE GROUP LEADER.
 *
 * Not a fifth Home - the SAME card as M1, in the state it takes on the
 * day the meeting happens. A leader's week is one job at a time, and
 * every one of them used to sit three taps deep: nudge the four who
 * never answered, then mark who actually came. Both surface here, on
 * the day they matter, and vanish again afterwards.
 */
export const lead = {};

const statPill = (n, t, bg, fg) =>
  `<div style="display:flex;align-items:baseline;gap:6px;"><span style="font-family:${SERIF};font-size:20px;font-weight:600;color:${fg};">${n}</span><span style="font-size:12px;color:${C.ink2};">${t}</span></div>`;

lead['HomeLeader.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      ${label('Wednesday, 12 March')}
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:6px;line-height:1.15;">Good evening,<br>Budi</div>
      <div style="margin-top:9px;">${tierPill('registered')}</div>
    </div>
    ${iconBtn(I.search)}
    ${av('BH', 44)}
  </div>

  ${card(`
    <div style="padding:15px 16px 13px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        ${pill('TONIGHT', C.accentTint, C.accent)}
        ${pill('You lead this group', C.surface, C.ink2, `border:1px solid ${C.line};`)}
      </div>
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;margin-top:11px;line-height:1.2;">Anugerah &middot; 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:9px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Your house &middot; Jl. Danau Indah C2/14</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:12px 16px;display:flex;align-items:center;gap:18px;">
      ${statPill('8', 'going', C.sageTint, C.sage)}
      ${statPill('2', 'cannot', C.bg, C.ink2)}
      ${statPill('4', 'no answer', C.amberTint, C.amber)}
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;display:flex;flex-direction:column;gap:10px;">
      ${btn('Remind the 4 on WhatsApp', { kind: 'outlineAccent', h: 48, icon: I.chat, grow: false })}
      ${btn('Take attendance', { h: 48, icon: I.check, grow: false })}
    </div>`, 'border-color:#B4562F55;')}

  ${card(row(
    dateBlock('SAT', '14'),
    'Service &middot; 09.00',
    'Grace Hall &middot; Samuel Kartono',
  ))}

  <div style="flex:1 1 auto;"></div>
  ${card(row(iconAv(I.cal, C.bg, C.ink3), 'April hosting still open', '2 weeks with no host &mdash; in Groups'))}
  <div style="height:2px;"></div>
`)}
${navMember('Home')}`));

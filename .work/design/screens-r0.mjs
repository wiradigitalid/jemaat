import {
  C, SERIF, doc, svg, I, label, card, pill, av, btn, phone, body,
  navMember, row, iconAv, dateBlock, tierPill,
} from './lib.mjs';

/*
 * HOME AS IT WOULD ACTUALLY SHIP IN R0.
 *
 * Staging a design is not slicing a list - it is auditing every link.
 * M1 as drawn reaches four screens that R0 does not contain: the
 * directory behind the search icon, the warta behind the announcements
 * strip, the serving screen behind the duty card, and the household
 * behind Me. Ship it unchanged and a pilot church meets four dead ends
 * in its first ten minutes.
 *
 * This is M1 with every one of them removed. It is thin, and the
 * thinness IS the finding: for an ordinary member - not a leader, not
 * a host - R0 offers one button, once a week. Iteration 17 already
 * said an app that gives nothing back gets uninstalled, and a member
 * who uninstalls in the pilot does not come back for R1.
 */
export const r0 = {};

r0['HomeR0.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      ${label('Tuesday, 10 March')}
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:6px;line-height:1.15;">Good afternoon,<br>Andreas</div>
      <div style="margin-top:9px;">${tierPill('community')}</div>
    </div>
    ${av('AW', 44)}
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:13px;padding:14px;">
    ${dateBlock('SAT', '14')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Service &middot; 09.00</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Grace Hall &middot; Samuel Kartono</div>
    </div>
  </div>`)}

  ${card(`
    <div style="padding:15px 16px 13px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        ${pill('YOUR CARE GROUP', C.accentTint, C.accent)}
        <span style="font-size:12px;font-weight:700;color:${C.ink3};">in 2 days</span>
      </div>
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;margin-top:11px;line-height:1.2;">Anugerah &middot; Wed 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:9px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Halim household &middot; Sunter</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;">
      <div style="font-size:12px;font-weight:700;color:${C.ink2};">Can you make it?</div>
      <div style="display:flex;gap:10px;margin-top:10px;">
        ${btn('Going', { icon: I.check })}
        ${btn('Can&rsquo;t', { kind: 'ghost' })}
      </div>
    </div>`)}

  ${card(row(iconAv(I.cal, C.amberTint, C.amber), '2 open hosting slots in April', 'Your group needs a host'))}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:6px;display:flex;align-items:flex-start;gap:10px;border:1px dashed ${C.line};border-radius:14px;padding:14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.help, 17)}</span>
    <div style="flex:1 1 auto;font-size:11px;color:${C.ink3};line-height:1.6;">Cut from M1 for R0: the directory search, the announcements strip, and the serving card &mdash; all three lead where R0 does not go. For a member who does not lead or host, what remains is one button once a week.</div>
  </div>
`)}
${navMember('Home')}`));

/* The same screen with the one row that changes the pilot. */
r0['HomeR0Warta.dc.html'] = r0['HomeR0.dc.html']
  .replace(
    `<div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Service &middot; 09.00</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Grace Hall &middot; Samuel Kartono</div>
    </div>
  </div>`,
    `<div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Service &middot; 09.00</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Grace Hall &middot; Samuel Kartono</div>
    </div>
  </div>
  <div style="border-top:1px solid ${C.lineSoft};padding:12px 14px;display:flex;align-items:center;gap:10px;">
    <span style="color:${C.accent};display:flex;">${svg(I.mail, 17)}</span>
    <div style="flex:1 1 auto;font-size:13px;font-weight:600;">This week: 3 announcements, 2 birthdays</div>
    <span style="color:${C.ink3};display:flex;">${svg(I.chevR, 18, 1.9)}</span>
  </div>`)
  .replace(
    `Cut from M1 for R0: the directory search, the announcements strip, and the serving card &mdash; all three lead where R0 does not go. For a member who does not lead or host, what remains is one button once a week.`,
    `The only difference from M28 is the row above. The office already types those announcements into W8, which is already in R0 &mdash; this costs one mobile screen, not a module.`);

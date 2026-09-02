import {
  C, SERIF, doc, svg, I, label, card, pill, av, sq, btn, chev, iconBtn,
  phone, body, bodyPushed, topbar, navMember, rows, dateBlock, tierPill, iconAv,
} from './lib.mjs';

/*
 * THE SAME PRODUCT AT 2,000 MEMBERS AND 40 CARE GROUPS.
 *
 * Every screen so far was drawn against 248 people and 5 groups, and two
 * assumptions hid inside that:
 *
 * 1. ONE SERVICE. "Next service - Saturday 09.00" is written as though a
 *    church has one. Above roughly 400 members it has two to four, and
 *    that changes what "when" MEANS: which service you attend, which one
 *    you serve at, which one an announcement is for, which one attendance
 *    was taken at. A date is no longer an answer.
 *
 * 2. A FLAT LIST OF GROUPS. Fine at five. At forty it is a wall, and the
 *    number a large church actually cares about is not how many groups
 *    exist but how many people are in none of them.
 */
export const scale = {};

/* ============ HOME, BIG CHURCH ============ */
scale['HomeScale.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      ${label('Tuesday, 10 March')}
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:6px;line-height:1.15;">Good afternoon,<br>Andreas</div>
      <div style="margin-top:9px;">${tierPill('community')}</div>
    </div>
    ${iconBtn(I.search)}
    ${av('AW', 44)}
  </div>

  ${card(`
    <div style="display:flex;align-items:center;gap:13px;padding:14px;">
      ${dateBlock('SAT', '14')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:15px;font-weight:700;">Service &middot; 09.00</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Grace Hall &middot; Samuel Kartono</div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 14px;display:flex;align-items:center;gap:9px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.clock, 16)}</span>
      <div style="flex:1 1 auto;font-size:12px;color:${C.ink2};">You usually come to <span style="font-weight:700;color:${C.ink};">09.00</span> &middot; 3 services this week</div>
      <span style="color:${C.accent};display:flex;">${svg(I.chevD, 17, 2)}</span>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 14px;display:flex;align-items:center;gap:10px;">
      <span style="color:${C.accent};display:flex;">${svg(I.mail, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;font-weight:600;">This week: 6 announcements</div>
      ${chev()}
    </div>`)}

  ${card(`
    <div style="padding:14px 16px 12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        ${pill('YOUR CARE GROUP', C.accentTint, C.accent)}
        <span style="font-size:12px;font-weight:700;color:${C.ink3};">in 2 days</span>
      </div>
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;margin-top:10px;line-height:1.2;">Anugerah &middot; Wed 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Halim household &middot; Sunter area</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:12px 16px;display:flex;gap:10px;">
      ${btn('Going', { icon: I.check })}
      ${btn('Can&rsquo;t', { kind: 'ghost' })}
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    <div style="display:flex;align-items:baseline;gap:10px;">
      ${label('You are serving')}
      <div style="flex:1 1 auto;"></div>
      <span style="font-size:11px;font-weight:700;color:${C.accent};">All serving</span>
    </div>
    ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
      ${dateBlock('SAT', '14')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:600;">Media team</div>
        <div style="font-size:12px;color:${C.accent};margin-top:3px;font-weight:600;">07.00 service &middot; not the one you attend</div>
      </div>
      ${chev()}
    </div>`)}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="height:2px;"></div>
`)}
${navMember('Home')}`));

/* ============ CARE GROUPS AT FORTY ============ */
const areaRow = (name, groups, people, coord) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${sq(name.slice(0, 1), 40, C.bg, C.ink2)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:600;">${name}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">${groups} groups &middot; ${people} people &middot; ${coord}</div>
    </div>
    ${chev()}
  </div>`;

scale['GroupsScale.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="flex:1 1 auto;font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Care Groups</div>
    ${iconBtn(I.plus, `background:${C.accent};color:#FFFFFF;border-color:${C.accent};`)}
  </div>

  <div style="display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;color:${C.ink3};">
    ${svg(I.search, 19)}<span style="font-size:14px;">Search a group, area or leader</span>
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${sq('A', 42)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:15px;font-weight:700;">Anugerah</span>${pill('You are in', C.accentTint, C.accent)}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Sunter area &middot; Wed 19.30 &middot; 14 people</div>
    </div>
    ${chev()}
  </div>`, 'border-color:#B4562F55;')}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('By area')}
    ${card(rows([
      areaRow('Sunter', 8, 214, 'Budi Halim'),
      areaRow('Dago', 7, 186, 'Ruth Simanjuntak'),
      areaRow('Antapani', 10, 271, 'Maruli Nainggolan'),
      areaRow('Cimahi', 9, 233, 'Hendra Lie'),
    ]))}
    <div style="text-align:center;padding-top:2px;"><span style="font-size:13px;font-weight:700;color:${C.accent};">2 more areas</span></div>
  </div>

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${iconAv(I.users, C.amberTint, C.amber, 38)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">820 people are in no group</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Out of 2,000. This is the number that matters.</div>
    </div>
    ${chev()}
  </div>`, 'border-color:#9A722344;background:#F7EEDD88;')}
  <div style="height:2px;"></div>
`)}
${navMember('Groups')}`));

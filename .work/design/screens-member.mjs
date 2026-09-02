import {
  C, SERIF, doc, svg, I, label, card, pill, av, sq, btn, chev, iconBtn, chip,
  phone, body, bodyPushed, topbar, navMember, rows, row, field, stack, iconAv,
  tierPill, lockPill, dateBlock, infoRow, avExternal,
} from './lib.mjs';

export const mem = {};

/* ===================== HOME (signed in, Community Member) ===================== */
mem['MemberHome.dc.html'] = doc(phone(`
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
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 14px;display:flex;align-items:center;gap:10px;">
      <span style="color:${C.accent};display:flex;">${svg(I.mail, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;font-weight:600;">This week: 3 announcements, 2 birthdays</div>
      ${chev()}
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
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 16px;display:flex;align-items:center;gap:10px;">
      ${stack(['MH', 'BH', 'GS', 'RS'])}
      <span style="font-size:12px;color:${C.ink2};">8 of 14 have answered</span>
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
        <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Call time 08.30 &middot; slides</div>
      </div>
      <span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:1px solid ${C.line};color:${C.ink2};font-size:12px;font-weight:700;">${svg(I.swap, 15)}<span>Swap</span></span>
    </div>`)}
  </div>

  <div style="flex:1 1 auto;"></div>
`)}
${navMember('Home')}`));

/* ===================== PEOPLE - full directory (Registered / office) ===================== */
const householdRow = (init, name, meta, members) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${sq(init, 44)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:600;">${name}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">${meta}</div>
    </div>
    ${stack(members)}
    ${chev()}
  </div>`;

mem['Directory.dc.html'] = doc(phone(`
${topbar('People', iconBtn(I.plus, `background:${C.accent};color:#FFFFFF;border-color:${C.accent};`))}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Full directory</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:3px;">248 people &middot; you are Registered</div>
  </div>

  <div style="display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;color:${C.ink3};">
    ${svg(I.search, 19)}<span style="font-size:14px;">Search name, household or phone</span>
  </div>

  <div style="display:flex;gap:8px;overflow:hidden;">
    ${chip('All 248', true)}${chip('Registered 196')}${chip('Community 34')}${chip('Guests 18')}
  </div>

  <div style="display:flex;gap:4px;padding:4px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
    <div style="flex:1 1 0;height:38px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:${C.accentTint};color:${C.accent};font-size:13px;font-weight:700;">By household</div>
    <div style="flex:1 1 0;height:38px;display:flex;align-items:center;justify-content:center;border-radius:6px;color:${C.ink2};font-size:13px;font-weight:600;">By person</div>
  </div>

  <div style="display:flex;flex-direction:column;gap:10px;">
    ${card(householdRow('H', 'Halim household', '4 people &middot; Sunter', ['BH', 'MH', 'GH', 'KH']))}
    ${card(householdRow('P', 'Prasetyo household', '5 people &middot; Sunter', ['DP', 'IP', 'RP', 'NP']))}
    ${card(householdRow('S', 'Simanjuntak household', '3 people &middot; Dago', ['TS', 'RS', 'AS']))}
    ${card(householdRow('W', 'Wibowo household', '4 people &middot; Sunter', ['AW', 'LW', 'FW', 'CW']))}
  </div>
  <div style="flex:1 1 auto;"></div>
`)}`));

/* ===================== PEOPLE - scoped view (Community Member) ===================== */
const personRow = (init, name, meta, right) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;">
    ${av(init, 38)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${name}</div><div style="font-size:12px;color:${C.ink2};margin-top:2px;">${meta}</div></div>
    ${right}
  </div>`;

const waBtn = () =>
  `<span style="width:36px;height:36px;flex:0 0 36px;border-radius:999px;border:1px solid ${C.line};color:${C.accent};display:flex;align-items:center;justify-content:center;">${svg(I.chat, 17)}</span>`;

mem['DirectoryLimited.dc.html'] = doc(phone(`
${topbar('People')}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Your care group</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:3px;">14 people &middot; you are Community</div>
  </div>

  ${card(`<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 19)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:700;">You see contacts in your own care group</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:5px;line-height:1.5;">The full church directory is open to Registered Members and the church office. Everything else &mdash; sermons, service times, events, serving &mdash; is open to you.</div>
      <div style="margin-top:9px;"><a href="#" style="font-size:12px;font-weight:700;">How membership works</a></div>
    </div>
  </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Anugerah &middot; 14 people')}
    ${card(rows([
      personRow('BH', 'Budi Halim', 'Group leader &middot; 0812-1122-3344', waBtn()),
      personRow('MH', 'Melisa Halim', '0813-9080-1122', waBtn()),
      personRow('DP', 'Dedi Prasetyo', 'No number on file yet', ''),
      personRow('IP', 'Intan Prasetyo', '0811-4455-6677', waBtn()),
      personRow('GS', 'Grace Sutanto', '0813-5566-7788', waBtn()),
    ]))}
  </div>
  <div style="flex:1 1 auto;"></div>
`)}`));

/* ===================== HOUSEHOLD DETAIL ===================== */
const memberRow = (init, name, badgeHtml, meta) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${av(init, 40)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:600;">${name}</span>${badgeHtml}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">${meta}</div>
    </div>
    ${chev()}
  </div>`;

mem['Household.dc.html'] = doc(phone(`
${topbar('Household', `<span style="font-size:14px;font-weight:700;color:${C.accent};">Edit</span>`)}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:17px;padding:22px 20px 0;">
  <div>
    <div style="display:flex;align-items:center;gap:14px;">
      ${sq('H', 56)}
      <div style="flex:1 1 auto;">
        <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Halim household</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:4px;line-height:1.4;">Jl. Danau Indah C2/14, Sunter</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px;">
      ${pill('Sunter area', C.surface, C.ink2, `border:1px solid ${C.line};`)}
      ${pill('Anugerah care group', C.accentTint, C.accent)}
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('People &middot; 4')}
    ${card(rows([
      memberRow('BH', 'Budi Halim', pill('Head', C.accentTint, C.accent), 'Registered &middot; 48 &middot; 0812-1122-3344'),
      memberRow('MH', 'Melisa Halim', pill('Spouse', C.surface, C.ink2, `border:1px solid ${C.line};`), 'Registered &middot; 45 &middot; 0813-9080-1122'),
      memberRow('GH', 'Gavriel Halim', pill('Child', C.sageTint, C.sage), 'Community &middot; 14 &middot; no phone yet'),
      memberRow('KH', 'Kayla Halim', pill('Child', C.sageTint, C.sage), 'Community &middot; 9 &middot; no phone yet'),
    ]))}
    <div style="display:flex;align-items:center;justify-content:center;gap:9px;height:48px;border:1.5px dashed ${C.line};border-radius:12px;color:${C.accent};font-size:14px;font-weight:700;">${svg(I.plus, 18)}<span>Add someone to this household</span></div>
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('In memory')}
    ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
      ${av('YH', 40, C.bg, C.ink3)}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:600;color:${C.ink2};">Yohanes Halim</div>
        <div style="font-size:12px;color:${C.ink3};margin-top:3px;">Father of Budi &middot; 1948 &ndash; 2026</div>
      </div>
      ${chev()}
    </div>`)}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;font-size:11px;color:${C.ink3};">Created Feb 2021 &middot; updated 3 days ago by the church office</div>
</div>`));

/* ===================== ADD PERSON (office) ===================== */
mem['AddMember.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">New person</div>
  <span style="font-size:14px;font-weight:700;color:${C.disabledInk};">Save</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:16px 20px 0;">
  <div style="font-size:13px;color:${C.ink2};line-height:1.5;">Six fields. Everything else can wait.</div>

  ${field('Full name', 'Rafael Prasetyo')}
  <div style="display:flex;flex-direction:column;gap:7px;">
    ${field('Household', 'Prasetyo', { right: chev() })}
    ${card(`
      <div style="display:flex;align-items:center;gap:11px;padding:11px 13px;">
        ${sq('P', 34)}
        <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:700;">Prasetyo household</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">5 people &middot; Jl. Danau Indah C4/8, Sunter</div></div>
        <span style="color:${C.accent};display:flex;">${svg(I.check, 17, 2.4)}</span>
      </div>
      <div style="border-top:1px solid ${C.lineSoft};padding:10px 13px;display:flex;align-items:center;gap:10px;">
        <span style="color:${C.ink3};display:flex;">${svg(I.plus, 15)}</span>
        <span style="flex:1 1 auto;font-size:12px;color:${C.ink3};">Or start a new household called Prasetyo</span>
      </div>`, `border-color:#B4562F55;`)}
    <span style="font-size:11px;color:${C.ink3};line-height:1.4;">Matches show as you type. Creating a second household with the same name is the most common way a register gets messy.</span>
  </div>

  <div style="display:flex;flex-direction:column;gap:8px;">
    <span style="font-size:12px;font-weight:700;color:${C.ink2};">Role in household</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${chip('Head')}${chip('Spouse')}${chip('Child', true)}${chip('Other')}
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:8px;">
    <span style="font-size:12px;font-weight:700;color:${C.ink2};">Standing in this church</span>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${chip('Guest')}${chip('Community', true)}${chip('Registered')}${chip('Not on our roll')}
    </div>
    <span style="font-size:11px;color:${C.ink3};line-height:1.4;">Not on our roll means a guest speaker or visiting volunteer. They can be scheduled, but they are not a member here.</span>
  </div>

  ${field('Date of birth', '12 August 2016', { tag: 'optional', right: `<span style="color:${C.ink3};display:flex;">${svg(I.cal, 18)}</span>` })}
  ${field('Phone', 'Leave empty if none', { tag: 'optional', placeholder: true })}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:22px;">
    <div style="display:flex;">${btn('Save person', { h: 52 })}</div>
    <div style="text-align:center;font-size:12px;color:${C.ink3};margin-top:11px;line-height:1.5;">Address, baptism and occupation can be filled in any time later.</div>
  </div>
</div>`));

/* ===================== CARE GROUPS ===================== */
const cgRow = (init, name, meta) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">${sq(init, 42, C.bg, C.ink2)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${name}</div><div style="font-size:12px;color:${C.ink2};margin-top:3px;">${meta}</div></div>${chev()}</div>`;

mem['CareGroups.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="flex:1 1 auto;font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Care Groups</div>
    ${iconBtn(I.plus, `background:${C.accent};color:#FFFFFF;border-color:${C.accent};`)}
  </div>

  ${card(`
    <div style="padding:15px 16px 13px;">
      <div style="display:flex;align-items:center;gap:10px;">
        ${sq('A', 42)}
        <div style="flex:1 1 auto;">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:15px;font-weight:700;">Anugerah</span>${pill('You are in', C.accentTint, C.accent)}</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:4px;">14 people &middot; 5 households &middot; Sunter</div>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:12px 16px;display:flex;align-items:center;gap:10px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.cal, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;color:${C.ink2};">Wed 12 Mar &middot; 19.30 &middot; Halim household</div>
      ${pill('8/14 in', C.sageTint, C.sage)}
    </div>`, 'border-color:#B4562F55;')}

  ${card(row(iconAv(I.cal, C.amberTint, C.amber), '2 open hosting slots in April', 'Your group still needs a host'), 'border-color:#9A722344;background:#F7EEDD88;')}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Other groups')}
    ${card(rows([
      cgRow('D', 'Damai', 'Dago &middot; Thu 19.30 &middot; 18 people'),
      cgRow('H', 'Harapan', 'Cimahi &middot; Wed 19.00 &middot; 11 people'),
      cgRow('M', 'Young Adults', 'Sunter &middot; Fri 19.30 &middot; 22 people'),
      cgRow('S', 'Sukacita', 'Buahbatu &middot; Tue 19.30 &middot; 9 people'),
    ]))}
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:14px;">
    <span style="color:${C.accent};display:flex;">${svg(I.pin, 19)}</span>
    <div style="flex:1 1 auto;"><div style="font-size:13px;font-weight:600;">Find a group near you</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;line-height:1.4;">Open to Community and Registered alike &mdash; joining a group never moves your membership.</div></div>
    ${chev()}
  </div>`, `border-style:dashed;`)}
  <div style="flex:1 1 auto;"></div>
`)}
${navMember('Groups')}`));

/* ===================== CARE GROUP DETAIL ===================== */
const meetPast = (date, host, count) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    <div style="width:42px;flex:0 0 42px;text-align:center;"><div style="font-size:10px;font-weight:700;letter-spacing:0.06em;color:${C.ink3};">WED</div><div style="font-family:${SERIF};font-size:17px;font-weight:500;line-height:1.1;">${date}</div></div>
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${host}</div><div style="font-size:12px;color:${C.ink2};margin-top:2px;">${count}</div></div>${chev()}</div>`;

mem['GroupDetail.dc.html'] = doc(phone(`
${topbar('Care group', iconBtn(I.more))}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:16px;padding:22px 20px 0;">
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Anugerah</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:6px;">Sunter &middot; every Wednesday, 19.30</div>
    <div style="display:flex;gap:8px;margin-top:12px;">
      ${pill('14 people', C.surface, C.ink2, `border:1px solid ${C.line};`)}
      ${pill('5 households', C.surface, C.ink2, `border:1px solid ${C.line};`)}
      ${pill('Led by Budi H.', C.accentTint, C.accent)}
    </div>
  </div>

  <div style="display:flex;gap:22px;border-bottom:1px solid ${C.line};">
    <div style="padding-bottom:10px;border-bottom:2px solid ${C.accent};margin-bottom:-1px;font-size:14px;font-weight:700;color:${C.accent};">Meetings</div>
    <div style="padding-bottom:10px;font-size:14px;font-weight:600;color:${C.ink3};">People</div>
    <div style="padding-bottom:10px;font-size:14px;font-weight:600;color:${C.ink3};">Hosting</div>
  </div>

  ${card(`
    <div style="padding:14px 16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">${pill('NEXT', C.accentTint, C.accent)}<span style="font-size:12px;font-weight:700;color:${C.ink3};">in 2 days</span></div>
      <div style="font-family:${SERIF};font-size:20px;font-weight:500;margin-top:10px;">Wednesday, 12 March &middot; 19.30</div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:8px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Halim household &middot; Jl. Danau Indah C2/14</span></div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:11px 16px;display:flex;gap:8px;">
      ${pill('Going 8', C.sageTint, C.sage)}${pill('Can&rsquo;t 2', C.surface, C.ink2, `border:1px solid ${C.line};`)}${pill('No answer 4', C.amberTint, C.amber)}
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Past meetings')}
    ${card(rows([
      meetPast('5', 'Wibowo household', '11 came &middot; 2 first-timers'),
      meetPast('27', 'Simanjuntak household', '9 came'),
      meetPast('20', 'Halim household', '12 came &middot; 1 first-timer'),
    ]))}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;padding-bottom:26px;">${btn('Take attendance', { h: 52, icon: I.check })}</div>
</div>`));

/* ===================== MEETING + RSVP ===================== */
const rsvpOpt = (t, on) =>
  `<div style="flex:1 1 0;display:flex;align-items:center;justify-content:center;gap:7px;height:48px;border-radius:12px;${on ? `background:${C.accent};color:#FFFFFF;border:1px solid ${C.accent};` : `background:${C.surface};color:${C.ink2};border:1px solid ${C.line};`}font-size:14px;font-weight:600;">${on ? svg(I.check, 17) : ''}<span>${t}</span></div>`;

const answerRow = (init, name, status, color, tint) =>
  `<div style="display:flex;align-items:center;gap:11px;padding:11px 14px;">${av(init, 34)}<div style="flex:1 1 auto;font-size:14px;font-weight:600;">${name}</div>${pill(status, tint, color)}</div>`;

mem['Meeting.dc.html'] = doc(phone(`
${topbar('Meeting')}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:16px;padding:20px 20px 0;">
  ${card(`
    <div style="padding:16px;">
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Wednesday, 12 March</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:5px;">19.30 &ndash; 21.00 &middot; Anugerah</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:14px;">
        <div style="display:flex;align-items:center;gap:9px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Halim household, Jl. Danau Indah C2/14</span></div>
        <div style="display:flex;align-items:center;gap:9px;color:${C.ink2};">${svg(I.user, 16)}<span style="font-size:13px;">Devotion led by Andreas Wibowo</span></div>
      </div>
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:10px;">
    ${label('Your answer')}
    <div style="display:flex;gap:8px;">${rsvpOpt('Going', true)}${rsvpOpt('Can&rsquo;t', false)}${rsvpOpt('Not sure', false)}</div>
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Who is coming')}
    <div style="display:flex;gap:8px;">${pill('Going 8', C.sageTint, C.sage)}${pill('Can&rsquo;t 2', C.surface, C.ink2, `border:1px solid ${C.line};`)}${pill('No answer 4', C.amberTint, C.amber)}</div>
    ${card(rows([
      answerRow('BH', 'Budi Halim', 'Going', C.sage, C.sageTint),
      answerRow('MH', 'Melisa Halim', 'Going', C.sage, C.sageTint),
      answerRow('DP', 'Dedi Prasetyo', 'Can&rsquo;t', C.ink2, C.bg),
      answerRow('TS', 'Tigor Simanjuntak', 'No answer', C.amber, C.amberTint),
    ]))}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;padding-bottom:26px;">${btn('Nudge 4 people on WhatsApp', { kind: 'outlineAccent', h: 50, icon: I.chat })}</div>
</div>`));

/* ===================== HOSTING QUEUE ===================== */
const taskLine = (role, who, open = false) =>
  `<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:12px;color:${C.ink3};width:70px;flex:0 0 70px;">${role}</span>${open
    ? `<span style="display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;border:1px solid ${C.accent};color:${C.accent};font-size:11px;font-weight:700;">I can</span>`
    : `<span style="font-size:12px;font-weight:600;">${who}</span>`}</div>`;

mem['HostQueue.dc.html'] = doc(phone(`
${topbar('Hosting and tasks')}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:20px 20px 0;">
  <div style="font-size:13px;color:${C.ink2};line-height:1.5;">Claim an open date. One household hosts at most once a month.</div>

  <div style="display:flex;align-items:center;gap:14px;">
    ${iconBtn(I.chevL)}
    <div style="flex:1 1 auto;text-align:center;font-family:${SERIF};font-size:17px;font-weight:600;">March 2026</div>
    ${iconBtn(I.chevR)}
  </div>

  ${card(`<div style="padding:13px 14px;display:flex;gap:12px;">
    ${dateBlock('WED', '12')}
    <div style="flex:1 1 auto;">
      <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">Halim household</span>${pill('Taken', C.sageTint, C.sage)}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:9px;">
        ${taskLine('Devotion', 'Andreas W.')}
        ${taskLine('Food', 'Sutanto household')}
      </div>
    </div></div>`)}

  ${card(`<div style="padding:13px 14px;display:flex;gap:12px;">
    ${dateBlock('WED', '19')}
    <div style="flex:1 1 auto;">
      <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;">Wibowo household</span>${pill('Taken', C.sageTint, C.sage)}</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:9px;">
        ${taskLine('Devotion', '', true)}
        ${taskLine('Food', 'Halim household')}
      </div>
    </div></div>`)}

  ${card(`<div style="padding:13px 14px;">
    <div style="display:flex;gap:12px;">
      ${dateBlock('WED', '26', true)}
      <div style="flex:1 1 auto;">
        <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;color:${C.ink2};">No host yet</span>${pill('Open', C.amberTint, C.amber)}</div>
        <div style="font-size:12px;color:${C.ink3};margin-top:5px;">You last hosted 6 Nov 2025</div>
      </div>
    </div>
    <div style="display:flex;margin-top:12px;">${btn('I can host', { kind: 'outlineAccent', h: 46 })}</div>
  </div>`, 'border-color:#9A722344;background:#F7EEDD88;')}

  ${card(`<div style="padding:13px 14px;display:flex;gap:12px;align-items:center;">
    ${dateBlock('WED', '2', true)}
    <div style="flex:1 1 auto;"><div style="font-size:14px;font-weight:600;color:${C.ink2};">2 April &middot; not open yet</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;">April opens on 20 March</div></div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;text-align:center;"><span style="font-size:13px;font-weight:700;color:${C.accent};">See hosting history</span></div>
</div>`));

/* ===================== SERVING ===================== */
const slotRow = (dow, d, role, team, muted = false) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${dateBlock(dow, d, muted)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:600;">${role}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">${team}</div>
    </div>
    <span style="display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;border:1px solid ${C.accent};color:${C.accent};font-size:13px;font-weight:700;">I can</span>
  </div>`;

mem['Serving.dc.html'] = doc(phone(`
${topbar('Serving', iconBtn(I.filter))}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Your serving</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:3px;">Open to Community and Registered alike</div>
  </div>

  <div style="display:flex;gap:8px;overflow:hidden;">
    ${chip('Media', true)}${chip('Hosting', true)}${chip('+ Join a team')}
  </div>

  ${card(`
    <div style="padding:14px 16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">${pill('YOUR NEXT DUTY', C.accentTint, C.accent)}<span style="font-size:12px;font-weight:700;color:${C.ink3};">in 4 days</span></div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:12px;">
        ${dateBlock('SAT', '14')}
        <div style="flex:1 1 auto;">
          <div style="font-size:15px;font-weight:700;">Media team &middot; slides</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Call time 08.30 &middot; Grace Hall</div>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;display:flex;gap:10px;">
      ${btn('Confirm', { icon: I.check })}
      ${btn('Find a swap', { kind: 'ghost', icon: I.swap })}
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Open slots')}
    ${card(rows([
      slotRow('SAT', '21', 'Sound desk', 'Media team'),
      slotRow('SAT', '28', 'Welcome and ushers', 'Hospitality team'),
      slotRow('FRI', '20', 'MC', 'Family Night &middot; special event'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  ${card(row(iconAv(I.cal, C.bg, C.ink3), 'Full roster for March', '4 teams &middot; 26 slots'))}
  <div style="height:24px;"></div>
`)}`));

/* ===================== ME ===================== */
const setRow = (icon, title, right = chev()) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:14px;"><span style="color:${C.ink3};display:flex;">${svg(icon, 19)}</span><div style="flex:1 1 auto;font-size:14px;font-weight:600;">${title}</div>${right}</div>`;

mem['Profile.dc.html'] = doc(phone(`
${body(`
  <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Me</div>

  ${card(`<div style="display:flex;align-items:center;gap:14px;padding:16px;">
    ${av('AW', 58)}
    <div style="flex:1 1 auto;">
      <div style="font-size:17px;font-weight:700;">Andreas Wibowo</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Wibowo household &middot; Sunter</div>
      <div style="margin-top:8px;">${tierPill('community')}</div>
    </div>
    ${chev()}
  </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Membership')}
    ${card(rows([
      infoRow(I.checkCircle, 'Community Member since March 2024', 'Meaning your membership stays at Immanuel Church, Surabaya &mdash; and everything here is open to you except the full directory'),
      `<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 14px;"><span style="color:${C.accent};display:flex;padding-top:1px;">${svg(I.swap, 18)}</span><div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">Move my membership here</div><div style="font-size:12px;color:${C.ink2};margin-top:3px;line-height:1.4;">Needs a transfer letter. Opens the full directory and voting rights.</div></div>${chev()}</div>`,
    ]))}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Account')}
    ${card(rows([
      setRow(I.grid, 'My churches', `<span style="display:flex;align-items:center;gap:7px;color:${C.ink3};"><span style="font-size:13px;color:${C.ink2};font-weight:600;">2</span>${svg(I.chevR, 18, 1.9)}</span>`),
      setRow(I.qr, 'Digital member card', lockPill()),
      setRow(I.bell, 'Meeting reminders', `<span style="font-size:13px;color:${C.ink2};font-weight:600;">On &middot; WhatsApp</span>`),
      setRow(I.globe, 'Language', `<span style="font-size:13px;color:${C.ink2};font-weight:600;">English</span>`),
      setRow(I.lock, 'This phone', `<span style="font-size:13px;color:${C.ink2};font-weight:600;">Asks again in 12 days</span>`),
      `<div style="display:flex;align-items:center;gap:12px;padding:14px;"><span style="color:${C.accentDark};display:flex;">${svg(I.out, 19)}</span><div style="flex:1 1 auto;font-size:14px;font-weight:600;color:${C.accentDark};">Sign out</div></div>`,
    ]))}
  </div>
  <div style="flex:1 1 auto;"></div>
`)}
${navMember('Me')}`));

/* ===================== ASSIGN A SLOT - pick from the list ===================== */
const radio = (on) =>
  `<div style="width:20px;height:20px;flex:0 0 20px;border-radius:999px;border:${on ? `6px solid ${C.accent}` : `1.5px solid ${C.line}`};"></div>`;

const pickRow = (avatarHtml, name, meta, on = false) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;">
    ${radio(on)}${avatarHtml}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${name}</div><div style="font-size:12px;color:${C.ink2};margin-top:2px;">${meta}</div></div>
  </div>`;

mem['AssignPick.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Sat 14 Mar &middot; Music</div>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:16px;padding:18px 20px 0;">
  <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Who is on keys?</div>

  <div style="display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;color:${C.ink3};">
    ${svg(I.search, 19)}<span style="font-size:14px;">Search any name</span>
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Music team')}
    ${card(rows([
      pickRow(av('MH', 36), 'Melisa Halim', 'Keys, worship lead &middot; 14 times', true),
      pickRow(av('KH', 36), 'Kayla Halim', 'Keys &middot; 6 times'),
      pickRow(av('GS', 36), 'Grace Sutanto', 'Vocals, worship lead &middot; 11 times'),
    ]))}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Guests used before')}
    ${card(rows([
      pickRow(avExternal('RP', 36), 'Rio Panjaitan', 'Keys &middot; 6 times &middot; not on our roll'),
      pickRow(avExternal('SK', 36), 'Samuel Kartono', 'Speaking &middot; 3 times &middot; not on our roll'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    <div style="display:flex;align-items:center;gap:11px;padding:14px;border:1.5px dashed ${C.line};border-radius:12px;">
      <span style="color:${C.accent};display:flex;">${svg(I.userPlus, 19)}</span>
      <div style="flex:1 1 auto;"><div style="font-size:13px;font-weight:600;">Someone not on this list</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;">Type any name &mdash; they do not need a record here</div></div>
      ${chev()}
    </div>
  </div>
</div>`));

/* ===================== ASSIGN A SLOT - type a name that is not on file ===================== */
mem['AssignGuest.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Sat 14 Mar &middot; Music</div>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:18px 20px 0;">
  <div style="display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;background:${C.surface};border:1.5px solid ${C.accent};border-radius:12px;">
    ${svg(I.search, 19)}<span style="font-size:15px;font-weight:600;">Yohana Tanudjaja</span><span style="width:2px;height:22px;background:${C.accent};"></span>
  </div>
  <div style="display:flex;align-items:center;gap:8px;color:${C.ink3};">
    ${svg(I.search, 15)}<span style="font-size:12px;">Nobody on our roll and no past guest matches</span>
  </div>

  ${card(`
    <div style="padding:14px 16px 12px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:center;gap:11px;">
      ${avExternal('YT', 38)}
      <div style="flex:1 1 auto;"><div style="font-size:14px;font-weight:700;">Add as a guest</div><div style="font-size:12px;color:${C.ink2};margin-top:3px;">Name only is enough</div></div>
    </div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:14px;">
      ${field('Name', 'Yohana Tanudjaja')}
      <div style="display:flex;flex-direction:column;gap:8px;">
        <span style="font-size:12px;font-weight:700;color:${C.ink2};">What they do</span>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${chip('Keys', true)}${chip('Vocals')}${chip('Guitar')}${chip('Sound')}${chip('Speaking')}${chip('Other')}
        </div>
      </div>
      ${field('Phone', 'Leave empty if you do not have it', { tag: 'optional', placeholder: true })}
      ${field('From', 'Zion Church, Bandung', { tag: 'optional' })}
    </div>`, `border-color:#B4562F55;`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:22px;">
    <div style="display:flex;">${btn('Add and assign', { h: 52, icon: I.check })}</div>
    <div style="text-align:center;font-size:12px;color:${C.ink3};margin-top:11px;line-height:1.5;">Saved as a guest so you can pick her next time without retyping. Guests get no app access and never appear in the directory.</div>
  </div>
</div>`));

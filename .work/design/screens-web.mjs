import { C, SERIF, doc, svg, I, card, pill, av, sq, chip, btn, label, tierPill, qrBlock, rows, infoRow, avExternal } from './lib.mjs';

export const web = {};

const sideItem = (icon, t, on = false, badge = '') =>
  `<div style="display:flex;align-items:center;gap:11px;height:40px;padding:0 12px;border-radius:12px;${on ? `background:${C.accentTint};color:${C.accent};` : `color:${C.ink2};`}font-size:14px;font-weight:${on ? 700 : 600};"><span style="display:flex;">${svg(icon, 19, on ? 2 : 1.7)}</span><span style="flex:1 1 auto;">${t}</span>${badge ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:${C.accent};color:#FFFFFF;font-size:11px;font-weight:700;">${badge}</span>` : ''}</div>`;

export const sidebar = (active) => `
<div style="width:246px;flex:0 0 246px;background:${C.surfaceAlt};border-right:1px solid ${C.line};display:flex;flex-direction:column;padding:26px 16px 20px;">
  <div style="display:flex;align-items:center;gap:11px;padding:0 6px;">
    <div style="width:34px;height:34px;border-radius:12px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${svg(I.group, 20, 1.9)}</div>
    <div style="font-family:${SERIF};font-size:20px;font-weight:500;letter-spacing:-0.01em;">Jemaat</div>
  </div>
  <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};margin:26px 12px 8px;">CHURCH OFFICE</div>
  <div style="display:flex;flex-direction:column;gap:3px;">
    ${sideItem(I.grid, 'Overview', active === 'Overview')}
    ${sideItem(I.inbox, 'Applicants', active === 'Applicants', '5')}
    ${sideItem(I.users, 'People', active === 'People')}
    ${sideItem(I.home, 'Households', active === 'Households')}
    ${sideItem(I.group, 'Care Groups', active === 'Care Groups')}
    ${sideItem(I.hand, 'Serving', active === 'Serving')}
    ${sideItem(I.video, 'Sermons', active === 'Sermons')}
  </div>
  <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};margin:22px 12px 8px;">THIS CHURCH</div>
  <div style="display:flex;flex-direction:column;gap:3px;">
    ${sideItem(I.qr, 'Church code', active === 'Church code')}
    ${sideItem(I.sliders, 'Settings', active === 'Settings')}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;align-items:center;gap:11px;padding:11px 8px;border-top:1px solid ${C.line};">
    ${av('LS', 34)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Lidya S.</div><div style="font-size:11px;color:${C.ink3};">Church office</div></div>
  </div>
</div>`;

export const pageHead = (title, sub, actions) => `
<div style="display:flex;align-items:flex-end;gap:10px;">
  <div style="flex:1 1 auto;">
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.015em;">${title}</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:5px;">${sub}</div>
  </div>
  ${actions}
</div>`;

export const wBtn = (t, icon, primary = false) =>
  `<div style="display:flex;align-items:center;gap:8px;height:40px;padding:0 ${primary ? 18 : 16}px;border-radius:12px;${primary ? `background:${C.accent};color:#FFFFFF;` : `background:${C.surface};border:1px solid ${C.line};`}font-size:13px;font-weight:600;">${svg(icon, 17)}<span>${t}</span></div>`;

/* ===================== APPLICANTS QUEUE ===================== */
const applicantCard = (init, name, want, since, meta, on = false) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:12px;background:${on ? C.surface : 'transparent'};border:${on ? `1.5px solid ${C.accent}` : '1px solid transparent'};">
  ${av(init, 38)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:700;">${name}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:4px;">${want}</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:4px;">${meta}</div>
  </div>
  <span style="font-size:11px;color:${C.ink3};font-weight:600;white-space:nowrap;">${since}</span>
</div>`;

const detailField = (lab, value) =>
  `<div style="display:flex;flex-direction:column;gap:5px;"><span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${lab}</span><span style="font-size:14px;font-weight:600;">${value}</span></div>`;

const selectField = (lab, value, hint = '') => `
<div style="display:flex;flex-direction:column;gap:6px;">
  <span style="font-size:12px;font-weight:700;color:${C.ink2};">${lab}</span>
  <div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
    <span style="flex:1 1 auto;font-size:14px;font-weight:600;">${value}</span><span style="color:${C.ink3};display:flex;">${svg(I.chevD, 17)}</span>
  </div>
  ${hint ? `<span style="font-size:11px;color:${C.ink3};line-height:1.4;">${hint}</span>` : ''}
</div>`;

web['WebApplicants.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Applicants')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Applicants', '5 waiting &middot; oldest submitted 4 days ago', `${wBtn('Export list', I.upload)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="width:392px;flex:0 0 392px;display:flex;flex-direction:column;gap:10px;">
        ${card(`<div style="padding:6px;display:flex;flex-direction:column;gap:2px;">
          ${applicantCard('RW', 'Rian Wijaya', 'Wants: Community Member', '2 days', 'Over a year &middot; Bethania Church, Bandung', true)}
          ${applicantCard('GS', 'Grace Sutanto', 'Wants: Registered Member', '2 days', '6 to 12 months &middot; no other church')}
          ${applicantCard('FT', 'Fandi Tobing', 'Wants: Community Member', '3 days', 'Over a year &middot; Ebenhaezer Church, Jakarta')}
          ${applicantCard('SR', 'Sinta Rahmat', 'Wants: Community Member', '4 days', 'Under 6 months &middot; no other church')}
          ${applicantCard('HL', 'Hendra Lie', 'Wants: Registered Member', '4 days', 'Over a year &middot; Zion Church, Bandung')}
        </div>`)}
      </div>

      <div style="flex:1 1 auto;min-width:0;">
        ${card(`
          <div style="padding:22px 24px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:flex-start;gap:16px;">
            ${av('RW', 52)}
            <div style="flex:1 1 auto;">
              <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Rian Wijaya</div>
              <div style="font-size:13px;color:${C.ink3};margin-top:5px;">Submitted 8 March, 14.22 &middot; not yet contacted</div>
            </div>
            ${wBtn('WhatsApp', I.chat)}
          </div>

          <div style="padding:20px 24px;border-bottom:1px solid ${C.lineSoft};display:flex;gap:44px;">
            ${detailField('PHONE', '+62 812-1234-5678')}
            ${detailField('WORSHIPPING HERE', 'Over a year')}
            ${detailField('CURRENT MEMBERSHIP', 'Bethania Church, Bandung')}
            ${detailField('REQUESTED', 'Community Member')}
          </div>

          <div style="padding:20px 24px;display:flex;flex-direction:column;gap:16px;">
            ${label('Confirm and place')}
            <div style="display:flex;gap:16px;">
              <div style="flex:1 1 0;">${selectField('Membership status', 'Community Member', 'Keeps their membership at Bethania Church.')}</div>
              <div style="flex:1 1 0;">${selectField('Household', 'Create new: Wijaya household', 'Or attach to an existing household.')}</div>
              <div style="flex:1 1 0;">${selectField('Care group', 'Anugerah &middot; Sunter', 'Optional. Can be changed by the group leader.')}</div>
            </div>
          </div>

          <div style="padding:0 24px 22px;display:flex;align-items:center;gap:12px;">
            <div style="display:flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:12px;background:${C.accent};color:#FFFFFF;font-size:14px;font-weight:700;">${svg(I.check, 18)}<span>Confirm as Community Member</span></div>
            <div style="display:flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:12px;background:${C.surface};border:1px solid ${C.line};font-size:14px;font-weight:600;">${svg(I.chat, 17)}<span>Needs a conversation</span></div>
            <span style="font-size:13px;font-weight:600;color:${C.ink3};padding:0 6px;">Already on our roll</span>
            <div style="flex:1 1 auto;"></div>
            <div style="display:flex;align-items:center;gap:8px;max-width:330px;color:${C.ink3};">${svg(I.lock, 16)}<span style="font-size:11px;line-height:1.4;">There is no decline button on purpose. The furthest this screen goes is asking for a conversation.</span></div>
          </div>`)}
      </div>
    </div>
  </div>
</div>`);

/* ===================== PEOPLE TABLE ===================== */
const th = (t, w = '') =>
  `<div style="${w ? `width:${w};flex:0 0 ${w};` : 'flex:1 1 0;'}font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${t}</div>`;
const td = (t, w = '', extra = '') =>
  `<div style="${w ? `width:${w};flex:0 0 ${w};` : 'flex:1 1 0;'}font-size:13px;${extra}">${t}</div>`;
const checkbox = () => `<div style="width:16px;flex:0 0 16px;height:16px;border:1.5px solid ${C.line};border-radius:6px;"></div>`;
const initialsOf = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);

const personTr = (name, household, role, age, phone, group, status) => `
<div style="display:flex;align-items:center;gap:16px;padding:0 22px;height:48px;border-top:1px solid ${C.lineSoft};">
  ${checkbox()}
  <div style="width:200px;flex:0 0 200px;display:flex;align-items:center;gap:10px;">${status.includes('Not on our roll') ? avExternal(initialsOf(name), 30) : av(initialsOf(name), 30)}<span style="font-size:13px;font-weight:600;">${name}</span></div>
  ${td(household, '188px', `color:${C.ink2};`)}
  ${td(role, '100px', `color:${C.ink2};`)}
  ${td(age, '52px', `color:${C.ink2};`)}
  ${td(phone, '148px', `color:${C.ink2};`)}
  ${td(group, '128px', `color:${C.ink2};`)}
  <div style="width:172px;flex:0 0 172px;">${status}</div>
  <div style="width:30px;flex:0 0 30px;color:${C.ink3};display:flex;justify-content:flex-end;">${svg(I.more, 18)}</div>
</div>`;

const pageNum = (t, on = false) =>
  `<span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:12px;${on ? `background:${C.accent};color:#FFFFFF;` : `border:1px solid ${C.line};background:${C.surface};color:${C.ink2};`}font-size:13px;font-weight:${on ? 700 : 600};">${t}</span>`;

web['WebPeople.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('People', '248 on the roll &middot; 6 external &middot; 76 households &middot; updated today 09.14',
      `${wBtn('Import from Excel', I.upload)}${wBtn('Add person', I.plus, true)}`)}

    <div style="display:flex;align-items:center;gap:9px;">
      ${chip('All 254', true)}${chip('Registered 196')}${chip('Community 34')}${chip('Guests 18')}${chip('Not on our roll 6')}
      <span style="width:1px;height:26px;background:${C.line};margin:0 4px;"></span>
      <span style="display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 13px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};font-size:13px;font-weight:600;color:${C.ink2};">Area: all ${svg(I.chevD, 15)}</span>
      <span style="display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 13px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};font-size:13px;font-weight:600;color:${C.ink2};">Care group: all ${svg(I.chevD, 15)}</span>
      <div style="flex:1 1 auto;"></div>
      <span style="font-size:13px;font-weight:700;color:${C.accent};">12 phone numbers missing</span>
    </div>

    ${card(`
      <div style="display:flex;align-items:center;gap:16px;padding:0 22px;height:44px;">
        ${checkbox()}
        ${th('NAME', '200px')}${th('HOUSEHOLD', '188px')}${th('ROLE', '100px')}${th('AGE', '52px')}${th('PHONE', '148px')}${th('CARE GROUP', '128px')}${th('STATUS', '172px')}<div style="width:30px;flex:0 0 30px;"></div>
      </div>
      ${personTr('Budi Halim', 'Halim household', 'Head', '48', '0812-1122-3344', 'Anugerah', tierPill('registered'))}
      ${personTr('Melisa Halim', 'Halim household', 'Spouse', '45', '0813-9080-1122', 'Anugerah', tierPill('registered'))}
      ${personTr('Gavriel Halim', 'Halim household', 'Child', '14', '&mdash;', 'Anugerah', tierPill('community'))}
      ${personTr('Andreas Wibowo', 'Wibowo household', 'Head', '44', '0811-2200-3311', 'Anugerah', tierPill('community'))}
      ${personTr('Dedi Prasetyo', 'Prasetyo household', 'Head', '52', `<span style="color:${C.amber};font-weight:600;">missing</span>`, 'Anugerah', tierPill('registered'))}
      ${personTr('Intan Prasetyo', 'Prasetyo household', 'Spouse', '49', '0811-4455-6677', 'Anugerah', tierPill('registered'))}
      ${personTr('Tigor Simanjuntak', 'Simanjuntak household', 'Head', '61', '0812-7788-9900', 'Damai', tierPill('registered'))}
      ${personTr('Grace Sutanto', 'Sutanto household', 'Other', '31', '0813-5566-7788', '&mdash;', tierPill('guest'))}
      ${personTr('Fandi Tobing', 'Tobing household', 'Head', '37', '0812-6600-4411', 'Damai', tierPill('community'))}
      ${personTr('Samuel Kartono', '&mdash;', '&mdash;', '&mdash;', '0812-4400-9911', '&mdash;', tierPill('external'))}
      ${personTr('Rio Panjaitan', '&mdash;', '&mdash;', '&mdash;', '0813-7711-2200', '&mdash;', tierPill('external'))}
      <div style="display:flex;align-items:center;padding:0 22px;height:52px;border-top:1px solid ${C.line};">
        <div style="flex:1 1 auto;font-size:13px;color:${C.ink2};">Showing 1&ndash;10 of 248</div>
        <div style="display:flex;gap:7px;align-items:center;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:12px;border:1px solid ${C.line};background:${C.surface};color:${C.ink3};">${svg(I.chevL, 16)}</span>
          ${pageNum('1', true)}${pageNum('2')}${pageNum('3')}
          <span style="display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:12px;border:1px solid ${C.line};background:${C.surface};color:${C.ink2};">${svg(I.chevR, 16)}</span>
        </div>
      </div>`, 'overflow:hidden;')}
    <div style="flex:1 1 auto;"></div>
  </div>
</div>`);

/* ===================== SERVING ROSTER ===================== */
const cellFilled = (who, notes) => `
<div style="flex:1 1 0;padding:11px 12px;border-left:1px solid ${C.lineSoft};display:flex;flex-direction:column;gap:7px;justify-content:center;">
  <div style="display:flex;align-items:center;gap:7px;">${av(who.split(' ').map((w) => w[0]).join('').slice(0, 2), 24)}<span style="font-size:13px;font-weight:600;">${who}</span></div>
  ${notes.map((n) => `<div style="font-size:11px;color:${C.ink2};">${n}</div>`).join('')}
</div>`;
const cellOpen = (note) => `
<div style="flex:1 1 0;padding:11px 12px;border-left:1px solid ${C.lineSoft};display:flex;flex-direction:column;justify-content:center;gap:7px;background:#F7EEDD88;">
  <div style="display:flex;align-items:center;gap:7px;color:${C.amber};">${svg(I.plus, 16)}<span style="font-size:12px;font-weight:700;">Open slot</span></div>
  <div style="font-size:11px;color:${C.ink3};">${note}</div>
</div>`;
const cellWait = (who) => `
<div style="flex:1 1 0;padding:11px 12px;border-left:1px solid ${C.lineSoft};display:flex;flex-direction:column;gap:7px;justify-content:center;">
  <div style="display:flex;align-items:center;gap:7px;">${av(who.split(' ').map((w) => w[0]).join('').slice(0, 2), 24, C.bg, C.ink3)}<span style="font-size:13px;font-weight:600;color:${C.ink2};">${who}</span></div>
  <div style="display:flex;"><span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;border:1px dashed ${C.ink3};color:${C.ink3};font-size:11px;font-weight:700;">Not confirmed</span></div>
</div>`;
const cellExternal = (who, notes) => `
<div style="flex:1 1 0;padding:11px 12px;border-left:1px solid ${C.lineSoft};display:flex;flex-direction:column;gap:7px;justify-content:center;">
  <div style="display:flex;align-items:center;gap:7px;">${avExternal(who.split(' ').map((w) => w[0]).join('').slice(0, 2), 24)}<span style="font-size:13px;font-weight:600;">${who}</span></div>
  ${notes.map((n) => `<div style="font-size:11px;color:${C.ink2};">${n}</div>`).join('')}
  <div style="display:flex;"><span style="display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:999px;border:1px dashed ${C.ink3};color:${C.ink3};font-size:10px;font-weight:700;">Not on our roll</span></div>
</div>`;

const rosterRow = (team, meta, cells) => `
<div style="display:flex;border-top:1px solid ${C.line};min-height:98px;">
  <div style="width:230px;flex:0 0 230px;padding:13px 18px;display:flex;align-items:center;gap:11px;">
    ${sq(team.slice(0, 1), 36)}
    <div><div style="font-size:13px;font-weight:700;">${team}</div><div style="font-size:11px;color:${C.ink3};margin-top:3px;">${meta}</div></div>
  </div>
  ${cells}
</div>`;

web['WebRoster.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Serving')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Serving roster', 'March 2026 &middot; 4 teams &middot; 4 service dates &middot; 2 slots filled from outside',
      `${wBtn('March 2026', I.cal)}${wBtn('Send WhatsApp reminders', I.chat)}${wBtn('Add duty', I.plus, true)}`)}

    <div style="display:flex;gap:10px;">
      ${pill('3 open slots', C.amberTint, C.amber, 'height:30px;padding:0 12px;font-size:12px;')}
      ${pill('4 not confirmed', C.surface, C.ink2, `border:1px solid ${C.line};height:30px;padding:0 12px;font-size:12px;`)}
      ${pill('19 confirmed', C.sageTint, C.sage, 'height:30px;padding:0 12px;font-size:12px;')}
    </div>

    ${card(`
      <div style="display:flex;height:44px;align-items:center;">
        <div style="width:230px;flex:0 0 230px;padding:0 18px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">TEAM</div>
        ${['SAT 7 MAR', 'SAT 14 MAR', 'SAT 21 MAR', 'SAT 28 MAR']
          .map((w) => `<div style="flex:1 1 0;padding:0 12px;border-left:1px solid ${C.lineSoft};font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${w}</div>`)
          .join('')}
      </div>
      ${rosterRow('Media', '6 volunteers &middot; slides, sound',
        cellFilled('Gavriel Halim', ['Slides', 'Sound: Fandi T.']) +
        cellFilled('Andreas Wibowo', ['Slides', 'Sound: Fandi T.']) +
        cellOpen('Sound desk unfilled') +
        cellWait('Gavriel Halim'))}
      ${rosterRow('Music', '9 volunteers &middot; 1 guest',
        cellFilled('Melisa Halim', ['Worship lead', 'Keys: Kayla H.']) +
        cellFilled('Grace Sutanto', ['Worship lead', 'Keys: Melisa H.']) +
        cellExternal('Rio Panjaitan', ['Keys, guest pianist']) +
        cellWait('Grace Sutanto'))}
      ${rosterRow('Hospitality', '11 volunteers &middot; welcome, ushers',
        cellFilled('Intan Prasetyo', ['Welcome desk', 'Ushers: 3 rostered']) +
        cellFilled('Ruth Simanjuntak', ['Welcome desk', 'Ushers: 3 rostered']) +
        cellFilled('Intan Prasetyo', ['Welcome desk', 'Ushers: 2 rostered']) +
        cellOpen('No welcome desk yet'))}
      ${rosterRow('Preaching', '4 speakers &middot; 2 from outside',
        cellExternal('Samuel Kartono', ['Growing in Prayer 2']) +
        cellExternal('Samuel Kartono', ['Growing in Prayer 3']) +
        cellFilled('Budi Halim', ['Growing in Prayer 4']) +
        cellOpen('Speaker not assigned'))}
    `, 'overflow:hidden;')}
    <div style="flex:1 1 auto;"></div>
  </div>
</div>`);

/* ===================== CHURCH CODE (multi-tenant entry point) ===================== */
const statRow = (n, t, sub) =>
  `<div style="display:flex;align-items:baseline;gap:12px;padding:13px 16px;">
    <span style="font-family:${SERIF};font-size:24px;font-weight:600;width:64px;flex:0 0 64px;">${n}</span>
    <div style="flex:1 1 auto;"><div style="font-size:13px;font-weight:600;">${t}</div><div style="font-size:12px;color:${C.ink3};margin-top:2px;">${sub}</div></div>
  </div>`;

const exposed = (yes, t) =>
  `<div style="display:flex;align-items:center;gap:10px;padding:10px 16px;">
    <span style="color:${yes ? C.sage : C.ink3};display:flex;">${svg(yes ? I.check : I.lock, 16, 2)}</span>
    <span style="font-size:13px;color:${yes ? C.ink : C.ink2};">${t}</span>
  </div>`;

web['WebChurchCode.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Church code')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Church code', 'How people find Grace Community Church in the app',
      `${wBtn('Rotate code', I.swap)}${wBtn('Download QR poster', I.qr, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="width:520px;flex:0 0 520px;">
        ${card(`
          <div style="padding:26px;display:flex;gap:26px;align-items:center;border-bottom:1px solid ${C.lineSoft};">
            <div style="padding:12px;background:#FFFFFF;border:1px solid ${C.line};border-radius:12px;">${qrBlock(180, C.ink)}</div>
            <div style="flex:1 1 auto;min-width:0;">
              ${label('Church code')}
              <div style="font-size:34px;font-weight:700;letter-spacing:0.06em;margin-top:9px;line-height:1.1;">GRACE<span style="color:${C.ink3};">-</span>BDG</div>
              <div style="font-size:12px;color:${C.ink2};margin-top:10px;line-height:1.5;">Capitals do not matter. The QR carries the same code, so a printed poster and a typed code lead to the same place.</div>
            </div>
          </div>
          <div style="padding:18px 26px;display:flex;align-items:flex-start;gap:11px;">
            <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.lock, 17)}</span>
            <div style="font-size:12px;color:${C.ink2};line-height:1.55;">Rotating the code stops every printed poster and bulletin from working. People already following this church stay; only new joins need the new code.</div>
          </div>`)}
      </div>

      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 0;">${label('Reach')}</div>
          ${rows([
            statRow('312', 'devices following this church', 'Browsing sermons and service times'),
            statRow('48', 'signed in', 'Community and Registered combined'),
            statRow('5', 'applications waiting', 'Sitting in the Applicants queue'),
          ])}`)}

        ${card(`
          <div style="padding:14px 16px 8px;">${label('Two things to decide out loud')}</div>
          <div style="padding:0 16px 14px;font-size:11px;color:${C.ink2};line-height:1.6;">
            <span style="font-weight:700;color:${C.ink};">Listed by name?</span> Someone who has lost the bulletin can look you up with your full name and city. There is no browsable list of churches anywhere, and you can be unlisted entirely.<br><br>
            <span style="font-weight:700;color:${C.ink};">Messages by WhatsApp?</span> It is the only channel people reliably read, and it means your members&rsquo; numbers pass through a messaging provider. Turn it off and everything still works by push notification, with fewer people answering.
          </div>`, 'border-color:#9A722344;')}

        ${card(`
          <div style="padding:14px 16px 6px;">${label('Anyone with the code can see')}</div>
          ${exposed(true, 'Service times, speaker and location')}
          ${exposed(true, 'Sermon recordings and event posters')}
          ${exposed(false, 'Names, phone numbers, addresses')}
          ${exposed(false, 'The people directory and households')}
          ${exposed(false, 'Care group rosters and attendance')}
          <div style="height:12px;"></div>`)}
      </div>
    </div>
  </div>
</div>`);

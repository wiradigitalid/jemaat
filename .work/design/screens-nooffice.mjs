import { C, SERIF, doc, svg, I, card, label, av, btn, chev, iconBtn, rows, dateBlock } from './lib.mjs';

/*
 * THE CHURCH WITH NO OFFICE.
 *
 * Ten web screens all assume Lidya: a person with a desk, a computer,
 * and time on Thursday. The stated target is small-to-medium
 * congregations, and most small Indonesian churches have no paid staff
 * at all - the office is a volunteer treasurer who comes on Saturday,
 * or the pastor's spouse, on a phone.
 *
 * The web/mobile split was drawn along the wrong axis. Not WHO you are
 * (member on a phone, office on a desktop) but HOW BIG THE JOB IS.
 * Importing 261 rows and reading a four-week roster grid are genuinely
 * big-screen work. Publishing one week and confirming one applicant are
 * not, and they are the two things an office does most often.
 */
export const nooffice = {};

const field = (lab, value, right = '', muted = false) => `
<div style="display:flex;flex-direction:column;gap:5px;">
  <span style="font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${lab}</span>
  <div style="display:flex;align-items:center;gap:9px;height:44px;padding:0 13px;background:${muted ? 'transparent' : C.surface};border:1px solid ${muted ? C.lineSoft : C.line};border-radius:12px;">
    <span style="flex:1 1 auto;font-size:13px;font-weight:600;color:${muted ? C.ink3 : C.ink};">${value}</span>${right}
  </div>
</div>`;

const tick = (t, who, on) => `
<div style="display:flex;align-items:center;gap:11px;padding:10px 14px;">
  <div style="width:17px;height:17px;flex:0 0 17px;border-radius:6px;background:${on ? C.accent : 'transparent'};border:${on ? 'none' : `1.5px solid ${C.line}`};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${on ? svg(I.check, 11, 3) : ''}</div>
  <div style="flex:1 1 auto;min-width:0;"><div style="font-size:12px;font-weight:600;line-height:1.35;">${t}</div><div style="font-size:10px;color:${C.ink3};margin-top:2px;">${who}</div></div>
</div>`;

const phoneFrame = (inner) =>
  `<div style="width:390px;height:844px;flex:0 0 390px;background:${C.bg};display:flex;flex-direction:column;border:1px solid ${C.line};border-radius:14px;overflow:hidden;">${inner}</div>`;

const fact = (k, v) =>
  `<div style="display:flex;align-items:baseline;gap:12px;padding:9px 14px;">
    <span style="width:92px;flex:0 0 92px;font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">${k}</span>
    <span style="flex:1 1 auto;font-size:12px;font-weight:600;line-height:1.4;">${v}</span>
  </div>`;

/* ---- the week, published from a phone ---- */
const weekPhone = phoneFrame(`
<div style="display:flex;align-items:center;gap:12px;padding:22px 18px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:13px;font-weight:700;color:${C.ink2};">This week</div>
  <span style="font-size:13px;font-weight:700;color:${C.accent};">Publish</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:13px;padding:16px 18px 0;">
  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${dateBlock('SAT', '14')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:700;">Saturday 14 March, 09.00</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;">Grace Hall &middot; from church settings</div>
    </div>
  </div>`)}
  ${field('SPEAKER', 'Samuel Kartono', `<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 16)}</span>`)}
  ${field('SERIES AND PART', 'Growing in Prayer &middot; part 3')}
  <div style="display:flex;flex-direction:column;gap:8px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">ANNOUNCEMENTS</span>
      <span style="font-size:11px;font-weight:700;color:${C.accent};">Add</span>
    </div>
    ${card(rows([
      tick('New members class starts 22 March', 'Office &middot; until 12 April', true),
      tick('Youth camp closes 18 March', 'Youth team', true),
      tick('Choir needs two altos', 'Music team', true),
    ]))}
  </div>
  ${field('LAST WEEK&rsquo;S RECORDING', 'youtu.be/8Kq2mVn4pQe')}
  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:20px;">
    ${btn('Publish this week', { h: 48, icon: I.check, grow: false })}
    <div style="text-align:center;font-size:10px;color:${C.ink3};margin-top:10px;line-height:1.5;">The poster is the one thing left for a desktop. Publish without it and the app draws the title.</div>
  </div>
</div>`);

/* ---- one applicant, confirmed from a phone ---- */
const applicantPhone = phoneFrame(`
<div style="display:flex;align-items:center;gap:12px;padding:22px 18px 0;">
  ${iconBtn(I.chevL)}
  <div style="flex:1 1 auto;font-size:13px;font-weight:700;color:${C.ink2};">Applicant 1 of 3</div>
  ${iconBtn(I.chat)}
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:13px;padding:16px 18px 0;">
  <div style="display:flex;align-items:center;gap:12px;">
    ${av('RW', 48)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Rian Wijaya</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;">Submitted 8 March &middot; not yet contacted</div>
    </div>
  </div>
  ${card(rows([
    fact('PHONE', '+62 812-1234-5678'),
    fact('HERE FOR', 'Over a year'),
    fact('MEMBER OF', 'Bethania Church, Bandung'),
    fact('ASKED FOR', 'To keep his membership there'),
  ]))}
  <div style="display:flex;flex-direction:column;gap:11px;">
    <span style="font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">CONFIRM AND PLACE</span>
    ${field('STANDING', 'Community Member', `<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 16)}</span>`)}
    ${field('HOUSEHOLD', 'Create new: Wijaya', `<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 16)}</span>`)}
    ${field('CARE GROUP', 'Anugerah &middot; Sunter', `<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 16)}</span>`)}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:20px;display:flex;flex-direction:column;gap:9px;">
    ${btn('Confirm', { h: 48, icon: I.check, grow: false })}
    ${btn('Needs a conversation', { kind: 'ghost', h: 44, icon: I.chat, grow: false })}
    <div style="text-align:center;font-size:10px;color:${C.ink3};line-height:1.5;">Does not move his membership.</div>
  </div>
</div>`);

nooffice['NoOffice.dc.html'] = doc(`
<div style="width:1440px;height:1060px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The church with no office</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:960px;">Ten web screens all assume Lidya: a desk, a computer, and time on Thursday. Most small Indonesian churches have no paid staff at all &mdash; the office is a volunteer who comes on Saturday, or the pastor&rsquo;s spouse, on a phone.</div>
  </div>

  <div style="display:flex;gap:26px;flex:1 1 auto;min-height:0;">
    ${weekPhone}
    ${applicantPhone}
    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`<div style="padding:20px;">
        <div style="font-size:15px;font-weight:700;">The split was drawn along the wrong axis</div>
        <div style="font-size:13px;color:${C.ink2};margin-top:10px;line-height:1.65;">Not <span style="font-style:italic;">who you are</span> &mdash; member on a phone, office on a desktop &mdash; but <span style="font-weight:700;color:${C.ink};">how big the job is</span>.<br><br>Importing 261 rows and reading a four-week roster grid are genuinely big-screen work. Publishing one week and confirming one applicant are not, and they are the two things an office does most often.</div>
      </div>`, 'border-color:#B4562F55;')}

      ${card(`
        <div style="padding:15px 16px 8px;">${label('Genuinely desktop, and that is fine')}</div>
        <div style="padding:0 16px 14px;font-size:12px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">W5 import</span> &mdash; column mapping on a phone is not a design problem, it is a bad idea. A church of 60 does not need it: typing 60 people on M5 is one evening.<br><br>
          <span style="font-weight:700;color:${C.ink};">W3 roster grid</span> &mdash; four weeks by four teams needs the width. A phone gets one week at a time, which is what M10 already does.<br><br>
          <span style="font-weight:700;color:${C.ink};">W2 table</span> &mdash; bulk work wants a table. One person at a time is M4 and M5, already on the phone.
        </div>`)}

      ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:12px;">
        <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 20)}</span>
        <div style="flex:1 1 auto;">
          <div style="font-size:14px;font-weight:700;">What it costs the release</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.6;">Two more mobile screens in R0, both compressions of screens already designed rather than new thinking. And one thing genuinely dropped: the poster stays desktop-only, so a phone-only church publishes without one and the app draws the title instead. That is a worse poster and a shipped week, which is the right trade.</div>
        </div>
      </div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

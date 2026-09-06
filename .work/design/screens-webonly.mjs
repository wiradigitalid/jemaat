import { C, SERIF, doc, svg, I, card, label, av, btn, chev, iconBtn, rows, sq, field, dateBlock, pill } from './lib.mjs';

/*
 * WEB FIRST, NO APP.
 *
 * The owner's decision: go live on the web and leave the mobile app for
 * later. This page works out what that actually costs, and the answer is
 * cheaper than it looks - because two earlier iterations already did the
 * expensive thinking.
 *
 * S7 (it. 32) routed everything a person must ACT on to WhatsApp, and S8
 * (it. 33) found the consequence: the office needs the web, the leader
 * needs the app, the congregation needs nothing. Drop the app and exactly
 * one person is affected - the group leader.
 *
 * S9 (it. 34) is paid back rather than lost: its two phone compressions of
 * W8 and W1 stop being extra screens and become the same responsive route.
 *
 * What the app was quietly carrying, and now has to be drawn: the session,
 * the offline write, the install, and push. Three have cheap answers. One -
 * attendance marked inside a concrete hall with no signal - does not, and it
 * is the write the whole retention argument rests on.
 */
export const webonly = {};

const vdots = `<circle cx="12" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none"/>`;

const frame = (inner) =>
  `<div style="width:390px;height:844px;background:${C.bg};display:flex;flex-direction:column;">${inner}</div>`;

const statusRow = (time = '19.32', offline = false) => `
<div style="display:flex;align-items:center;gap:8px;height:34px;padding:0 16px;">
  <span style="font-size:11px;font-weight:700;color:${C.ink2};">${time}</span>
  <div style="flex:1 1 auto;"></div>
  ${offline
    ? `<span style="display:inline-flex;align-items:center;gap:5px;color:${C.amber};font-size:9px;font-weight:700;letter-spacing:0.06em;">${svg(I.offline, 13, 2)}<span>NO SIGNAL</span></span>`
    : `<span style="display:flex;gap:2px;align-items:flex-end;">${[5, 7, 9, 11].map((h) => `<span style="width:3px;height:${h}px;border-radius:1px;background:${C.ink3};"></span>`).join('')}</span>`}
  <span style="width:21px;height:11px;border:1.2px solid ${C.ink3};border-radius:3px;padding:1.5px;display:flex;"><span style="width:${offline ? '40%' : '70%'};background:${C.ink3};border-radius:1px;"></span></span>
</div>`;

/** A real browser: an address bar the page does not control, and a toolbar eating the bottom. */
const urlBar = (url) => `
<div style="display:flex;align-items:center;padding:0 12px 10px;">
  <div style="flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;background:${C.surface};border:1px solid ${C.line};border-radius:999px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.lock, 13, 2)}</span>
    <span style="flex:1 1 auto;min-width:0;font-size:12px;font-weight:600;color:${C.ink2};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${url}</span>
    <span style="color:${C.ink3};display:flex;">${svg(vdots, 15, 2)}</span>
  </div>
</div>`;

const toolbar = () => `
<div style="display:flex;align-items:center;justify-content:space-between;height:66px;padding:0 26px 16px;border-top:1px solid ${C.line};background:${C.surfaceAlt};color:${C.ink3};">
  ${svg(I.chevL, 19)}${svg(I.chevR, 19)}${svg(I.share, 18)}${svg(I.grid, 18)}${svg(vdots, 18)}
</div>`;

/** Content region: 844 - 34 status - 48 address - 66 toolbar = 696. */
const inBrowser = (url, inner, { offline = false, time = '19.32' } = {}) =>
  frame(`${statusRow(time, offline)}${urlBar(url)}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>
${toolbar()}`);

/** Added to the home screen: the address bar and the toolbar are gone. 844 - 34 - 24 = 786. */
const installed = (inner, { time = '19.32' } = {}) =>
  frame(`${statusRow(time)}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>
<div style="height:24px;display:flex;align-items:center;justify-content:center;"><span style="width:118px;height:4px;border-radius:999px;background:${C.line};"></span></div>`);

/*
 * The webview inside a messaging app. Drawn in this product's palette on
 * purpose - the same rule S8 set for the message thread. It is not a
 * rendering of WhatsApp and must not become one.
 */
const inApp = (url, inner) =>
  frame(`${statusRow()}
<div style="display:flex;align-items:center;gap:11px;height:48px;padding:0 14px;border-bottom:1px solid ${C.line};background:${C.surfaceAlt};">
  <span style="color:${C.ink2};display:flex;">${svg(I.x, 17, 2)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${url}</div>
    <div style="font-size:9px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};margin-top:1px;">IN-APP BROWSER</div>
  </div>
  <span style="color:${C.ink2};display:flex;">${svg(vdots, 17, 2)}</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>`);

const pad = (inner, gap = 14) =>
  `<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:${gap}px;padding:16px 16px 0;">${inner}</div>`;

/*
 * NAVIGATION MOVES TO THE TOP, AND STAYS THERE.
 *
 * The app's four-tab strip cannot survive here: a bottom bar sits directly
 * on top of the browser's own toolbar and loses ~118px of an 844px screen.
 * So navigation goes to the top - and it stays at the top even once the page
 * is saved to the home screen, where a bottom strip would fit again. One
 * layout, so the leader who installs it does not get a second app.
 */
const webNav = (active) => {
  const tab = (t) => {
    const on = t === active;
    return `<span style="display:inline-flex;align-items:center;height:32px;padding:0 13px;border-radius:999px;font-size:12px;font-weight:${on ? 700 : 600};${on ? `background:${C.accent};color:#FFFFFF;` : `color:${C.ink2};`}">${t}</span>`;
  };
  return `
<div style="display:flex;align-items:center;gap:11px;padding:12px 16px 0;">
  ${sq('IM', 30)}
  <div style="flex:1 1 auto;min-width:0;font-size:13px;font-weight:700;">Immanuel</div>
  <span style="color:${C.ink3};display:flex;">${svg(I.bell, 19)}</span>
</div>
<div style="display:flex;gap:4px;padding:11px 12px;border-bottom:1px solid ${C.line};">
  ${['Home', 'Groups', 'Sermons', 'Me'].map(tab).join('')}
</div>`;
};

const note = (t, tone = C.ink3) =>
  `<div style="font-size:10.5px;color:${tone};line-height:1.5;">${t}</div>`;

/** Content-width action. lib's btn() carries no horizontal padding, so it overflows a tight row. */
const miniBtn = (t) =>
  `<span style="display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;height:34px;padding:0 15px;border-radius:12px;border:1px solid ${C.accent};color:${C.accent};font-size:13px;font-weight:600;white-space:nowrap;">${t}</span>`;

const tickRow = (name, meta, state) => {
  const box = {
    on: `background:${C.accent};border:none;`,
    off: `background:transparent;border:1.5px solid ${C.line};`,
    wa: `background:${C.sageTint};border:1.5px solid ${C.sage};`,
  }[state];
  const mark = state === 'on' ? svg(I.check, 12, 3) : state === 'wa' ? `<span style="color:${C.sage};display:flex;">${svg(I.check, 12, 3)}</span>` : '';
  return `<div style="display:flex;align-items:center;gap:11px;padding:11px 14px;">
    ${av(name.split(' ').map((w) => w[0]).join('').slice(0, 2), 34)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:600;line-height:1.3;">${name}</div>
      ${meta ? `<div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">${meta}</div>` : ''}
    </div>
    <div style="width:22px;height:22px;flex:0 0 22px;border-radius:7px;color:#FFFFFF;display:flex;align-items:center;justify-content:center;${box}">${mark}</div>
  </div>`;
};

/* ============================ B1 - the one door ============================ */

webonly['WebSignIn.dc.html'] = doc(inBrowser('imanuel.jemaat.app', pad(`
  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${sq('IM', 42)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Immanuel Church, Sunter</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;font-family:ui-monospace,monospace;">jemaat.app/c/K7M2QX</div>
    </div>
  </div>`)}

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Sign in</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:7px;line-height:1.55;">The office already has your number. There is nothing to create.</div>
  </div>

  ${field('YOUR PHONE', '812-3456-7890', { prefix: '+62', placeholder: true })}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${btn('Send me a link on WhatsApp', { h: 48, icon: I.chat, grow: false })}
    ${btn('Send a 6-digit code instead', { kind: 'ghost', h: 44, grow: false })}
    ${note('The link is one tap in the app you already have open. The code is for a phone with no WhatsApp, and for a shared computer.')}
  </div>

  ${card(`<div style="padding:14px;">
    <div style="font-size:12.5px;font-weight:700;">One door, three different afters</div>
    <div style="font-size:11.5px;color:${C.ink2};margin-top:7px;line-height:1.6;">The office, a group leader and an ordinary member all sign in here. What you can see afterwards is what the office granted you on W13 &mdash; never something you chose on this screen.</div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="display:flex;align-items:flex-start;gap:10px;padding:13px 14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
    <div style="flex:1 1 auto;">${note('Stays signed in on this phone. Before it will show you anyone else&rsquo;s number it asks again &mdash; 12 days, the same promise M11 made when this was an app.', C.ink2)}</div>
  </div>`)}
  <div style="height:16px;"></div>
`)));

/* ==================== B2 - the leader's Wednesday, in a browser ==================== */

const meetingCard = `
${card(`
  <div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${dateBlock('WED', '11')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Anugerah &middot; tonight, 19.30</div>
      <div style="font-size:11.5px;color:${C.ink2};margin-top:3px;">At the Prasetyo home &middot; Sunter</div>
    </div>
  </div>
  <div style="display:flex;gap:8px;padding:0 14px 12px;">
    ${pill('9 said yes', C.sageTint, C.sage)}
    ${pill('3 no answer', C.bg, C.ink3, `border:1px solid ${C.line};`)}
  </div>
  <div style="display:flex;gap:9px;padding:0 14px 14px;border-top:1px solid ${C.lineSoft};padding-top:12px;">
    ${btn('Nudge the 3', { kind: 'ghost', h: 44, icon: I.chat })}
    ${btn('Mark attendance', { h: 44, icon: I.check })}
  </div>`)}`;

webonly['WebLeader.dc.html'] = doc(inBrowser('imanuel.jemaat.app', `
${webNav('Home')}
${pad(`
  <div>
    <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WEDNESDAY, 11 MARCH</div>
    <div style="font-family:${SERIF};font-size:22px;font-weight:500;margin-top:5px;">Good evening, Budi</div>
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
    <span style="color:${C.accent};display:flex;">${svg(I.share, 18)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12.5px;font-weight:700;">Keep Jemaat one tap away</div>
      <div style="font-size:10.5px;color:${C.ink2};margin-top:2px;">Add to home screen &mdash; no store, no download</div>
    </div>
    <span style="color:${C.ink3};display:flex;">${svg(I.x, 15, 2)}</span>
  </div>`, `border-color:#B4562F55;background:${C.accentTint};`)}

  ${meetingCard}

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
    <span style="color:${C.sage};display:flex;">${svg(I.checkCircle, 18)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12.5px;font-weight:600;">Tonight&rsquo;s group is on this phone</div>
      <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">14 names and the hosting rota, ready without signal</div>
    </div>
  </div>`)}

  ${card(rows([
    `<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.megaphone, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;font-weight:600;">This week at Immanuel</div>
      ${chev()}
    </div>`,
  ]))}

  <div style="flex:1 1 auto;"></div>
  ${note('Home shows only what is due. On a week with no meeting this screen is nearly empty, and that is correct &mdash; M21 settled it.')}
  <div style="height:14px;"></div>
`)}`));

/* ==================== B3 - attendance, no signal, in a browser ==================== */

webonly['WebAttendance.dc.html'] = doc(inBrowser('imanuel.jemaat.app', pad(`
  ${card(`<div style="display:flex;align-items:flex-start;gap:11px;padding:12px 14px;">
    <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.offline, 18)}</span>
    <div style="flex:1 1 auto;">
      <div style="font-size:12.5px;font-weight:700;">No signal in the hall</div>
      <div style="font-size:10.5px;color:${C.ink2};margin-top:3px;line-height:1.5;">Keep ticking. Every tap is saved on this phone and sends itself when you are back in range.</div>
    </div>
  </div>`, `border-color:#9A722344;background:${C.amberTint};`)}

  <div style="display:flex;align-items:baseline;gap:10px;">
    <div style="flex:1 1 auto;">
      <div style="font-size:14px;font-weight:700;">Anugerah &middot; Wednesday 11 March</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;">Who came &middot; two taps per person, no typing</div>
    </div>
    <span style="font-family:${SERIF};font-size:20px;font-weight:600;">12<span style="font-size:13px;color:${C.ink3};font-weight:500;"> / 14</span></span>
  </div>

  ${card(rows([
    tickRow('Melisa Tanudjaja', '', 'on'),
    tickRow('Andreas Halim', '', 'on'),
    tickRow('Intan Prasetyo', 'Answered on WhatsApp &middot; never opened this', 'wa'),
    tickRow('Grace Anjani', '', 'on'),
    tickRow('Dedi Kurnia', 'Said yes, not here', 'off'),
    tickRow('Tigor Siahaan', 'No phone on file &mdash; only you can answer for him', 'off'),
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:16px;display:flex;flex-direction:column;gap:9px;">
    ${card(`<div style="display:flex;align-items:center;gap:10px;padding:11px 14px;">
      <span style="color:${C.sage};display:flex;">${svg(I.check, 16, 2.4)}</span>
      <span style="flex:1 1 auto;font-size:11.5px;font-weight:600;color:${C.ink2};">Saved on this phone &middot; 12 ticks waiting to send</span>
    </div>`)}
    ${note('This is the one thing an app gave for free. Do not clear this browser&rsquo;s data before you have signal again &mdash; that is the honest cost of shipping without one.', C.ink2)}
  </div>
`), { offline: true, time: '20.14' }));

/* ==================== B4 - the week, opened from a message ==================== */

webonly['WebWartaLink.dc.html'] = doc(inApp('imanuel.jemaat.app/w/8Kq2', pad(`
  <div>
    <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">IMMANUEL CHURCH, SUNTER</div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;margin-top:5px;">This week</div>
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${dateBlock('SAT', '14')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Saturday 09.00 &middot; Grace Hall</div>
      <div style="font-size:11.5px;color:${C.ink2};margin-top:3px;">Samuel Kartono &middot; Growing in Prayer, part 3</div>
    </div>
  </div>`)}

  ${card(`
    <div style="padding:13px 14px 6px;">${label('From the office')}</div>
    ${rows([
      `<div style="padding:10px 14px;font-size:12.5px;line-height:1.45;">New members class starts 22 March</div>`,
      `<div style="padding:10px 14px;font-size:12.5px;line-height:1.45;">Youth camp closes 18 March</div>`,
      `<div style="padding:10px 14px;font-size:12.5px;line-height:1.45;">Choir needs two altos</div>`,
    ])}`)}

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
    <span style="color:${C.accent};display:flex;">${svg(I.playFill, 17, 0)}</span>
    <div style="flex:1 1 auto;font-size:13px;font-weight:600;">Last week&rsquo;s sermon</div>
    ${chev()}
  </div>`)}

  ${card(`
    <div style="padding:13px 14px 8px;">${label('Birthdays this week')}</div>
    <div style="display:flex;align-items:center;gap:11px;padding:0 14px 13px;">
      ${av('LM', 34)}
      <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Lidya Manurung</div><div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Thursday</div></div>
      ${miniBtn('Greet')}
    </div>`)}

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="display:flex;align-items:flex-start;gap:10px;padding:13px 14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.globe, 16)}</span>
    <div style="flex:1 1 auto;">${note('This link opens this week and nothing else. It does not sign you in, it shows nobody&rsquo;s number, and whoever you forward it to sees exactly this page.', C.ink2)}</div>
  </div>`)}
  <div style="height:16px;"></div>
`)));

/* ==================== B5 - the dead end every leader meets once ==================== */

const step = (n, t, sub) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;">
  <span style="width:24px;height:24px;flex:0 0 24px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:600;line-height:1.35;">${t}</div>
    ${sub ? `<div style="font-size:10.5px;color:${C.ink3};margin-top:3px;line-height:1.45;">${sub}</div>` : ''}
  </div>
</div>`;

webonly['WebInApp.dc.html'] = doc(inApp('imanuel.jemaat.app', pad(`
  <div style="padding-top:6px;">
    <span style="width:44px;height:44px;border-radius:999px;background:${C.amberTint};color:${C.amber};display:flex;align-items:center;justify-content:center;">${svg(I.help, 22)}</span>
    <div style="font-family:${SERIF};font-size:23px;font-weight:500;line-height:1.2;margin-top:14px;">This browser cannot keep Jemaat</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:9px;line-height:1.6;">You opened the link inside your messages, so the page is here but there is nowhere to save it. Two taps fixes it, once.</div>
  </div>

  ${card(rows([
    step('1', 'Tap the three dots, top right', 'The ones in this bar, not in your keyboard'),
    step('2', 'Choose Open in Chrome', 'Or Safari, or whichever browser is yours'),
    step('3', 'Then Add to home screen', 'An icon, no address bar, and it works without signal'),
  ]))}

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.check, 17, 2.2)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12.5px;font-weight:600;">You were opening: Mark attendance</div>
      <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Anugerah &middot; tonight, 19.30</div>
    </div>
  </div>`)}

  ${card(`<div style="padding:13px 14px;">${note('That still works right here, exactly as it does anywhere else. It is only the saving-for-later that this browser will not do &mdash; so finish tonight first, and fix the icon afterwards.', C.ink2)}</div>`)}
  ${note('Close this and nothing is lost. Ask the office to send the link again, or sign in from jemaat.app with your number.')}
  <div style="flex:1 1 auto;"></div>
  <div style="height:16px;"></div>
`)));

/* ==================== B6 - saved to the home screen ==================== */

webonly['WebInstalled.dc.html'] = doc(installed(`
${webNav('Home')}
${pad(`
  <div>
    <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WEDNESDAY, 11 MARCH</div>
    <div style="font-family:${SERIF};font-size:22px;font-weight:500;margin-top:5px;">Good evening, Budi</div>
  </div>

  ${meetingCard}

  ${card(rows([
    `<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.megaphone, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;font-weight:600;">This week at Immanuel</div>
      ${chev()}
    </div>`,
    `<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.hand, 17)}</span>
      <div style="flex:1 1 auto;font-size:13px;font-weight:600;">Hosting in April</div>
      ${chev()}
    </div>`,
  ]))}

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="padding:14px;">
    <div style="font-size:12.5px;font-weight:700;">Same screen, 118 pixels back</div>
    <div style="font-size:11px;color:${C.ink2};margin-top:7px;line-height:1.6;">No address bar and no browser toolbar. The navigation stays at the top anyway, so this is the same layout as the tab you signed in on &mdash; not a second app to learn.</div>
  </div>`)}
  ${card(`<div style="display:flex;align-items:flex-start;gap:10px;padding:13px 14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.chat, 16)}</span>
    <div style="flex:1 1 auto;">${note('Reminders still arrive on WhatsApp, not from this icon. That was already the decision on S7 &mdash; anything you must act on goes down the channel people actually read.', C.ink2)}</div>
  </div>`)}
  <div style="height:14px;"></div>
`)}`));

/* ==================== W18 - the office signs in, at last ==================== */

const factCard = (title, lines, extra = '') =>
  card(`<div style="padding:16px 18px;">
    <div style="font-size:14px;font-weight:700;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">${lines}</div>
  </div>`, extra);

webonly['WebOfficeSignIn.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;padding:40px;gap:24px;">

  <div style="width:396px;flex:0 0 396px;border-radius:14px;background:${C.accentDark};color:#F7EFE7;padding:32px;display:flex;flex-direction:column;">
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;">Jemaat</div>
    <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;opacity:0.7;margin-top:8px;">CHURCH OFFICE</div>
    <div style="flex:1 1 auto;"></div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;line-height:1.25;">There are no passwords in this product.</div>
    <div style="width:38px;height:2px;background:#F7EFE7;opacity:0.5;margin:16px 0 14px;"></div>
    <div style="font-size:12.5px;line-height:1.7;opacity:0.88;">The office is often a volunteer on a shared computer. A password is one more thing to lose, and a shared one is worse than none &mdash; so the door is the same phone and the same code a member uses on P7 and P8.<br><br>Nothing here was invented for the web. It is the auth that already had to exist.</div>
  </div>

  <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;justify-content:center;">
    ${card(`<div style="padding:26px;display:flex;flex-direction:column;gap:18px;">
      <div>
        <div style="font-family:${SERIF};font-size:24px;font-weight:500;">Sign in to Immanuel</div>
        <div style="font-size:12.5px;color:${C.ink2};margin-top:7px;line-height:1.55;">Sunter, Jakarta &middot; <span style="font-family:ui-monospace,monospace;">K7M2QX</span></div>
      </div>
      ${field('YOUR PHONE', '812-3456-7890', { prefix: '+62', placeholder: true })}
      ${btn('Send me a link on WhatsApp', { h: 48, icon: I.chat, grow: false })}
      ${btn('Send a 6-digit code instead', { kind: 'ghost', h: 44, grow: false })}
      ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
        <div style="width:19px;height:19px;flex:0 0 19px;border-radius:6px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${svg(I.check, 12, 3)}</div>
        <div style="flex:1 1 auto;">
          <div style="font-size:12.5px;font-weight:600;">This computer is shared</div>
          <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Signs out when the browser closes. Leave it ticked in a church office.</div>
        </div>
      </div>`)}
      <div style="font-size:11px;color:${C.ink3};line-height:1.55;">No number on file? Only another administrator can add one &mdash; there is nothing to self-serve here, by design.</div>
    </div>`)}
  </div>

  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
    ${factCard('The hole this closes', 'Named at iteration 16 &mdash; <span style="font-style:italic;">the office cannot sign in to the web at all</span> &mdash; and still sitting open on S1 twenty-six iterations later, because it was cheap and nothing depended on it.<br><br>Web first makes it the front door for <span style="font-weight:700;color:' + C.ink + ';">everybody</span>: the office, the leader and the member all arrive through this screen. It stops being cheap and starts being first.', 'border-color:#B4562F55;')}

    ${factCard('What a link cannot do', 'It expires in ten minutes and once used it is dead, so a forwarded message is not an account.<br><br>It carries no role. Whatever W13 granted is what the person gets, and a link handed to the wrong volunteer grants nothing they did not already have.')}

    ${factCard('Two administrators, still the rule', 'W13 refuses a church with one. It matters more here: the only way back in is a phone number in the register, so a church with one administrator and one lost phone is locked out of its own roll.')}

    ${card(`<div style="padding:16px 18px;display:flex;align-items:flex-start;gap:12px;">
      <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
      <div style="flex:1 1 auto;">
        <div style="font-size:14px;font-weight:700;">The dependency this makes unavoidable</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">A WhatsApp sender was already the second external dependency in R0 (S7). Now it is also how anyone reaches the office at all. The 6-digit fallback exists so a vendor outage is a slow morning rather than a locked building.</div>
      </div>
    </div>`, 'border-color:#9A722344;')}
    <div style="flex:1 1 auto;"></div>
  </div>
</div>`);

/* ==================== S12 - the sheet that makes the decision ==================== */

const surfaceRow = (who, device, door, does, tone = false) => `
<div style="display:flex;gap:14px;padding:13px 16px;${tone ? `background:${C.accentTint};` : ''}">
  <span style="width:104px;flex:0 0 104px;font-size:12.5px;font-weight:700;line-height:1.4;">${who}</span>
  <span style="width:132px;flex:0 0 132px;font-size:12px;color:${C.ink2};line-height:1.45;">${device}</span>
  <span style="width:150px;flex:0 0 150px;font-size:12px;color:${C.ink2};line-height:1.45;">${door}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${does}</span>
</div>`;

const carried = (what, wasApp, nowWeb, ok) => `
<div style="display:flex;gap:13px;padding:12px 16px;">
  <span style="width:16px;flex:0 0 16px;color:${ok ? C.sage : C.amber};display:flex;padding-top:2px;">${svg(ok ? I.check : I.help, 15, 2.2)}</span>
  <span style="width:104px;flex:0 0 104px;font-size:12.5px;font-weight:700;line-height:1.4;">${what}</span>
  <span style="width:214px;flex:0 0 214px;font-size:11.5px;color:${C.ink3};line-height:1.45;">${wasApp}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${nowWeb}</span>
</div>`;

const bullet = (t) => `
<div style="display:flex;gap:10px;padding:7px 16px;">
  <span style="width:5px;height:5px;flex:0 0 5px;border-radius:999px;background:${C.ink3};margin-top:6px;"></span>
  <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

webonly['WebFirst.dc.html'] = doc(`
<div style="width:1440px;height:1120px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">Web first, no app</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:920px;">The decision is to go live on the web and leave the app for later. It is cheaper than it looks, and the reason is that two earlier iterations already did the expensive thinking: <span style="font-weight:700;color:${C.ink};">S7 sent everything a person must act on to WhatsApp, and S8 found that the congregation therefore needs nothing installed</span>. Drop the app and exactly one person is affected.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">3&thinsp;&rarr;&thinsp;2</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">surfaces to build<br>one of them is WhatsApp</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:834px;flex:0 0 834px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Who is actually affected</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">The row in accent is the only one that changes. The other two were never going to install anything.</div>
        </div>
        <div style="display:flex;gap:14px;padding:9px 16px 4px;">
          <span style="width:104px;flex:0 0 104px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WHO</span>
          <span style="width:132px;flex:0 0 132px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">ON WHAT</span>
          <span style="width:150px;flex:0 0 150px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">HOW THEY GET IN</span>
          <span style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WHAT CHANGES WITHOUT AN APP</span>
        </div>
        ${surfaceRow('The office', 'Desktop, or a phone browser', 'W18, phone and a link', 'Nothing. W1&ndash;W17 were always web, and S9&rsquo;s two phone compressions stop being extra screens &mdash; they are the same responsive route.')}
        ${surfaceRow('The leader', 'A phone browser', 'A link in WhatsApp', 'Everything on this page. Four things the app carried silently now have to be drawn, and one of them is not cheap.', true)}
        ${surfaceRow('The congregation', 'WhatsApp, and a link when a page is needed', 'A tokened link &mdash; no sign-in', 'Nothing, and this was settled at S8. RSVP, hosting, duties and greetings are reply buttons. B4 is the only page they ever open.')}`)}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">What the app was quietly carrying</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Nobody wrote these down as features, which is exactly why they get discovered in week three.</div>
        </div>
        ${carried('The session', 'Held for months. Signing in was a first-run event nobody repeated.', 'A link in WhatsApp, and it stays signed in on that phone. B1 keeps M11&rsquo;s promise anyway: it asks again after 12 days before showing anyone else&rsquo;s number.', true)}
        ${carried('The install', 'An icon, from a store, with a download nobody in R0 was going to do.', 'Add to home screen &mdash; B6. And the trap that will hit every leader once: from inside a message browser there is nothing to add, so B5 exists to say so.', true)}
        ${carried('Push', 'Assumed, until S7 examined it and moved everything urgent to WhatsApp.', 'Gone, and it costs almost nothing. Nice-to-know notifications disappear; everything a person must act on was already going down a channel they read.', true)}
        ${carried('The offline write', 'M17 was designed: the duty card on the phone, a tapped RSVP queued rather than lost.', 'A service worker and a queue, and this one is real work. Attendance is marked inside a concrete hall with no signal &mdash; see B3 &mdash; and it is the write everything else depends on.', false)}`)}

      ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:13px;">
        <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 20)}</span>
        <div style="flex:1 1 auto;">
          <div style="font-size:14px;font-weight:700;">A sixth leak for S10, and this one is mine</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">The app never had a forwardable front door. A link that carries a session does: forward the message and you have handed over the account. So a tokened link opens <span style="font-weight:700;color:${C.ink};">one page, for a short time, and never the directory</span> &mdash; B4 says that on the screen rather than in a policy. A link that signs someone in is a different object with a different lifetime, and it dies on first use (W18).</div>
        </div>
      </div>`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('What it saves')}</div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">One codebase.</span> Go and React, and the Flutter shell is not written, not reviewed, not shipped twice.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">No install funnel.</span> S8 named it the largest adoption lever in the design. Web-only takes it to zero for everyone, not just the congregation.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">No store review.</span> A fix reaches the pilot church the afternoon it is written, which is the whole point of a pilot.')}
        ${bullet('S9&rsquo;s two phone screens stop being a cost and become the same route at a narrower width.')}
        <div style="height:8px;"></div>`)}

      ${card(`
        <div style="padding:15px 16px 8px;">${label('What it costs')}</div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The offline queue has to be built.</span> Days, not hours, and it is not optional &mdash; see the box below.')}
        ${bullet('Every leader meets the message-browser dead end once, on the day they are onboarded. B5 is the whole answer.')}
        ${bullet('No push at all until a page is saved to the home screen, and on iOS not even then unless it is. Mitigated by S7, not by us.')}
        ${bullet('A shared phone is now a real case. B1 offers the code instead of the link, and W18 defaults to signing out when the browser closes.')}
        ${bullet('O2&rsquo;s QR scan needs camera permission in a browser &mdash; already Later on S1, so nothing moves.')}
        <div style="height:8px;"></div>`)}

      ${card(`<div style="padding:18px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">The one honest reason to refuse</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">A group leader on a cheap Android inside a concrete hall with no signal is the worst case there is for a web app &mdash; and it. 17 established that he is the load-bearing volunteer: when he stops ticking, RSVP numbers, M23 and every count in the product stop with him.<br><br><span style="font-weight:700;color:${C.ink};">So web first is safe only if the offline queue ships with B3, not after it.</span> Ship attendance that loses a tick in a hall and the pilot fails at the exact thing it exists to test &mdash; and it will look like the design was wrong, when it was the surface.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

/* ==================== S13 - the ship list, re-derived ==================== */

const shipItem = (code, name, why, tone = 'ship') => {
  const chip = { ship: [C.sageTint, C.sage], new: [C.accentTint, C.accent], gone: [C.bg, C.ink3] }[tone];
  return `<div style="display:flex;align-items:baseline;gap:11px;padding:6px 16px;">
    <span style="width:46px;flex:0 0 46px;display:inline-flex;align-items:center;justify-content:center;height:20px;border-radius:6px;background:${chip[0]};color:${chip[1]};font-size:10px;font-weight:700;">${code}</span>
    <span style="width:176px;flex:0 0 176px;font-size:12.5px;font-weight:600;line-height:1.35;">${name}</span>
    <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${why}</span>
  </div>`;
};

const bandRow = (tag, title, meta, why) => `
<div style="padding:15px 16px 12px;margin-top:6px;border-top:1px solid ${C.line};background:${C.bg};">
  <div style="display:flex;align-items:baseline;gap:10px;">
    <span style="display:inline-flex;align-items:center;justify-content:center;height:22px;padding:0 9px;border-radius:6px;background:${C.accent};color:#FFFFFF;font-size:11px;font-weight:700;">${tag}</span>
    <span style="font-size:14px;font-weight:700;">${title}</span>
    <div style="flex:1 1 auto;"></div>
    <span style="font-size:11px;font-weight:700;color:${C.ink3};">${meta}</span>
  </div>
  ${why ? `<div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.55;">${why}</div>` : ''}
</div>`;

webonly['WebRelease.dc.html'] = doc(`
<div style="width:1440px;height:1240px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">R0 on the web</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">S1 stages seventeen screens across an app and a web side. This re-derives that column for one surface, because it. 41 has already caught this canvas twice: <span style="font-weight:700;color:${C.ink};">a finding lands where it was found and nowhere else</span>, and a plan drawn from a remembered conclusion is drawn from a stale map. Screen codes are kept &mdash; every phone artboard is now a route, not a rewrite.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">15</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">routes &middot; 7 capabilities<br>was 17 screens &middot; 7</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:596px;flex:0 0 596px;">
      ${card(`
        ${bandRow('R0&thinsp;W', 'One pilot church, one surface', '15 routes &middot; 7 capabilities', 'Two screens leave because the install path they served no longer exists. Two arrive because a browser needs them. One capability is swapped, not added: the app shell and push plumbing are gone, and an offline queue takes their place.')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">CARRIED, AS ROUTES AT PHONE WIDTH</div>
        ${shipItem('M1', 'Home', 'B2 is this screen in a browser. Navigation moves to the top and stays there')}
        ${shipItem('M4', 'Household', 'Unchanged. The thing the brief asked for first')}
        ${shipItem('M5', 'New person', 'Unchanged. Six fields, and the household match from it. 36')}
        ${shipItem('M6', 'Care groups', 'Where the + that creates a group lives. Cutting it broke R0 once already')}
        ${shipItem('M7', 'Care group detail', '')}
        ${shipItem('M8', 'Meeting and RSVP', '')}
        ${shipItem('M9', 'Hosting queue', '')}
        ${shipItem('M11', 'Me', 'The 12-day security row from it. 38 is now the session rule itself')}
        ${shipItem('M14', 'Attendance', 'B3. The one route that must work with the connection dead')}
        ${shipItem('M26', 'After attendance', 'The leader gets paid, or R1 has no data at all')}
        ${shipItem('W2', 'People table', 'Desktop, unchanged')}
        ${shipItem('W8', 'This week', 'Desktop, unchanged &mdash; and the same route answers S9&rsquo;s phone case')}
        ${shipItem('W11', 'The empty People table', 'Still the real first screen a church meets')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.accent};">NEW, AND ONLY BECAUSE IT IS A BROWSER</div>
        ${shipItem('B1', 'Sign in, in a browser', 'One door for the office, the leader and the member. Replaces P7 and P8 at R0', 'new')}
        ${shipItem('W18', 'Sign in, office desktop', 'The hole named at it. 16 and open on S1 ever since. Same auth, wider screen', 'new')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">GONE FROM R0, NOT FROM THE DESIGN</div>
        ${shipItem('S9', 'W8 and W1 on a phone', 'No longer two screens. One responsive route serves both widths', 'gone')}
        ${shipItem('O1', 'First run', 'There is no install to run first. The church is in the URL, and B1 resolves it', 'gone')}
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.55;">
          <span style="font-weight:700;color:${C.ink};">B5 and B6 are not on this list on purpose.</span> They are one route each and neither is a screen a church asks for &mdash; but B5 is a dead end every leader hits on day one, and this canvas has never shipped the happy path without it (P10, P11). Count them as part of B1.
        </div>`, 'overflow:hidden;')}
    </div>

    <div style="width:372px;flex:0 0 372px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">What this decision does not touch</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Worth stating, because a surface change invites a redesign nobody asked for.</div>
        </div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">S5, the data model.</span> Not one table moves. A surface is not a schema.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">S6, the palette and type.</span> Built with no shadows and web-safe fallbacks from the start, which is why these artboards needed no restyling.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">S7, the channel.</span> WhatsApp for anything you must act on, and it now carries sign-in too.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">W1&ndash;W17.</span> Already web. Already responsive at the two widths that matter.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">S2 and S3.</span> The warta and the noticing decisions are still yours, and still unanswered.')}
        <div style="height:8px;"></div>`)}

      ${card(`<div style="padding:18px;">
        <div style="font-size:14px;font-weight:700;">Deferred, not cancelled</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Every phone artboard in this canvas stays valid: 390 is a phone browser as readily as an app frame, and each one is now a route against the same API. A native shell later re-skins routes that already work rather than reopening a design.<br><br>The one thing to keep honest: <span style="font-weight:700;color:${C.ink};">R0 W is not a smaller R0</span>. It is the same product on one surface, and the app becomes a distribution decision instead of a build.</div>
      </div>`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="display:flex;align-items:baseline;gap:10px;">
            <span style="font-family:${SERIF};font-size:27px;font-weight:600;color:${C.amber};">3</span>
            <span style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.ink3};">Before anyone builds</span>
          </div>
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">None of these is a design question, and all three decide a schedule.</div>
        </div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The offline queue is a spike, not a story.</span> Ticks must survive a killed tab and a dead connection, and land exactly once when they send. Prove it on a real cheap Android in a real hall before B3 is called done.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The church URL is not the church name.</span> It. 37 refused a browsable index of congregations; a guessable path reopens it. The code is the path, and a name path is opt-in per W4.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Sign-in links need approved templates.</span> Same vendor queue as every other act-now message, and the same reason not to discover it in month two.')}
        <div style="height:8px;"></div>`)}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Still open, and still not mine</div>
        </div>
        ${bullet('No <span style="font-family:ui-monospace,monospace;">DEC-</span> has been written for anything, and this decision is now the largest of them. Start already names the gap; web first makes it structural rather than tidy.')}
        ${bullet('Time zones are named on W12 and applied nowhere. Every screen still says 19.30 and none says which.')}
        ${bullet('The pilot church has not seen any of this. Everything here is a claim until a leader marks one Wednesday in a hall.')}
        <div style="height:8px;"></div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

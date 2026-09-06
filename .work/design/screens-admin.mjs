import { C, SERIF, doc, svg, I, card, label, av, btn, chev, rows, sq, field, pill } from './lib.mjs';
import { pageHead, wBtn } from './screens-web.mjs';

/*
 * THE ADMIN REGISTER, ALONE.
 *
 * Iteration 43 read "web first" as "the whole product on the web" and drew a
 * group leader in a phone browser. Wrong axis, again: the first build is ONE
 * ROLE, not one surface. The mobile app is a separate build, so nobody except
 * the office has any surface at all - no guest, no member, no leader.
 *
 * What survives is the register, and the reason it survives is structural:
 * every other flow in this canvas is two-sided. An application needs an
 * applicant, an RSVP needs a member, attendance needs a leader, a statement
 * needs a person to state it, a warta needs a reader. Pendataan is the only
 * one-sided thing in the product - the office types it and the office reads
 * it - which is why it can ship alone, and it is also what the brief asked
 * for first.
 *
 * The expensive requirement from iteration 43 disappears with the leader:
 * nobody marks attendance in a hall with no signal, so no offline queue.
 */
export const admin = {};

const vdots = `<circle cx="12" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1.3" fill="currentColor" stroke="none"/>`;

const frame = (inner) =>
  `<div style="width:390px;height:844px;background:${C.bg};display:flex;flex-direction:column;">${inner}</div>`;

const statusRow = (time = '10.12') => `
<div style="display:flex;align-items:center;gap:8px;height:34px;padding:0 16px;">
  <span style="font-size:11px;font-weight:700;color:${C.ink2};">${time}</span>
  <div style="flex:1 1 auto;"></div>
  <span style="display:flex;gap:2px;align-items:flex-end;">${[5, 7, 9, 11].map((h) => `<span style="width:3px;height:${h}px;border-radius:1px;background:${C.ink3};"></span>`).join('')}</span>
  <span style="width:21px;height:11px;border:1.2px solid ${C.ink3};border-radius:3px;padding:1.5px;display:flex;"><span style="width:70%;background:${C.ink3};border-radius:1px;"></span></span>
</div>`;

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

/** 844 - 34 status - 48 address - 66 toolbar = 696 of content. */
const inBrowser = (url, inner) =>
  frame(`${statusRow()}${urlBar(url)}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>
${toolbar()}`);

/** Saved to the home screen: no address bar, no toolbar. 844 - 34 - 24 = 786. */
const installed = (inner) =>
  frame(`${statusRow()}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>
<div style="height:24px;display:flex;align-items:center;justify-content:center;"><span style="width:118px;height:4px;border-radius:999px;background:${C.line};"></span></div>`);

/* The webview inside a messaging app, drawn in this palette. Not a rendering
   of WhatsApp, for the same reason S8 gave. */
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

const note = (t, tone = C.ink3) =>
  `<div style="font-size:10.5px;color:${tone};line-height:1.5;">${t}</div>`;

const miniBtn = (t, primary = false) =>
  `<span style="display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;height:34px;padding:0 15px;border-radius:12px;${primary ? `background:${C.accent};color:#FFFFFF;` : `border:1px solid ${C.accent};color:${C.accent};`}font-size:13px;font-weight:600;white-space:nowrap;">${t}</span>`;

/*
 * THE SIDEBAR IS SHORTER, AND THAT IS THE SCOPE MADE VISIBLE.
 *
 * W2 and the other office screens carry Applicants, Serving, Sermons and
 * Church code. Every one of those reads or writes something only a member,
 * a guest or a leader produces, so none of them has an input in this
 * release. They are not greyed out - a control that cannot do anything is
 * worse than an absent one. They simply are not here yet.
 */
const sideItem = (icon, t, on = false) =>
  `<div style="display:flex;align-items:center;gap:11px;height:40px;padding:0 12px;border-radius:12px;${on ? `background:${C.accentTint};color:${C.accent};` : `color:${C.ink2};`}font-size:14px;font-weight:${on ? 700 : 600};"><span style="display:flex;">${svg(icon, 19, on ? 2 : 1.7)}</span><span style="flex:1 1 auto;">${t}</span></div>`;

const sidebarLite = (active) => `
<div style="width:246px;flex:0 0 246px;background:${C.surfaceAlt};border-right:1px solid ${C.line};display:flex;flex-direction:column;padding:26px 16px 20px;">
  <div style="display:flex;align-items:center;gap:11px;padding:0 6px;">
    <div style="width:34px;height:34px;border-radius:12px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${svg(I.group, 20, 1.9)}</div>
    <div style="font-family:${SERIF};font-size:20px;font-weight:500;letter-spacing:-0.01em;">Jemaat</div>
  </div>
  <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};margin:26px 12px 8px;">THE REGISTER</div>
  <div style="display:flex;flex-direction:column;gap:3px;">
    ${sideItem(I.users, 'People', active === 'People')}
    ${sideItem(I.home, 'Households', active === 'Households')}
    ${sideItem(I.group, 'Care Groups', active === 'Care Groups')}
  </div>
  <div style="font-size:11px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};margin:22px 12px 8px;">THIS CHURCH</div>
  <div style="display:flex;flex-direction:column;gap:3px;">
    ${sideItem(I.upload, 'Import and export', active === 'Import and export')}
    ${sideItem(I.lock, 'Administrators', active === 'Administrators')}
    ${sideItem(I.sliders, 'Church record', active === 'Church record')}
  </div>
  <div style="flex:1 1 auto;"></div>
  <div style="padding:10px 12px;border-radius:12px;background:${C.bg};border:1px dashed ${C.line};">
    <div style="font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">NOT YET</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:5px;line-height:1.5;">Applicants, serving, sermons and the church code arrive with the app that feeds them.</div>
  </div>
  <div style="display:flex;align-items:center;gap:11px;padding:11px 8px;margin-top:12px;border-top:1px solid ${C.line};">
    ${av('LS', 34)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Lidya S.</div><div style="font-size:11px;color:${C.ink3};">Administrator</div></div>
  </div>
</div>`;

const deskShell = (active, inner) => `
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebarLite(active)}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">${inner}</div>
</div>`;

const deskField = (lab, value, { hint = '', placeholder = false, prefix = '', caret = false } = {}) => `
<div style="display:flex;flex-direction:column;gap:6px;">
  <span style="font-size:12px;font-weight:700;color:${C.ink2};">${lab}</span>
  <div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:${C.surface};border:1px solid ${caret ? C.accent : C.line};border-radius:12px;">
    ${prefix ? `<span style="font-size:14px;font-weight:600;color:${C.ink2};">${prefix}</span><span style="width:1px;height:20px;background:${C.line};"></span>` : ''}
    <span style="flex:1 1 auto;font-size:14px;font-weight:${placeholder ? 400 : 600};color:${placeholder ? C.ink3 : C.ink};">${value}</span>
    ${caret ? `<span style="width:1.5px;height:18px;background:${C.accent};"></span>` : ''}
  </div>
  ${hint ? `<span style="font-size:11px;color:${C.ink3};line-height:1.45;">${hint}</span>` : ''}
</div>`;

const infoCard = (title, body, extra = '') =>
  card(`<div style="padding:16px 18px;">
    <div style="font-size:14px;font-weight:700;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">${body}</div>
  </div>`, extra);

/* ==================== W18 - sign in, office desktop ==================== */

admin['AdminDeskSignIn.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;padding:40px;gap:24px;">

  <div style="width:396px;flex:0 0 396px;border-radius:14px;background:${C.accentDark};color:#F7EFE7;padding:32px;display:flex;flex-direction:column;">
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;">Jemaat</div>
    <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;opacity:0.7;margin-top:8px;">THE REGISTER</div>
    <div style="flex:1 1 auto;"></div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;line-height:1.25;">There are no passwords in this product.</div>
    <div style="width:38px;height:2px;background:#F7EFE7;opacity:0.5;margin:16px 0 14px;"></div>
    <div style="font-size:12.5px;line-height:1.7;opacity:0.88;">The office is often a volunteer on a shared computer. A password is one more thing to lose, and a shared one is worse than none &mdash; so the door is a phone number and a code sent to it.<br><br>This is the auth the product needed anyway. It arrives early because in this release the office is the only person who signs in at all.</div>
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
      <div style="font-size:11px;color:${C.ink3};line-height:1.55;">No number on file? Only another administrator can add one. There is nothing to self-serve here, and in this release nothing to self-serve into.</div>
    </div>`)}
  </div>

  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
    ${infoCard('The hole this closes', `Named at iteration 16 &mdash; <span style="font-style:italic;">the office cannot sign in to the web at all</span> &mdash; and still open on S1 twenty-six iterations later, because it was cheap and nothing depended on it.<br><br>Now everything depends on it. <span style="font-weight:700;color:${C.ink};">The office is the only role that exists</span>, so this screen is the entire front door of the release.`, 'border-color:#B4562F55;')}

    ${infoCard('One role, and the rule that guards it', `W13 grants three kinds of access: office, group leader, administrator. Two of those unlock an app that is not built, so this release has exactly one role and W13 shrinks to <span style="font-weight:700;color:${C.ink};">who the administrators are</span>.<br><br>Its refusal survives the shrink, and matters more here: a church with one administrator and one lost phone is locked out of its own register. Two is the minimum.`)}

    ${infoCard('The bill this release does not pay', `S7 costed WhatsApp at roughly 2,000 conversations a month &mdash; two act-now messages a week across 248 people. None of those messages exists yet: no RSVP, no duty, no invitation.<br><br>What is left is sign-in for a handful of administrators. The vendor and the approved template are still needed on day one; <span style="font-weight:700;color:${C.ink};">the monthly bill is not</span>.`)}

    ${card(`<div style="padding:16px 18px;display:flex;align-items:flex-start;gap:12px;">
      <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
      <div style="flex:1 1 auto;">
        <div style="font-size:14px;font-weight:700;">The one dependency left</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">A message vendor is still an approval queue and a lead time, even for ten numbers. The 6-digit fallback exists so an outage is a slow morning rather than a locked building.</div>
      </div>
    </div>`, 'border-color:#9A722344;')}
    <div style="flex:1 1 auto;"></div>
  </div>
</div>`);

/* ==================== W19 - sign in, on a phone ==================== */

admin['AdminSignIn.dc.html'] = doc(inBrowser('imanuel.jemaat.app', pad(`
  ${card(`<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${sq('IM', 42)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Immanuel Church, Sunter</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;font-family:ui-monospace,monospace;">jemaat.app/c/K7M2QX</div>
    </div>
  </div>`)}

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">Sign in</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:7px;line-height:1.55;">Another administrator has already put your number on file. There is nothing to create.</div>
  </div>

  ${field('YOUR PHONE', '812-3456-7890', { prefix: '+62', placeholder: true })}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${btn('Send me a link on WhatsApp', { h: 48, icon: I.chat, grow: false })}
    ${btn('Send a 6-digit code instead', { kind: 'ghost', h: 44, grow: false })}
  </div>

  ${card(`<div style="padding:14px;">
    <div style="font-size:12.5px;font-weight:700;">Why this screen is on a phone at all</div>
    <div style="font-size:11.5px;color:${C.ink2};margin-top:7px;line-height:1.6;">S9 found the office is often a volunteer who comes on Saturday, or the pastor&rsquo;s spouse, with no desk and no computer. Adding one person and correcting a number are the jobs that follow them around; the table, the import and the roster stay on a desktop.</div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="display:flex;align-items:flex-start;gap:10px;padding:13px 14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
    <div style="flex:1 1 auto;">${note('Stays signed in on this phone, and asks again after 12 days &mdash; the promise M11 made when this was an app. It holds harder here: this screen opens the whole register, and there is no smaller view to fall back to.', C.ink2)}</div>
  </div>`)}
  <div style="height:16px;"></div>
`)));

/* ==================== W20 - the link, opened inside messages ==================== */

const step = (n, t, sub) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;">
  <span style="width:24px;height:24px;flex:0 0 24px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:600;line-height:1.35;">${t}</div>
    ${sub ? `<div style="font-size:10.5px;color:${C.ink3};margin-top:3px;line-height:1.45;">${sub}</div>` : ''}
  </div>
</div>`;

admin['AdminLinkStuck.dc.html'] = doc(inApp('imanuel.jemaat.app/in/9Fv3', pad(`
  <div style="padding-top:6px;">
    <span style="width:44px;height:44px;border-radius:999px;background:${C.amberTint};color:${C.amber};display:flex;align-items:center;justify-content:center;">${svg(I.help, 22)}</span>
    <div style="font-family:${SERIF};font-size:23px;font-weight:500;line-height:1.2;margin-top:14px;">You are signed in, but not saved</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:9px;line-height:1.6;">The link came by WhatsApp, so it opened inside your messages. The register works here. There is just nowhere in this browser to keep it.</div>
  </div>

  ${card(rows([
    step('1', 'Tap the three dots, top right', 'The ones in this bar, not in your keyboard'),
    step('2', 'Choose Open in Chrome', 'Or Safari, or whichever browser is yours'),
    step('3', 'Then Add to home screen', 'An icon, and no signing in again for 12 days'),
  ]))}

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
    ${sq('IM', 34)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12.5px;font-weight:600;">Immanuel &middot; 248 people</div>
      <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Signed in as Lidya S., administrator</div>
    </div>
    ${miniBtn('Open')}
  </div>`)}

  ${note('Every administrator meets this screen once, on the day they are added, because the link they are sent arrives in the app they read it in. It is the only dead end this release has, and it costs one route to answer.')}
  <div style="flex:1 1 auto;"></div>
  <div style="height:16px;"></div>
`)));

/* ==================== W21 - the register on a phone, saved ==================== */

const stat = (n, t) => `
<div style="flex:1 1 0;min-width:0;padding:12px 6px;text-align:center;">
  <div style="font-family:${SERIF};font-size:24px;font-weight:600;line-height:1;">${n}</div>
  <div style="font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};margin-top:6px;">${t}</div>
</div>`;

admin['AdminHomePhone.dc.html'] = doc(installed(`
<div style="display:flex;align-items:center;gap:11px;padding:14px 16px 12px;border-bottom:1px solid ${C.line};">
  ${sq('IM', 34)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:700;">Immanuel</div>
    <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Lidya S. &middot; administrator</div>
  </div>
  <span style="color:${C.ink3};display:flex;">${svg(I.search, 19)}</span>
</div>
${pad(`
  ${card(`<div style="display:flex;">
    ${stat('248', 'PEOPLE')}
    <span style="width:1px;background:${C.lineSoft};"></span>
    ${stat('76', 'HOUSEHOLDS')}
    <span style="width:1px;background:${C.lineSoft};"></span>
    ${stat('5', 'GROUPS')}
  </div>`)}

  <div style="display:flex;gap:9px;">
    ${btn('Add a person', { h: 48, icon: I.userPlus })}
    ${btn('Find', { kind: 'ghost', h: 48, icon: I.search })}
  </div>

  ${card(`<div style="display:flex;align-items:flex-start;gap:11px;padding:13px 14px;">
    <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 18)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12.5px;font-weight:700;">12 people have no phone number</div>
      <div style="font-size:10.5px;color:${C.ink2};margin-top:3px;line-height:1.5;">Worth fixing now rather than later: a number is how a person signs in once the app exists, and how the office reaches them before that.</div>
      <div style="margin-top:10px;">${miniBtn('Work through them')}</div>
    </div>
  </div>`, 'border-color:#9A722344;')}

  ${card(rows([
    `<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.clock, 17)}</span>
      <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Last import</div><div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">8 March &middot; 261 rows &middot; 4 flagged as possible duplicates</div></div>
      ${chev()}
    </div>`,
    `<div style="display:flex;align-items:center;gap:11px;padding:12px 14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.group, 17)}</span>
      <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Care groups</div><div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">5 groups &middot; 187 people are in none</div></div>
      ${chev()}
    </div>`,
  ]))}

  <div style="flex:1 1 auto;"></div>
  ${card(`<div style="padding:13px 14px;">${note('Saved to the home screen, so there is no address bar. Nothing here will ever notify you &mdash; in this release there is nobody on the other side to send anything.', C.ink2)}</div>`)}
  <div style="height:14px;"></div>
`)}`));

/* ==================== W22 - add a person, desktop ==================== */

const matchRow = (title, meta, primary = false) => `
<div style="display:flex;align-items:center;gap:11px;padding:11px 14px;${primary ? `background:${C.accentTint};` : ''}">
  <span style="color:${primary ? C.accent : C.ink3};display:flex;">${svg(primary ? I.home : I.plus, 17)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:${primary ? 700 : 600};line-height:1.3;">${title}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:2px;">${meta}</div>
  </div>
</div>`;

admin['AdminPersonNew.dc.html'] = doc(deskShell('People', `
  ${pageHead('Add a person', 'Six fields. Everything else the register can learn later', `<div style="display:flex;gap:10px;">${wBtn('Cancel', I.x)}${wBtn('Save and add another', I.check, true)}</div>`)}

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="width:560px;flex:0 0 560px;">
      ${card(`<div style="padding:22px 24px;display:flex;flex-direction:column;gap:16px;">
        ${deskField('FULL NAME', 'Yosafat Prasetyo')}
        <div style="display:flex;gap:14px;">
          <div style="flex:1 1 0;">${deskField('PHONE', '812-7788-2200', { prefix: '+62' })}</div>
          <div style="width:180px;flex:0 0 180px;">${deskField('BORN', '14 June 1979')}</div>
        </div>
        ${deskField('HOUSEHOLD', 'Prase', { caret: true })}
        ${card(rows([
          matchRow('The Prasetyo household', '4 people &middot; Sunter Agung Q4/12', true),
          matchRow('The Prasetya household', '2 people &middot; Kelapa Gading', false),
          matchRow('Create a new household called Prase&hellip;', 'Only if this person lives at a different address', false),
        ]), 'margin-top:-6px;')}
        <div style="display:flex;gap:14px;">
          <div style="flex:1 1 0;">${deskField('STANDING', 'Registered Member')}</div>
          <div style="width:180px;flex:0 0 180px;">${deskField('WITH US SINCE', 'March 2019')}</div>
        </div>
        <div style="font-size:11px;color:${C.ink3};line-height:1.5;">Standing is per church and only the office sets it &mdash; nothing about this person changes at any other church. <span style="font-weight:600;">With us since</span> is what the roll is asked for at every anniversary, and the only field here nobody can reconstruct later.</div>
      </div>`)}
      ${card(`<div style="padding:16px 18px;display:flex;align-items:center;gap:12px;margin-top:18px;">
        <span style="color:${C.ink3};display:flex;">${svg(I.users, 19)}</span>
        <div style="flex:1 1 auto;font-size:12.5px;color:${C.ink2};line-height:1.5;">Saved as person 249. The household gains a member, the address is not retyped, and W2 shows both by the time the page settles.</div>
      </div>`)}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
      ${infoCard('The match is above the create, on purpose', `Iteration 35 found that this design <span style="font-weight:700;color:${C.ink};">manufactures duplicates</span>: a field that makes creating as easy as finding will be used to create. The second Halim household on S10 was made by a screen I wrote.<br><br>So matching happens while typing, and the existing household sits above the option to make another. W12 cleans up what still gets through.`, 'border-color:#B4562F55;')}

      ${infoCard('What saving this does not do', `No message is sent. No account is made. No invitation goes anywhere.<br><br>In this release <span style="font-weight:700;color:${C.ink};">a person is a record, not a user</span> &mdash; the phone number is stored because the register needs it and because it is what will sign them in later, not because anything reaches them today.`)}

      ${infoCard('Six fields, and the ones deliberately missing', `Name, phone, birth date, household, standing, and the date they joined. No email, no photograph, no notes field.<br><br>A notes field on a membership record fills with things a church should not be writing down, and it is the one addition that cannot be undone once a congregation has used it for a year.`)}

      ${infoCard('The same form on a phone, W23', `Two fields drop at phone width: birth date and with-us-since. They are the two nobody has to hand when a person is standing in front of them after a service, and a form that demands them gets abandoned in the hall.<br><br>Everything else is identical, because this is the job that follows a volunteer around a building &mdash; the rule S9 set, applied to the one screen it matters most on.`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
`));

/* ==================== W23 - add a person, on a phone ==================== */

admin['AdminPersonPhone.dc.html'] = doc(inBrowser('imanuel.jemaat.app/people/new', `
<div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;border-bottom:1px solid ${C.line};">
  <span style="color:${C.ink2};display:flex;">${svg(I.x, 18, 2)}</span>
  <div style="flex:1 1 auto;font-size:13px;font-weight:700;">Add a person</div>
  <span style="font-size:13px;font-weight:700;color:${C.accent};">Save</span>
</div>
${pad(`
  ${field('FULL NAME', 'Yosafat Prasetyo')}
  ${field('PHONE', '812-7788-2200', { prefix: '+62' })}
  ${field('HOUSEHOLD', 'Prase', { right: `<span style="width:1.5px;height:18px;background:${C.accent};"></span>` })}
  ${card(rows([
    matchRow('The Prasetyo household', '4 people &middot; Sunter Agung Q4/12', true),
    matchRow('Create a new household', 'Only for a different address', false),
  ]), 'margin-top:-6px;')}
  ${field('STANDING', 'Registered Member', { right: `<span style="color:${C.ink3};display:flex;">${svg(I.chevD, 17)}</span>` })}

  <div style="flex:1 1 auto;"></div>
  ${note('Born and joined-on are on the desktop form. They are the two nobody has to hand when someone is standing in front of them after a service, and a form that demands them gets abandoned in the hall.')}
  <div style="height:16px;"></div>
`)}`));

/* ==================== W24 - care groups, desktop ==================== */

const groupRow = (name, area, leader, n, on = false) => `
<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:12px;${on ? `background:${C.surface};border:1.5px solid ${C.accent};` : 'border:1px solid transparent;'}">
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:700;">${name}</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:4px;">${area} &middot; led by ${leader}</div>
  </div>
  <span style="font-size:12px;font-weight:700;color:${C.ink2};">${n}</span>
</div>`;

const memberRow = (init, name, meta, right = '') => `
<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;">
  ${av(init, 34)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13.5px;font-weight:600;">${name}</div>
    ${meta ? `<div style="font-size:11.5px;color:${C.ink3};margin-top:2px;">${meta}</div>` : ''}
  </div>
  ${right}
</div>`;

admin['AdminGroups.dc.html'] = doc(deskShell('Care Groups', `
  ${pageHead('Care groups', '5 groups &middot; 61 of 248 people belong to one', `<div style="display:flex;gap:10px;">${wBtn('New group', I.plus, true)}</div>`)}

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="width:392px;flex:0 0 392px;">
      ${card(`<div style="padding:6px;display:flex;flex-direction:column;gap:2px;">
        ${groupRow('Anugerah', 'Sunter', 'Budi H.', '14', true)}
        ${groupRow('Kasih', 'Kelapa Gading', 'Melisa T.', '12')}
        ${groupRow('Damai', 'Sunter', 'Maruli S.', '11')}
        ${groupRow('Setia', 'Pluit', 'Grace A.', '13')}
        ${groupRow('Harapan', 'Kemayoran', 'not set', '11')}
      </div>`)}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;gap:20px;">
      ${card(`
        <div style="padding:20px 16px 16px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:flex-end;gap:12px;">
          <div style="flex:1 1 auto;">
            <div style="font-family:${SERIF};font-size:24px;font-weight:500;">Anugerah</div>
            <div style="font-size:12.5px;color:${C.ink3};margin-top:5px;">Sunter &middot; 14 people &middot; meets Wednesday</div>
          </div>
          <div style="flex:0 0 auto;white-space:nowrap;">${wBtn('Add member', I.userPlus)}</div>
        </div>
        ${memberRow('BH', 'Budi Hartono', 'Leader since March 2024', pill('Leader', C.accentTint, C.accent))}
        ${rows([
          memberRow('MT', 'Melisa Tanudjaja', 'Registered Member'),
          memberRow('AH', 'Andreas Halim', 'Community Member'),
          memberRow('IP', 'Intan Prasetyo', 'Registered Member'),
          memberRow('GA', 'Grace Anjani', 'Guest &mdash; leads Setia'),
          memberRow('DK', 'Dedi Kurnia', 'Registered Member &middot; no phone on file'),
          memberRow('TS', 'Tigor Siahaan', 'Community Member'),
          memberRow('SL', 'Samuel Lubis', 'Registered Member'),
          memberRow('YT', 'Yuni Tarigan', 'Registered Member'),
          memberRow('HK', 'Hendra Kusuma', 'Community Member &middot; no phone on file'),
        ])}
        <div style="padding:12px 16px;border-top:1px solid ${C.lineSoft};display:flex;align-items:center;gap:10px;">
          <span style="flex:1 1 auto;font-size:12px;color:${C.ink3};">and 4 more</span>
          <span style="font-size:11.5px;font-weight:600;color:${C.ink3};">2 without a phone number</span>
        </div>`, 'flex:1 1 auto;min-width:0;overflow:hidden;')}

      <div style="width:326px;flex:0 0 326px;display:flex;flex-direction:column;gap:18px;">
        ${infoCard('Naming a leader records a fact, not a permission', `Everywhere else in this canvas, making someone a leader hands them an app: attendance, RSVP, the hosting rota, and the prompt on M23.<br><br>None of that exists yet, so this field <span style="font-weight:700;color:${C.ink};">says who leads and grants nothing</span>. The permission arrives with the app, and W9 already describes what a handover has to do on the day it does.`, 'border-color:#B4562F55;')}

        ${infoCard('Harapan has no leader, and that is allowed', `A group with no leader is a real state in a church, not a validation error. It is also the most useful thing this screen can show an office: five groups, one of them quietly unled since the coordinator moved away.`)}

        ${infoCard('187 people are in no group', `The number a large church actually asks for, from M25 &mdash; and the register can answer it on day one without anybody attending anything.`)}
        <div style="flex:1 1 auto;"></div>
      </div>
    </div>
  </div>
`));

/* ==================== W25 - the church record ==================== */

const dormant = (title, why) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:12px 14px;">
  <span style="width:34px;height:20px;flex:0 0 34px;border-radius:999px;background:${C.disabled};display:flex;align-items:center;padding:2px;"><span style="width:16px;height:16px;border-radius:999px;background:${C.surface};"></span></span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:600;color:${C.disabledInk};line-height:1.3;">${title}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.45;">${why}</div>
  </div>
</div>`;

admin['AdminChurch.dc.html'] = doc(deskShell('Church record', `
  ${pageHead('Church record', 'The handful of facts every other screen reads', `${wBtn('Save', I.check, true)}`)}

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="width:560px;flex:0 0 560px;">
      ${card(`<div style="padding:22px 24px;display:flex;flex-direction:column;gap:16px;">
        ${deskField('CHURCH NAME', 'Immanuel Church, Sunter')}
        ${deskField('ADDRESS', 'Jl. Danau Sunter Utara Blok A No. 4, Jakarta Utara')}
        <div style="display:flex;gap:14px;">
          <div style="flex:1 1 0;">${deskField('TIME ZONE', 'WIB &middot; GMT+7', { hint: 'Iteration 35 flagged this and no screen carried it until now. Every time in the register is an instant in this zone.' })}</div>
          <div style="width:200px;flex:0 0 200px;">${deskField('WORSHIP DAY', 'Saturday', { hint: 'A setting, never a hard-coded Sunday.' })}</div>
        </div>
        ${deskField('ADMINISTRATORS', 'Lidya S. and Pdt. Marulitua H.', { hint: 'Two is the minimum W13 will accept. The register is only reachable through the numbers on these two records.' })}
      </div>`)}

      ${card(`
        <div style="padding:16px 18px 10px;">
          <div style="font-size:14px;font-weight:700;">Every change here carries a name and a date</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.6;">The same rule W6, W9 and W10 apply to anything consequential. A church record that changes with nobody attached to the change is how an office ends up arguing about who moved the worship day.</div>
        </div>
        ${rows([
          `<div style="display:flex;align-items:center;gap:11px;padding:11px 18px;"><span style="color:${C.ink3};display:flex;">${svg(I.clock, 16)}</span><div style="flex:1 1 auto;font-size:12px;color:${C.ink2};">Time zone set to WIB &middot; Lidya S. &middot; 6 March</div></div>`,
          `<div style="display:flex;align-items:center;gap:11px;padding:11px 18px;"><span style="color:${C.ink3};display:flex;">${svg(I.clock, 16)}</span><div style="flex:1 1 auto;font-size:12px;color:${C.ink2};">Pdt. Marulitua H. added as administrator &middot; Lidya S. &middot; 6 March</div></div>`,
        ])}`, 'margin-top:18px;')}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
      ${card(`
        <div style="padding:16px 16px 10px;">
          <div style="font-size:14px;font-weight:700;">Four switches that are not switches yet</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.55;">A church expects to find these here. Each one is drawn, decided and waiting on a surface that does not exist &mdash; so none of them is offered as something to turn on, because a control that cannot do anything is worse than an absent one.</div>
        </div>
        ${rows([
          dormant('Church code and QR (W4)', 'The code exists so a stranger can find the church in the app. Nothing can scan it yet.'),
          dormant('Listed by name and city', 'The disclosure iteration 38 added. It governs being findable, which needs somewhere to be found.'),
          dormant('Messages by WhatsApp', 'S7 routes act-now messages here. There are no act-now messages in a register.'),
          dormant('Corrections from members (W16)', 'Iteration 42 gave the person their own store. In this release it has no writer.'),
        ])}`)}

      ${infoCard('The one that must be decided anyway', `Iteration 42 split every fact into two stores with one writer each: <span style="font-weight:700;color:${C.ink};">the archive, written only by this church, and the statement, written only by the person</span>.<br><br>Only the first exists here. Build one store now and the second writer becomes a migration across every row in the product &mdash; the same shape of mistake decision 7 warns about on S5.`, 'border-color:#9A722344;')}

      ${card(`
        <div style="padding:16px 18px 8px;">${label('This register, today')}</div>
        ${rows([
          `<div style="display:flex;align-items:baseline;gap:14px;padding:11px 18px;"><span style="width:150px;flex:0 0 150px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">HOLDS</span><span style="flex:1 1 auto;font-size:12.5px;font-weight:600;">248 people &middot; 76 households &middot; 5 care groups</span></div>`,
          `<div style="display:flex;align-items:baseline;gap:14px;padding:11px 18px;"><span style="width:150px;flex:0 0 150px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">STARTED</span><span style="flex:1 1 auto;font-size:12.5px;font-weight:600;">6 March &middot; 261 rows imported, 4 merged since</span></div>`,
          `<div style="display:flex;align-items:baseline;gap:14px;padding:11px 18px;"><span style="width:150px;flex:0 0 150px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">LAST EXPORT</span><span style="flex:1 1 auto;font-size:12.5px;font-weight:600;">Never &mdash; and W10 is one click away on any Tuesday</span></div>`,
        ])}`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
`));

/* ==================== S12 - the scope sheet ==================== */

const whoRow = (who, gets, when, tone = false) => `
<div style="display:flex;gap:16px;padding:13px 16px;${tone ? `background:${C.accentTint};` : ''}">
  <span style="width:150px;flex:0 0 150px;font-size:12.5px;font-weight:700;line-height:1.4;">${who}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${gets}</span>
  <span style="width:186px;flex:0 0 186px;font-size:11.5px;color:${C.ink3};line-height:1.45;">${when}</span>
</div>`;

const twoSided = (flow, missing) => `
<div style="display:flex;gap:13px;padding:8px 16px;">
  <span style="width:16px;flex:0 0 16px;color:${C.ink3};display:flex;padding-top:2px;">${svg(I.x, 13, 2.4)}</span>
  <span style="width:176px;flex:0 0 176px;font-size:12.5px;font-weight:600;line-height:1.4;">${flow}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${missing}</span>
</div>`;

const bullet = (t) => `
<div style="display:flex;gap:10px;padding:7px 16px;">
  <span style="width:5px;height:5px;flex:0 0 5px;border-radius:999px;background:${C.ink3};margin-top:6px;"></span>
  <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

admin['AdminScope.dc.html'] = doc(`
<div style="width:1440px;height:1020px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The register, alone</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">Iteration 43 read <span style="font-style:italic;">web first</span> as <span style="font-style:italic;">the whole product on the web</span>, and drew a group leader in a phone browser. The correction is smaller and sharper: the first build is <span style="font-weight:700;color:${C.ink};">one role, not one surface</span>. The app is a separate build, so the office is the only person with anywhere to go.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">1<span style="font-size:20px;color:${C.ink3};"> of 4</span></div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">roles in the flow<br>the other three wait for the app</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:834px;flex:0 0 834px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Who gets what</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Stated plainly, because three of these four rows are the reason the release is small enough to finish.</div>
        </div>
        ${whoRow('The congregation', 'Nothing. No app, no page, no message &mdash; they are recorded, and they are not told.', 'With the app')}
        ${whoRow('A guest', 'Nothing. There is no way to find this church and no way to apply to it.', 'With the app, or a public page')}
        ${whoRow('A member', 'Nothing. Cannot see their own record, cannot correct it, cannot be asked anything.', 'With the app')}
        ${whoRow('The administrator', 'Everything in this release: the register, the households, the groups, import, export, and who else may administer.', 'Now', true)}`)}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Why the register is the one slice that can ship alone</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Every other flow in these 88 artboards is two-sided. Take away three of the four roles and each one loses the half that starts it.</div>
        </div>
        ${twoSided('Applications, W1', 'needs an applicant. Nobody can apply, so the queue has no input and no first row.')}
        ${twoSided('RSVP and hosting, M8 M9', 'needs a member with a button. Without one there is nothing to answer and nothing to count.')}
        ${twoSided('Attendance, M14', 'needs a leader in the room. Nobody is holding a phone in the hall on Wednesday.')}
        ${twoSided('Statements, W14 W15 W16', 'needs a person to state something. Iteration 42 gave them a store; this release gives it no writer.')}
        ${twoSided('The week, W8', 'needs a reader. The office can compose it and nothing can display it.')}
        ${twoSided('The church code, W4', 'needs an app to scan it into. A code that resolves to nothing is a poster with no door behind it.')}
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">Pendataan is the only one-sided thing in the product.</span> The office types it and the office reads it, so it works with an audience of one. It is also the thing the brief named first &mdash; and iteration 26 caught the staging having quietly put it last.
        </div>`)}

      ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:13px;">
        <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.archive, 20)}</span>
        <div style="flex:1 1 auto;">
          <div style="font-size:14px;font-weight:700;">Dormant is not deleted</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Nine office screens and every mobile artboard stay in this canvas, designed and argued, waiting for the surface that feeds them. Nothing above is a cut &mdash; it is a <span style="font-weight:700;color:${C.ink};">sequencing</span> decision, and the order it implies is the reverse of the usual one: the institution gets its tool first, and the congregation gets theirs when the app ships.</div>
        </div>
      </div>`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('What this drops from iteration 43')}</div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The offline queue.</span> It existed for a leader ticking names in a concrete hall. No leader, no hall, no service worker &mdash; the single most expensive item on the last sheet is gone.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The forwardable link leak.</span> Sign-in links go to two administrators, not to 248 people, so the sixth leak on S10 shrinks back to an ordinary session question.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Push, and the app shell.</span> Neither was carrying anything once S7 moved act-now messages to WhatsApp.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Two of three roles.</span> W13 becomes a list of administrators, and the two-administrator rule becomes the whole of access control.')}
        <div style="height:8px;"></div>`)}

      ${card(`
        <div style="padding:15px 16px 8px;">${label('Decide anyway, or pay a migration')}</div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Two stores, one writer each.</span> The archive has its writer; the statement does not exist yet. Build one store now and iteration 42 becomes a rewrite of every row.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">One global person table.</span> Decision 7 on S5, and still the only one that cannot be retrofitted. A single pilot church makes it look like over-engineering.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">A service is an entity.</span> Nothing in the register displays one, and attendance will hang off it the moment the app lands.')}
        ${bullet('None of these three shows up on any screen in this release. All three are free today and expensive in month four.')}
        <div style="height:8px;"></div>`)}

      ${card(`<div style="padding:18px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">The risk this choice takes</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Iteration 17 turned on the office this time: <span style="font-weight:700;color:${C.ink};">a register with no weekly rhythm goes stale</span>. Lidya types 248 people over two evenings, and then has no reason to open it again until somebody moves house or dies.<br><br>What it pays back is real but occasional &mdash; import, search, export, a clean roll. If the pilot needs a reason to open it weekly, the cheapest parked item is W8: the office can compose the week with no member surface at all, and only the displaying half is missing.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

/* ==================== S13 - what ships ==================== */

const shipItem = (code, name, why, tone = 'ship') => {
  const chip = { ship: [C.sageTint, C.sage], new: [C.accentTint, C.accent], gone: [C.bg, C.ink3] }[tone];
  return `<div style="display:flex;align-items:baseline;gap:11px;padding:6px 16px;">
    <span style="width:46px;flex:0 0 46px;display:inline-flex;align-items:center;justify-content:center;height:20px;border-radius:6px;background:${chip[0]};color:${chip[1]};font-size:10px;font-weight:700;">${code}</span>
    <span style="width:186px;flex:0 0 186px;font-size:12.5px;font-weight:600;line-height:1.35;">${name}</span>
    <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${why}</span>
  </div>`;
};

const order = (n, t, why) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 16px;">
  <span style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12.5px;font-weight:600;line-height:1.35;">${t}</div>
    <div style="font-size:11.5px;color:${C.ink3};margin-top:3px;line-height:1.45;">${why}</div>
  </div>
</div>`;

admin['AdminRelease.dc.html'] = doc(`
<div style="width:1440px;height:1150px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">What ships: the register</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">S1 staged R0 across an app and a web side, and S13 has now been re-derived twice &mdash; once for one surface, and again for one role. Sixteen routes, six capabilities, and a build order that puts the two-week item where it can be seen rather than hidden inside a sprint.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">16</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">routes &middot; 6 capabilities<br>one role, one surface</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:596px;flex:0 0 596px;">
      ${card(`
        <div style="padding:15px 16px 12px;background:${C.bg};border-bottom:1px solid ${C.line};">
          <div style="display:flex;align-items:baseline;gap:10px;">
            <span style="display:inline-flex;align-items:center;justify-content:center;height:22px;padding:0 9px;border-radius:6px;background:${C.accent};color:#FFFFFF;font-size:11px;font-weight:700;">R0&thinsp;A</span>
            <span style="font-size:14px;font-weight:700;">The administrator&rsquo;s register</span>
            <div style="flex:1 1 auto;"></div>
            <span style="font-size:11px;font-weight:700;color:${C.ink3};">16 routes &middot; 6 capabilities</span>
          </div>
          <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.55;">Tenancy, admin auth, the register itself, import, export and merge. Nothing in this column waits on anybody outside the office.</div>
        </div>
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">ALREADY DRAWN, UNCHANGED</div>
        ${shipItem('W11', 'The empty People table', 'Still the real first screen a church meets, and now the only one')}
        ${shipItem('W2', 'People table', 'Search, filter, and the 12 missing phone numbers it complains about')}
        ${shipItem('W6', 'One person, lifecycle', 'Transferred and deceased are register facts, not app features')}
        ${shipItem('W17', 'A household', 'Minus the who-signs-in column, which has nobody to describe yet')}
        ${shipItem('W5', 'Import from Excel', 'Two weeks on its own. The single largest item here')}
        ${shipItem('W12', 'Merge two records', 'Import makes duplicates, so it ships with import and not after it')}
        ${shipItem('W10', 'Export, and leaving', 'More important here, not less: the register IS the product')}
        ${shipItem('W13', 'Administrators', 'Shrunk from three kinds of access to one, keeping its refusal of a single admin')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.accent};">NEW ON THIS PAGE</div>
        ${shipItem('W18', 'Sign in, desktop', 'The hole open since iteration 16, now the whole front door', 'new')}
        ${shipItem('W19', 'Sign in, on a phone', 'S9&rsquo;s volunteer office, who has no desk', 'new')}
        ${shipItem('W20', 'The link inside messages', 'Every administrator meets it once. One route to answer it', 'new')}
        ${shipItem('W21', 'The register on a phone', 'Counts, add, find, and the missing-numbers job', 'new')}
        ${shipItem('W22', 'Add a person, desktop', 'M5 was mobile-only. The household match from iteration 36 lives here', 'new')}
        ${shipItem('W23', 'Add a person, on a phone', 'The one job that follows a volunteer around after a service', 'new')}
        ${shipItem('W24', 'Care groups', 'M6 and M7 were mobile. Membership is register data; the meeting is not', 'new')}
        ${shipItem('W25', 'The church record', 'Never drawn anywhere. Also where the time zone finally lands', 'new')}
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.55;">
          <span style="font-weight:700;color:${C.ink};">Not needed, and worth naming so nobody builds them by habit:</span> an offline queue, push notifications, an app shell, RSVP, attendance, meetings, weekly content, applications, and the statement store&rsquo;s second writer.
        </div>`, 'overflow:hidden;')}
    </div>

    <div style="width:372px;flex:0 0 372px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 10px;">
          <div style="font-size:14px;font-weight:700;">Build in this order</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">W11 already argued the principle: a group that works beats a list that is finished.</div>
        </div>
        ${order('1', 'The church record and tenancy', 'One row before any person exists. The zone is set here or every timestamp is a guess')}
        ${order('2', 'Admin auth, two administrators', 'The vendor template has a lead time. Start it in week one')}
        ${order('3', 'People and households, by hand', 'W11 to W22. After this the register is genuinely usable at 20 people')}
        ${order('4', 'Care groups', 'Cheap, and it is what the church came for after the roll itself')}
        ${order('5', 'Import, then merge', 'Two weeks together. Never ship the first without the second')}
        ${order('6', 'Export', 'Before the second church signs, not the first')}
        <div style="height:8px;"></div>`)}

      ${infoCard('What the mobile build inherits', `Every M, O and P artboard stays valid and untouched, against the same API. The app is not a second product &mdash; it is the other three roles arriving at a register that already holds real data, which is the easier order to build in and the harder one to sell.`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Closed by this release</div>
        </div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The office could not sign in.</span> Named at iteration 16, open for twenty-six. W18 and W19.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Time zones were named and never applied.</span> Every screen said 19.30 and none said which. W25 holds it now.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Creating a person was mobile-only.</span> W2 had an Add button pointing at M5, an app screen. W22 and W23.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Care groups could only arrive by import.</span> A church starting one in month two had nowhere to do it. W24.')}
        <div style="height:8px;"></div>`)}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Still open, and still not mine</div>
        </div>
        ${bullet('No <span style="font-family:ui-monospace,monospace;">DEC-</span> exists for anything, and the scope decision on this page is now the largest of them.')}
        ${bullet('S2 and S3 &mdash; the warta and the noticing decisions &mdash; are untouched, and both belong to the app rather than to this release.')}
        ${bullet('The pilot church has still seen none of this. Everything here is a claim until an office types its own congregation into it.')}
        <div style="height:8px;"></div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

import { C, SERIF, doc, svg, I, card, label, av, btn, chev, rows, sq, field, pill } from './lib.mjs';
import { pageHead, wBtn } from './screens-web.mjs';

/*
 * THE ADMIN REGISTER.
 *
 * One role, not one surface: the office. The mobile app is a separate build,
 * so the congregation, the guest and the member have no surface at all.
 *
 * COPY RULE FOR THIS PAGE, SET BY THE OWNER AT ITERATION 45: nothing on these
 * artboards explains the design. No iteration numbers, no screen codes, no
 * rationale, no "not yet in this release" panels. A screen shows what the
 * office would see and nothing else. Every reason lives in the sticky notes
 * and on S12, S13 and S14, which are sheets rather than product.
 *
 * That rule cost the layouts their right-hand rails, so the real UI had to
 * grow to fill the frame - which is the correct pressure. A screen that only
 * looked finished because a design note sat beside it was not finished.
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

/* The webview inside a messaging app, drawn in this palette rather than as a
   rendering of WhatsApp - the rule S8 set for the message thread. */
const inApp = (url, inner) =>
  frame(`${statusRow()}
<div style="display:flex;align-items:center;gap:11px;height:48px;padding:0 14px;border-bottom:1px solid ${C.line};background:${C.surfaceAlt};">
  <span style="color:${C.ink2};display:flex;">${svg(I.x, 17, 2)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${url}</div>
  </div>
  <span style="color:${C.ink2};display:flex;">${svg(vdots, 17, 2)}</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;">${inner}</div>`);

const pad = (inner, gap = 14) =>
  `<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:${gap}px;padding:16px 16px 0;">${inner}</div>`;

const miniBtn = (t, primary = false) =>
  `<span style="display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;height:34px;padding:0 15px;border-radius:12px;${primary ? `background:${C.accent};color:#FFFFFF;` : `border:1px solid ${C.accent};color:${C.accent};`}font-size:13px;font-weight:600;white-space:nowrap;">${t}</span>`;

/*
 * Map stand-in. An abstract street block with a draggable pin, drawn rather
 * than embedded - the same approach qrBlock takes. The tiles behind the real
 * one are OpenStreetMap, and the attribution is on the frame because it is a
 * licence condition rather than a decoration.
 */
const mapBlock = (w, h, r = 12) => {
  const road = (x1, y1, x2, y2, wd) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFFFFF" stroke-width="${wd}" stroke-linecap="round"/>`;
  const blk = (x, y, bw, bh, fill = '#E4DCD1') =>
    `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="2" fill="${fill}"/>`;
  const cx = w * 0.5, cy = h * 0.47;
  return `
<div style="position:relative;width:${w}px;height:${h}px;flex:0 0 ${h}px;border-radius:${r}px;overflow:hidden;border:1px solid ${C.line};">
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;">
    <rect x="0" y="0" width="${w}" height="${h}" fill="#EFE9E0"/>
    ${blk(w * 0.04, h * 0.06, w * 0.26, h * 0.3)}
    ${blk(w * 0.36, h * 0.06, w * 0.3, h * 0.22)}
    ${blk(w * 0.72, h * 0.1, w * 0.24, h * 0.26)}
    ${blk(w * 0.04, h * 0.62, w * 0.22, h * 0.3)}
    ${blk(w * 0.34, h * 0.66, w * 0.3, h * 0.26)}
    ${blk(w * 0.7, h * 0.6, w * 0.26, h * 0.32, '#E0E7DC')}
    ${road(0, h * 0.5, w, h * 0.47, 9)}
    ${road(w * 0.33, 0, w * 0.31, h, 7)}
    ${road(w * 0.68, 0, w * 0.7, h, 5)}
    ${road(0, h * 0.86, w, h * 0.84, 4)}
    <circle cx="${cx}" cy="${cy}" r="13" fill="${C.accent}" opacity="0.16"/>
    <path d="M${cx} ${cy + 9} c-4.6 -6.4 -7 -9.6 -7 -12.6 a7 7 0 0 1 14 0 c0 3 -2.4 6.2 -7 12.6z" fill="${C.accentDark}"/>
    <circle cx="${cx}" cy="${cy - 3.8}" r="2.4" fill="#FFFFFF"/>
  </svg>
  <div style="position:absolute;top:8px;right:8px;display:flex;flex-direction:column;background:${C.surface};border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
    <span style="width:26px;height:24px;display:flex;align-items:center;justify-content:center;color:${C.ink2};border-bottom:1px solid ${C.lineSoft};">${svg(I.plus, 13, 2.2)}</span>
    <span style="width:26px;height:24px;display:flex;align-items:center;justify-content:center;color:${C.ink2};font-size:14px;font-weight:700;">&minus;</span>
  </div>
  <div style="position:absolute;bottom:0;right:0;padding:2px 6px;background:rgba(255,255,255,0.78);font-size:8px;font-weight:600;color:${C.ink2};">&copy; OpenStreetMap</div>
</div>`;
};

const deskField = (lab, value, { hint = '', placeholder = false, prefix = '', caret = false, tag = '', right = '' } = {}) => `
<div style="display:flex;flex-direction:column;gap:6px;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;font-weight:700;color:${C.ink2};">${lab}</span>
    ${tag ? `<span style="font-size:11px;font-weight:600;color:${C.ink3};">${tag}</span>` : ''}
  </div>
  <div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:${C.surface};border:1px solid ${caret ? C.accent : C.line};border-radius:12px;">
    ${prefix ? `<span style="font-size:14px;font-weight:600;color:${C.ink2};">${prefix}</span><span style="width:1px;height:20px;background:${C.line};"></span>` : ''}
    <span style="flex:1 1 auto;min-width:0;font-size:14px;font-weight:${placeholder ? 400 : 600};color:${placeholder ? C.ink3 : C.ink};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${value}</span>
    ${caret ? `<span style="width:1.5px;height:18px;background:${C.accent};"></span>` : right}
  </div>
  ${hint ? `<span style="font-size:11px;color:${C.ink3};line-height:1.45;">${hint}</span>` : ''}
</div>`;

const segmented = (opts, active) => `
<div style="display:flex;gap:4px;padding:4px;background:${C.bg};border:1px solid ${C.line};border-radius:12px;">
  ${opts.map((t) => `<span style="flex:1 1 0;display:flex;align-items:center;justify-content:center;height:36px;border-radius:9px;font-size:13px;font-weight:${t === active ? 700 : 600};${t === active ? `background:${C.accent};color:#FFFFFF;` : `color:${C.ink2};`}white-space:nowrap;">${t}</span>`).join('')}
</div>`;

const fieldWrap = (lab, inner, { tag = '', hint = '' } = {}) => `
<div style="display:flex;flex-direction:column;gap:6px;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="font-size:12px;font-weight:700;color:${C.ink2};">${lab}</span>
    ${tag ? `<span style="font-size:11px;font-weight:600;color:${C.ink3};">${tag}</span>` : ''}
  </div>
  ${inner}
  ${hint ? `<span style="font-size:11px;color:${C.ink3};line-height:1.45;">${hint}</span>` : ''}
</div>`;

const tag = (t, on) =>
  `<span style="display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;${on ? `background:${C.accent};color:#FFFFFF;` : `background:${C.surface};color:${C.ink2};border:1px solid ${C.line};`}">${t}</span>`;

/** A chosen serving role always carries its department, because role names repeat across them. */
const roleChip = (dept, role) =>
  `<span style="display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 10px 0 13px;border-radius:999px;background:${C.accentTint};color:${C.accent};font-size:13px;white-space:nowrap;">
    <span style="opacity:0.72;font-weight:600;">${dept}</span><span style="opacity:0.4;">/</span><span style="font-weight:700;">${role}</span>
    <span style="display:flex;opacity:0.8;">${svg(I.x, 13, 2.4)}</span>
  </span>`;

const addChip = (t) =>
  `<span style="display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 13px;border-radius:999px;border:1px dashed ${C.line};color:${C.ink2};font-size:13px;font-weight:600;white-space:nowrap;">${svg(I.plus, 14, 2.2)}<span>${t}</span></span>`;

const sectionLabel = (t) =>
  `<div style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">${t}</div>`;

/* ==================== W18 - sign in, office desktop ==================== */

admin['AdminDeskSignIn.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  <div style="width:560px;flex:0 0 560px;background:${C.accentDark};color:#F7EFE7;padding:48px;display:flex;flex-direction:column;">
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:38px;height:38px;border-radius:12px;background:#F7EFE7;color:${C.accentDark};display:flex;align-items:center;justify-content:center;">${svg(I.group, 22, 1.9)}</div>
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;">Jemaat</div>
    </div>
    <div style="flex:1 1 auto;"></div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;line-height:1.2;letter-spacing:-0.01em;">The church register,<br>kept by the people<br>who know the church.</div>
    <div style="width:40px;height:2px;background:#F7EFE7;opacity:0.5;margin:22px 0 18px;"></div>
    <div style="font-size:13px;line-height:1.7;opacity:0.85;">Members, households and care groups in one place. Your data stays yours, and leaves as a spreadsheet whenever you ask.</div>
  </div>

  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;">
    <div style="width:420px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:26px;">
        ${sq('IM', 44)}
        <div style="flex:1 1 auto;min-width:0;">
          <div style="font-size:15px;font-weight:700;">Immanuel Church, Sunter</div>
          <div style="font-size:12.5px;color:${C.ink3};margin-top:3px;">Jakarta Utara</div>
        </div>
      </div>
      <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Sign in</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;">We send a link to your WhatsApp. No password to remember.</div>

      <div style="display:flex;flex-direction:column;gap:16px;margin-top:24px;">
        ${deskField('YOUR PHONE', '812-3456-7890', { prefix: '+62', placeholder: true })}
        ${btn('Send me a link', { h: 48, icon: I.chat, grow: false })}
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="flex:1 1 auto;height:1px;background:${C.line};"></span>
          <span style="font-size:11px;font-weight:700;color:${C.ink3};">OR</span>
          <span style="flex:1 1 auto;height:1px;background:${C.line};"></span>
        </div>
        ${btn('Send a 6-digit code', { kind: 'ghost', h: 44, grow: false })}
        <div style="display:flex;align-items:center;gap:11px;padding:13px 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
          <div style="width:19px;height:19px;flex:0 0 19px;border-radius:6px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;">${svg(I.check, 12, 3)}</div>
          <div style="flex:1 1 auto;">
            <div style="font-size:13px;font-weight:600;">This is a shared computer</div>
            <div style="font-size:11px;color:${C.ink3};margin-top:2px;">Sign me out when the browser closes</div>
          </div>
        </div>
        <div style="font-size:12px;color:${C.ink3};line-height:1.55;text-align:center;">Your number is not on file? Ask another administrator to add it.</div>
      </div>
    </div>
  </div>
</div>`);

/* ==================== W19 - sign in, on a phone ==================== */

admin['AdminSignIn.dc.html'] = doc(inBrowser('imanuel.jemaat.app', pad(`
  <div style="display:flex;align-items:center;gap:12px;padding-top:8px;">
    ${sq('IM', 44)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Immanuel Church, Sunter</div>
      <div style="font-size:11.5px;color:${C.ink3};margin-top:3px;">Jakarta Utara</div>
    </div>
  </div>

  <div>
    <div style="font-family:${SERIF};font-size:26px;font-weight:500;letter-spacing:-0.01em;">Sign in</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:8px;line-height:1.55;">We send a link to your WhatsApp. No password to remember.</div>
  </div>

  ${field('YOUR PHONE', '812-3456-7890', { prefix: '+62', placeholder: true })}

  <div style="display:flex;flex-direction:column;gap:10px;">
    ${btn('Send me a link', { h: 48, icon: I.chat, grow: false })}
    <div style="display:flex;align-items:center;gap:12px;">
      <span style="flex:1 1 auto;height:1px;background:${C.line};"></span>
      <span style="font-size:11px;font-weight:700;color:${C.ink3};">OR</span>
      <span style="flex:1 1 auto;height:1px;background:${C.line};"></span>
    </div>
    ${btn('Send a 6-digit code', { kind: 'ghost', h: 44, grow: false })}
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:13px 14px;">
    <div style="width:19px;height:19px;flex:0 0 19px;border-radius:6px;border:1.5px solid ${C.line};"></div>
    <div style="flex:1 1 auto;">
      <div style="font-size:13px;font-weight:600;">This is a shared phone</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:2px;">Sign me out when I close this tab</div>
    </div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="text-align:center;font-size:11.5px;color:${C.ink3};line-height:1.55;padding-bottom:18px;">Your number is not on file?<br>Ask another administrator to add it.</div>
`)));

/* ==================== W20 - the link, opened inside messages ==================== */

const step = (n, t, sub) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;">
  <span style="width:24px;height:24px;flex:0 0 24px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13.5px;font-weight:600;line-height:1.35;">${t}</div>
    ${sub ? `<div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.45;">${sub}</div>` : ''}
  </div>
</div>`;

admin['AdminLinkStuck.dc.html'] = doc(inApp('imanuel.jemaat.app', pad(`
  ${card(`<div style="display:flex;align-items:center;gap:11px;padding:13px 14px;">
    ${sq('IM', 38)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13.5px;font-weight:700;">Signed in as Lidya S.</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:2px;">Immanuel Church &middot; 248 people</div>
    </div>
    ${miniBtn('Open register', true)}
  </div>`)}

  <div style="padding-top:8px;">
    <div style="font-family:${SERIF};font-size:23px;font-weight:500;line-height:1.25;">Keep this one tap away</div>
    <div style="font-size:12.5px;color:${C.ink2};margin-top:9px;line-height:1.6;">You opened the link inside WhatsApp. To put Jemaat on your home screen, open it in your browser first.</div>
  </div>

  ${card(rows([
    step('1', 'Tap the three dots, top right', 'In this bar, above'),
    step('2', 'Choose Open in Chrome', 'Or Safari, or your usual browser'),
    step('3', 'Then Add to home screen', 'One icon, and no signing in again'),
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="text-align:center;font-size:11.5px;color:${C.ink3};line-height:1.55;padding-bottom:18px;">Nothing is lost if you close this.<br>Your link still works.</div>
`)));

/* ==================== W21 - the register on a phone ==================== */

const stat = (n, t) => `
<div style="flex:1 1 0;min-width:0;padding:13px 6px;text-align:center;">
  <div style="font-family:${SERIF};font-size:24px;font-weight:600;line-height:1;">${n}</div>
  <div style="font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};margin-top:6px;">${t}</div>
</div>`;

const taskRow = (icon, title, meta) => `
<div style="display:flex;align-items:center;gap:11px;padding:13px 14px;">
  <span style="color:${C.ink3};display:flex;">${svg(icon, 17)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13.5px;font-weight:600;">${title}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:2px;">${meta}</div>
  </div>
  ${chev()}
</div>`;

admin['AdminHomePhone.dc.html'] = doc(installed(`
<div style="display:flex;align-items:center;gap:11px;padding:14px 16px 12px;border-bottom:1px solid ${C.line};">
  ${sq('IM', 34)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:700;">Immanuel</div>
    <div style="font-size:10.5px;color:${C.ink3};margin-top:2px;">Lidya S.</div>
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

  ${card(rows([
    taskRow(I.chat, '12 people have no phone number', 'Grace A., Dedi K., Tigor S. and 9 more'),
    taskRow(I.group, '12 asked to join a care group', 'Not placed in one yet'),
    taskRow(I.home, '3 households have no address', 'Added by hand last week'),
  ]))}

  ${card(rows([
    taskRow(I.clock, 'Last import', '8 March &middot; 261 rows &middot; 4 possible duplicates'),
    taskRow(I.upload, 'Export the register', 'Never exported'),
  ]))}

  <div style="flex:1 1 auto;"></div>
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

admin['AdminPersonNew.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <span style="color:${C.ink2};display:flex;">${svg(I.x, 20, 2)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Add a person</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">Immanuel Church, Sunter</div>
    </div>
    ${wBtn('Save and close', I.check)}
    ${wBtn('Save and add another', I.userPlus, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:40px;padding:26px 32px;justify-content:center;">

    <div style="width:470px;flex:0 0 470px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHO THEY ARE')}
      ${deskField('FULL NAME', 'Yosafat Prasetyo')}
      <div style="display:flex;gap:14px;">
        <div style="flex:1 1 0;">${deskField('DATE OF BIRTH', '14 June 1979')}</div>
        <div style="flex:1 1 0;">${deskField('WITH US SINCE', 'March 2019')}</div>
      </div>
      ${deskField('PHONE', '812-7788-2200', { prefix: '+62' })}
      ${deskField('SECOND PHONE', 'Add another number', { prefix: '+62', tag: 'optional', placeholder: true })}

      <div style="height:2px;"></div>
      ${sectionLabel('STANDING')}
      ${fieldWrap('MEMBERSHIP', segmented(['Guest', 'Member', 'Registered Member'], 'Member'))}
      ${deskField('MEMBER OF', 'Bethania Church, Bandung', { hint: 'Where their membership is held.' })}
    </div>

    <div style="width:590px;flex:0 0 590px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHERE THEY LIVE')}
      ${deskField('HOUSEHOLD', 'Prase', { caret: true })}
      ${card(rows([
        matchRow('Keluarga Prasetyo', '8 people &middot; Sunter Agung Q4/12', true),
        matchRow('Keluarga Prasetya', '2 people &middot; Kelapa Gading'),
        matchRow('Create a new household', 'For a different address'),
      ]), 'margin-top:-6px;')}
      ${deskField('ADDRESS', 'Sunter Agung Q4/12, Jakarta Utara', { tag: 'from the household', right: `<span style="font-size:12px;font-weight:700;color:${C.accent};">Change</span>` })}
      ${mapBlock(590, 190)}

      <div style="height:2px;"></div>
      ${sectionLabel('WHAT THEY ARE INTERESTED IN')}
      ${fieldWrap('SERVING ROLES', `<div style="display:flex;flex-wrap:wrap;gap:8px;">${roleChip('Music', 'Singer')}${roleChip('Prayer', 'Intercessor')}${addChip('Add a role')}</div>`, { tag: 'any number' })}
      ${fieldWrap('A CARE GROUP', segmented(['Yes', 'No'], 'Yes'), { hint: 'Someone from the office will place them in one.' })}
    </div>
  </div>
</div>`);

/* ==================== W23 - add a person, on a phone ==================== */

admin['AdminPersonPhone.dc.html'] = doc(inBrowser('imanuel.jemaat.app/people/new', `
<div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;border-bottom:1px solid ${C.line};">
  <span style="color:${C.ink2};display:flex;">${svg(I.x, 18, 2)}</span>
  <div style="flex:1 1 auto;font-size:13.5px;font-weight:700;">Add a person</div>
  <span style="font-size:13px;font-weight:700;color:${C.accent};">Save</span>
</div>
${pad(`
  ${field('FULL NAME', 'Yosafat Prasetyo')}
  ${field('PHONE', '812-7788-2200', { prefix: '+62' })}
  ${fieldWrap('MEMBERSHIP', segmented(['Guest', 'Member', 'Registered'], 'Member'))}
  ${field('HOUSEHOLD', 'Prase', { right: `<span style="width:1.5px;height:18px;background:${C.accent};"></span>` })}
  ${card(rows([
    matchRow('Keluarga Prasetyo', '8 people &middot; Sunter Agung Q4/12', true),
    matchRow('Create a new household', 'For a different address'),
  ]), 'margin-top:-6px;')}

  ${card(rows([
    `<div style="display:flex;align-items:center;gap:11px;padding:14px;">
      <span style="color:${C.ink3};display:flex;">${svg(I.sliders, 17)}</span>
      <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13.5px;font-weight:600;">More details</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">Birth date, second phone, interests</div></div>
      ${chev()}
    </div>`,
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="height:16px;"></div>
`)}`));

/* ==================== W26 - a household ==================== */

const occupant = (init, name, relation, meta, right = '') => `
<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;">
  ${av(init, 36)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13.5px;font-weight:600;">${name}</div>
    <div style="font-size:11.5px;color:${C.ink3};margin-top:2px;">${meta}</div>
  </div>
  <span style="width:150px;flex:0 0 150px;font-size:12.5px;font-weight:600;color:${C.ink2};">${relation}</span>
  ${right}
</div>`;

admin['AdminHousehold.dc.html'] = doc(`
<div style="width:1440px;height:1040px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <span style="color:${C.ink2};display:flex;">${svg(I.chevL, 20, 2)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Keluarga Prasetyo</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">9 people &middot; 7 family, 2 others &middot; Sunter Agung Q4/12</div>
    </div>
    ${wBtn('Print family card', I.upload)}
    ${wBtn('Add a person here', I.userPlus, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:28px;padding:26px 32px;">

    <div style="width:470px;flex:0 0 470px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHERE THIS HOUSEHOLD IS')}
      ${deskField('ADDRESS', 'Sunter Agung Q4/12, Jakarta Utara', { right: `<span style="font-size:12px;font-weight:700;color:${C.accent};">Edit</span>` })}
      ${mapBlock(470, 240)}
      <div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
        <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.pin, 17)}</span>
        <div style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.5;">Drag the pin if the address search put it on the wrong gang.</div>
      </div>

      ${card(`
        <div style="padding:13px 16px 8px;">${label('Also at this address')}</div>
        <div style="display:flex;align-items:center;gap:12px;padding:0 16px 14px;">
          ${sq('KH', 38)}
          <div style="flex:1 1 auto;min-width:0;">
            <div style="font-size:13.5px;font-weight:600;">Keluarga Halim</div>
            <div style="font-size:11.5px;color:${C.ink3};margin-top:2px;">3 people &middot; Andreas H. is head</div>
          </div>
          ${chev()}
        </div>`)}

      ${card(`
        <div style="padding:13px 16px 8px;">${label('Who the office calls')}</div>
        <div style="display:flex;align-items:center;gap:12px;padding:0 16px 14px;">
          ${av('BP', 36)}
          <div style="flex:1 1 auto;min-width:0;">
            <div style="font-size:13.5px;font-weight:600;">Bambang Prasetyo</div>
            <div style="font-size:11.5px;color:${C.ink3};margin-top:2px;">+62 812-3344-9900</div>
          </div>
          <span style="font-size:12.5px;font-weight:700;color:${C.accent};">Change</span>
        </div>`)}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('FAMILY')}
      ${card(`
        ${occupant('BP', 'Bambang Prasetyo', `<span style="color:${C.accent};font-weight:700;">Head of household</span>`, 'Registered Member &middot; 62')}
        ${rows([
          occupant('SP', 'Sri Prasetyo', 'Wife', 'Registered Member &middot; 59'),
          occupant('YP', 'Yosafat Prasetyo', 'Son', 'Member &middot; 46'),
          occupant('IP', 'Intan Prasetyo', 'Daughter-in-law', 'Registered Member &middot; 44'),
          occupant('RP', 'Rafael Prasetyo', 'Grandchild', 'Guest &middot; 11'),
          occupant('KP', 'Kevin Prasetyo', 'Grandchild', 'Member &middot; 20', pill('Own address', C.bg, C.ink3, `border:1px solid ${C.line};`)),
          occupant('YS', 'Yanti Sihombing', 'Other relative', 'Member &middot; 52'),
        ])}`)}

      ${sectionLabel('ALSO LIVES HERE')}
      ${card(`
        ${occupant('NU', 'Nuraini', 'Household helper', 'Guest &middot; 41 &middot; from Sukabumi')}
        ${rows([
          occupant('PT', 'Petrus Tanjung', 'Boards here', 'Member &middot; 24'),
        ])}
        <div style="display:flex;align-items:center;gap:10px;padding:13px 16px;border-top:1px solid ${C.lineSoft};">
          <span style="color:${C.accent};display:flex;">${svg(I.plus, 16, 2.2)}</span>
          <span style="font-size:13px;font-weight:600;color:${C.accent};">Add someone who lives here</span>
        </div>`)}

      ${card(`
        <div style="padding:13px 16px 8px;">${label('Moved out')}</div>
        ${rows([
          `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;">
            ${av('MT', 34)}
            <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Melisa Tanudjaja</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">Daughter &middot; married January 2024</div></div>
            <span style="font-size:12px;font-weight:600;color:${C.ink2};">Keluarga Tanudjaja</span>
            ${chev()}
          </div>`,
          `<div style="display:flex;align-items:center;gap:12px;padding:11px 16px;">
            ${av('DP', 34)}
            <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">Daniel Prasetyo</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">Son &middot; married August 2019</div></div>
            <span style="font-size:12px;font-weight:600;color:${C.ink2};">Keluarga Prasetyo, Bekasi</span>
            ${chev()}
          </div>`,
        ])}`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

/* ==================== W24 - care groups ==================== */

const groupRow = (name, area, leader, n, on = false) => `
<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:12px;${on ? `background:${C.surface};border:1.5px solid ${C.accent};` : 'border:1px solid transparent;'}">
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:700;">${name}</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:4px;">${area} &middot; ${leader}</div>
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

admin['AdminGroups.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Care groups</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">5 groups &middot; 61 of 248 people belong to one</div>
    </div>
    ${wBtn('New group', I.plus, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:24px;padding:24px 32px;">
    <div style="width:352px;flex:0 0 352px;">
      ${card(`<div style="padding:6px;display:flex;flex-direction:column;gap:2px;">
        ${groupRow('Anugerah', 'Sunter', 'Budi Hartono', '14', true)}
        ${groupRow('Kasih', 'Kelapa Gading', 'Melisa Tanudjaja', '12')}
        ${groupRow('Damai', 'Sunter', 'Maruli Siregar', '11')}
        ${groupRow('Setia', 'Pluit', 'Grace Anjani', '13')}
        ${groupRow('Harapan', 'Kemayoran', 'No leader yet', '11')}
      </div>`)}
    </div>

    <div style="flex:1 1 auto;min-width:0;">
      ${card(`
        <div style="padding:18px 16px 14px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:flex-end;gap:12px;">
          <div style="flex:1 1 auto;min-width:0;">
            <div style="font-family:${SERIF};font-size:23px;font-weight:500;">Anugerah</div>
            <div style="font-size:12.5px;color:${C.ink3};margin-top:5px;">Sunter &middot; 14 people &middot; Wednesdays</div>
          </div>
          <div style="flex:0 0 auto;white-space:nowrap;">${wBtn('Add member', I.userPlus)}</div>
        </div>
        ${memberRow('BH', 'Budi Hartono', 'Registered Member', pill('Leader', C.accentTint, C.accent))}
        ${rows([
          memberRow('MT', 'Melisa Tanudjaja', 'Registered Member'),
          memberRow('AH', 'Andreas Halim', 'Member'),
          memberRow('IP', 'Intan Prasetyo', 'Registered Member'),
          memberRow('GA', 'Grace Anjani', 'Guest'),
          memberRow('DK', 'Dedi Kurnia', 'Registered Member'),
          memberRow('TS', 'Tigor Siahaan', 'Member'),
          memberRow('SL', 'Samuel Lubis', 'Registered Member'),
          memberRow('YT', 'Yuni Tarigan', 'Registered Member'),
        ])}
        <div style="padding:12px 16px;border-top:1px solid ${C.lineSoft};font-size:12px;color:${C.ink3};">and 5 more</div>`, 'overflow:hidden;')}
    </div>

    <div style="width:326px;flex:0 0 326px;">
      ${card(`
        <div style="padding:16px 16px 6px;">
          <div style="font-size:14px;font-weight:700;">Asked to join a group</div>
          <div style="font-size:12px;color:${C.ink3};margin-top:4px;">12 people, none placed yet</div>
        </div>
        ${rows([
          memberRow('RW', 'Rian Wijaya', 'Sunter', miniBtn('Place')),
          memberRow('SR', 'Sinta Rahmat', 'Sunter', miniBtn('Place')),
          memberRow('FT', 'Fandi Tobing', 'Pluit', miniBtn('Place')),
          memberRow('HL', 'Hendra Lie', 'Kemayoran', miniBtn('Place')),
          memberRow('NK', 'Nita Kusuma', 'Kelapa Gading', miniBtn('Place')),
        ])}
        <div style="padding:12px 16px;border-top:1px solid ${C.lineSoft};font-size:12.5px;font-weight:600;color:${C.accent};">See all 12</div>`)}
    </div>
  </div>
</div>`);

/* ==================== W27 - departments and serving roles ==================== */

const deptRow = (name, n, on = false) => `
<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:12px;${on ? `background:${C.surface};border:1.5px solid ${C.accent};` : 'border:1px solid transparent;'}">
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:700;">${name}</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:4px;">${n} roles</div>
  </div>
  ${chev()}
</div>`;

const roleRow = (role, interested, off = false) => `
<div style="display:flex;align-items:center;gap:14px;padding:13px 16px;">
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13.5px;font-weight:600;color:${off ? C.disabledInk : C.ink};">${role}</div>
    ${off ? `<div style="font-size:11.5px;color:${C.ink3};margin-top:2px;">Not in use since March</div>` : ''}
  </div>
  <span style="width:120px;flex:0 0 120px;font-size:12.5px;color:${off ? C.ink3 : C.ink2};">${interested}</span>
  <span style="color:${C.ink3};display:flex;">${svg(I.more, 17)}</span>
</div>`;

admin['AdminDepartments.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Departments and serving roles</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">6 departments &middot; 24 roles</div>
    </div>
    ${wBtn('New department', I.plus, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:24px;padding:24px 32px;">
    <div style="width:352px;flex:0 0 352px;">
      ${card(`<div style="display:flex;flex-direction:column;height:100%;">
        <div style="padding:6px;display:flex;flex-direction:column;gap:2px;">
          ${deptRow('Music', 6, true)}
          ${deptRow('Multimedia', 5)}
          ${deptRow('Prayer', 2)}
          ${deptRow('Teaching', 4)}
          ${deptRow('Visitation', 3)}
          ${deptRow('Hospitality', 4)}
        </div>
        <div style="flex:1 1 auto;"></div>
        <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-top:1px solid ${C.lineSoft};">
          <span style="color:${C.accent};display:flex;">${svg(I.plus, 16, 2.2)}</span>
          <span style="font-size:13px;font-weight:600;color:${C.accent};">Add a department</span>
        </div>
      </div>`, 'height:100%;overflow:hidden;')}
    </div>

    <div style="flex:1 1 auto;min-width:0;">
      ${card(`<div style="display:flex;flex-direction:column;height:100%;">
        <div style="padding:18px 16px 14px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:flex-end;gap:12px;">
          <div style="flex:1 1 auto;min-width:0;">
            <div style="font-family:${SERIF};font-size:23px;font-weight:500;">Music</div>
            <div style="font-size:12.5px;color:${C.ink3};margin-top:5px;">6 roles &middot; 49 people interested</div>
          </div>
          <div style="flex:0 0 auto;white-space:nowrap;">${wBtn('Rename', I.edit)}</div>
        </div>
        <div style="display:flex;gap:14px;padding:11px 16px 6px;">
          <span style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">SERVING ROLE</span>
          <span style="width:120px;flex:0 0 120px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">INTERESTED</span>
          <span style="width:17px;flex:0 0 17px;"></span>
        </div>
        ${rows([
          roleRow('Worship Leader', '7 people'),
          roleRow('Singer', '18 people'),
          roleRow('Keyboardist', '5 people'),
          roleRow('Guitarist', '9 people'),
          roleRow('Bassist', '4 people'),
          roleRow('Drummer', '6 people'),
          roleRow('Choir Conductor', 'none', true),
        ])}
        <div style="flex:1 1 auto;"></div>
        <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-top:1px solid ${C.lineSoft};">
          <span style="color:${C.accent};display:flex;">${svg(I.plus, 16, 2.2)}</span>
          <span style="font-size:13px;font-weight:600;color:${C.accent};">Add a role to Music</span>
        </div>
      </div>`, 'height:100%;overflow:hidden;')}
    </div>

    <div style="width:326px;flex:0 0 326px;">
      ${card(`<div style="display:flex;flex-direction:column;height:100%;">
        <div style="padding:16px 16px 6px;">
          <div style="font-size:14px;font-weight:700;">Interested in Music</div>
          <div style="font-size:12px;color:${C.ink3};margin-top:4px;">49 people, newest first</div>
        </div>
        ${rows([
          memberRow('YP', 'Yosafat Prasetyo', 'Singer'),
          memberRow('GA', 'Grace Anjani', 'Keyboardist &middot; Singer'),
          memberRow('SL', 'Samuel Lubis', 'Guitarist'),
          memberRow('YT', 'Yuni Tarigan', 'Singer'),
          memberRow('RW', 'Rian Wijaya', 'Drummer'),
          memberRow('NK', 'Nita Kusuma', 'Singer'),
          memberRow('HL', 'Hendra Lie', 'Bassist'),
          memberRow('SR', 'Sinta Rahmat', 'Singer'),
          memberRow('FT', 'Fandi Tobing', 'Worship Leader'),
        ])}
        <div style="flex:1 1 auto;"></div>
        <div style="padding:14px 16px;border-top:1px solid ${C.lineSoft};display:flex;align-items:center;gap:10px;">
          <span style="flex:1 1 auto;font-size:12.5px;color:${C.ink3};">and 40 more</span>
          <span style="font-size:12.5px;font-weight:700;color:${C.accent};">Export</span>
        </div>
      </div>`, 'height:100%;overflow:hidden;')}
    </div>
  </div>
</div>`);

/* ==================== W28 - choosing a serving role ==================== */

const optRow = (role, { on = false, chosen = false } = {}) => `
<div style="display:flex;align-items:center;gap:11px;padding:10px 16px;${on ? `background:${C.accentTint};` : ''}">
  <span style="flex:1 1 auto;min-width:0;font-size:13.5px;font-weight:${on ? 700 : 600};color:${chosen ? C.ink3 : C.ink};">${role}</span>
  ${chosen ? `<span style="color:${C.sage};display:flex;">${svg(I.check, 15, 2.4)}</span>` : ''}
</div>`;

const optHead = (dept) =>
  `<div style="padding:9px 16px 7px;background:${C.bg};border-top:1px solid ${C.lineSoft};font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">${dept}</div>`;

admin['AdminRolePicker.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <span style="color:${C.ink2};display:flex;">${svg(I.x, 20, 2)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Add a person</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">Immanuel Church, Sunter</div>
    </div>
    ${wBtn('Save and close', I.check)}
    ${wBtn('Save and add another', I.userPlus, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:40px;padding:26px 32px;justify-content:center;">
    <div style="width:470px;flex:0 0 470px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHO THEY ARE')}
      ${deskField('FULL NAME', 'Yosafat Prasetyo')}
      <div style="display:flex;gap:14px;">
        <div style="flex:1 1 0;">${deskField('DATE OF BIRTH', '14 June 1979')}</div>
        <div style="flex:1 1 0;">${deskField('WITH US SINCE', 'March 2019')}</div>
      </div>
      ${deskField('PHONE', '812-7788-2200', { prefix: '+62' })}
      ${deskField('SECOND PHONE', 'Add another number', { prefix: '+62', tag: 'optional', placeholder: true })}
      <div style="height:2px;"></div>
      ${sectionLabel('STANDING')}
      ${fieldWrap('MEMBERSHIP', segmented(['Guest', 'Member', 'Registered Member'], 'Member'))}
    </div>

    <div style="width:590px;flex:0 0 590px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHERE THEY LIVE')}
      ${deskField('HOUSEHOLD', 'Keluarga Prasetyo', { right: `<span style="font-size:12px;font-weight:700;color:${C.accent};">Change</span>` })}

      <div style="height:2px;"></div>
      ${sectionLabel('WHAT THEY ARE INTERESTED IN')}
      ${fieldWrap('SERVING ROLES', `
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">${roleChip('Music', 'Singer')}${roleChip('Prayer', 'Intercessor')}</div>
        <div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 14px;background:${C.surface};border:1px solid ${C.accent};border-radius:12px;">
          <span style="color:${C.ink3};display:flex;">${svg(I.search, 17)}</span>
          <span style="flex:1 1 auto;font-size:14px;font-weight:600;">mus</span>
          <span style="width:1.5px;height:18px;background:${C.accent};"></span>
        </div>
        <div style="margin-top:8px;background:${C.surface};border:1px solid ${C.line};border-radius:12px;overflow:hidden;">
          ${optHead('MUSIC')}
          ${optRow('Worship Leader')}
          ${optRow('Singer', { chosen: true })}
          ${optRow('Keyboardist', { on: true })}
          ${optRow('Guitarist')}
          ${optHead('MULTIMEDIA')}
          ${optRow('Sound Engineer')}
          ${optRow('Music Slides Operator')}
          <div style="padding:10px 16px;border-top:1px solid ${C.lineSoft};font-size:11.5px;color:${C.ink3};">6 of 24 roles match &ldquo;mus&rdquo;</div>
        </div>`, { tag: 'search by role or department' })}
      ${fieldWrap('A CARE GROUP', segmented(['Yes', 'No'], 'Yes'), { hint: 'Someone from the office will place them in one.' })}
    </div>
  </div>
</div>`);

/* ==================== W25 - the church record ==================== */

admin['AdminChurch.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:14px;padding:20px 32px;background:${C.surfaceAlt};border-bottom:1px solid ${C.line};">
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:16px;font-weight:700;">Church record</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:2px;">Immanuel Church, Sunter</div>
    </div>
    ${wBtn('Save', I.check, true)}
  </div>

  <div style="flex:1 1 auto;min-height:0;display:flex;gap:28px;padding:26px 32px;">
    <div style="width:470px;flex:0 0 470px;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('THIS CHURCH')}
      ${deskField('NAME', 'Immanuel Church, Sunter')}
      ${deskField('ADDRESS', 'Jl. Danau Sunter Utara Blok A No. 4, Jakarta Utara')}
      <div style="display:flex;gap:14px;">
        <div style="flex:1 1 0;">${deskField('TIME ZONE', 'WIB &middot; GMT+7')}</div>
        <div style="flex:1 1 0;">${deskField('WORSHIP DAY', 'Saturday')}</div>
      </div>
      ${mapBlock(470, 200)}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
      ${sectionLabel('WHO CAN ADMINISTER')}
      ${card(`
        ${memberRow('LS', 'Lidya Sutanto', 'Added 6 March &middot; +62 812-3456-7890', pill('You', C.accentTint, C.accent))}
        ${rows([
          memberRow('MH', 'Pdt. Marulitua Hutagalung', 'Added 6 March &middot; +62 813-9021-4455', `<span style="font-size:12.5px;font-weight:600;color:${C.ink3};">Remove</span>`),
        ])}
        <div style="display:flex;align-items:center;gap:10px;padding:13px 16px;border-top:1px solid ${C.lineSoft};">
          <span style="color:${C.accent};display:flex;">${svg(I.plus, 16, 2.2)}</span>
          <span style="font-size:13px;font-weight:600;color:${C.accent};">Add an administrator</span>
        </div>
        <div style="padding:0 16px 14px;font-size:11.5px;color:${C.ink3};line-height:1.5;">Keep at least two, so the register is never locked behind one phone.</div>`)}

      ${sectionLabel('THIS REGISTER')}
      ${card(rows([
        `<div style="display:flex;align-items:baseline;gap:14px;padding:12px 16px;"><span style="width:130px;flex:0 0 130px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">HOLDS</span><span style="flex:1 1 auto;font-size:13px;font-weight:600;">248 people &middot; 76 households &middot; 5 care groups</span></div>`,
        `<div style="display:flex;align-items:baseline;gap:14px;padding:12px 16px;"><span style="width:130px;flex:0 0 130px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">STARTED</span><span style="flex:1 1 auto;font-size:13px;font-weight:600;">6 March 2026</span></div>`,
        `<div style="display:flex;align-items:baseline;gap:14px;padding:12px 16px;"><span style="width:130px;flex:0 0 130px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">LAST EXPORT</span><span style="flex:1 1 auto;font-size:13px;font-weight:600;">Never</span><span style="font-size:12.5px;font-weight:700;color:${C.accent};">Export now</span></div>`,
      ]))}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

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

const infoCard = (title, body, extra = '') =>
  card(`<div style="padding:16px 18px;">
    <div style="font-size:14px;font-weight:700;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">${body}</div>
  </div>`, extra);

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
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Every other flow in these 93 artboards is two-sided. Take away three of the four roles and each one loses the half that starts it.</div>
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
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">One global person table.</span> Decision 7 on S5, and still the only one that cannot be retrofitted.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Household and family are different things.</span> S14 settles which one this release stores, and the answer changes the schema rather than a screen.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">A service is an entity.</span> Nothing in the register displays one, and attendance will hang off it the moment the app lands.')}
        <div style="height:8px;"></div>`)}

      ${card(`<div style="padding:18px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">The risk this choice takes</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Iteration 17 turned on the office this time: <span style="font-weight:700;color:${C.ink};">a register with no weekly rhythm goes stale</span>. Lidya types 248 people over two evenings, and then has no reason to open it again until somebody moves house.<br><br>The new interest fields cut into that: <span style="font-weight:700;color:${C.ink};">12 people asked to join a care group and none are placed</span> is a queue the office can work through without anybody else being online. It is the first thing in this release that generates its own next task.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

/* ==================== S14 - household, family, and the address ==================== */

const modelRow = (thing, holds, changes) => `
<div style="display:flex;gap:16px;padding:13px 16px;">
  <span style="width:150px;flex:0 0 150px;font-size:12.5px;font-weight:700;line-height:1.4;">${thing}</span>
  <span style="width:300px;flex:0 0 300px;font-size:12px;color:${C.ink2};line-height:1.45;">${holds}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${changes}</span>
</div>`;

const caseRow = (situation, answer) => `
<div style="display:flex;gap:14px;padding:11px 16px;">
  <span style="width:250px;flex:0 0 250px;font-size:12.5px;font-weight:600;line-height:1.4;">${situation}</span>
  <span style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.45;">${answer}</span>
</div>`;

admin['AdminModel.dc.html'] = doc(`
<div style="width:1440px;height:1300px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">Household, family, and the address</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:960px;">The question that produced this sheet: <span style="font-style:italic;">is a household who lives in one house, or is it a family with a head?</span> They are two different facts and the design had been using one word for both. <span style="font-weight:700;color:${C.ink};">A household is an address with people in it. A family is who those people are to each other.</span> One changes when somebody moves; the other does not.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">2</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">facts, one word<br>separated here</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:834px;flex:0 0 834px;display:flex;flex-direction:column;gap:18px;">
      ${card(`
        <div style="padding:16px 16px 10px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Two facts, and what each one owns</div>
        </div>
        <div style="display:flex;gap:16px;padding:9px 16px 4px;">
          <span style="width:150px;flex:0 0 150px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">THE FACT</span>
          <span style="width:300px;flex:0 0 300px;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WHAT IT HOLDS</span>
          <span style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">WHEN IT CHANGES</span>
        </div>
        ${modelRow('Household', 'The address, the map pin, and the people living at it. One of them is the head.', 'Somebody moves in or out. A move rewrites the household, never the person.')}
        ${modelRow('Family', 'Who a person is to another person: spouse, parent, child.', 'A marriage, a birth, a death. Never a move &mdash; a married daughter is still a daughter.')}
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">What ships now is the household, with a relationship written on each occupant.</span> That is the shape of a Kartu Keluarga, it is what a church prints as a family card, and it answers the visitation question a register is actually asked. Kinship <span style="font-style:italic;">between</span> households &mdash; a daughter who married out &mdash; stays a link the office can follow, not a graph the register maintains.
        </div>`)}

      ${card(`
        <div style="padding:16px 16px 10px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">One list of relations, and where the line falls</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Not everyone under a roof is kin. The relation is how a person is attached to the household, so it covers both &mdash; and whether they are family is <span style="font-weight:700;color:${C.ink};">derived from the value, never asked as a second question</span>.</div>
        </div>
        <div style="display:flex;gap:20px;padding:14px 16px 16px;">
          <div style="flex:1 1 0;min-width:0;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">FAMILY</div>
            <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;">
              ${['Head of household', 'Wife', 'Husband', 'Son', 'Daughter', 'Son-in-law', 'Daughter-in-law', 'Parent', 'Parent-in-law', 'Grandchild', 'Sibling', 'Other relative'].map((t) => `<span style="display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:${C.accentTint};color:${C.accent};font-size:11.5px;font-weight:600;">${t}</span>`).join('')}
            </div>
          </div>
          <span style="width:1px;background:${C.lineSoft};"></span>
          <div style="width:280px;flex:0 0 280px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};">NOT FAMILY</div>
            <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:10px;">
              ${['Household helper', 'Boards here', 'Friend', 'Other'].map((t) => `<span style="display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};color:${C.ink2};font-size:11.5px;font-weight:600;">${t}</span>`).join('')}
            </div>
            <div style="font-size:11.5px;color:${C.ink3};margin-top:12px;line-height:1.5;">Kartu Keluarga already carries famili lain and pembantu, so the office recognises the list rather than learning it.</div>
          </div>
        </div>
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.6;">
          W26 shows the two groups as two blocks, so a reader sees at a glance who is family and who simply lives here. <span style="font-weight:700;color:${C.ink};">A helper is in the household and not in the family</span> &mdash; she is on the visitation list, she is not on the family card, and her own family lives in Sukabumi where this register cannot see it.
        </div>`)}

      ${card(`
        <div style="padding:16px 16px 10px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">The situations that decide the model</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Every one of these is ordinary in an Indonesian congregation, and each one breaks a design that has only one of the two facts.</div>
        </div>
        ${rows([
          caseRow('A married son and his wife live in his parents&rsquo; house', 'Two households at one address, not one household of six. Each has its own head, and W26 shows the neighbour at the foot of the address panel.'),
          caseRow('A daughter marries and moves out', 'She leaves the household and joins a new one. The old household keeps her in <span style="font-weight:600;">Moved out</span>, with where she went &mdash; which is the kinship link, kept without a kinship table.'),
          caseRow('A student boards with a church family', 'An occupant of that household whose relationship is <span style="font-weight:600;">Boards here</span>. No kinship at all, and the visitation list is still right.'),
          caseRow('A widow lives alone', 'A household of one, and she is its head. A head is a role, never a rank, and never a man by default.'),
          caseRow('A person works in another city', 'Household unchanged. Their own address overrides the household&rsquo;s, which is the only reason a person carries an address field at all.'),
          caseRow('Parents divorce, children split the week', 'One household holds the children, the other is recorded on the parent. The register refuses to model custody, and the office writes what it needs in neither &mdash; there is no notes field.'),
        ])}`)}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('The shape, in tables')}</div>
        <div style="padding:0 16px 14px;font-family:ui-monospace,monospace;font-size:11.5px;color:${C.ink2};line-height:1.85;">
          <span style="font-weight:700;color:${C.ink};">household</span><br>
          &nbsp;&nbsp;id, name, address,<br>&nbsp;&nbsp;lat, lng, church_id<br><br>
          <span style="font-weight:700;color:${C.ink};">household_member</span><br>
          &nbsp;&nbsp;person_id, household_id,<br>&nbsp;&nbsp;relation, moved_in, moved_out<br><br>
          <span style="font-weight:700;color:${C.ink};">person</span><br>
          &nbsp;&nbsp;id, name, born, phone,<br>&nbsp;&nbsp;phone_2, address_override<br><br>
          <span style="color:${C.ink3};">-- not yet, and named so</span><br>
          <span style="color:${C.ink3};">-- nobody invents it early</span><br>
          <span style="font-weight:700;color:${C.ink3};">relationship</span><br>
          &nbsp;&nbsp;<span style="color:${C.ink3};">person_a, person_b, type</span>
        </div>`)}

      ${infoCard('One head, and it is a role', `Exactly one occupant per household carries it, and the screen refuses a household with none rather than guessing. It decides who a letter is addressed to and who the office rings first &mdash; nothing else, and no permission anywhere hangs off it.`)}

      ${infoCard('The address lives on the household', `Decision 6 on S5, unchanged: correct it once and the whole house moves. The person-level override exists for the student in a dorm and the worker in another city, and it is left empty on almost every record.`, 'border-color:#B4562F55;')}

      ${infoCard('The pin is the truth, not the text', `Indonesian addresses defeat geocoders: a gang with no name, a blok that repeats, an RT that only the neighbours know. So the office searches, then drags the pin, and the coordinates are what a visitation team actually follows.<br><br>Tiles and search are OpenStreetMap &mdash; free, no key for tiles, and self-hostable later, which is the same argument the MIT licence already made.`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

/* ==================== S15 - departments, roles, and interest ==================== */

const rule = (n, t, why) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 16px;">
  <span style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12.5px;font-weight:700;line-height:1.4;">${t}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:3px;line-height:1.5;">${why}</div>
  </div>
</div>`;

admin['AdminServing.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">Departments, roles, and what a person is interested in</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:960px;">Areas of involvement was a flat list of five words typed into a person. It becomes master data: <span style="font-weight:700;color:${C.ink};">a department holds serving roles, and a person expresses interest in a role</span>. Two levels, no third &mdash; and the department is a heading in the picker, never a thing you can choose.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">2</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">levels, and a wish<br>never a roster</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="width:834px;flex:0 0 834px;display:flex;flex-direction:column;gap:18px;">
      ${card(`
        <div style="padding:16px 16px 10px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Seven rules that keep it from rotting</div>
        </div>
        ${rows([
          rule('1', 'A role belongs to exactly one department', 'Moving it is allowed and recorded. A role that floats between departments makes every count ambiguous.'),
          rule('2', 'The catalogue is per church', 'A congregation with no multimedia team never sees those roles. Every church starts from a seed list and edits it down.'),
          rule('3', 'Deactivate, never delete', 'People have already expressed interest, and one day a roster will point at it. A dead role stops being offered and keeps resolving.'),
          rule('4', 'Search matches both levels, only one is choosable', 'Typing a department name surfaces its roles; the heading itself stays a label. Nobody is ever interested in Music, they are interested in Keyboardist.'),
          rule('5', 'A chosen role always carries its department', 'Coordinator exists in four departments. The chip reads Music / Coordinator or it is worthless in a list.'),
          rule('6', 'Interest is a wish, not a roster', 'It says someone is willing. It never means they are scheduled, and nothing in this release schedules anybody.'),
          rule('7', 'Interest is per church, like standing', 'Willing to sing here says nothing about the church someone attends on the other side of town.'),
        ])}`)}

      ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:13px;">
        <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.hand, 20)}</span>
        <div style="flex:1 1 auto;">
          <div style="font-size:14px;font-weight:700;">The line this must not cross</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Iteration 5 named serving as its own axis: a person belongs to teams, teams own slots, slots have dates. That is M10, M12, M13 and W3, and S1 cut all four to Later &mdash; the volunteer rotation a church actually asked for lives inside a care group.<br><br><span style="font-weight:700;color:${C.ink};">This release adds the catalogue and the wish, and no schedule.</span> The distance between the two is one table, and building it early would quietly restore the biggest cut on the release map.</div>
        </div>
      </div>`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('The shape, in tables')}</div>
        <div style="padding:0 16px 14px;font-family:ui-monospace,monospace;font-size:11.5px;color:${C.ink2};line-height:1.85;">
          <span style="font-weight:700;color:${C.ink};">department</span><br>
          &nbsp;&nbsp;id, name, church_id, active<br><br>
          <span style="font-weight:700;color:${C.ink};">serving_role</span><br>
          &nbsp;&nbsp;id, department_id, name, active<br><br>
          <span style="font-weight:700;color:${C.ink};">person_serving_interest</span><br>
          &nbsp;&nbsp;person_id, serving_role_id,<br>&nbsp;&nbsp;noted_on<br><br>
          <span style="color:${C.ink3};">-- the cut, named so nobody</span><br>
          <span style="color:${C.ink3};">-- adds it by reflex</span><br>
          <span style="font-weight:700;color:${C.ink3};">serving_assignment</span><br>
          &nbsp;&nbsp;<span style="color:${C.ink3};">person, role, slot, date</span>
        </div>`)}

      ${infoCard('What the office gets out of it', `A list per role, which is the first thing a coordinator asks for: eighteen people said Singer and nobody has called them. W27 shows that list beside the role and lets it be exported, which is as far as this release goes towards a rota.`)}

      ${infoCard('The seed list', `Music, Multimedia, Prayer, Teaching, Visitation, Hospitality &mdash; twenty-four roles between them. A new church deletes what it does not have rather than inventing from an empty screen, the same argument W11 makes about the register itself.`, 'border-color:#9A722344;')}
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
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">S1 staged R0 across an app and a web side, and this column has now been re-derived twice &mdash; once for one surface, and again for one role. Eighteen routes, eight capabilities, with the two-week item named where it can be seen rather than hidden inside a sprint.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">18</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">routes &middot; 8 capabilities<br>one role, one surface</div>
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
            <span style="font-size:11px;font-weight:700;color:${C.ink3};">18 routes &middot; 8 capabilities</span>
          </div>
          <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.55;">Tenancy, admin auth, the register, households, import, export and merge, plus two that arrived with the field list: the map, and the serving catalogue a person&rsquo;s interests point at.</div>
        </div>
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">ALREADY DRAWN, UNCHANGED</div>
        ${shipItem('W11', 'The empty People table', 'Still the real first screen a church meets, and now the only one')}
        ${shipItem('W2', 'People table', 'Search, filter, and the missing phone numbers it complains about')}
        ${shipItem('W6', 'One person, lifecycle', 'Transferred and deceased are register facts, not app features')}
        ${shipItem('W5', 'Import from Excel', 'Two weeks on its own. The single largest item here')}
        ${shipItem('W12', 'Merge two records', 'Import makes duplicates, so it ships with import and not after it')}
        ${shipItem('W10', 'Export, and leaving', 'More important here, not less: the register IS the product')}
        ${shipItem('W13', 'Administrators', 'Shrunk to one kind of access, keeping its refusal of a single admin')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.accent};">NEW ON THIS PAGE</div>
        ${shipItem('W18', 'Sign in, desktop', 'The hole open since iteration 16, now the whole front door', 'new')}
        ${shipItem('W19', 'Sign in, on a phone', 'The volunteer office S9 described, who has no desk', 'new')}
        ${shipItem('W20', 'The link inside messages', 'Every administrator meets it once. One route to answer it', 'new')}
        ${shipItem('W21', 'The register on a phone', 'Counts, add, find, and the three queues the register generates', 'new')}
        ${shipItem('W22', 'Add a person, desktop', 'Eleven fields now, in four sections. M5 was mobile-only', 'new')}
        ${shipItem('W23', 'Add a person, on a phone', 'Four fields and a More details row. The job that happens in a hall', 'new')}
        ${shipItem('W26', 'A household', 'Address, pin, occupants with relationships, and who moved out', 'new')}
        ${shipItem('W24', 'Care groups', 'Membership is register data. Placing the 12 who asked is the work', 'new')}
        ${shipItem('W25', 'The church record', 'Never drawn anywhere. Also where the time zone finally lands', 'new')}
        ${shipItem('W27', 'Departments and roles', 'Master data behind the interest field, and the list a coordinator asks for', 'new')}
        <div style="padding:10px 16px 4px;font-size:11.5px;color:${C.ink3};line-height:1.5;">W28 is not a route. It is W22 with the role picker open, drawn because the grouped search is the part that is easy to build wrongly.</div>
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
        ${order('3', 'Households, then people', 'The household holds the address, so it is the first table with a shape')}
        ${order('4', 'The map, last of the register', 'Search and a draggable pin. Everything works without it, worse')}
        ${order('5', 'Care groups and the interest queues', 'Cheap, and the only thing here that generates its own next task')}
        ${order('6', 'Import, then merge', 'Two weeks together. Never ship the first without the second')}
        ${order('7', 'Export', 'Before the second church signs, not the first')}
        <div style="height:8px;"></div>`)}

      ${infoCard('What the mobile build inherits', `Every M, O and P artboard stays valid against the same API. The app is not a second product &mdash; it is the other three roles arriving at a register that already holds real data, which is the easier order to build in and the harder one to sell.`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Closed by this release</div>
        </div>
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">The office could not sign in.</span> Named at iteration 16, open for twenty-six. W18 and W19.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Time zones were named and never applied.</span> Every screen said 19.30 and none said which. W25 holds it now.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Creating a person was mobile-only.</span> W2 had an Add button pointing at an app screen. W22 and W23.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Care groups could only arrive by import.</span> A church starting one in month two had nowhere to do it. W24.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Household did two jobs under one word.</span> S14 splits the address from the kinship, and W26 draws it.')}
        ${bullet('<span style="font-weight:700;color:' + C.ink + ';">Involvement was five words typed into a person.</span> It is master data now: a department, its roles, and an interest that points at one. S15 and W27.')}
        <div style="height:8px;"></div>`)}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="font-size:14px;font-weight:700;">Still open, and still not mine</div>
        </div>
        ${bullet('No <span style="font-family:ui-monospace,monospace;">DEC-</span> exists for anything, and the scope decision on this page is now the largest of them.')}
        ${bullet('The tier names changed to Guest, Member and Registered Member. Older sheets still say Community Member in prose.')}
        ${bullet('S5 predates the eleven-field person and the household split. It is the next sheet to re-derive.')}
        ${bullet('The pilot church has still seen none of this. Everything here is a claim until an office types its own congregation into it.')}
        <div style="height:8px;"></div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

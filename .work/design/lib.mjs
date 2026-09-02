export const C = {
  bg: '#FAF7F2', surface: '#FFFFFF', surfaceAlt: '#FFFDFB',
  ink: '#241E1A', ink2: '#6B6058', ink3: '#9A8F85',
  line: '#E9E1D7', lineSoft: '#F1EAE1',
  accent: '#B4562F', accentDark: '#8E4224', accentTint: '#F6EAE3',
  sage: '#4C6B52', sageTint: '#EAF0EA',
  amber: '#9A7223', amberTint: '#F7EEDD',
  disabled: '#EFE8DF', disabledInk: '#B5AAA0',
};

/*
 * TOKENS. Added at iteration 13 after measuring what twelve iterations of
 * screen-by-screen building had actually produced: 32 distinct font sizes,
 * 15 radii, 39 control heights. That is not a system, it is noise - and a
 * developer handed 32 font sizes will invent the 33rd.
 *
 * The scale below is the dominant values kept and the near-duplicates
 * dropped. 13.5 and 14 are indistinguishable on a phone but double the
 * decisions; 46, 48 and 50 are the same button.
 */
export const T = {
  micro: 9, tiny: 10, xs: 11, sm: 12, base: 13, md: 14, lg: 15, xl: 17,
  d1: 20, d2: 24, d3: 27, d4: 34,
};

export const R = { mark: 6, input: 12, card: 14, pill: 999 };

/** Control heights. Anything else snaps down to the nearest of these. */
export const H = [34, 40, 44, 48, 52, 56];
export const snapH = (h) => H.filter((x) => x <= h).pop() ?? H[0];

const FONTS = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
export const SERIF = '"Newsreader", Georgia, "Times New Roman", serif';

export const doc = (body) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="${FONTS}">
  <style>
    body { margin: 0; background: ${C.bg}; color: ${C.ink}; font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-wrap: pretty; }
    a { color: ${C.accent}; text-decoration: none; }
    a:hover { color: ${C.accentDark}; }
    * { box-sizing: border-box; }
  </style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;

export const svg = (paths, size = 22, sw = 1.7) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const I = {
  home: `<path d="M3.6 10.2 12 3.8l8.4 6.4V19a1.4 1.4 0 0 1-1.4 1.4h-4.2v-5.6H9.2v5.6H5a1.4 1.4 0 0 1-1.4-1.4z"/>`,
  users: `<circle cx="9.2" cy="8" r="3.2"/><path d="M3.6 19.6c0-3.1 2.5-5 5.6-5s5.6 1.9 5.6 5"/><path d="M16.2 5.5a3.2 3.2 0 0 1 0 5.9"/><path d="M17.6 15c2 .6 3.4 2 3.4 4.6"/>`,
  group: `<circle cx="12" cy="6.6" r="2.6"/><circle cx="5.8" cy="15.6" r="2.6"/><circle cx="18.2" cy="15.6" r="2.6"/><path d="M10.3 8.8 7.5 13.2"/><path d="M13.7 8.8l2.8 4.4"/><path d="M8.4 16.8h7.2"/>`,
  user: `<circle cx="12" cy="8" r="3.4"/><path d="M4.8 20.2c0-3.6 3.2-5.7 7.2-5.7s7.2 2.1 7.2 5.7"/>`,
  chevR: `<path d="m9.5 6 6 6-6 6"/>`,
  chevL: `<path d="m14.5 6-6 6 6 6"/>`,
  chevD: `<path d="m6 9.5 6 6 6-6"/>`,
  search: `<circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 4.4 4.4"/>`,
  plus: `<path d="M12 5.2v13.6"/><path d="M5.2 12h13.6"/>`,
  pin: `<path d="M12 21s6.4-6.2 6.4-10.4A6.4 6.4 0 0 0 5.6 10.6C5.6 14.8 12 21 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>`,
  check: `<path d="m5 12.6 4.6 4.6L19 7.4"/>`,
  x: `<path d="M6.2 6.2l11.6 11.6"/><path d="M17.8 6.2 6.2 17.8"/>`,
  cal: `<rect x="3.6" y="5.4" width="16.8" height="15" rx="2.4"/><path d="M8 3.4v4"/><path d="M16 3.4v4"/><path d="M3.6 10.4h16.8"/>`,
  clock: `<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.1 2"/>`,
  chat: `<path d="M20.4 11.6c0 4-3.8 7.2-8.4 7.2-1 0-2-.14-2.9-.4L4.4 20l1.2-3.4a6.9 6.9 0 0 1-2-5c0-4 3.8-7.2 8.4-7.2s8.4 3.2 8.4 7.2z"/>`,
  bell: `<path d="M6.6 10.5a5.4 5.4 0 0 1 10.8 0c0 4.2 1.6 5.6 1.6 5.6H5s1.6-1.4 1.6-5.6z"/><path d="M10.2 19a2 2 0 0 0 3.6 0"/>`,
  qr: `<rect x="4" y="4" width="6" height="6" rx="1.4"/><rect x="14" y="4" width="6" height="6" rx="1.4"/><rect x="4" y="14" width="6" height="6" rx="1.4"/><path d="M14 14h2.5v2.5H14z"/><path d="M20 14v6h-3.5"/>`,
  globe: `<circle cx="12" cy="12" r="8.4"/><path d="M3.6 12h16.8"/><path d="M12 3.6c2.2 2.3 3.4 5.2 3.4 8.4S14.2 18.1 12 20.4c-2.2-2.3-3.4-5.2-3.4-8.4S9.8 5.9 12 3.6z"/>`,
  help: `<circle cx="12" cy="12" r="8.4"/><path d="M9.8 9.5a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 1.8-2.2 3.3"/><path d="M12 17.1h.01"/>`,
  out: `<path d="M14.5 4.8H18a1.6 1.6 0 0 1 1.6 1.6v11.2a1.6 1.6 0 0 1-1.6 1.6h-3.5"/><path d="M9.6 8.4 6 12l3.6 3.6"/><path d="M6 12h8"/>`,
  more: `<circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none"/>`,
  upload: `<path d="M12 16.4V5.6"/><path d="m7.8 9.8 4.2-4.2 4.2 4.2"/><path d="M4.8 15.2v2.4a1.6 1.6 0 0 0 1.6 1.6h11.2a1.6 1.6 0 0 0 1.6-1.6v-2.4"/>`,
  sliders: `<path d="M4.4 8.4h15.2"/><path d="M4.4 15.6h15.2"/><circle cx="9.6" cy="8.4" r="2.2"/><circle cx="15" cy="15.6" r="2.2"/>`,
  grid: `<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>`,
  lock: `<rect x="5" y="10.6" width="14" height="9.4" rx="2.2"/><path d="M8.4 10.6V8.2a3.6 3.6 0 0 1 7.2 0v2.4"/>`,
  play: `<path d="M9.2 7.6 17 12l-7.8 4.4z"/>`,
  video: `<rect x="3.4" y="6" width="12.4" height="12" rx="2.4"/><path d="m16.2 11 4.4-2.6v7.2L16.2 13z"/>`,
  share: `<path d="M12 15.4V4.6"/><path d="m8.2 8.4 3.8-3.8 3.8 3.8"/><path d="M5.2 13.6v4.2a1.6 1.6 0 0 0 1.6 1.6h10.4a1.6 1.6 0 0 0 1.6-1.6v-4.2"/>`,
  userPlus: `<circle cx="10" cy="8" r="3.4"/><path d="M3.4 20.2c0-3.5 2.9-5.6 6.6-5.6"/><path d="M17.4 13.4v6"/><path d="M14.4 16.4h6"/>`,
  inbox: `<path d="M3.6 12.6h4l1.4 2.4h6l1.4-2.4h4"/><path d="M3.6 12.6 6.2 5.4h11.6l2.6 7.2v5.4a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6z"/>`,
  megaphone: `<path d="M4.4 10.2v3.6"/><path d="M8 8.6 18.6 5v14L8 15.4z"/><path d="M8 8.6H6.4a2 2 0 0 0-2 2v2.8a2 2 0 0 0 2 2H8z"/>`,
  checkCircle: `<circle cx="12" cy="12" r="8.4"/><path d="m8.4 12.2 2.6 2.6 4.6-5"/>`,
  playFill: `<path d="M9.2 7.4 17.4 12l-8.2 4.6z" fill="currentColor" stroke="none"/>`,
  hand: `<path d="M9 11.4V5.8a1.6 1.6 0 0 1 3.2 0v5.6"/><path d="M12.2 11V7.4a1.6 1.6 0 0 1 3.2 0v3.6"/><path d="M15.4 11.4V9.2a1.6 1.6 0 0 1 3.2 0v4.6c0 3.6-2.5 6.4-6.1 6.4s-6.1-2.8-6.1-6.4v-2.2a1.6 1.6 0 0 1 3.2 0"/>`,
  swap: `<path d="M4.6 8.6h11.8"/><path d="m13.4 5.6 3 3-3 3"/><path d="M19.4 15.4H7.6"/><path d="m10.6 12.4-3 3 3 3"/>`,
  mail: `<rect x="3.6" y="5.6" width="16.8" height="12.8" rx="2.2"/><path d="m4.6 7.4 7.4 5.4 7.4-5.4"/>`,
  filter: `<path d="M4 5.6h16l-6.2 7.3v5.5l-3.6 2v-7.5z"/>`,
  edit: `<path d="M4.6 19.4h3.2L18.4 8.8a2.26 2.26 0 0 0-3.2-3.2L4.6 16.2z"/><path d="m14.2 6.6 3.2 3.2"/>`,
  archive: `<rect x="3.6" y="4.4" width="16.8" height="4.4" rx="1.4"/><path d="M5.2 8.8v9a1.8 1.8 0 0 0 1.8 1.8h10a1.8 1.8 0 0 0 1.8-1.8v-9"/><path d="M10 12.4h4"/>`,
  quote: `<path d="M9.4 6.6C7 7.8 5.6 10 5.6 12.8c0 2.4 1.4 4 3.4 4s3.2-1.4 3.2-3.2-1.2-3-2.8-3c-.4 0-.8.1-1 .2.2-1.5 1.2-2.8 2.6-3.6z" fill="currentColor" stroke="none"/><path d="M18 6.6c-2.4 1.2-3.8 3.4-3.8 6.2 0 2.4 1.4 4 3.4 4s3.2-1.4 3.2-3.2-1.2-3-2.8-3c-.4 0-.8.1-1 .2.2-1.5 1.2-2.8 2.6-3.6z" fill="currentColor" stroke="none"/>`,
  offline: `<path d="M4.4 8.6a11 11 0 0 1 4.4-2.5"/><path d="M15.4 6.3a11 11 0 0 1 4.2 2.3"/><path d="M7.4 12.2a7 7 0 0 1 2.3-1.3"/><path d="M14.5 11a7 7 0 0 1 2.1 1.2"/><path d="M12 18.4h.01"/><path d="m3.4 3.4 17.2 17.2"/>`,
};

export const label = (t) =>
  `<div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.ink3};">${t}</div>`;

export const card = (inner, extra = '') =>
  `<div style="background:${C.surface};border:1px solid ${C.line};border-radius:${R.card}px;${extra}">${inner}</div>`;

export const pill = (t, bg, fg, extra = '') =>
  `<span style="display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:${bg};color:${fg};font-size:11px;font-weight:700;letter-spacing:0.02em;${extra}">${t}</span>`;

export const av = (t, size = 40, bg = C.accentTint, fg = C.accent, radius = 999) =>
  `<div style="width:${size}px;height:${size}px;flex:0 0 ${size}px;border-radius:${radius}px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.32)}px;font-weight:700;letter-spacing:0.02em;">${t}</div>`;

export const sq = (t, size = 44, bg = C.accentTint, fg = C.accent) => av(t, size, bg, fg, 12);

export const btn = (t, { kind = 'primary', h = 48, icon = null, grow = true } = {}) => {
  const styles = {
    primary: `background:${C.accent};color:#FFFFFF;border:1px solid ${C.accent};`,
    ghost: `background:${C.surface};color:${C.ink};border:1px solid ${C.line};`,
    outlineAccent: `background:${C.surface};color:${C.accent};border:1px solid ${C.accent};`,
    disabled: `background:${C.disabled};color:${C.disabledInk};border:1px solid ${C.disabled};`,
  };
  return `<div style="display:flex;align-items:center;justify-content:center;gap:8px;${grow ? 'flex:1 1 0;' : ''}height:${snapH(h)}px;border-radius:${R.input}px;${styles[kind]}font-size:${T.lg}px;font-weight:600;">${icon ? svg(icon, 18) : ''}<span>${t}</span></div>`;
};

export const chev = (color = C.ink3) => `<span style="color:${color};display:flex;">${svg(I.chevR, 18, 1.9)}</span>`;

export const iconBtn = (icon, extra = '') =>
  `<div style="width:40px;height:40px;flex:0 0 40px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center;color:${C.ink};${extra}">${svg(icon, 19)}</div>`;

export const chip = (t, active = false) =>
  `<span style="display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;${active ? `background:${C.accent};color:#FFFFFF;` : `background:${C.surface};color:${C.ink2};border:1px solid ${C.line};`}">${t}</span>`;

export const phone = (inner) =>
  `<div style="width:390px;height:844px;background:${C.bg};display:flex;flex-direction:column;">${inner}</div>`;

/** Content region for a screen that already has a topbar above it. */
export const bodyPushed = (inner) =>
  `<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:18px;padding:20px 20px 0;">${inner}</div>`;

export const body = (inner, pad = 20, top = 54) =>
  `<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:18px;padding:${top}px ${pad}px 0;">${inner}</div>`;

export const topbar = (title, right = '') => `
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.chevL)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">${title}</div>
  ${right}
</div>`;

const navBar = (items, active) =>
  `<div style="display:flex;border-top:1px solid ${C.line};background:${C.surfaceAlt};padding:9px 4px 20px;">${items
    .map(([t, ic]) => {
      const on = t === active;
      return `<div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:5px;color:${on ? C.accent : C.ink3};"><span style="display:flex;">${svg(ic, 22, on ? 2 : 1.7)}</span><span style="font-size:10px;font-weight:${on ? 700 : 600};letter-spacing:0.01em;">${t}</span></div>`;
    })
    .join('')}</div>`;

/** Public shell: no account required. */
export const navGuest = (active) =>
  navBar([['Home', I.home], ['Sermons', I.video], ['Service', I.cal], ['Join', I.userPlus]], active);

/**
 * Signed-in shell. Four tabs, and the first two are the SAME as the guest
 * shell: signing in must never take away the sermon library or the service
 * time - the two things people open every week. Serving and People are
 * reached from Home, because a duty happens twice a month and a directory
 * lookup is rarer still. A tab is for what you open weekly.
 */
export const navMember = (active) =>
  navBar([['Home', I.home], ['Sermons', I.video], ['Groups', I.group], ['Me', I.user]], active);

/**
 * Standing in THIS church. registered | community | guest, plus `external` -
 * which is not a rank on the ladder but the absence of any standing here: a
 * guest speaker or visiting volunteer who can still be scheduled.
 */
export const tierPill = (t) => {
  if (t === 'registered') return pill('Registered Member', C.sageTint, C.sage);
  if (t === 'community') return pill('Community Member', C.accentTint, C.accent);
  if (t === 'external') return pill('Not on our roll', 'transparent', C.ink3, `border:1px dashed ${C.ink3};`);
  return pill('Guest', C.bg, C.ink3, `border:1px solid ${C.line};`);
};

/** Avatar for someone with no record at this church - dashed, deliberately unlike a member. */
export const avExternal = (t, size = 40) =>
  `<div style="width:${size}px;height:${size}px;flex:0 0 ${size}px;border-radius:${size}px;background:transparent;border:1.5px dashed ${C.ink3};color:${C.ink3};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.32)}px;font-weight:700;letter-spacing:0.02em;">${t}</div>`;

export const lockPill = (t = 'Registered only') =>
  `<span style="display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:999px;border:1px dashed ${C.ink3};color:${C.ink3};font-size:10px;font-weight:700;">${svg(I.lock, 12, 2)}<span>${t}</span></span>`;

/** Typographic poster stand-in - no photography, deliberately flat. */
export const poster = (w, h, kicker, title, sub, footer) => `
<div style="width:${w}px;height:${h}px;flex:0 0 ${w}px;border-radius:14px;background:${C.accentDark};color:#F7EFE7;padding:20px;display:flex;flex-direction:column;overflow:hidden;">
  <div style="font-size:10px;font-weight:700;letter-spacing:0.18em;">${kicker}</div>
  <div style="flex:1 1 auto;"></div>
  <div style="font-family:${SERIF};font-size:27px;font-weight:500;line-height:1.05;letter-spacing:-0.01em;">${title}</div>
  <div style="width:38px;height:2px;background:#F7EFE7;opacity:0.55;margin:13px 0 10px;"></div>
  <div style="font-size:12px;line-height:1.45;opacity:0.86;">${sub}</div>
  <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;opacity:0.6;margin-top:11px;">${footer}</div>
</div>`;

export const posterMini = (w, h, kicker, title) => `
<div style="width:${w}px;height:${h}px;flex:0 0 ${w}px;border-radius:6px;background:${C.accentDark};color:#F7EFE7;padding:8px;display:flex;flex-direction:column;overflow:hidden;">
  <div style="font-size:8px;font-weight:700;letter-spacing:0.14em;opacity:0.75;">${kicker}</div>
  <div style="flex:1 1 auto;"></div>
  <div style="font-family:${SERIF};font-size:11px;font-weight:500;line-height:1.1;">${title}</div>
</div>`;

/** Video still stand-in for a recorded sermon. */
export const thumb = (w, h, kicker, tone) => `
<div style="width:${w}px;height:${h}px;flex:0 0 ${w}px;border-radius:12px;background:${tone};color:#F7EFE7;padding:9px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;">
  <div style="font-size:8px;font-weight:700;letter-spacing:0.13em;opacity:0.75;">${kicker}</div>
  <div style="width:26px;height:26px;border-radius:999px;background:#F7EFE7;color:${tone};display:flex;align-items:center;justify-content:center;">${svg(I.playFill, 15, 0)}</div>
</div>`;

export const TONES = ['#2E2823', '#8E4224', '#3D5142', '#4A4038'];

export const dateBlock = (dow, d, muted = false) => {
  const bg = muted ? C.bg : C.accentTint;
  const fg = muted ? C.ink3 : C.accent;
  return `<div style="width:50px;flex:0 0 50px;border-radius:12px;background:${bg};color:${fg};padding:7px 0;text-align:center;"><div style="font-size:10px;font-weight:700;letter-spacing:0.07em;">${dow}</div><div style="font-family:${SERIF};font-size:20px;font-weight:600;line-height:1.1;margin-top:1px;">${d}</div></div>`;
};

/**
 * Decorative QR stand-in. Deterministic so it never changes between builds.
 * Not a scannable code - it stands in for one.
 */
export const qrBlock = (px, tone = C.ink, bg = '#FFFFFF') => {
  const n = 21;
  const cell = px / n;
  const finder = (i, j, oi, oj) =>
    i >= oi && i < oi + 7 && j >= oj && j < oj + 7 &&
    (i === oi || i === oi + 6 || j === oj || j === oj + 6 ||
      (i >= oi + 2 && i <= oi + 4 && j >= oj + 2 && j <= oj + 4));
  let rects = '';
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let on;
      if (i < 8 && j < 8) on = finder(i, j, 0, 0);
      else if (i < 8 && j >= n - 8) on = finder(i, j, 0, n - 7);
      else if (i >= n - 8 && j < 8) on = finder(i, j, n - 7, 0);
      else on = ((i * 31 + j * 17 + i * j * 7) % 11) < 5;
      if (on) rects += `<rect x="${(j * cell).toFixed(2)}" y="${(i * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${tone}"/>`;
    }
  }
  return `<svg width="${px}" height="${px}" viewBox="0 0 ${px} ${px}" style="display:block;background:${bg};">${rects}</svg>`;
};

/** Church identity row - the tenant, not a person. */
export const churchRow = (init, name, meta, right = '') =>
  `<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${sq(init, 44)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:700;line-height:1.3;">${name}</div><div style="font-size:12px;color:${C.ink2};margin-top:3px;">${meta}</div></div>
    ${right}
  </div>`;

export const infoRow = (icon, primary, secondary = '') =>
  `<div style="display:flex;align-items:flex-start;gap:10px;padding:13px 14px;"><span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(icon, 18)}</span><div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;line-height:1.35;">${primary}</div>${secondary ? `<div style="font-size:12px;color:${C.ink2};margin-top:3px;line-height:1.4;">${secondary}</div>` : ''}</div></div>`;

export const rows = (arr) =>
  arr.map((r, i) => `<div style="${i ? `border-top:1px solid ${C.lineSoft};` : ''}">${r}</div>`).join('');

export const row = (left, title, meta, right = chev(), padY = 13) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:${padY}px 14px;">${left}<div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;line-height:1.3;">${title}</div>${meta ? `<div style="font-size:12px;color:${C.ink2};margin-top:3px;line-height:1.3;">${meta}</div>` : ''}</div>${right}</div>`;

export const field = (lab, value, { hint = '', tag = '', placeholder = false, right = '', prefix = '' } = {}) => `
<div style="display:flex;flex-direction:column;gap:7px;">
  <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:12px;font-weight:700;color:${C.ink2};">${lab}</span>${tag ? `<span style="font-size:11px;font-weight:600;color:${C.ink3};">${tag}</span>` : ''}</div>
  <div style="display:flex;align-items:center;gap:10px;height:52px;padding:0 14px;background:${C.surface};border:1px solid ${C.line};border-radius:${R.input}px;">
    ${prefix ? `<span style="font-size:15px;font-weight:600;color:${C.ink2};">${prefix}</span><span style="width:1px;height:22px;background:${C.line};"></span>` : ''}
    <span style="flex:1 1 auto;font-size:15px;font-weight:${placeholder ? 400 : 600};color:${placeholder ? C.ink3 : C.ink};">${value}</span>${right}
  </div>
  ${hint ? `<div style="font-size:11px;color:${C.ink3};line-height:1.4;">${hint}</div>` : ''}
</div>`;

export const stack = (initials) =>
  `<div style="display:flex;">${initials
    .map((t, i) => `<div style="width:26px;height:26px;border-radius:999px;background:${C.accentTint};color:${C.accent};border:2px solid ${C.surface};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;${i ? 'margin-left:-8px;' : ''}">${t}</div>`)
    .join('')}</div>`;

export const iconAv = (icon, bg, fg, size = 34) =>
  `<div style="width:${size}px;height:${size}px;flex:0 0 ${size}px;border-radius:999px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;">${svg(icon, 17)}</div>`;

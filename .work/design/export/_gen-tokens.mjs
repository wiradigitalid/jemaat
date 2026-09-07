import { C } from '../lib.mjs';
import { writeFileSync } from 'node:fs';

/*
 * Emits tokens.css from the canvas palette so the two can never drift.
 * Re-run after any change to C in lib.mjs:  node export/_gen-tokens.mjs
 */

const hex2hsl = (hex) => {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const r1 = (x) => Math.round(x * 10) / 10;
  return `${r1(h)} ${r1(s * 100)}% ${r1(l * 100)}%`;
};

const map = [
  ['background', C.bg, 'page ground'],
  ['foreground', C.ink, 'body text'],
  ['card', C.surface, 'raised surface'],
  ['card-foreground', C.ink, ''],
  ['popover', C.surface, 'dropdowns, command palette'],
  ['popover-foreground', C.ink, ''],
  ['primary', C.accent, 'the only saturated action colour'],
  ['primary-foreground', '#FFFFFF', ''],
  ['secondary', C.accentTint, 'tinted chips, quiet actions'],
  ['secondary-foreground', C.accentDark, ''],
  ['muted', C.lineSoft, 'inert fills, table stripes'],
  ['muted-foreground', C.ink3, 'meta text, placeholders'],
  ['accent', C.accentTint, 'hover and highlight rows'],
  ['accent-foreground', C.accent, ''],
  ['destructive', C.accentDark, 'NOT red - see design-system.md'],
  ['destructive-foreground', '#FFFFFF', ''],
  ['border', C.line, 'the only depth cue in the product'],
  ['input', C.line, ''],
  ['ring', C.accent, 'focus ring'],
  ['success', C.sage, 'added token, not stock shadcn'],
  ['success-foreground', '#FFFFFF', ''],
  ['success-muted', C.sageTint, ''],
  ['warning', C.amber, 'added token - errors use this, never red'],
  ['warning-foreground', '#FFFFFF', ''],
  ['warning-muted', C.amberTint, ''],
  ['surface-alt', C.surfaceAlt, 'added token - page headers, toolbars'],
  ['ink-2', C.ink2, 'added token - secondary prose'],
  ['disabled', C.disabled, 'added token'],
  ['disabled-foreground', C.disabledInk, 'added token'],
  ['sidebar', C.surfaceAlt, ''],
  ['sidebar-foreground', C.ink, ''],
  ['sidebar-primary', C.accent, ''],
  ['sidebar-primary-foreground', '#FFFFFF', ''],
  ['sidebar-accent', C.accentTint, ''],
  ['sidebar-accent-foreground', C.accent, ''],
  ['sidebar-border', C.line, ''],
  ['sidebar-ring', C.accent, ''],
];

const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
const hexBlock = map
  .map(([k, v, note]) => `  ${pad('--' + k + ':', 32)}${pad(v + ';', 11)}${note ? '/* ' + note + ' */' : ''}`)
  .join('\n');
const hslBlock = map.map(([k, v]) => `  ${pad('--' + k + ':', 32)}${hex2hsl(v)};`).join('\n');
const themeInline = map
  .filter(([k]) => k !== 'disabled' && k !== 'disabled-foreground')
  .map(([k]) => `  --color-${k}: var(--${k});`)
  .join('\n');

const css = `/* ============================================================================
   JEMAAT DESIGN TOKENS
   Generated from .work/design/lib.mjs, the source of truth for the design
   canvas. Do not hand-edit: change lib.mjs and re-run export/_gen-tokens.mjs.

   Three rules cannot be expressed as tokens, and stock shadcn/ui breaks all
   three by default:
     1. NO SHADOWS. Depth is a 1px border plus a cream-to-white surface step.
     2. NO RED. Errors and warnings use --warning (amber). Destructive
        actions use --destructive, the accent darkened, never a new hue.
     3. Light only, deliberately. See the dark-mode note at the foot.
   ============================================================================ */

/* --- Tailwind v4 / current shadcn: hex values used directly --------------- */
:root {
${hexBlock}

  /* Radii. lib.mjs R = { mark: 6, input: 12, card: 14, pill: 999 }.
     --radius drives shadcn rounded-lg/md/sm, so it carries the control
     radius and Card keeps its own. */
  --radius:                       0.75rem;   /* 12px inputs, buttons, chips */
  --radius-card:                  0.875rem;  /* 14px Card only */
  --radius-mark:                  0.375rem;  /* 6px  checkboxes, tiny marks */
}

@theme inline {
${themeInline}

  --font-sans: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
  --font-serif: "Newsreader", Georgia, "Times New Roman", serif;

  /* Type scale from lib.mjs T. Every size on 94 artboards is one of these. */
  --text-micro: 0.5625rem;  /*  9 */
  --text-tiny:  0.625rem;   /* 10 */
  --text-xs:    0.6875rem;  /* 11 */
  --text-sm:    0.75rem;    /* 12 */
  --text-base:  0.8125rem;  /* 13  the real body size */
  --text-md:    0.875rem;   /* 14 */
  --text-lg:    0.9375rem;  /* 15 */
  --text-xl:    1.0625rem;  /* 17  phone body minimum */
  --text-d1:    1.25rem;    /* 20  display */
  --text-d2:    1.5rem;     /* 24  display */
  --text-d3:    1.6875rem;  /* 27  display */
  --text-d4:    2.125rem;   /* 34  display, sheet titles only */

  /* Control heights. Anything else snaps DOWN to the nearest of these. */
  --size-control-xs:  2.125rem; /* 34 */
  --size-control-sm:  2.5rem;   /* 40 */
  --size-control-md:  2.75rem;  /* 44  desktop input and button default */
  --size-control-lg:  3rem;     /* 48  primary action, phone default */
  --size-control-xl:  3.25rem;  /* 52  phone input */
  --size-control-2xl: 3.5rem;   /* 56 */

  /* Spacing, derived from what the artboards use rather than decided up
     front - S6 flags this as the one axis never systematised. Enforce it in
     code or it drifts back to 39 values, which happened to the type scale
     twice. */
  --spacing-1: 0.25rem;  /*  4 */
  --spacing-2: 0.5rem;   /*  8 */
  --spacing-3: 0.75rem;  /* 12 */
  --spacing-4: 1rem;     /* 16 */
  --spacing-5: 1.25rem;  /* 20 */
  --spacing-6: 1.5rem;   /* 24 */
  --spacing-8: 2rem;     /* 32 */
  --spacing-10: 2.5rem;  /* 40 */
}

/* --- Tailwind v3 / older shadcn: the same values as HSL triplets ----------
   Uncomment this and delete the hex :root above if your stack expects
   "H S% L%" without a colour function.

:root {
${hslBlock}
  --radius: 0.75rem;
}
--------------------------------------------------------------------------- */

/* --- Base layer: the parts stock shadcn gets wrong ----------------------- */
@layer base {
  * { border-color: var(--border); }

  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    -webkit-font-smoothing: antialiased;
    text-wrap: pretty;
  }

  /* Rule 1, enforced. Prefer deleting the utility, but keep the guard: one
     stray shadow-sm and the product looks like every other admin panel. */
  .shadow-sm, .shadow, .shadow-md, .shadow-lg, .shadow-xl { box-shadow: none !important; }

  h1, h2, h3, .font-display {
    font-family: var(--font-serif);
    font-weight: 500;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  /* Uppercase micro-labels carry letter-spacing everywhere on the canvas. */
  .label-eyebrow {
    font-size: var(--text-tiny);
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  /* Digits that line up in columns: counts, ages, dates in tables. */
  .tabular { font-variant-numeric: tabular-nums; }
}

/* --- DARK MODE IS NOT DESIGNED ------------------------------------------
   S6 committed to one palette: no shadows, a 1px line plus a cream-to-white
   step, chosen to survive a cheap Android screen in daylight. None of the 94
   artboards has a dark counterpart.

   Below is a mechanical inversion so a stock shadcn dark toggle does not
   render unreadable text. It has had NO design pass: accent contrast on a
   dark ground is unverified and the tints are guesses. Either drop the
   toggle for the first release, or budget a pass before shipping it.
   ----------------------------------------------------------------------- */
.dark {
  --background: #1A1613;
  --foreground: #F2EBE3;
  --card: #221D19;
  --card-foreground: #F2EBE3;
  --popover: #221D19;
  --popover-foreground: #F2EBE3;
  --primary: #D9784F;
  --primary-foreground: #1A1613;
  --secondary: #33291F;
  --secondary-foreground: #E8C6B4;
  --muted: #2A2420;
  --muted-foreground: #A79A8E;
  --accent: #33291F;
  --accent-foreground: #D9784F;
  --destructive: #C25A33;
  --destructive-foreground: #1A1613;
  --border: #362E27;
  --input: #362E27;
  --ring: #D9784F;
  --success: #7FA487;
  --success-muted: #232E25;
  --warning: #C79A44;
  --warning-muted: #322818;
  --surface-alt: #1F1A16;
  --ink-2: #C3B7AB;
}
`;

writeFileSync(new URL('./tokens.css', import.meta.url), css, 'utf8');
console.log('wrote tokens.css');
console.log('checks: background', hex2hsl(C.bg), '| primary', hex2hsl(C.accent), '| border', hex2hsl(C.line));

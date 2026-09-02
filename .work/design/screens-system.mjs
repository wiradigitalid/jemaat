import { C, SERIF, doc, svg, I, card, label, T, R } from './lib.mjs';

/*
 * THE DESIGN SYSTEM AS A SPEC, NOT AS SOURCE.
 *
 * The tokens exist in lib.mjs, which is useless to the person writing
 * Flutter. This is the same values in the form a build needs: what each
 * colour is FOR, the type ramp with roles, the component anatomy, and
 * the one rule that no phone screen may break.
 *
 * One honest gap is named rather than hidden: spacing was never
 * systematised across the 62 artboards. The scale here is derived from
 * what the screens actually use, and it needs enforcing in code because
 * the design did not enforce it.
 */
export const sys = {};

const swatch = (hex, name, role) => `
<div style="display:flex;align-items:center;gap:13px;padding:9px 16px;">
  <div style="width:34px;height:34px;flex:0 0 34px;border-radius:12px;background:${hex};border:1px solid ${C.line};"></div>
  <div style="width:104px;flex:0 0 104px;font-size:12px;font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${hex}</div>
  <div style="width:96px;flex:0 0 96px;font-size:12px;font-weight:600;">${name}</div>
  <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.45;">${role}</div>
</div>`;

const typeRow = (px, sample, role) => `
<div style="display:flex;align-items:baseline;gap:14px;padding:8px 16px;">
  <div style="width:40px;flex:0 0 40px;font-size:11px;font-weight:700;color:${C.ink3};font-family:ui-monospace,monospace;">${px}</div>
  <div style="width:190px;flex:0 0 190px;font-size:${px}px;font-weight:600;line-height:1.25;">${sample}</div>
  <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.45;">${role}</div>
</div>`;

const spec = (k, v, note) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:8px 16px;">
  <div style="width:118px;flex:0 0 118px;font-size:11px;font-weight:700;">${k}</div>
  <div style="width:112px;flex:0 0 112px;font-size:11px;font-family:ui-monospace,monospace;color:${C.accent};">${v}</div>
  <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.45;">${note}</div>
</div>`;

sys['System.dc.html'] = doc(`
<div style="width:1440px;height:1180px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The system, as a build spec</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">Same values as the canvas, in the form a build needs. Flutter wants a ThemeData, React wants custom properties, and neither wants to read a JavaScript file to find out what a colour is for.</div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:472px;flex:0 0 472px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('Palette &middot; eleven, and no twelfth')}</div>
        ${swatch(C.bg, 'bg', 'Every page. Never white - white reads as a form, cream reads as paper')}
        ${swatch(C.surface, 'surface', 'Cards and inputs only. The contrast with bg IS the card')}
        ${swatch(C.ink, 'ink', 'All primary text')}
        ${swatch(C.ink2, 'ink2', 'Secondary lines, meta, body copy inside cards')}
        ${swatch(C.ink3, 'ink3', 'Labels, hints, disabled, dashed borders')}
        ${swatch(C.line, 'line', 'Card borders and dividers between sections')}
        ${swatch(C.lineSoft, 'lineSoft', 'Dividers INSIDE a card. Softer on purpose')}
        ${swatch(C.accent, 'accent', 'One action per screen, links, the current tab')}
        ${swatch(C.accentDark, 'accentDark', 'Destructive only - sign out, remove, close a church')}
        ${swatch(C.sage, 'sage', 'Confirmed, present, verified. Never decorative')}
        ${swatch(C.amber, 'amber', 'Needs a person. Never an error - errors get amber too, not red')}
        <div style="padding:11px 16px;border-top:1px solid ${C.line};font-size:11px;color:${C.ink2};line-height:1.55;">Tints are the same hues at roughly 8 per cent: <span style="font-family:ui-monospace,monospace;">accentTint ${C.accentTint} &middot; sageTint ${C.sageTint} &middot; amberTint ${C.amberTint}</span>. There is no red in this product. A church app has bad news in it, and bad news should not look like a system failure.</div>`)}
    </div>

    <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 16px 6px;">${label('Type &middot; Plus Jakarta Sans, and Newsreader for display')}</div>
        ${typeRow(T.d3, 'Saturday, 14 March', 'Screen title. Newsreader 500, tracking -0.01em')}
        ${typeRow(T.d1, 'Anugerah &middot; Wed 19.30', 'Card title. Newsreader')}
        ${typeRow(T.xl, 'Media team', 'Emphasis inside a card. Sans 700')}
        ${typeRow(T.lg, 'Save attendance', 'Buttons, input values')}
        ${typeRow(T.md, 'Budi Halim', 'Row titles - the most used size in the product')}
        ${typeRow(T.base, 'Halim household &middot; Sunter', 'Body copy and row meta')}
        ${typeRow(T.sm, 'Said going', 'Secondary meta, hints under a field')}
        ${typeRow(T.xs, 'YOUR CARE GROUP', 'Section labels. 700, uppercase, tracking 0.1em')}
        <div style="padding:11px 16px;border-top:1px solid ${C.line};font-size:11px;color:${C.ink2};line-height:1.55;">Fallbacks matter more than the webfonts: <span style="font-family:ui-monospace,monospace;">Georgia</span> for Newsreader, <span style="font-family:ui-monospace,monospace;">Segoe UI / system-ui</span> for Jakarta. On a cheap Android over a weak connection the fallback is what most people will actually read, and the metrics are close enough that the layout does not move.</div>`)}

      ${card(`
        <div style="padding:15px 16px 6px;">${label('Geometry')}</div>
        ${spec('Radius', `${R.card} / ${R.input} / ${R.mark} / 999`, 'Cards / controls and inputs / small marks and tags / pills and avatars. Four values, no fifth')}
        ${spec('Control height', '44 48 52 56', 'Nothing between. 44 is the floor and it is also the tap-target floor')}
        ${spec('Tap target', 'min 44px', 'The one rule no phone screen may break, including rows that only look like text')}
        ${spec('Page margin', '20px', 'Both edges, every mobile screen')}
        ${spec('Section gap', '18px', 'Between the blocks on a screen')}
        ${spec('Label to card', '9px', 'A label belongs to the thing under it, so it sits closer than the section gap')}
        ${spec('Card padding', '14 / 16px', 'Rows use 14, prose blocks use 16')}
        ${spec('Icons', '16 / 18 / 22px', 'Inline with text / in a row / in a tab bar. Stroke 1.7, never filled')}
        <div style="padding:11px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
          <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 16)}</span>
          <span style="font-size:11px;color:${C.ink2};line-height:1.55;"><span style="font-weight:700;">An honest gap.</span> Spacing was never systematised across the 62 artboards the way colour and type were. The scale above is derived from what the screens actually use, and it needs enforcing in code &mdash; because the design did not enforce it, and iteration 13 measured what that costs: 32 font sizes before anyone counted.</span>
        </div>`, 'border-color:#9A722344;')}
    </div>

    <div style="width:380px;flex:0 0 380px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('Component anatomy')}</div>
        <div style="padding:0 16px 14px;font-size:11px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">Card</span> &mdash; surface, 1px line, radius 14. Sections inside are divided by lineSoft, never by a gap. A card with an accent border is the one thing on the screen that matters.<br><br>
          <span style="font-weight:700;color:${C.ink};">Row</span> &mdash; avatar or icon, then title over meta, then a chevron if it leads somewhere. No chevron means it does not. That rule is never broken.<br><br>
          <span style="font-weight:700;color:${C.ink};">Pill</span> &mdash; 24px, radius 999, 700 weight, 11px. Tinted background carries meaning; a 1px line means neutral. Dashed means not on our roll.<br><br>
          <span style="font-weight:700;color:${C.ink};">Button</span> &mdash; accent fill for the one action, surface with a line for the alternative, accent outline for a third. Two side by side maximum.<br><br>
          <span style="font-weight:700;color:${C.ink};">Avatar</span> &mdash; initials, accentTint on accent. A DASHED avatar is a person with no standing here, and that distinction is load-bearing in five screens.<br><br>
          <span style="font-weight:700;color:${C.ink};">Tab bar</span> &mdash; four tabs, 22px icons, 10px labels, top line, 20px bottom safe area. Never five.
        </div>`)}
      <div style="height:20px;"></div>
      ${card(`<div style="padding:16px;display:flex;align-items:flex-start;gap:11px;">
        <span style="color:${C.accent};display:flex;padding-top:1px;">${svg(I.lock, 18)}</span>
        <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.6;">No shadows anywhere in 62 artboards. Depth is carried by a 1px line and a cream-to-white step, which survives a cheap screen in daylight better than a shadow does &mdash; and looks the same on both platforms without tuning.</div>
      </div>`, 'border-color:#B4562F55;')}
    </div>
  </div>
</div>`);

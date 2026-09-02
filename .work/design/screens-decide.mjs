import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE ONE DECISION THAT SHAPES THE PILOT.
 *
 * Iteration 23 found that the staging question and the warta question
 * are the same question. This sheet exists so it can be settled by
 * looking rather than arguing: the two versions of a member's week,
 * side by side, with the honest cost underneath.
 *
 * The finding that decides it: W8 is ALREADY in R0, and W8 already
 * collects the announcements. The office is already doing the typing.
 * The question is not whether to build a feature - it is whether to
 * show data the product is already gathering.
 */
export const decide = {};

const day = (d, what, tone = 'on') => `
<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 18px;">
  <span style="width:34px;flex:0 0 34px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${tone === 'off' ? C.line : C.ink3};">${d}</span>
  <span style="flex:1 1 auto;font-size:13px;line-height:1.5;color:${tone === 'off' ? C.ink3 : C.ink};${tone === 'off' ? 'font-style:italic;' : ''}">${what}</span>
</div>`;

const stat = (n, t) => `
<div style="display:flex;align-items:baseline;gap:12px;padding:14px 18px;border-top:1px solid ${C.lineSoft};">
  <span style="font-family:${SERIF};font-size:27px;font-weight:600;">${n}</span>
  <span style="flex:1 1 auto;font-size:13px;color:${C.ink2};line-height:1.45;">${t}</span>
</div>`;

const col = (tag, title, sub, days, statN, statT, proves, accent) => `
${card(`
  <div style="padding:18px 18px 14px;border-bottom:1px solid ${C.lineSoft};">
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:6px;background:${accent ? C.accentTint : C.bg};color:${accent ? C.accent : C.ink3};font-size:11px;font-weight:700;">${tag}</span>
      <span style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;">${title}</span>
    </div>
    <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.5;">${sub}</div>
  </div>
  <div style="padding:6px 0;">${days}</div>
  ${stat(statN, statT)}
  <div style="padding:14px 18px;border-top:1px solid ${C.lineSoft};background:${C.bg};">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">WHAT THE PILOT THEN PROVES</div>
    <div style="font-size:13px;color:${C.ink};margin-top:8px;line-height:1.55;font-weight:600;">${proves}</div>
  </div>`, accent ? 'border-color:#B4562F55;overflow:hidden;' : 'overflow:hidden;')}`;

decide['Decision.dc.html'] = doc(`
<div style="width:1440px;height:940px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:20px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">One decision, and it shapes the pilot</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:820px;">The staging question and the warta question turned out to be the same question. Here are both answers as an ordinary member would live them &mdash; not a leader, not a host, not the office. The person the pilot is actually about.</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="flex:1 1 0;min-width:0;">
      ${col('M28', 'Without the warta', 'R0 exactly as staged in iteration 22.', `
        ${day('TUE', 'Nothing.', 'off')}
        ${day('WED', 'Taps Going. Two seconds.')}
        ${day('THU', 'Nothing.', 'off')}
        ${day('FRI', 'Nothing.', 'off')}
        ${day('SAT', 'Goes to church. The app played no part.', 'off')}
      `, '1', 'opening a week, for about two seconds', 'Whether LEADERS keep marking attendance for three months. A fair question, and a cheaper release &mdash; but not the question anyone thinks they are asking.', false)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${col('M29', 'With the warta', 'The same twelve screens, plus M20 and one row on Home.', `
        ${day('TUE', 'Nothing.', 'off')}
        ${day('WED', 'Taps Going. Two seconds.')}
        ${day('THU', 'The week lands. Reads three announcements, sees who is speaking Saturday.')}
        ${day('FRI', 'A birthday. Sends Melisa a greeting in one tap.')}
        ${day('SAT', 'Checks the time and the speaker on the way.')}
      `, '4', 'openings a week, one of which reaches another member', 'Whether a CONGREGATION adopts it. That is what a pilot is for, and it is the only version that makes R1 launch into an installed base rather than a cold start.', true)}
    </div>
  </div>

  ${card(`<div style="padding:20px 22px;display:flex;align-items:flex-start;gap:16px;">
    <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 22)}</span>
    <div style="flex:1 1 auto;">
      <div style="font-size:15px;font-weight:700;">The cost is one mobile screen, not a module</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:9px;line-height:1.6;max-width:1080px;">W8 is already in R0, and W8 already collects the announcements, the speaker and the sermon link &mdash; the office is already doing the typing either way. The question was never whether to build a feature. It is whether to show data the product is already gathering.<br><br><span style="font-weight:700;color:${C.ink};">Recommendation: take it.</span> Unless the pilot&rsquo;s real purpose is to test whether leaders sustain attendance-taking &mdash; in which case the left-hand column is the correct instrument and should be chosen deliberately, not by omission.</div>
    </div>
  </div>`, 'border-color:#B4562F55;')}
</div>`);

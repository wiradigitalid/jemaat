import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE SECOND OPEN DECISION - M23, THE NOTICING PROMPT.
 *
 * The warta decision was about cost, so it could be settled by looking
 * at a member's week. This one cannot: the same screen is pastoral care
 * in one church and surveillance in another, and the difference is not
 * in the pixels.
 *
 * So the sheet is shaped differently. It separates what the DESIGN
 * enforces - which is real, and more than most church software does -
 * from what only a congregation's culture can hold. Then it offers a
 * third option that neither of the earlier arguments had noticed: ship
 * the capability, never the assumption.
 */
export const decide2 = {};

const can = (t) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:8px 18px;">
  <span style="color:${C.sage};display:flex;padding-top:2px;">${svg(I.check, 15, 2.4)}</span>
  <span style="flex:1 1 auto;font-size:13px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

const cannot = (t) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:8px 18px;">
  <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.x, 14, 2.4)}</span>
  <span style="flex:1 1 auto;font-size:13px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

const option = (tag, title, sub, rows, verdict, accent) => `
${card(`
  <div style="padding:18px 18px 14px;border-bottom:1px solid ${C.lineSoft};">
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;background:${accent ? C.accent : C.bg};color:${accent ? '#FFFFFF' : C.ink3};font-size:12px;font-weight:700;">${tag}</span>
      <span style="font-family:${SERIF};font-size:20px;font-weight:500;letter-spacing:-0.01em;">${title}</span>
    </div>
    <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.5;">${sub}</div>
  </div>
  <div style="padding:8px 0;">${rows}</div>
  <div style="padding:14px 18px;border-top:1px solid ${C.lineSoft};background:${C.bg};">
    <div style="font-size:13px;line-height:1.55;font-weight:600;">${verdict}</div>
  </div>`, accent ? 'border-color:#B4562F55;overflow:hidden;' : 'overflow:hidden;')}`;

const line = (t) => `<div style="padding:7px 18px;font-size:12px;color:${C.ink2};line-height:1.5;">${t}</div>`;

decide2['Decision2.dc.html'] = doc(`
<div style="width:1440px;height:980px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The noticing prompt</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:900px;">The warta question was about cost, so a member&rsquo;s week could settle it. This one cannot. The same screen is pastoral care in one church and surveillance in another, and the difference is not in the pixels &mdash; so the only honest place to start is what the design can actually hold, and what it cannot.</div>
  </div>

  <div style="display:flex;gap:20px;">
    <div style="flex:1 1 0;">
      ${card(`
        <div style="padding:16px 18px 10px;">${label('The design enforces this')}</div>
        ${can('It reaches one leader. There is no list view, anywhere, for anyone.')}
        ${can('No count, no percentage, no score - not on this screen and not in the data model behind it.')}
        ${can('No status changes automatically. Only the office marks anyone Inactive, after talking to them.')}
        ${can('Dismissing it costs nothing and records nothing, and it does not travel to the next leader (W9).')}
        <div style="height:8px;"></div>`)}
    </div>
    <div style="flex:1 1 0;">
      ${card(`
        <div style="padding:16px 18px 10px;">${label('The design cannot')}</div>
        ${cannot('Stop a pastor asking leaders to forward the names. No product can police a WhatsApp message.')}
        ${cannot('Decide why attendance is being taken. The same tick means care in one church and control in another.')}
        ${cannot('Make a leader treat it as a nudge rather than a fact, though the screen says so plainly.')}
        ${cannot('Tell the member it happened. M27 shows them their attendance, but never that someone was prompted.')}
        <div style="height:8px;"></div>`, `border-color:#9A722344;`)}
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="flex:1 1 0;min-width:0;">
      ${option('A', 'Cut it', 'M23 is standalone. Nothing else in the product depends on it.', `
        ${line('Attendance is still collected &mdash; M26 needs it, and so does the group&rsquo;s own history.')}
        ${line('The leader still sees who said yes and did not come, after every single meeting.')}
        ${line('A leader of fourteen people already knows who has been missing. The pattern detection is only genuinely needed at forty, or by an office watching two thousand.')}
      `, 'Costs almost nothing at pilot size. The real loss only appears at scale.', false)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${option('B', 'Ship it on', 'As drawn, for every church, from day one.', `
        ${line('The pastoral catch is automated, and quiet drift gets noticed earlier than a human would notice it.')}
        ${line('Every church inherits four conditions it never agreed to hold.')}
        ${line('A church that turns it into a report has broken a promise this product printed on the screen - and the product handed them the material.')}
      `, 'Defensible, and the fastest way to be wrong in a church that was never asked.', false)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${option('C', 'Off until asked for', 'The capability ships. The assumption never does.', `
        ${line('Default off. A church office turns it on, and the four unenforceable conditions are shown at that moment - not buried in a policy.')}
        ${line('Turning it on is a decision with a name and a date against it, like every other consequential act in this product (W6, W9, W10).')}
        ${line('A church that has never thought about it is never handed it.')}
      `, 'Recommended. Ship the capability, never the assumption.', true)}
    </div>
  </div>
</div>`);

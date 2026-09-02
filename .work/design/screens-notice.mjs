import {
  C, SERIF, doc, svg, I, label, card, av, btn, iconBtn,
  phone, bodyPushed, rows,
} from './lib.mjs';

/*
 * NOTICING THAT SOMEONE STOPPED COMING.
 *
 * The pastoral need is real: people drift away quietly, and it is
 * usually the moment something is wrong. Noticing is care.
 *
 * Every church system does this as an "inactive member alert" with a
 * week count, and that is where it turns. A number makes it a metric,
 * a metric makes a list, and a list of lapsed members circulating
 * among leaders in a small congregation is how people become gossip.
 *
 * So this screen is built from four refusals:
 *   - no number. "For a while", never "5 weeks", never a percentage.
 *   - no list. It goes to ONE person, the leader who already knows him.
 *   - no automatic status. Only the office marks anyone Inactive, and
 *     only after a conversation with a human being.
 *   - an off switch that costs nothing to use, because the most common
 *     truth is that the leader already knows why.
 *
 * The guardrails are printed on the screen rather than kept in a
 * privacy policy. The leader has to be able to see the promise in
 * order to hold it.
 */
export const notice = {};

const quietAction = (icon, title, sub) =>
  `<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(icon, 18)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:600;">${title}</div>
      <div style="font-size:12px;color:${C.ink3};margin-top:3px;line-height:1.45;">${sub}</div>
    </div>
  </div>`;

const guard = (t) =>
  `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
    <span style="color:${C.sage};display:flex;padding-top:2px;">${svg(I.check, 14, 2.4)}</span>
    <span style="font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
  </div>`;

notice['Noticed.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Anugerah</div>
</div>
${bodyPushed(`
  <div style="display:flex;align-items:center;gap:13px;">
    ${av('DP', 52)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Dedi Prasetyo</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Prasetyo household &middot; Sunter</div>
    </div>
  </div>

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Have you seen Dedi lately?</div>
    <div style="font-size:14px;color:${C.ink2};line-height:1.6;margin-top:10px;">He has missed the last few meetings. That may well be nothing &mdash; but it might be worth a message.</div>
  </div>

  ${btn('Send him a message', { kind: 'outlineAccent', h: 50, icon: I.chat, grow: false })}

  ${card(rows([
    quietAction(I.check, 'I know why', 'Stop asking me about Dedi. Nothing is recorded.'),
    quietAction(I.users, 'Someone else is checking', 'Quiet for a month, then ask me again'),
  ]))}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('How this works')}
    ${card(`
      ${guard('Only you see this. Dedi is not on any list, anywhere.')}
      ${guard('No count, no percentage, no attendance score &mdash; not for him, not for anyone.')}
      ${guard('Nothing here changes his status. Only the office can, and only after talking to him.')}
      ${guard('The office is told nothing about this unless you choose to tell them.')}
      <div style="height:8px;"></div>`)}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.55;">Attendance here is marked by hand and often wrong. Treat this as a nudge to care, never as a fact about someone.</div>
`)}`));

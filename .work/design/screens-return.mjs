import {
  C, SERIF, doc, svg, I, label, card, av, btn, phone, body, rows,
} from './lib.mjs';

/*
 * WHAT THE LEADER GETS BACK.
 *
 * Everything checked so far was day one. Weeks two to six are where
 * this dies, and the reason is the same for all three people in it:
 * THE APP TAKES DATA FROM THEM AND GIVES NONE OF THEM ANYTHING BACK.
 *
 * The leader feels it first and quits first. He ticks fourteen boxes
 * every Wednesday and the app says "saved". By week six he stops, and
 * when attendance stops the RSVP numbers, the noticing in M23 and every
 * count in the product go with it.
 *
 * The fix is not streaks, badges or a percentage. In a church those are
 * poison - see M23. The fix is to hand the ticking straight back as the
 * one thing a leader actually wants from it: who said yes and did not
 * come, who is new, and whether the group is growing.
 */
export const ret = {};

const personRow = (init, name, meta) =>
  `<div style="display:flex;align-items:center;gap:11px;padding:11px 14px;">
    ${av(init, 36)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${name}</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">${meta}</div></div>
    <span style="display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border-radius:999px;border:1px solid ${C.accent};color:${C.accent};font-size:12px;font-weight:700;">${svg(I.chat, 15)}<span>Message</span></span>
  </div>`;

ret['Saved.dc.html'] = doc(phone(`
${body(`
  <div style="width:60px;height:60px;border-radius:999px;background:${C.sageTint};color:${C.sage};display:flex;align-items:center;justify-content:center;">${svg(I.check, 30, 2.4)}</div>

  <div>
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Eleven came tonight</div>
    <div style="font-size:13px;color:${C.ink2};line-height:1.55;margin-top:8px;">Saved. Here is the only part worth your attention.</div>
  </div>

  ${card(`
    <div style="padding:13px 14px 4px;">${label('Said yes, did not come')}
      <div style="font-size:12px;color:${C.ink2};margin-top:6px;line-height:1.5;">Usually nothing. Occasionally the reason someone needed you.</div>
    </div>
    ${rows([
      personRow('DP', 'Dedi Prasetyo', 'Second time this month'),
      personRow('TS', 'Tigor Simanjuntak', 'First time'),
    ])}`)}

  ${card(`
    <div style="padding:13px 14px 10px;display:flex;align-items:center;gap:11px;">
      ${av('RK', 38)}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:700;">Rina Kusuma came for the first time</div>
        <div style="font-size:12px;color:${C.ink3};margin-top:3px;">You added her by name tonight</div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:12px 14px;display:flex;gap:10px;">
      ${btn('Add to the group', { h: 44, icon: I.userPlus })}
      ${btn('Just visiting', { kind: 'ghost', h: 44 })}
    </div>`, 'border-color:#B4562F55;')}

  <div style="display:flex;flex-direction:column;gap:8px;">
    ${label('Since January')}
    <div style="display:flex;align-items:baseline;gap:10px;">
      <span style="font-family:${SERIF};font-size:24px;font-weight:600;color:${C.ink3};">9</span>
      <span style="color:${C.ink3};display:flex;align-self:center;">${svg(I.chevR, 17, 2.2)}</span>
      <span style="font-family:${SERIF};font-size:34px;font-weight:600;">14</span>
      <span style="font-size:13px;color:${C.ink2};">people in the group</span>
    </div>
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;">
    ${btn('Done', { kind: 'ghost', h: 48, grow: false })}
    <div style="text-align:center;font-size:11px;color:${C.ink3};margin-top:12px;line-height:1.55;">No streak, no percentage, no comparison with other groups. Ticking boxes for six weeks should hand you something, not score you.</div>
  </div>
`)}`));

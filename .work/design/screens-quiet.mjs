import { C, SERIF, doc, svg, I, card, av, iconBtn, phone, dateBlock, tierPill, chev } from './lib.mjs';

/*
 * HOME ON A WEEK WHEN NOTHING IS DUE, AT READABLE TYPE.
 *
 * M18 found that Home holds four blocks at 17px, then iteration 6 grew
 * it back to five. Cutting a block would have been the wrong answer.
 *
 * The right one: Home is a list of what is DUE, not a fixed layout.
 * A meeting card belongs on Home the week the meeting happens; a duty
 * card the week you serve. Most weeks, most members are due nothing -
 * and this is what that must look like. Empty is a correct state, not
 * a failure to fill.
 */
export const quiet = {};

const navQ = (active) => {
  const items = [['Home', I.home], ['Sermons', I.video], ['Groups', I.group], ['Me', I.user]];
  return `<div style="display:flex;border-top:1px solid ${C.line};background:${C.surfaceAlt};padding:11px 4px 22px;">${items
    .map(([t, ic]) => {
      const on = t === active;
      return `<div style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:6px;color:${on ? C.accent : C.ink3};"><span style="display:flex;">${svg(ic, 25, on ? 2 : 1.7)}</span><span style="font-size:12px;font-weight:${on ? 700 : 600};">${t}</span></div>`;
    })
    .join('')}</div>`;
};

quiet['HomeQuiet.dc.html'] = doc(phone(`
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:20px;padding:54px 20px 0;">
  <div style="display:flex;align-items:flex-start;gap:12px;">
    <div style="flex:1 1 auto;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${C.ink3};">Tuesday, 24 March</div>
      <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;margin-top:7px;line-height:1.15;">Good afternoon,<br>Andreas</div>
      <div style="margin-top:11px;">${tierPill('community')}</div>
    </div>
    <div style="width:48px;height:48px;flex:0 0 48px;border-radius:999px;background:${C.surface};border:1px solid ${C.line};display:flex;align-items:center;justify-content:center;color:${C.ink};">${svg(I.search, 22)}</div>
    ${av('AW', 48)}
  </div>

  ${card(`
    <div style="display:flex;align-items:center;gap:14px;padding:15px 16px;">
      ${dateBlock('SAT', '28')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:17px;font-weight:700;">Service &middot; 09.00</div>
        <div style="font-size:15px;color:${C.ink2};margin-top:4px;">Speaker not confirmed yet &middot; part 5</div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;display:flex;align-items:center;gap:11px;">
      <span style="color:${C.accent};display:flex;">${svg(I.mail, 19)}</span>
      <div style="flex:1 1 auto;font-size:15px;font-weight:600;">This week: 2 announcements</div>
      ${chev()}
    </div>`)}

  <div style="display:flex;align-items:center;gap:12px;padding:15px 16px;border:1px dashed ${C.line};border-radius:14px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.group, 21)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:600;color:${C.ink2};">No care group meeting this week</div>
      <div style="font-size:14px;color:${C.ink3};margin-top:4px;">Next one Wednesday 1 April</div>
    </div>
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="text-align:center;padding-bottom:22px;">
    <div style="font-family:${SERIF};font-size:17px;font-weight:400;color:${C.ink3};line-height:1.4;">Nothing needs you<br>this week.</div>
  </div>
</div>
${navQ('Home')}`));

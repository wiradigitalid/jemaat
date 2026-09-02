import {
  C, SERIF, doc, svg, I, label, card, btn, chev, iconBtn,
  phone, bodyPushed, topbar, rows,
} from './lib.mjs';

/*
 * WHAT THE CHURCH KNOWS ABOUT ONE PERSON.
 *
 * Every privacy decision so far protected a member's data FROM OTHER
 * MEMBERS - the scoped directory, the WhatsApp button, the guardrails on
 * M23. Not one protected them from the church itself, and the church is
 * the party holding all of it.
 *
 * The uncomfortable item is attendance. This product records who came to
 * which meeting, for four years, and no member has ever been shown that.
 * Most would assume it is not happening.
 *
 * THE TEST THIS SCREEN APPLIES TO THE WHOLE PRODUCT: if showing someone
 * their own record feels creepy, collecting it was creepy. Anything that
 * cannot be shown here should not be stored anywhere.
 *
 * And one honest refusal. A membership roll is an institutional record -
 * someone was baptised there, married there. The church legitimately
 * keeps that after they leave. Pretending a delete button could erase it
 * would be a lie, so there is no delete button and the reason is written
 * out instead.
 */
export const rights = {};

const factRow = (lab, value, editable = true) =>
  `<div style="display:flex;align-items:center;gap:14px;padding:11px 14px;">
    <span style="width:76px;flex:0 0 76px;font-size:11px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">${lab}</span>
    <span style="flex:1 1 auto;font-size:14px;font-weight:600;">${value}</span>
    ${editable ? `<span style="color:${C.accent};display:flex;">${svg(I.edit, 17)}</span>` : ''}
  </div>`;

const seeOption = (t, sub, on) =>
  `<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;">
    <div style="width:18px;height:18px;flex:0 0 18px;border-radius:999px;border:${on ? `5.5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:13px;font-weight:${on ? 700 : 600};">${t}</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:2px;line-height:1.4;">${sub}</div>
    </div>
  </div>`;

const kept = (t, meta) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;">
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">${t}</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">${meta}</div></div>
    ${chev()}
  </div>`;

rights['MyData.dc.html'] = doc(phone(`
${topbar('My data')}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">What Grace knows about you</div>
    <div style="font-size:12px;color:${C.ink2};line-height:1.55;margin-top:8px;">All of it. Not a summary.</div>
  </div>

  ${card(rows([
    factRow('NAME', 'Andreas Wibowo'),
    factRow('BORN', '18 June 1982'),
    factRow('PHONE', '0811-2200-3311'),
    factRow('ADDRESS', 'Jl. Sunter Permai 12', false),
  ]))}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Who can see your number')}
    ${card(rows([
      seeOption('Your care group', 'The fourteen people in Anugerah', true),
      seeOption('Anyone signed in', 'All 248 on the roll, including people you have never met', false),
      seeOption('Only the church office', 'Nobody in the directory sees it', false),
    ]))}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Also recorded, and rarely mentioned')}
    ${card(rows([
      kept('Which meetings you came to', '84 since 2021, marked by your group leader'),
      kept('What you answered to each invitation', 'Going, cannot, or no answer'),
      kept('When your standing changed, and who changed it', '2 entries'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    ${btn('Download my copy', { kind: 'ghost', h: 48, icon: I.upload, grow: false })}
    <div style="font-size:11px;color:${C.ink3};margin-top:13px;line-height:1.6;">There is no delete button, and it would be dishonest to draw one. A membership roll is the church&rsquo;s own record &mdash; who was baptised, who was married &mdash; and it survives you leaving. What you can do is ask the office to mark you moved, and remove this church from your app. Both stop everything going forward.</div>
  </div>
`)}`));

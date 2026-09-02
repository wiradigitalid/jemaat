import { C, SERIF, doc, svg, I, card, label, rows, av } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * HANDING A CARE GROUP TO THE NEXT LEADER.
 *
 * Every church rotates its leaders - yearly, or whenever someone moves -
 * and not one screen in this design knew how. M7 says "led by Budi H."
 * and nothing could ever change it.
 *
 * The interesting part is not the permission flip. It is that a promise
 * made in iteration 11 constrains this screen now. M23 told Budi "only
 * you see this, nothing is recorded" about the quiet prompts he
 * dismissed. So those CANNOT travel to Melisa - she will be prompted
 * about Dedi again from scratch. Slightly wasteful, and the only answer
 * that does not turn the earlier promise into a lie.
 *
 * The co-leader option is here because it is what churches actually do:
 * you do not hand a group over on a Tuesday, you walk beside the next
 * person for a month first.
 */
export const hand = {};

const gets = (t) =>
  `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
    <span style="color:${C.sage};display:flex;padding-top:2px;">${svg(I.check, 14, 2.4)}</span>
    <span style="font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
  </div>`;

const nope = (t) =>
  `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
    <span style="color:${C.ink3};display:flex;padding-top:3px;">${svg(I.x, 13, 2.2)}</span>
    <span style="font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
  </div>`;

const whenRow = (t, sub, on) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 16px;">
  <div style="width:18px;height:18px;flex:0 0 18px;border-radius:999px;border:${on ? `5.5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:${on ? 700 : 600};">${t}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.45;">${sub}</div>
  </div>
</div>`;

hand['WebHandover.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Care Groups')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Anugerah', 'Sunter area &middot; 14 people &middot; led by Budi Halim since February 2021',
      `${wBtn('Cancel', I.x)}${wBtn('Hand over on 1 April', I.swap, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

      <div style="width:648px;flex:0 0 648px;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 4px;">${label('The change')}</div>
          <div style="padding:8px 16px 16px;">
            <div style="display:flex;align-items:center;gap:13px;padding:12px 14px;background:${C.bg};border-radius:12px;">
              ${av('BH', 44)}
              <div style="flex:1 1 auto;min-width:0;">
                <div style="font-size:14px;font-weight:700;">Budi Halim</div>
                <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Leader for four years and one month</div>
              </div>
              <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">STEPPING DOWN</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 22px;">
              <span style="color:${C.accent};display:flex;transform:rotate(90deg);">${svg(I.chevR, 18, 2.2)}</span>
              <span style="flex:1 1 auto;height:1px;background:${C.lineSoft};"></span>
            </div>
            <div style="display:flex;align-items:center;gap:13px;padding:12px 14px;background:${C.surface};border:1.5px solid ${C.accent};border-radius:12px;">
              ${av('MH', 44)}
              <div style="flex:1 1 auto;min-width:0;">
                <div style="font-size:14px;font-weight:700;">Melisa Halim</div>
                <div style="font-size:12px;color:${C.ink2};margin-top:3px;">In the group since 2021 &middot; Registered Member</div>
              </div>
              <span style="color:${C.ink3};display:flex;">${svg(I.chevD, 18)}</span>
            </div>
            <div style="font-size:11px;color:${C.ink3};margin-top:10px;line-height:1.5;">Anyone in the group can lead it. Standing does not decide this &mdash; a Community Member can lead a care group.</div>
          </div>`)}

        ${card(`
          <div style="padding:14px 16px 2px;">${label('When')}</div>
          ${rows([
            whenRow('Straight away', 'Melisa can take attendance tonight', false),
            whenRow('1 April, after this month is finished', 'Budi closes out March. Nothing changes until then', true),
            whenRow('Make her co-leader first, decide later', 'Both of them have everything. This is what most groups actually do', false),
          ])}`)}
      </div>

      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 8px;">${label('What Melisa gets')}</div>
          ${gets('The member list and their phone numbers')}
          ${gets('Every meeting recorded since 2021, and who came')}
          ${gets('The hosting rota, including who is next')}
          ${gets('Taking attendance, and answering RSVP for people not in the app')}
          <div style="height:10px;"></div>
          <div style="padding:0 16px 8px;">${label('What does not travel')}</div>
          ${nope('The quiet prompts Budi dismissed. M23 told him only he would see those, so they stay with him - Melisa will be asked about Dedi again from scratch.')}
          ${nope('Anything he was told in confidence. The app never held it, and it should not start now.')}
          <div style="padding:13px 16px;margin-top:8px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">On 1 April Budi loses the contact list, the prompts and attendance. He stays in the group as an ordinary member &mdash; only the role moves.</span>
          </div>`)}
        <div style="flex:1 1 auto;"></div>
      </div>
    </div>
  </div>
</div>`);

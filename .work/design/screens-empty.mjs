import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * THE FIRST SCREEN A CHURCH EVER SEES.
 *
 * Found by walking corrected R0 as a story. W2 exists only in its full
 * state - "showing 1 to 10 of 248" - and in R0 there is no import, so
 * the actual first thing the secretary meets is a table with nothing in
 * it. That screen decides whether she comes back tomorrow, and it had
 * never been drawn.
 *
 * So it is not a placeholder. It is the onboarding: the one concept
 * worth knowing before typing anything (households), and an order to
 * work in so the register is useful before it is complete.
 */
export const empty = {};

const step = (n, t, why) => `
<div style="display:flex;align-items:flex-start;gap:14px;padding:12px 18px;">
  <span style="width:24px;height:24px;flex:0 0 24px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:600;">${t}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:4px;line-height:1.5;">${why}</div>
  </div>
</div>`;

empty['WebEmpty.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('People', 'Nobody yet &middot; Grace Community Church, set up 4 minutes ago',
      `${wBtn('Add the first person', I.plus, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;">
        ${card(`<div style="padding:56px 48px;display:flex;flex-direction:column;align-items:flex-start;">
          <div style="width:56px;height:56px;border-radius:14px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;">${svg(I.users, 30, 1.7)}</div>
          <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;margin-top:22px;line-height:1.2;">Nothing here yet</div>
          <div style="font-size:14px;color:${C.ink2};line-height:1.65;margin-top:14px;max-width:520px;">One thing is worth knowing before you type anything. <span style="font-weight:700;color:${C.ink};">A household holds the address. A person holds their standing.</span> So change an address once and the whole family moves; change someone from Community to Registered and only they change.</div>
          <div style="font-size:14px;color:${C.ink2};line-height:1.65;margin-top:14px;max-width:520px;">Six fields per person, two of them optional. Nothing else is asked for, and nothing else has to be filled in later either.</div>
          <div style="display:flex;gap:11px;margin-top:26px;">
            ${wBtn('Add the first person', I.plus, true)}
            ${wBtn('How households work', I.help)}
          </div>
          <div style="font-size:12px;color:${C.ink3};line-height:1.6;margin-top:26px;max-width:520px;">Bulk import from a spreadsheet arrives in the next release. Until then this is typing &mdash; which is why the order on the right matters more than the total.</div>
        </div>`)}
      </div>

      <div style="width:428px;flex:0 0 428px;">
        ${card(`
          <div style="padding:16px 18px 10px;">${label('An hour, in this order')}
            <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.55;">The register does not have to be complete to be useful. It has to be useful before it is complete, or nobody finishes it.</div>
          </div>
          ${step('1', 'Your own household', 'Four people, five minutes. Now you have seen every screen a member will see.')}
          ${step('2', 'The care group leaders', 'Six or eight people. They are the ones who will fill in the rest for you.')}
          ${step('3', 'One care group', 'Give it a leader and a night. It can meet this week with three members in it.')}
          ${step('4', 'Everyone else, slowly', 'Or wait for the import next release. A group that works beats a list that is finished.')}
          <div style="padding:14px 18px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.sage};display:flex;padding-top:1px;">${svg(I.check, 16, 2.4)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">After step 3 the app is genuinely running: that group can RSVP, take attendance and claim a host, with eleven people still untyped.</span>
          </div>`, 'border-color:#B4562F55;')}
      </div>
    </div>
  </div>
</div>`);

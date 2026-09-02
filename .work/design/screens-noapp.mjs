import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE MEMBER WHO NEVER INSTALLS ANYTHING.
 *
 * M14 has rows reading "not in the app, mark by hand", and for fourteen
 * iterations I treated that as a gap to paper over. Iteration 32 moved
 * the act-now messages to WhatsApp, and WhatsApp has interactive reply
 * buttons - which means the gap was never a gap. Almost everything R0
 * offers an ordinary member can be done in a message thread.
 *
 * That inverts who the app is for. The office needs the web. The leader
 * needs the app. THE CONGREGATION DOES NOT - and in a country where
 * WhatsApp reaches nine people in ten and an app install reaches far
 * fewer, that is the largest adoption lever in the whole design.
 *
 * The thread below is drawn in this product's own palette on purpose.
 * It is not a rendering of WhatsApp and should not become one.
 */
export const noapp = {};

const them = (text, time) => `
<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px;">
  <div style="max-width:290px;background:${C.surface};border:1px solid ${C.line};border-radius:14px;border-top-left-radius:5px;padding:11px 13px;font-size:12px;line-height:1.55;">${text}</div>
  <span style="font-size:10px;color:${C.ink3};padding-left:4px;">${time}</span>
</div>`;

const buttons = (list) => `
<div style="display:flex;flex-direction:column;gap:6px;max-width:290px;margin-top:-2px;">
  ${list.map((b) => `<div style="border:1px solid ${C.line};background:${C.surface};border-radius:12px;padding:9px 0;text-align:center;font-size:12px;font-weight:700;color:${C.accent};">${b}</div>`).join('')}
</div>`;

const me = (text, time) => `
<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
  <div style="max-width:250px;background:${C.accentTint};border-radius:14px;border-top-right-radius:5px;padding:11px 13px;font-size:12px;line-height:1.55;color:${C.ink};">${text}</div>
  <span style="font-size:10px;color:${C.ink3};padding-right:4px;">${time}</span>
</div>`;

const yes = (t) => `
<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
  <span style="color:${C.sage};display:flex;padding-top:2px;">${svg(I.check, 14, 2.4)}</span>
  <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

const no = (t) => `
<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 16px;">
  <span style="color:${C.ink3};display:flex;padding-top:3px;">${svg(I.x, 13, 2.2)}</span>
  <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

noapp['NoApp.dc.html'] = doc(`
<div style="width:1440px;height:1060px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The member who never installs anything</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:980px;">M14 says &ldquo;not in the app, mark by hand&rdquo; and for fourteen iterations that read as a gap to paper over. Once the act-now messages moved to WhatsApp it stopped being one: reply buttons are enough for almost everything R0 offers an ordinary member.</div>
  </div>

  <div style="display:flex;gap:22px;flex:1 1 auto;min-height:0;">

    <div style="width:352px;flex:0 0 352px;">
      ${card(`
        <div style="padding:14px 16px 10px;border-bottom:1px solid ${C.lineSoft};">
          ${label('The same week, as messages')}
          <div style="font-size:11px;color:${C.ink3};margin-top:6px;line-height:1.45;">Drawn in this product&rsquo;s palette, not WhatsApp&rsquo;s. Nothing here is installed.</div>
        </div>
        <div style="padding:16px;display:flex;flex-direction:column;gap:13px;">
          ${them('<span style="font-weight:700;">Grace Community Church</span><br><br>Care group Anugerah, Wednesday 19.30, at the Halim household. Can you make it?', 'Sun 19.02')}
          ${buttons(['Going', 'Can&rsquo;t', 'Not sure'])}
          ${me('Going', 'Sun 21.40')}
          ${them('Thank you. Eight of fourteen so far.', 'Sun 21.40')}
          ${them('<span style="font-weight:700;">This week</span><br><br>Sat 14 Mar, 09.00, Grace Hall. Samuel Kartono, Growing in Prayer part 3.<br><br>New members class starts 22 March.<br>Youth camp closes 18 March.<br><br>grace-bdg.jemaat.app', 'Thu 18.00')}
          ${them('It is Melisa Halim&rsquo;s birthday today.', 'Fri 07.00')}
          ${me('Happy birthday Melisa! 🙏', 'Fri 07.12')}
        </div>`, 'overflow:hidden;')}
    </div>

    <div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 16px 8px;">${label('Works with no app at all')}</div>
        ${yes('RSVP to a care group meeting &mdash; a reply button, and the leader&rsquo;s count updates')}
        ${yes('Confirm a serving duty, and see the call time')}
        ${yes('Claim an open hosting date')}
        ${yes('Read the week: service time, speaker, announcements')}
        ${yes('Get the sermon link, watch it on YouTube')}
        ${yes('Greet someone on their birthday &mdash; the member sends this themselves, for free')}
        <div style="height:8px;"></div>
        <div style="padding:0 16px 8px;">${label('Still needs the app, or the web')}</div>
        ${no('Taking attendance &mdash; the leader&rsquo;s job, and leaders will install')}
        ${no('The care group contact list')}
        ${no('Correcting your own name, phone or household')}
        ${no('Seeing what the church holds about you (M27)')}
        ${no('Everything the office does &mdash; all ten web screens')}
        <div style="height:8px;"></div>`)}

      ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:13px;">
        <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 20)}</span>
        <div style="flex:1 1 auto;">
          <div style="font-size:15px;font-weight:700;">What this inverts</div>
          <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">The office needs the web. The leader needs the app. <span style="font-weight:700;color:${C.ink};">The congregation does not need anything.</span> In a country where WhatsApp reaches nine people in ten and an app install reaches far fewer, that is the largest adoption lever in this whole design &mdash; and it was sitting behind a row in M14 that I had read as a defect for fourteen iterations.<br><br>It also cheapens R0 rather than growing it: fewer people to onboard, no install to explain, and the &ldquo;2 not in the app&rdquo; rows on M14 shrink to the genuinely phone-less.</div>
        </div>
      </div>`, 'border-color:#B4562F55;')}
    </div>

    <div style="width:372px;flex:0 0 372px;">
      ${card(`<div style="padding:18px 20px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 20)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:15px;font-weight:700;">Before anyone builds this</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:9px;line-height:1.65;">Three things to check, and none of them are design questions.<br><br><span style="font-weight:700;color:${C.ink};">Templates.</span> Business-initiated messages need pre-approved templates, and a reply-button template with variable content has rules. Verify before promising this.<br><br><span style="font-weight:700;color:${C.ink};">The 24-hour window.</span> Once someone replies, further messages are free for a day. The Sunday invitation opening that window is what makes the rest of the week cheap.<br><br><span style="font-weight:700;color:${C.ink};">Opt-in.</span> A church broadcasting to 248 numbers without consent is a problem in any jurisdiction, and P5 is where the consent belongs.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

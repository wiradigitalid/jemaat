import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * EVERY MESSAGE THIS PRODUCT SENDS, AND DOWN WHICH PIPE.
 *
 * Thirty-two iterations never examined the channel. Every time-based
 * feature quietly assumed a push notification gets read - while every
 * manual nudge button in the same 63 screens sends WhatsApp, because
 * that is what actually gets read here. The product already knew and
 * the design never said so.
 *
 * It matters more than it sounds. If invitations arrive by push:
 * RSVP numbers stay low, M23 is never opened, M26 is never seen, and
 * the four-openings-a-week the warta was justified on collapses.
 *
 * And it surfaces the first RECURRING COST in the whole design. No
 * screen in 63 has ever mentioned that this product costs a church
 * money every month.
 */
export const msg = {};

const row = (when, what, channel, why) => {
  const tone = {
    wa: [C.sageTint, C.sage, 'WHATSAPP'],
    push: [C.bg, C.ink3, 'PUSH'],
    both: [C.accentTint, C.accent, 'PUSH, THEN WA'],
    human: [C.amberTint, C.amber, 'A PERSON SENDS IT'],
  }[channel];
  return `<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 16px;border-top:1px solid ${C.lineSoft};">
    <div style="width:104px;flex:0 0 104px;font-size:11px;font-weight:700;color:${C.ink3};">${when}</div>
    <div style="width:250px;flex:0 0 250px;font-size:12px;font-weight:600;line-height:1.4;">${what}</div>
    <div style="width:118px;flex:0 0 118px;"><span style="display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:6px;background:${tone[0]};color:${tone[1]};font-size:9px;font-weight:700;letter-spacing:0.03em;">${tone[2]}</span></div>
    <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.45;">${why}</div>
  </div>`;
};

msg['Messages.dc.html'] = doc(`
<div style="width:1440px;height:1040px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">Every message, and down which pipe</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:960px;">Thirty-two iterations never examined the channel. Every nudge button in these 63 screens sends WhatsApp, because that is what gets read here &mdash; while everything automatic quietly assumed a push notification. The product already knew; the design never said it.</div>
  </div>

  ${card(`
    <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;">
      <div style="width:104px;flex:0 0 104px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">WHEN</div>
      <div style="width:250px;flex:0 0 250px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">WHAT IS SENT</div>
      <div style="width:118px;flex:0 0 118px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">CHANNEL</div>
      <div style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">WHY THAT ONE</div>
    </div>
    ${row('On sign-in', 'The six-digit code', 'wa', 'Already designed this way on P8. If this one fails nobody gets in at all')}
    ${row('Sunday 19.00', 'Wednesday&rsquo;s care group, with the RSVP buttons in the message', 'wa', 'The whole RSVP number depends on this being read. Push is where invitations go to die')}
    ${row('Thursday 09.00', 'Your duty on Saturday, and the call time', 'wa', 'Turning up is the act. A missed message means an empty sound desk')}
    ${row('When confirmed', 'The office has confirmed you &mdash; here is how to sign in', 'wa', 'They have no app yet, so push is not even possible')}
    ${row('Opening month', 'Hosting dates are open, and your household is next in the rota', 'wa', 'M9 is self-serve, which only works if somebody knows it opened')}
    ${row('Thursday 18.00', 'This week is out: three announcements, two birthdays', 'push', 'Nice to know, not act now. Cheap, and ignoring it costs nobody anything')}
    ${row('Birthday, 07.00', 'It is Melisa&rsquo;s birthday today', 'push', 'The greeting itself then goes out as WhatsApp, sent by the member, at no cost to the church')}
    ${row('Wednesday 21.30', 'Attendance not marked yet', 'both', 'The leader is an app user by definition, so push first. WhatsApp only if still unmarked by Thursday')}
    ${row('Never automatic', 'Remind the four who have not answered', 'human', 'M8 keeps this a button. A leader chasing you is care; a robot chasing you is not')}
    ${row('Never automatic', 'Have you seen Dedi lately', 'human', 'M23 in-app only, on purpose. A push saying someone is missing is the surveillance version')}
    <div style="height:8px;"></div>`, 'overflow:hidden;')}

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="flex:1 1 0;min-width:0;">
      ${card(`<div style="padding:18px 20px;">
        <div style="font-size:15px;font-weight:700;">The rule</div>
        <div style="font-size:13px;color:${C.ink2};margin-top:10px;line-height:1.65;">If a person has to <span style="font-weight:700;color:${C.ink};">do</span> something, it goes to WhatsApp. If it is only nice to know, push is enough and free. Nothing pastoral is ever automated down any pipe at all.<br><br>Five act-now messages, two nice-to-know, one hybrid, two deliberately left to a human. That is the whole set the 63 screens imply.</div>
      </div>`)}
    </div>
    <div style="flex:1 1 0;min-width:0;">
      ${card(`<div style="padding:18px 20px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 20)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:15px;font-weight:700;">The first recurring cost, never once mentioned</div>
            <div style="font-size:13px;color:${C.ink2};margin-top:10px;line-height:1.65;">WhatsApp Business is billed per conversation. Roughly two act-now messages a week across 248 people is about <span style="font-weight:700;color:${C.ink};">2,000 conversations a month</span> &mdash; a real line item for a church that was told this software is free and open source.<br><br>Both statements can be true, and the product has to say so plainly somewhere. It never has.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
    </div>
    <div style="width:400px;flex:0 0 400px;">
      ${card(`<div style="padding:18px 20px;">
        <div style="font-size:15px;font-weight:700;">What that changes upstream</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:10px;line-height:1.65;">A WhatsApp sender is a vendor, an approval queue and a monthly bill &mdash; so it joins auth as the second external dependency in R0, and for the same reason: discovering it at month two is a schedule failure.<br><br>It also has to be a church <span style="font-weight:700;color:${C.ink};">setting</span>, not a product decision. A church that cannot pay sends nothing but push and loses RSVP accuracy, which is its own trade to make.</div>
      </div>`, 'border-color:#B4562F55;')}
    </div>
  </div>
</div>`);

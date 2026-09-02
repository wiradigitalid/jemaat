import {
  C, SERIF, doc, svg, I, label, card, av, btn, chev, iconBtn,
  phone, bodyPushed, topbar, rows,
} from './lib.mjs';

/*
 * WHEN IT BREAKS.
 *
 * Fifty-three screens, all of them the happy path. The two failures
 * that cost most are both at the front door, and both strand someone
 * BEFORE they are anybody in the system - so there is nobody to help
 * them and no record that they tried.
 *
 * Two rules held throughout:
 *
 * NEVER BLAME THE PERSON. "Invalid code" says you typed it wrong. Codes
 * get rotated and bulletins get old; the app has no idea whose fault it
 * is and should not guess.
 *
 * EVERY DEAD END GETS A HUMAN. Not a support address - a named person
 * at that church with a WhatsApp button, because that is who actually
 * solves it.
 */
export const broken = {};

const route = (icon, title, body, action = '') =>
  `<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;">
    <span style="color:${C.accent};display:flex;padding-top:1px;">${svg(icon, 19)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">${title}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:5px;line-height:1.55;">${body}</div>
      ${action ? `<div style="margin-top:9px;"><span style="font-size:12px;font-weight:700;color:${C.accent};">${action}</span></div>` : ''}
    </div>
  </div>`;

/* ===================== FRONT DOOR: THE CODE DOES NOT RESOLVE ===================== */
broken['CodeFailed.dc.html'] = doc(phone(`
${topbar('Find your church')}
${bodyPushed(`
  <div style="display:flex;align-items:center;height:62px;padding:0 18px;background:${C.surface};border:1.5px solid ${C.amber};border-radius:14px;">
    <span style="font-size:20px;font-weight:700;letter-spacing:0.14em;color:${C.ink2};">GRACE-B0G</span>
    <div style="flex:1 1 auto;"></div>
    <span style="color:${C.amber};display:flex;">${svg(I.help, 20)}</span>
  </div>

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">No church has that code</div>
    <div style="font-size:13px;color:${C.ink2};line-height:1.6;margin-top:9px;">Codes get changed and bulletins get old. Any of these three will get you there.</div>
  </div>

  ${card(rows([
    route(I.search, 'Look again at the letters',
      'No church code contains a zero or a one, because they read as O and l. Yours has a <span style="font-weight:700;">0</span> in it.'),
    route(I.pin, 'Look it up by name and city',
      'You need the full name and the city &mdash; there is no browsable list of churches, and that is deliberate.',
      'Look it up'),
    route(I.chat, 'Ask at the welcome desk',
      'Whoever is at the door has the current one printed. It changes rarely, but it does change.'),
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.6;">Nothing here has asked who you are, and nothing will<br>until you choose a church.</div>
`)}`));

/* ===================== SECOND DOOR: THE SIGN-IN CODE NEVER ARRIVES ===================== */
const reason = (title, body, action) =>
  `<div style="display:flex;flex-direction:column;gap:7px;padding:13px 14px;">
    <div style="font-size:13px;font-weight:700;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};line-height:1.55;">${body}</div>
    <div><span style="font-size:12px;font-weight:700;color:${C.accent};">${action}</span></div>
  </div>`;

broken['CodeNeverCame.dc.html'] = doc(phone(`
${topbar('Sign in')}
${bodyPushed(`
  <div style="width:56px;height:56px;border-radius:999px;background:${C.amberTint};color:${C.amber};display:flex;align-items:center;justify-content:center;">${svg(I.clock, 27, 1.7)}</div>

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Still nothing?</div>
    <div style="font-size:13px;color:${C.ink2};line-height:1.6;margin-top:9px;">We sent it twice to <span style="font-weight:700;color:${C.ink};">+62 812-1234-5678</span> on WhatsApp. Three things it usually is.</div>
  </div>

  ${card(rows([
    reason('That number may not be yours any more',
      'It is the one the church office has on file, which may be years old.',
      'Message the office'),
    reason('WhatsApp may not be on this phone',
      'The same code can come by SMS instead. It is slower.',
      'Send it as an SMS'),
    reason('It may be waiting in message requests',
      'WhatsApp hides messages from numbers you have never replied to.',
      'How to check'),
  ]))}

  ${card(`<div style="display:flex;align-items:center;gap:13px;padding:14px;">
    ${av('LS', 44)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:700;">Lidya Suryani</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Grace Community Church office</div>
    </div>
    <span style="display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 13px;border-radius:999px;border:1px solid ${C.accent};color:${C.accent};font-size:12px;font-weight:700;">${svg(I.chat, 15)}<span>Message</span></span>
  </div>`, 'border-color:#B4562F55;')}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;font-size:12px;color:${C.ink3};line-height:1.6;">Lidya cannot read your code and cannot send you one &mdash; she can only correct the number on file. Nobody at the church, and nobody here, can sign in as you.</div>
`)}`));

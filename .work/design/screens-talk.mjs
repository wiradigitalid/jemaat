import {
  C, SERIF, doc, svg, I, label, card, av, btn, iconBtn,
  phone, body, rows,
} from './lib.mjs';

/*
 * WHAT AN APPLICANT SEES WHEN THE OFFICE IS NOT READY TO CONFIRM.
 *
 * There is deliberately no "declined" screen in this product. A church
 * does not refuse someone through a push notification - that is a
 * conversation, and turning it into a status makes the app do something
 * no person in the building would do.
 *
 * So the office has no Decline button either (see W1). The furthest it
 * can go is "needs a conversation", and this is how that lands: warm,
 * non-terminal, with a name and a number attached. Nothing expires.
 */
export const talk = {};

const step = (title, meta, state) => {
  const dot = {
    done: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.sageTint};color:${C.sage};display:flex;align-items:center;justify-content:center;">${svg(I.check, 13, 2.4)}</div>`,
    now: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.accentTint};display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:999px;background:${C.accent};"></div></div>`,
    todo: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;border:1.5px dashed ${C.line};"></div>`,
  }[state];
  return `<div style="display:flex;align-items:center;gap:12px;padding:11px 14px;">${dot}<div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:${state === 'now' ? 700 : 600};color:${state === 'todo' ? C.ink3 : C.ink};">${title}</div>${meta ? `<div style="font-size:12px;color:${C.ink3};margin-top:2px;">${meta}</div>` : ''}</div></div>`;
};

talk['LetsTalk.dc.html'] = doc(phone(`
${body(`
  <div style="width:64px;height:64px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;">${svg(I.chat, 30, 1.7)}</div>
  <div>
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Let us talk first</div>
    <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:9px;">Someone from the office would like a short conversation before anything is confirmed. <span style="font-weight:600;color:${C.ink};">Nothing has been refused</span> &mdash; your application stays open.</div>
  </div>

  ${card(rows([
    step('Sent', '8 March, 14.22', 'done'),
    step('Read by the office', '9 March', 'done'),
    step('A short conversation', 'Waiting on this', 'now'),
    step('Confirmed by the office', '', 'todo'),
  ]))}

  ${card(`<div style="display:flex;align-items:center;gap:13px;padding:15px 16px;">
    ${av('LS', 46)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Lidya Suryani</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Church office &middot; usually replies within a day</div>
    </div>
  </div>
  <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;">
    ${btn('Message Lidya on WhatsApp', { kind: 'outlineAccent', h: 48, icon: I.chat, grow: false })}
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;">
    ${btn('Back to home', { kind: 'ghost', h: 50, grow: false })}
    <div style="text-align:center;font-size:12px;color:${C.ink3};margin-top:12px;line-height:1.5;">Meanwhile you keep everything a guest has &mdash; sermons, service times, events.</div>
  </div>
`)}`));

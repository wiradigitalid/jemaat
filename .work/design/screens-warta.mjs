import {
  C, SERIF, doc, svg, I, label, card, pill, av, btn, chev, iconBtn,
  phone, bodyPushed, topbar, rows, dateBlock,
} from './lib.mjs';

/*
 * THE WEEKLY BULLETIN.
 *
 * Found by asking what brings an ORDINARY member back - not the leader,
 * not a volunteer. Today: nothing. She knows the service time by heart
 * and watches sermons on YouTube. An app that only the leader opens is
 * an app that dies.
 *
 * Every church here already writes a warta every week. It costs them
 * nothing extra and it is the most-read thing they produce. Birthdays
 * sit at the bottom because a one-tap greeting is the cheapest reason
 * anyone has ever had to open an app.
 */
export const warta = {};

const announce = (title, body, meta) =>
  `<div style="padding:13px 14px;">
    <div style="font-size:14px;font-weight:600;line-height:1.35;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:5px;line-height:1.5;">${body}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:7px;">${meta}</div>
  </div>`;

const birthday = (init, name, when) =>
  `<div style="display:flex;align-items:center;gap:11px;padding:10px 14px;">
    ${av(init, 34)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:600;">${name}</div><div style="font-size:12px;color:${C.ink3};margin-top:2px;">${when}</div></div>
    <span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:1px solid ${C.accent};color:${C.accent};font-size:12px;font-weight:700;">${svg(I.chat, 15)}<span>Greet</span></span>
  </div>`;

warta['ThisWeek.dc.html'] = doc(phone(`
${topbar('This week', iconBtn(I.share))}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">This week</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:5px;">9 &ndash; 15 March &middot; posted by the church office</div>
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:13px;padding:14px;">
    ${dateBlock('SAT', '14')}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:15px;font-weight:700;">Service &middot; 09.00</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Samuel Kartono &middot; Growing in Prayer, part 3</div>
    </div>
    ${chev()}
  </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Announcements &middot; 3')}
    ${card(rows([
      announce('New members class starts 22 March',
        'Four Saturdays, 08.00, Room 2. Open to anyone &mdash; you do not have to be a member to attend.',
        'Church office &middot; 2 days ago'),
      announce('Youth camp registration closes 18 March',
        'Three places left. Ask Grace Sutanto or sign up at the welcome desk.',
        'Youth team &middot; 4 days ago'),
      announce('Choir needs two more altos',
        'Rehearsal every Thursday, 19.00. No audition &mdash; come and try one week.',
        'Music team &middot; 5 days ago'),
    ]))}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Birthdays this week')}
    ${card(rows([
      birthday('MH', 'Melisa Halim', 'Wednesday 14 March'),
      birthday('GH', 'Gavriel Halim', 'Friday 16 March &middot; turns 15'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    ${btn('Share this week on WhatsApp', { kind: 'ghost', h: 50, icon: I.chat, grow: false })}
  </div>
`)}`));

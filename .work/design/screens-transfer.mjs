import {
  C, SERIF, doc, svg, I, label, card, pill, av, sq, btn, chev, iconBtn,
  phone, bodyPushed, topbar, rows, qrBlock,
} from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * MOVING A MEMBERSHIP BETWEEN CHURCHES.
 *
 * In Indonesian practice this is a surat pindah: the origin church
 * writes a letter, the member carries it, the new church admits them.
 * It is slow, the letter often never arrives, and people end up
 * belonging to two churches or to none.
 *
 * Multi-tenancy can do better - but ONLY if it never assumes both
 * churches are customers. Most receiving churches will not be on
 * Jemaat. So the design is: a transfer IS a letter. When the other
 * side is on Jemaat the letter travels as data; when it is not, the
 * same letter prints with a QR that proves it is genuine. One
 * artefact, two channels, and the paper channel is the primary one.
 *
 * The second rule is harder and matters more: churches are separate
 * tenants and must stay that way. What crosses is the minimum a new
 * church needs to admit someone. Attendance, giving and anything the
 * office wrote about them never leaves the church that recorded it.
 */
export const xfer = {};

const churchLine = (init, name, place, tag) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">
    ${sq(init, 40)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:14px;font-weight:700;">${name}</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;">${place}</div></div>
    ${tag}
  </div>`;

const goes = (t) =>
  `<div style="display:flex;align-items:center;gap:10px;padding:6px 16px;">
    <span style="color:${C.sage};display:flex;">${svg(I.check, 14, 2.4)}</span>
    <span style="font-size:12px;color:${C.ink2};">${t}</span>
  </div>`;

const stays = (t) =>
  `<div style="display:flex;align-items:center;gap:10px;padding:6px 16px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.x, 13, 2.2)}</span>
    <span style="font-size:12px;color:${C.ink2};">${t}</span>
  </div>`;

/* ===================== THE MEMBER ASKS ===================== */
xfer['Transfer.dc.html'] = doc(phone(`
${topbar('Membership')}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Move your membership</div>
    <div style="font-size:13px;color:${C.ink2};line-height:1.5;margin-top:8px;">Both churches have to agree. This asks them &mdash; it does not do it.</div>
  </div>

  ${card(`
    ${churchLine('I', 'Immanuel Church', 'Surabaya &middot; where you are now', pill('Leaving', C.bg, C.ink3, `border:1px solid ${C.line};`))}
    <div style="display:flex;align-items:center;gap:10px;padding:0 20px;">
      <span style="color:${C.accent};display:flex;transform:rotate(90deg);">${svg(I.chevR, 17, 2.2)}</span>
      <span style="flex:1 1 auto;height:1px;background:${C.lineSoft};"></span>
    </div>
    ${churchLine('G', 'Grace Community Church', 'Bandung &middot; where you worship', pill('Joining', C.accentTint, C.accent))}`)}

  ${card(`
    <div style="padding:14px 16px 6px;">${label('What goes with you')}</div>
    ${goes('Your name and date of birth')}
    ${goes('Your household, so your family stays together')}
    ${goes('Baptism and marriage dates')}
    ${goes('The date you first joined a church')}
    <div style="height:10px;"></div>
    <div style="padding:0 16px 6px;">${label('What stays behind')}</div>
    ${stays('Every meeting you attended in Surabaya')}
    ${stays('Your care group and serving history there')}
    ${stays('Anything you gave')}
    ${stays('Anything the office wrote about you')}
    <div style="padding:13px 16px;margin-top:8px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
      <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
      <span style="font-size:12px;color:${C.ink2};line-height:1.55;">Immanuel keeps its own records. Grace never sees them, and never will.</span>
    </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    ${btn('Ask both churches', { h: 52, icon: I.swap, grow: false })}
    <div style="text-align:center;font-size:12px;color:${C.ink3};margin-top:12px;line-height:1.55;">Three people agree: you, the office in Surabaya, the office in Bandung. Until all three do, you stay a Community Member here. Nothing changes today.</div>
  </div>
`)}`));

/* ===================== THE RECEIVING OFFICE ACCEPTS ===================== */
const arrived = (lab, value) =>
  `<div style="display:flex;align-items:baseline;gap:16px;padding:11px 16px;">
    <span style="width:150px;flex:0 0 150px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${lab}</span>
    <span style="flex:1 1 auto;font-size:13px;font-weight:600;">${value}</span>
  </div>`;

xfer['WebTransfer.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Applicants')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Andreas Wibowo', 'Transfer request &middot; arrived 12 March from Immanuel Church, Surabaya',
      `${wBtn('Needs a conversation', I.chat)}${wBtn('Accept as Registered Member', I.check, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:16px;display:flex;align-items:center;gap:13px;border-bottom:1px solid ${C.lineSoft};">
            <div style="width:38px;height:38px;border-radius:999px;background:${C.sageTint};color:${C.sage};display:flex;align-items:center;justify-content:center;">${svg(I.checkCircle, 21, 1.9)}</div>
            <div style="flex:1 1 auto;">
              <div style="font-size:14px;font-weight:700;">Verified by Immanuel Church, Surabaya</div>
              <div style="font-size:12px;color:${C.ink2};margin-top:3px;">Signed by their office 12 March &middot; reference IMN-4T92-KQ</div>
            </div>
          </div>
          <div style="padding:14px 16px 4px;">${label('What arrived')}</div>
          ${rows([
            arrived('NAME', 'Andreas Wibowo'),
            arrived('BORN', '18 June 1982'),
            arrived('HOUSEHOLD', 'Wife and two children, listed'),
            arrived('BAPTISED', '9 April 2005, Immanuel Church'),
            arrived('MEMBER SINCE', '9 April 2005'),
          ])}
          <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">That is everything Immanuel sent, and everything it can send. Their attendance, giving and pastoral records stay with them.</span>
          </div>`)}
      </div>

      <div style="width:428px;flex:0 0 428px;">
        ${card(`
          <div style="padding:14px 16px 8px;">${label('If they had brought paper instead')}
            <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.55;">Most churches are not on Jemaat, so this is the normal case, not the exception. A transfer is a letter either way &mdash; the digital one is just a letter that can be checked.</div>
          </div>
          <div style="display:flex;justify-content:center;padding:14px 0 6px;">
            <div style="padding:12px;background:#FFFFFF;border:1px solid ${C.line};border-radius:12px;">${qrBlock(150, C.ink)}</div>
          </div>
          ${rows([
            arrived('SCAN', 'The QR printed on the letter'),
            arrived('OR TYPE', 'The reference under the signature'),
          ])}
          <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 16)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">No letter at all? Accept them as a Community Member and ask Surabaya yourself. Nobody waits on paper to belong somewhere.</span>
          </div>`)}
      </div>
    </div>
  </div>
</div>`);

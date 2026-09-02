import {
  C, SERIF, doc, svg, I, label, card, pill, av, btn, chev, iconBtn, chip,
  phone, body, topbar, navGuest, rows, field, poster, posterMini, thumb, TONES,
  infoRow, lockPill, avExternal,
} from './lib.mjs';

export const pub = {};

/* ===================== GUEST HOME (app entry, no account) ===================== */
mainHome();
function mainHome() {
  pub['Main.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="display:flex;align-items:center;gap:10px;flex:1 1 auto;min-width:0;">
      <div style="width:34px;height:34px;flex:0 0 34px;border-radius:12px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;">G</div>
      <div style="min-width:0;">
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Grace Community Church</span>
          <span style="color:${C.ink3};display:flex;">${svg(I.chevD, 15, 2)}</span>
        </div>
        <div style="font-size:11px;color:${C.ink3};margin-top:1px;">Bandung</div>
      </div>
    </div>
    <span style="display:inline-flex;align-items:center;height:36px;padding:0 15px;border-radius:999px;border:1px solid ${C.line};background:${C.surface};font-size:13px;font-weight:600;white-space:nowrap;">Sign in</span>
  </div>

  ${card(`
    <div style="padding:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        ${pill('NEXT SERVICE', C.accentTint, C.accent)}
        <span style="font-size:12px;font-weight:700;color:${C.ink3};">in 4 days</span>
      </div>
      <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;margin-top:12px;line-height:1.15;">Saturday, 14 March</div>
      <div style="display:flex;flex-direction:column;gap:7px;margin-top:11px;">
        <div style="display:flex;align-items:center;gap:9px;color:${C.ink2};">${svg(I.clock, 16)}<span style="font-size:13px;">09.00 &ndash; 11.30</span></div>
        <div style="display:flex;align-items:center;gap:9px;color:${C.ink2};">${svg(I.pin, 16)}<span style="font-size:13px;">Grace Hall &middot; Jl. Cihampelas 42</span></div>
      </div>
    </div>
    <div style="border-top:1px solid ${C.lineSoft};padding:13px 16px;display:flex;align-items:center;gap:11px;">
      ${avExternal('SK', 38)}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:600;">Samuel Kartono</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:2px;">Guest speaker &middot; Growing in Prayer, part 3</div>
      </div>
      ${chev()}
    </div>`)}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Special event')}
    ${card(`<div style="display:flex;align-items:center;gap:13px;padding:13px 14px;">
      ${posterMini(58, 76, 'FAMILY NIGHT', 'A Home Restored')}
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:14px;font-weight:600;line-height:1.3;">Family Night: A Home Restored</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:4px;">Friday, 20 March &middot; 18.30</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:2px;">Esther Manullang</div>
      </div>
      ${chev()}
    </div>`)}
  </div>

  <div style="flex:1 1 auto;"></div>

  ${card(`<div style="padding:16px;">
    <div style="font-family:${SERIF};font-size:17px;font-weight:500;line-height:1.25;">Worshipping here regularly?</div>
    <div style="font-size:13px;color:${C.ink2};line-height:1.5;margin-top:8px;">Ask to be part of things &mdash; a care group, the meeting invitations, the serving list. You keep your membership wherever it already is.</div>
    <div style="display:flex;margin-top:14px;">${btn('Apply to join', { h: 48, icon: I.userPlus })}</div>
  </div>`)}
  <div style="height:2px;"></div>
`)}
${navGuest('Home')}`));
}

/* ===================== SERVICE DETAIL (public tab) ===================== */
pub['Service.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="flex:1 1 auto;font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Service</div>
    ${iconBtn(I.share)}
  </div>

  ${poster(350, 196, 'THIS WEEK', 'Growing<br>in Prayer', 'Part 3 &middot; Praying when nothing changes<br>Samuel Kartono', 'SAT 14 MAR &middot; 09.00 &middot; GRACE HALL')}

  ${card(rows([
    infoRow(I.cal, 'Saturday, 14 March &middot; 09.00 &ndash; 11.30', 'Every Saturday, set by the church'),
    infoRow(I.pin, 'Grace Hall', 'Jl. Cihampelas 42, Bandung &middot; <a href="#">Get directions</a>'),
    infoRow(I.user, 'Samuel Kartono', 'Guest speaker &middot; Immanuel Church, Surabaya'),
  ]))}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Order of service')}
    ${card(rows([
      `<div style="display:flex;gap:14px;padding:11px 14px;"><span style="font-size:13px;font-weight:700;color:${C.accent};width:44px;flex:0 0 44px;">09.00</span><span style="font-size:13px;">Bible study groups</span></div>`,
      `<div style="display:flex;gap:14px;padding:11px 14px;"><span style="font-size:13px;font-weight:700;color:${C.accent};width:44px;flex:0 0 44px;">10.00</span><span style="font-size:13px;">Main service</span></div>`,
      `<div style="display:flex;gap:14px;padding:11px 14px;"><span style="font-size:13px;font-weight:700;color:${C.ink3};width:44px;flex:0 0 44px;">11.30</span><span style="font-size:13px;color:${C.ink2};">Fellowship lunch</span></div>`,
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;gap:10px;">
    ${btn('Add to calendar', { kind: 'ghost', h: 48, icon: I.cal })}
  </div>
  <div style="height:2px;"></div>
`)}
${navGuest('Service')}`));

/* ===================== SERMON LIBRARY (public tab) ===================== */
const sermonRow = (kicker, tone, title, meta) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:11px 12px;">
    ${thumb(112, 64, kicker, tone)}
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:14px;font-weight:600;line-height:1.3;">${title}</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:5px;">${meta}</div>
    </div>
  </div>`;

pub['Sermons.dc.html'] = doc(phone(`
${body(`
  <div style="display:flex;align-items:center;gap:12px;">
    <div style="flex:1 1 auto;font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;">Sermons</div>
    ${iconBtn(I.search)}
  </div>

  ${card(`<div style="display:flex;align-items:center;gap:13px;padding:13px 14px;">
    ${thumb(84, 84, 'CURRENT SERIES', TONES[1])}
    <div style="flex:1 1 auto;min-width:0;">
      ${label('Current series')}
      <div style="font-family:${SERIF};font-size:17px;font-weight:500;margin-top:5px;line-height:1.2;">Growing in Prayer</div>
      <div style="font-size:12px;color:${C.ink2};margin-top:5px;">2 of 5 parts published</div>
    </div>
    ${chev()}
  </div>`)}

  <div style="display:flex;gap:8px;overflow:hidden;">
    ${chip('Latest', true)}${chip('By series')}${chip('By speaker')}
  </div>

  ${card(rows([
    sermonRow('PART 2', TONES[0], 'Praying with others', 'Samuel Kartono &middot; 7 Mar &middot; 42 min'),
    sermonRow('PART 1', TONES[2], 'Where prayer starts', 'Samuel Kartono &middot; 28 Feb &middot; 38 min'),
    sermonRow('STANDALONE', TONES[3], 'The house that listens', 'Esther Manullang &middot; 21 Feb &middot; 45 min'),
    sermonRow('EARLIER SERIES', TONES[1], 'Carrying each other', 'Josua Manoppo &middot; 14 Feb &middot; 40 min'),
  ]))}
  <div style="flex:1 1 auto;"></div>
`)}
${navGuest('Sermons')}`));

/* ===================== ONE SERMON ===================== */
pub['SermonDetail.dc.html'] = doc(phone(`
${topbar('Sermon', iconBtn(I.share))}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:15px;padding:18px 20px 0;">
  <div style="position:relative;">
    ${thumb(350, 197, 'GROWING IN PRAYER &middot; PART 2', TONES[0]).replace(
      `width:26px;height:26px`, `width:56px;height:56px`
    ).replace(`${svg(I.playFill, 15, 0)}`, `${svg(I.playFill, 30, 0)}`)}
  </div>

  <div>
    <div style="font-family:${SERIF};font-size:24px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Praying with others</div>
    <div style="font-size:12px;color:${C.ink3};margin-top:6px;">Growing in Prayer &middot; part 2 of 5</div>
  </div>

  ${card(rows([
    infoRow(I.user, 'Samuel Kartono', 'Guest speaker &middot; Immanuel Church, Surabaya'),
    infoRow(I.cal, 'Saturday, 7 March 2026', 'Recorded at Grace Hall &middot; 42 min'),
  ]))}

  <div style="font-size:13px;color:${C.ink2};line-height:1.6;">Praying together is harder than praying alone, and that is the point. This part looks at what changes when a room agrees on one thing.</div>

  <div style="display:flex;">${btn('Watch on YouTube', { kind: 'outlineAccent', h: 48, icon: I.playFill })}</div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('More from this series')}
    ${card(rows([
      sermonRow('PART 1', TONES[2], 'Where prayer starts', 'Samuel Kartono &middot; 28 Feb'),
    ]))}
  </div>
  <div style="flex:1 1 auto;"></div>
</div>`));

/* ===================== APPLICATION FORM ===================== */
const choiceCard = (title, sub, on) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;background:${C.surface};border:${on ? `1.5px solid ${C.accent}` : `1px solid ${C.line}`};border-radius:12px;">
  <div style="width:20px;height:20px;flex:0 0 20px;border-radius:999px;border:${on ? `6px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:1px;"></div>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:14px;font-weight:700;">${title}</div>
    <div style="font-size:12px;color:${C.ink2};margin-top:4px;line-height:1.45;">${sub}</div>
  </div>
</div>`;

pub['Join.dc.html'] = doc(phone(`
<div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
  ${iconBtn(I.x)}
  <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${C.ink2};">Application</div>
  <span style="font-size:14px;font-weight:700;color:${C.accent};">Submit</span>
</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:14px;padding:18px 20px 0;">
  <div style="font-size:13px;color:${C.ink2};line-height:1.5;">Two fields and one question. The church office will talk to you before anything is confirmed.</div>

  ${field('Full name', 'Rian Wijaya')}
  ${field('Phone', '812-1234-5678', { prefix: '+62' })}

  <div style="display:flex;flex-direction:column;gap:9px;">
    <span style="font-size:12px;font-weight:700;color:${C.ink2};">What are you asking for?</span>
    <span style="font-size:11px;color:${C.ink3};line-height:1.45;">The office calls the first one a Community Member and the second a Registered Member. You do not have to.</span>
    ${choiceCard('I keep my membership where it is', 'My home church stays my home church. Here I want a care group, the meeting invitations and the serving list.', true)}
    ${choiceCard('I want to move my membership here', 'This becomes my church on paper too. It needs a transfer letter from the other one.', false)}
    ${choiceCard('I am not sure yet', 'Let us talk first. Nothing is decided by this form.', false)}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:22px;">
    <div style="display:flex;">${btn('Submit', { h: 52 })}</div>
    <div style="display:flex;align-items:flex-start;gap:10px;margin-top:13px;">
      <div style="width:17px;height:17px;flex:0 0 17px;border-radius:6px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;margin-top:1px;">${svg(I.check, 11, 3)}</div>
      <div style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.55;">The church may message me on WhatsApp about services, my care group and anything I am asked to do. Nothing else, and I can stop it any time.</div>
    </div>
    <div style="text-align:center;font-size:11px;color:${C.ink3};margin-top:11px;line-height:1.5;">Only the church office sees this form.</div>
  </div>
</div>`));

/* ===================== APPLICATION SUBMITTED ===================== */
const step = (title, meta, state) => {
  const dot = {
    done: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.sageTint};color:${C.sage};display:flex;align-items:center;justify-content:center;">${svg(I.check, 13, 2.4)}</div>`,
    now: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:${C.amberTint};display:flex;align-items:center;justify-content:center;"><div style="width:8px;height:8px;border-radius:999px;background:${C.amber};"></div></div>`,
    todo: `<div style="width:22px;height:22px;flex:0 0 22px;border-radius:999px;border:1.5px dashed ${C.line};"></div>`,
  }[state];
  return `<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;">${dot}<div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;color:${state === 'todo' ? C.ink3 : C.ink};">${title}</div>${meta ? `<div style="font-size:12px;color:${C.ink3};margin-top:2px;">${meta}</div>` : ''}</div></div>`;
};

const lockedRow = (icon, title) =>
  `<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;"><span style="color:${C.ink3};display:flex;">${svg(icon, 18)}</span><div style="flex:1 1 auto;font-size:13px;font-weight:600;color:${C.ink2};">${title}</div><span style="color:${C.ink3};display:flex;">${svg(I.lock, 15, 2)}</span></div>`;

pub['Pending.dc.html'] = doc(phone(`
${body(`
  <div style="width:64px;height:64px;border-radius:999px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;">${svg(I.clock, 30, 1.7)}</div>
  <div>
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Application sent</div>
    <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:9px;">The church office will contact you on <span style="font-weight:600;color:${C.ink};">+62 812-1234-5678</span> within three working days.</div>
  </div>

  ${card(rows([
    step('Sent', '8 March, 14.22', 'done'),
    step('Reviewed by the office', 'In progress', 'now'),
    step('Confirmed by the office', 'They set your status after you talk', 'todo'),
  ]))}

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Opens up once confirmed')}
    ${card(rows([
      lockedRow(I.group, 'Care group and meeting RSVP'),
      lockedRow(I.hand, 'Serving schedule and open slots'),
      lockedRow(I.users, 'Contacts in your care group'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;padding-bottom:26px;">${btn('Back to home', { kind: 'ghost', h: 50 })}</div>
`)}`));

/* ===================== SIGN IN ===================== */
pub['SignIn.dc.html'] = doc(phone(`
<div style="display:flex;padding:54px 20px 0;">${iconBtn(I.x)}</div>
<div style="flex:1 1 auto;display:flex;flex-direction:column;padding:34px 26px 40px;">
  <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.015em;line-height:1.1;">Welcome back</div>
  <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:10px;max-width:272px;">Sign in with the phone number the church office has on file.</div>
  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;flex-direction:column;gap:16px;">
    ${field('Phone', '812-1234-5678', { prefix: '+62' })}
    <div style="display:flex;">${btn('Send sign-in code', { h: 52 })}</div>
    <div style="display:flex;align-items:center;gap:12px;"><span style="flex:1 1 0;height:1px;background:${C.line};"></span><span style="font-size:12px;color:${C.ink3};font-weight:600;">or</span><span style="flex:1 1 0;height:1px;background:${C.line};"></span></div>
    <div style="display:flex;">${btn('Use email instead', { kind: 'ghost', h: 52, icon: I.mail })}</div>
  </div>
  <div style="margin-top:26px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.5;">No account yet? <a href="#">Apply to join</a> &mdash; you can browse<br>sermons and service times without one.</div>
</div>`));

/* ===================== VERIFY CODE ===================== */
const otpBox = (d, active = false) =>
  `<div style="flex:1 1 0;height:56px;border-radius:12px;background:${C.surface};border:${active ? `1.5px solid ${C.accent}` : `1px solid ${C.line}`};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;font-family:${SERIF};">${d}</div>`;

pub['Verify.dc.html'] = doc(phone(`
${topbar('Sign in')}
<div style="flex:1 1 auto;display:flex;flex-direction:column;padding:26px 26px 40px;">
  <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Enter the code</div>
  <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:10px;">We sent six digits over WhatsApp to <span style="font-weight:600;color:${C.ink};">+62 812-1234-5678</span>. <a href="#">Change number</a></div>
  <div style="display:flex;gap:9px;margin-top:28px;">
    ${otpBox('4')}${otpBox('8')}${otpBox('2')}${otpBox(`<span style="width:2px;height:24px;background:${C.accent};display:block;"></span>`, true)}${otpBox('')}${otpBox('')}
  </div>
  <div style="display:flex;align-items:center;gap:7px;margin-top:18px;color:${C.ink3};">${svg(I.clock, 15)}<span style="font-size:12px;font-weight:600;">Resend in 00.42</span></div>
  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;">${btn('Continue', { kind: 'disabled', h: 52 })}</div>
  <div style="margin-top:18px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.5;">Your number is only used to sign in.<br>It is never shown to others without your consent.</div>
</div>`));

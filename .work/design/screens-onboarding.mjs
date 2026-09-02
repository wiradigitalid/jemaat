import {
  C, SERIF, doc, svg, I, label, card, pill, av, sq, btn, chev, iconBtn,
  phone, body, topbar, rows, infoRow, tierPill, qrBlock, churchRow,
} from './lib.mjs';

export const onb = {};

/* ===================== WELCOME - first run, no church chosen yet ===================== */
onb['Welcome.dc.html'] = doc(phone(`
<div style="flex:1 1 auto;display:flex;flex-direction:column;padding:100px 26px 40px;">
  <div style="display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:14px;background:${C.accent};color:#FFFFFF;">${svg(I.group, 30, 1.9)}</div>
  <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;margin-top:24px;line-height:1;">Jemaat</div>
  <div style="font-size:15px;color:${C.ink2};line-height:1.55;margin-top:13px;max-width:280px;">One app, many churches. Pick yours first so nothing gets mixed up.</div>

  <div style="flex:1 1 auto;"></div>

  <div style="display:flex;flex-direction:column;gap:12px;">
    <div style="display:flex;">${btn('Scan church QR', { h: 56, icon: I.qr })}</div>
    <div style="display:flex;">${btn('Enter church code', { kind: 'ghost', h: 56, icon: I.grid })}</div>
  </div>
  <div style="margin-top:20px;text-align:center;"><a href="#" style="font-size:13px;font-weight:700;">Look it up by name and city</a></div>
  <div style="margin-top:7px;text-align:center;font-size:11px;color:${C.ink3};line-height:1.5;">Needs the full name and the city. There is no list<br>of churches to browse, on purpose.</div>
  <div style="margin-top:24px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.55;">Your church prints the code in the bulletin<br>and shows the QR at the welcome desk.</div>
</div>`));

/* ===================== SCAN QR ===================== */
const bracket = (corner) => {
  const pos = {
    tl: 'top:-2px;left:-2px;border-top:3px solid;border-left:3px solid;border-top-left-radius:10px;',
    tr: 'top:-2px;right:-2px;border-top:3px solid;border-right:3px solid;border-top-right-radius:10px;',
    bl: 'bottom:-2px;left:-2px;border-bottom:3px solid;border-left:3px solid;border-bottom-left-radius:10px;',
    br: 'bottom:-2px;right:-2px;border-bottom:3px solid;border-right:3px solid;border-bottom-right-radius:10px;',
  }[corner];
  return `<div style="position:absolute;${pos}width:34px;height:34px;border-color:#F7EFE7;"></div>`;
};

onb['ScanQR.dc.html'] = doc(`
<div style="width:390px;height:844px;background:#14110F;display:flex;flex-direction:column;">
  <div style="display:flex;align-items:center;gap:12px;padding:54px 20px 0;">
    <div style="width:40px;height:40px;flex:0 0 40px;border-radius:999px;border:1px solid #F7EFE733;display:flex;align-items:center;justify-content:center;color:#F7EFE7;">${svg(I.x, 19)}</div>
    <div style="flex:1 1 auto;font-size:14px;font-weight:700;letter-spacing:0.02em;color:#F7EFE7CC;">Scan church QR</div>
  </div>

  <div style="flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;padding:0 34px;">
    <div style="position:relative;width:236px;height:236px;border-radius:12px;overflow:hidden;">
      <div style="opacity:0.34;">${qrBlock(236, '#F7EFE7', 'transparent')}</div>
      ${bracket('tl')}${bracket('tr')}${bracket('bl')}${bracket('br')}
    </div>
    <div style="text-align:center;font-size:14px;color:#F7EFE7B3;line-height:1.6;">Point at the QR code on your bulletin,<br>or at the welcome desk.</div>
  </div>

  <div style="padding:0 26px 44px;display:flex;flex-direction:column;gap:16px;">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;height:52px;border-radius:12px;border:1px solid #F7EFE73D;color:#F7EFE7;font-size:15px;font-weight:600;">${svg(I.grid, 18)}<span>Enter code instead</span></div>
    <div style="text-align:center;font-size:11px;color:#F7EFE766;line-height:1.5;">The camera is only used to read the code.</div>
  </div>
</div>`);

/* ===================== ENTER CODE ===================== */
onb['EnterCode.dc.html'] = doc(phone(`
${topbar('Find your church')}
<div style="flex:1 1 auto;display:flex;flex-direction:column;padding:28px 26px 40px;">
  <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;">Enter your church code</div>
  <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:10px;">It is printed on the bulletin, or ask at the welcome desk.</div>

  <div style="display:flex;align-items:center;height:66px;padding:0 18px;background:${C.surface};border:1.5px solid ${C.accent};border-radius:14px;margin-top:26px;">
    <span style="font-size:20px;font-weight:700;letter-spacing:0.14em;">GRACE-BDG</span>
    <span style="width:2px;height:26px;background:${C.accent};margin-left:4px;"></span>
  </div>
  <div style="font-size:12px;color:${C.ink3};line-height:1.5;margin-top:10px;">Six to twelve letters and numbers. Capitals do not matter.</div>

  <div style="display:flex;">${btn('Continue', { h: 52 }).replace('flex:1 1 0;', 'flex:1 1 0;margin-top:22px;')}</div>

  <div style="display:flex;align-items:center;gap:12px;margin-top:26px;"><span style="flex:1 1 0;height:1px;background:${C.line};"></span><span style="font-size:12px;color:${C.ink3};font-weight:600;">or</span><span style="flex:1 1 0;height:1px;background:${C.line};"></span></div>
  <div style="display:flex;margin-top:20px;">${btn('Scan the QR instead', { kind: 'ghost', h: 52, icon: I.qr })}</div>

  <div style="flex:1 1 auto;"></div>
  <div style="text-align:center;font-size:12px;color:${C.ink3};line-height:1.55;">Code not working? It may have been changed.<br><a href="#">Find your church by name</a></div>
</div>`));

/* ===================== CONFIRM CHURCH ===================== */
onb['ConfirmChurch.dc.html'] = doc(phone(`
${topbar('Is this right?')}
<div style="flex:1 1 auto;display:flex;flex-direction:column;padding:30px 26px 40px;">
  <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
    ${sq('G', 74)}
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;margin-top:18px;">Grace Community<br>Church</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:9px;line-height:1.5;">Bandung &middot; Jl. Cihampelas 42</div>
    <div style="margin-top:12px;">${pill('GRACE-BDG', C.accentTint, C.accent, 'letter-spacing:0.1em;')}</div>
  </div>

  <div style="margin-top:26px;">
    ${card(rows([
      infoRow(I.cal, 'Every Saturday, 09.00', 'Main service, 90 minutes'),
      infoRow(I.group, '5 care groups', 'Across Sunter, Dago, Cimahi, Buahbatu'),
    ]))}
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <div style="display:flex;">${btn('Yes, this is my church', { h: 52, icon: I.check })}</div>
    <div style="display:flex;">${btn('Not this one', { kind: 'ghost', h: 52 })}</div>
  </div>
  <div style="margin-top:18px;text-align:center;font-size:12px;color:${C.ink3};line-height:1.55;">You can add another church later,<br>and remove this one any time.</div>
</div>`));

/* ===================== MY CHURCHES - add and remove ===================== */
const moreBtn = () =>
  `<span style="width:34px;height:34px;flex:0 0 34px;border-radius:999px;color:${C.ink3};display:flex;align-items:center;justify-content:center;">${svg(I.more, 18)}</span>`;

onb['MyChurches.dc.html'] = doc(phone(`
${topbar('My churches', iconBtn(I.plus, `background:${C.accent};color:#FFFFFF;border-color:${C.accent};`))}
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:17px;padding:22px 20px 0;">
  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Currently viewing')}
    ${card(`
      ${churchRow('G', 'Grace Community Church', 'Bandung &middot; GRACE-BDG', pill('Viewing', C.accentTint, C.accent))}
      <div style="border-top:1px solid ${C.lineSoft};padding:11px 14px;display:flex;align-items:center;gap:9px;">
        <span style="font-size:12px;color:${C.ink3};font-weight:600;">Your status here</span>
        <div style="flex:1 1 auto;"></div>
        ${tierPill('community')}
      </div>`, 'border-color:#B4562F55;')}
  </div>

  <div style="display:flex;flex-direction:column;gap:9px;">
    ${label('Also following')}
    ${card(`
      ${churchRow('I', 'Immanuel Church', 'Surabaya &middot; IMANUEL-SBY', moreBtn())}
      <div style="border-top:1px solid ${C.lineSoft};padding:11px 14px;display:flex;align-items:center;gap:9px;">
        <span style="font-size:12px;color:${C.ink3};font-weight:600;">Your status here</span>
        <div style="flex:1 1 auto;"></div>
        ${tierPill('registered')}
      </div>`)}
  </div>

  <div style="display:flex;align-items:center;gap:12px;padding:14px;border:1.5px dashed ${C.line};border-radius:12px;">
    <span style="color:${C.accent};display:flex;">${svg(I.plus, 19)}</span>
    <div style="flex:1 1 auto;"><div style="font-size:13px;font-weight:600;">Add a church</div><div style="font-size:12px;color:${C.ink3};margin-top:3px;">Scan a QR or type a code</div></div>
    ${chev()}
  </div>

  ${card(`<div style="display:flex;align-items:flex-start;gap:12px;padding:14px;">
    <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 18)}</span>
    <div style="flex:1 1 auto;min-width:0;font-size:12px;color:${C.ink2};line-height:1.55;">Your status is <span style="font-weight:700;color:${C.ink};">per church</span>. Being Registered in Surabaya does not change your status in Bandung, and neither church sees the other.</div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:26px;font-size:11px;color:${C.ink3};line-height:1.55;">Removing a church only stops this app from showing it. Your record stays with that church&rsquo;s office.</div>
</div>`));

/* ===================== REMOVE CHURCH ===================== */
const consequence = (icon, title, sub) =>
  `<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 14px;"><span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(icon, 18)}</span><div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;line-height:1.35;">${title}</div><div style="font-size:12px;color:${C.ink2};margin-top:3px;line-height:1.45;">${sub}</div></div></div>`;

onb['LeaveChurch.dc.html'] = doc(phone(`
<div style="display:flex;padding:54px 20px 0;">${iconBtn(I.x)}</div>
<div style="flex:1 1 auto;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:18px;padding:26px 20px 0;">
  <div style="width:60px;height:60px;border-radius:999px;background:${C.accentTint};color:${C.accentDark};display:flex;align-items:center;justify-content:center;">${svg(I.out, 28, 1.8)}</div>
  <div>
    <div style="font-family:${SERIF};font-size:27px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Remove Immanuel Church?</div>
    <div style="font-size:14px;color:${C.ink2};line-height:1.55;margin-top:9px;">Surabaya &middot; IMANUEL-SBY</div>
  </div>

  ${card(rows([
    consequence(I.cal, 'You stop seeing their services and sermons', 'No more reminders, posters or announcements from them.'),
    consequence(I.group, 'You leave their care group and serving roster', 'Any slot you claimed there is released back to the group.'),
    consequence(I.checkCircle, 'Your membership record stays with them', 'This is not a resignation. Only the church office can change your membership.'),
  ]))}

  <div style="flex:1 1 auto;"></div>
  <div style="display:flex;flex-direction:column;gap:12px;padding-bottom:24px;">
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;height:52px;border-radius:12px;background:${C.accentDark};color:#FFFFFF;font-size:15px;font-weight:600;">${svg(I.out, 18)}<span>Remove church</span></div>
    <div style="display:flex;">${btn('Keep it', { kind: 'ghost', h: 52 })}</div>
    <div style="text-align:center;font-size:12px;color:${C.ink3};line-height:1.5;margin-top:2px;">You can rejoin any time with the code IMANUEL-SBY.</div>
  </div>
</div>`));

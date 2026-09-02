import { C, SERIF, doc, svg, I, card, label, av, tierPill } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * AXIS THREE, WHICH NEVER GOT A SCREEN.
 *
 * Iteration 5 named three axes: standing, serving, and app access.
 * Sixty-seven artboards later, standing and serving both have screens
 * and app access has none. It was assumed in every sentence - "only the
 * office can", "the leader sees", "granted separately" - and nothing
 * anywhere granted or revoked it.
 *
 * Two things this screen has to get right that a generic permissions
 * table gets wrong:
 *
 * A ROLE MUST SAY WHAT IT DOES, in the words of this church's own work.
 * "Can edit people" is useless; "adds and corrects the register" is a
 * job someone recognises.
 *
 * ONE ADMINISTRATOR IS A SINGLE POINT OF FAILURE. A church whose only
 * admin dies or leaves in anger is locked out of its own register - and
 * this product has a deceased lifecycle, so that is not hypothetical.
 */
export const roles = {};

const holder = (init, name, role, meta, tier) => `
<div style="display:flex;align-items:center;gap:13px;padding:12px 18px;border-top:1px solid ${C.lineSoft};">
  ${av(init, 38)}
  <div style="width:170px;flex:0 0 170px;min-width:0;">
    <div style="font-size:13px;font-weight:700;">${name}</div>
    <div style="margin-top:5px;">${tier}</div>
  </div>
  <div style="width:168px;flex:0 0 168px;font-size:12px;font-weight:600;color:${C.accent};">${role}</div>
  <div style="flex:1 1 auto;font-size:11px;color:${C.ink3};line-height:1.45;">${meta}</div>
  <span style="color:${C.ink3};display:flex;">${svg(I.more, 18)}</span>
</div>`;

const roleDef = (name, count, does, notes) => `
<div style="padding:14px 18px;border-top:1px solid ${C.lineSoft};">
  <div style="display:flex;align-items:baseline;gap:10px;">
    <span style="font-size:13px;font-weight:700;">${name}</span>
    <span style="font-size:11px;font-weight:700;color:${C.ink3};">${count}</span>
  </div>
  <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.55;">${does}</div>
  ${notes ? `<div style="font-size:11px;color:${C.ink3};margin-top:6px;line-height:1.5;">${notes}</div>` : ''}
</div>`;

roles['WebRoles.dc.html'] = doc(`
<div style="width:1440px;height:1000px;background:${C.bg};display:flex;">
  ${sidebar('Settings')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Who can do what', 'Six people have access beyond their own household &middot; 248 do not',
      `${wBtn('Give someone access', I.userPlus, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

      <div style="flex:1 1 auto;min-width:0;">
        ${card(`
          <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;">
            <div style="width:38px;flex:0 0 38px;"></div>
            <div style="width:170px;flex:0 0 170px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">PERSON</div>
            <div style="width:168px;flex:0 0 168px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">CAN DO</div>
            <div style="flex:1 1 auto;font-size:10px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">GIVEN BY, AND WHEN</div>
            <div style="width:18px;flex:0 0 18px;"></div>
          </div>
          ${holder('LS', 'Lidya Suryani', 'Church office', 'Andreas Wibowo &middot; Feb 2021 &middot; used yesterday', tierPill('registered'))}
          ${holder('AW', 'Andreas Wibowo', 'Administrator', 'The first account &middot; used 3 days ago', tierPill('community'))}
          ${holder('BH', 'Budi Halim', 'Leads Anugerah', 'Lidya Suryani &middot; Feb 2021 &middot; used yesterday', tierPill('registered'))}
          ${holder('RS', 'Ruth Simanjuntak', 'Leads Damai', 'Lidya Suryani &middot; Mar 2023 &middot; used last week', tierPill('registered'))}
          ${holder('MN', 'Maruli Nainggolan', 'Leads Harapan', 'Lidya Suryani &middot; Aug 2024 &middot; never signed in', tierPill('registered'))}
          ${holder('GS', 'Grace Sutanto', 'Leads Young Adults', 'Lidya Suryani &middot; Jan 2026 &middot; used yesterday', tierPill('guest'))}
          <div style="padding:14px 18px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:11px;">
            <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 17)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">Two rows are worth a second look. <span style="font-weight:700;">Maruli has led Harapan for eighteen months and has never signed in</span> &mdash; so that group has no attendance and no RSVP, and nobody noticed because the access was granted, not used. And <span style="font-weight:700;">Grace leads a group while still a Guest</span>, which is correct: leading is serving, not standing. The screen shows the standing so nobody 'fixes' it.</span>
          </div>`, 'overflow:hidden;')}
      </div>

      <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:15px 18px 4px;">${label('What each one actually means')}</div>
          ${roleDef('Administrator', '1 &mdash; needs 2', 'Everything the office does, plus giving and taking away access, and closing the church.', 'A church with one administrator is locked out of its own register the day that person dies or leaves in anger. This product has a deceased lifecycle, so that is not hypothetical. Two is the minimum and the screen should refuse one.')}
          ${roleDef('Church office', '1', 'Adds and corrects the register, confirms applicants, publishes the week, runs the import, downloads everything.', 'Cannot give anyone else access. That separation is the whole point of having two roles instead of one.')}
          ${roleDef('Leads a care group', '4', 'One group only: takes attendance, sees who answered, has the contacts, manages the hosting rota.', 'Ends the day the handover in W9 completes. Nobody has to remember to remove it.')}
          ${roleDef('Everyone else', '248', 'Their own household, their own care group, and everything public.', 'This is not a role. It is what being a member already means, and no grant creates it.')}
          <div style="height:8px;"></div>`)}

        ${card(`<div style="padding:18px 20px;display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">Taking access away</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">Immediate, and it removes only access. Their membership, their household and their whole history stay exactly as they were &mdash; being removed from a role is not being removed from a church.<br><br>One order matters: <span style="font-weight:700;color:${C.ink};">take a leader through W9 first.</span> Revoking without handing over leaves a group with fourteen people, a hosting rota and nobody who can take attendance.</div>
          </div>
        </div>`, 'border-color:#B4562F55;')}
        <div style="flex:1 1 auto;"></div>
      </div>
    </div>
  </div>
</div>`);

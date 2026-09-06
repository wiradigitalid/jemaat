import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE FRONT DOOR.
 *
 * Thirty-nine iterations left the reasoning in thirty sticky notes, and
 * nobody reads thirty sticky notes. This is the page that replaces them:
 * what the product is, the decisions that cost money to change, the
 * positions that were chosen rather than inherited, and an honest list
 * of what is still missing.
 *
 * It is the launch page of the canvas on purpose. Everything else is
 * evidence for what is claimed here.
 */
export const start = {};

const decision = (n, what, why) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 18px;border-top:1px solid ${C.lineSoft};">
  <span style="width:19px;height:19px;flex:0 0 19px;border-radius:999px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12px;font-weight:700;line-height:1.4;">${what}</div>
    <div style="font-size:11px;color:${C.ink2};margin-top:3px;line-height:1.45;">${why}</div>
  </div>
</div>`;

const position = (what, why) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:10px 18px;border-top:1px solid ${C.lineSoft};">
  <span style="color:${C.sage};display:flex;padding-top:3px;">${svg(I.check, 14, 2.4)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12px;font-weight:700;line-height:1.4;">${what}</div>
    <div style="font-size:11px;color:${C.ink2};margin-top:3px;line-height:1.45;">${why}</div>
  </div>
</div>`;

const pageRow = (name, n, what) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 18px;border-top:1px solid ${C.lineSoft};">
  <span style="width:132px;flex:0 0 132px;font-size:12px;font-weight:700;">${name}</span>
  <span style="width:34px;flex:0 0 34px;font-size:11px;color:${C.ink3};font-weight:700;">${n}</span>
  <span style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.45;">${what}</span>
</div>`;

const gap = (t) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:8px 18px;">
  <span style="color:${C.amber};display:flex;padding-top:3px;">${svg(I.x, 13, 2.2)}</span>
  <span style="flex:1 1 auto;font-size:11px;color:${C.ink2};line-height:1.5;">${t}</span>
</div>`;

start['Start.dc.html'] = doc(`
<div style="width:1440px;height:1420px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">

  <div style="display:flex;align-items:flex-end;gap:24px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;line-height:1.1;">Jemaat</div>
      <div style="font-size:14px;color:${C.ink2};margin-top:12px;line-height:1.6;max-width:820px;">A church membership and care group product for Indonesian congregations. One installation serving many churches, each found by its own code. <span style="font-weight:700;color:${C.ink};">The first build is the church office alone</span> &mdash; the register, on a desktop and at phone width for the volunteer who has no desk. The congregation, the guest and the member arrive with the mobile app, which is a separate build: S12 and S13 show what that leaves in and what goes dormant.<br><br><span style="font-weight:700;color:${C.ink};">Everything else in this canvas is evidence for what is claimed on this page.</span></div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:600;">93</div>
      <div style="font-size:11px;color:${C.ink3};line-height:1.6;margin-top:4px;">artboards &middot; 46 iterations<br>Design only. No code yet.</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 18px 6px;">${label('Cheap now, a migration later')}
          <div style="font-size:11px;color:${C.ink2};margin-top:6px;line-height:1.5;">The real output of 39 iterations. Every one of these is free to decide today and costs a rewrite once the schema exists. Detail on S5.</div>
        </div>
        ${decision('1', 'A service is an entity, not a date', 'Churches above ~400 members run two to four a week')}
        ${decision('2', 'Standing belongs to person &times; church', 'Never person.standing. Someone can be Registered in Surabaya and Community in Bandung')}
        ${decision('3', 'Lifecycle is its own field', 'Transferred and deceased are not ranks on the tier ladder')}
        ${decision('4', 'Care group membership is a relation', 'Joining a group never touches anyone&rsquo;s standing')}
        ${decision('5', 'Assignments point at a person', 'So a guest pianist can be scheduled with no membership at all')}
        ${decision('6', 'Address on the household, standing on the person', 'Change an address once, the whole family moves')}
        ${decision('7', 'One global person table, everything else scoped', 'The only decision here that cannot be retrofitted')}
        <div style="height:8px;"></div>`, `border-color:#B4562F55;`)}

      ${card(`
        <div style="padding:15px 18px 6px;">${label('What is in this canvas')}</div>
        ${pageRow('Onboarding', '6', 'Finding a church before any account exists')}
        ${pageRow('Public', '11', 'What a stranger sees, applying, signing in, and both front-door failures')}
        ${pageRow('Signed in', '25', 'Members, households, care groups, RSVP, attendance, serving')}
        ${pageRow('Church office', '17', 'The queue, the register, the week, import, export, transfers, roles, merge')}
        ${pageRow('Home, stressed', '7', 'One screen in Indonesian, offline, at readable type, quiet, at 2,000, and as R0 ships')}
        ${pageRow('Ships first', '11', 'The release map, two open decisions, and eight specification sheets')}
        ${pageRow('The admin register', '15', 'The first build: one role, the household split, the serving catalogue, and R0 re-derived')}
        <div style="padding:12px 18px 14px;border-top:1px solid ${C.lineSoft};font-size:11px;color:${C.ink2};line-height:1.55;">
          <span style="font-weight:700;color:${C.ink};">Two code series, and they are not the same thing.</span>
          <span style="font-family:ui-monospace,monospace;">O P M W</span> are screens, numbered per page &mdash; and a width is never a new series, which is why the phone-sized office screens are still <span style="font-family:ui-monospace,monospace;">W</span>.
          <span style="font-family:ui-monospace,monospace;">S1&ndash;S13</span> are the specification sheets.
          <span style="font-family:ui-monospace,monospace;">R0 R1 R2</span> are the three releases and never a sheet; <span style="font-family:ui-monospace,monospace;">R0&thinsp;A</span> is R0 cut down to the administrator.
        </div>`)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${card(`
        <div style="padding:15px 18px 6px;">${label('Ten positions, each one chosen rather than inherited')}
          <div style="font-size:11px;color:${C.ink2};margin-top:6px;line-height:1.5;">These are the places the design says no to something a competitor ships. Each is defensible and each is reversible &mdash; but reverse one knowingly, not by accident.</div>
        </div>
        ${position('The worship day is a setting, not Saturday', 'The pilot church meets on Saturday. A Sunday church changes one field and no screen notices')}
        ${position('Institutional vocabulary never appears before someone is inside', 'P5 asks about the situation, not about Community versus Registered. A form that asks an unanswerable question gets closed')}
        ${position('There is no rejection screen, anywhere', 'The furthest the office can go is asking for a conversation. A church does not refuse someone by push notification')}
        ${position('No count, no percentage, no score &mdash; in the UI or the schema', 'A column that exists is eventually shown. M23 refuses one, and S5 has no attendance_rate to be tempted by')}
        ${position('Nothing pastoral is automated down any pipe', 'A leader chasing you is care. A robot chasing you is not, and the difference is the whole product')}
        ${position('Home shows only what is due', 'Most weeks most members are due nothing, and Home should then be nearly empty. Empty is a correct state')}
        ${position('The app is optional for ordinary members', 'WhatsApp reply buttons carry RSVP, serving and hosting. The office needs the web, the leader needs the app, the congregation needs nothing &mdash; and the first build is the office alone, S12')}
        ${position('Serving is not a status, and leading is not a rank', 'Grace leads a care group while still a Guest. The screen shows her standing so nobody tries to correct it')}
        ${position('The register is the church&rsquo;s, and it can always leave', 'Export is on every Tuesday, not on the way out. MIT, self-hostable, and the JSON holds nothing back')}
        ${position('No public directory of churches using Jemaat', 'The obvious growth feature. It would publish a national index of congregations with their addresses and meeting times')}
        <div style="height:8px;"></div>`)}
    </div>

    <div style="width:392px;flex:0 0 392px;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        <div style="padding:15px 18px 8px;">${label('How it ships')}</div>
        <div style="padding:0 18px 14px;font-size:12px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">R0 &middot; 15 screens, 7 capabilities.</span> One pilot church, accounts by hand, no public area. The care group week works end to end and the church enters its own register.<br><br>
          <span style="font-weight:700;color:${C.ink};">R1 &middot; 13 screens, 4 capabilities.</span> Any church can be found, join itself and import its people. This is where it becomes a product.<br><br>
          <span style="font-weight:700;color:${C.ink};">R2 &middot; 4 screens.</span> The promises the first two made.<br><br>
          Sixteen more are parked with a reason each, and the biggest single cut is the whole church-wide serving module &mdash; the volunteer rotation that was asked for lives inside a care group, and M9 already does it.
        </div>`)}

      ${card(`
        <div style="padding:15px 18px 8px;">${label('Two decisions still open')}</div>
        <div style="padding:0 18px 14px;font-size:12px;color:${C.ink2};line-height:1.6;">
          <span style="font-weight:700;color:${C.ink};">M20, the weekly warta.</span> Beyond the original brief, and the only thing giving an ordinary member a reason to open the app between meetings. S2 shows both versions of their week. The office already types the content either way.<br><br>
          <span style="font-weight:700;color:${C.ink};">M23, the noticing prompt.</span> Pastoral care or attendance surveillance depending entirely on how a church holds it. S3 separates what the design enforces from what it cannot, and recommends shipping the capability with the assumption switched off.
        </div>`, `border-color:#9A722344;`)}

      ${card(`
        <div style="padding:15px 18px 6px;">${label('Known to be missing')}</div>
        ${gap('None of this is in the repo corpus yet. It lives in a scratch folder, so a coding worker cannot be pointed at it.')}
        ${gap('Seventeen decisions are stated on screens and in notes, but no DEC- has been written. A decision nobody registered is a decision that quietly disappears in week three.')}
        ${gap('Spacing was never systematised the way colour and type were. S6 derives a scale from what the screens use; it needs enforcing in code.')}
        ${gap('Time zones are named on W12 and applied nowhere. Every screen says 19.30 and none says which.')}
        ${gap('Bad exits &mdash; discipline, safeguarding, someone who must not be assigned &mdash; never examined. It needs the children&rsquo;s ministry module, which is not in any release.')}
        <div style="height:8px;"></div>`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

import {
  C, T, R, SERIF, doc, svg, I, card, label, rows, av, avExternal, btn, chev,
  phone, bodyPushed, topbar, tierPill, pill, iconBtn,
} from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * THE ARCHIVE AND THE STATEMENT.
 *
 * Iteration 42. The question that produced this set: if a person can
 * change their own name, the church's archive moves under it - and a
 * membership roll that moves on its own is not a record, it is a feed.
 *
 * Every earlier answer in this design tried to solve it by deciding
 * WHERE a value is stored - global row, church row - and each answer
 * broke something. Storing it globally lets one church rename someone
 * in another. Storing it only per church means a person corrects their
 * name four times and still sees the old one somewhere.
 *
 * THE AXIS WAS WRONG AGAIN, for the third time in this project. Not
 * WHERE a value lives, but WHO MAY WRITE IT. Two stores, and each has
 * exactly one writer:
 *
 *   THE STATEMENT   one per person, written only by that person
 *   THE ARCHIVE     one per church per person, written only by that church
 *
 * Nothing flows between them by itself. A church may LOOK UP the
 * statement, and ADOPT it one field at a time, and that adoption is the
 * church writing to its own archive - which is the only kind of write
 * there is. No sync, no propagation, no merge job at 3am.
 *
 * What this costs: a person who corrects their address may see the old
 * one at a church for weeks. That is not a defect. That church really
 * has not been told yet, and pretending otherwise is what makes
 * registers untrustworthy.
 *
 * What it buys: an office can be handed this product and told, truthfully,
 * that nothing in their register ever changes except by their own hand.
 */
export const rec = {};

/* ── shared pieces ─────────────────────────────────────────────────── */

const STATED = (t = 'stated') =>
  `<span style="display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:${R.pill}px;background:${C.amberTint};color:${C.amber};font-size:${T.micro}px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">${svg(I.quote, 11, 0)}<span>${t}</span></span>`;

const OURS = () =>
  `<span style="display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:${R.pill}px;background:${C.sageTint};color:${C.sage};font-size:${T.micro}px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">ours</span>`;

/* One field in the church's own archive. `flag` marks that the person has
   stated something different - a marker, never a change. */
const archiveRow = (lab, value, meta, flag = '') =>
  `<div style="display:flex;align-items:flex-start;gap:16px;padding:13px 16px;">
    <span style="width:112px;flex:0 0 112px;font-size:${T.xs}px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};padding-top:2px;">${lab}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:${T.md}px;font-weight:600;line-height:1.35;">${value}</div>
      <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:3px;">${meta}</div>
    </div>
    ${flag}
  </div>`;

const note = (text, tone = C.ink2) =>
  `<div style="font-size:${T.sm}px;color:${tone};line-height:1.55;">${text}</div>`;

const banner = (icon, title, textLine, bg, fg) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:${R.card}px;background:${bg};border:1px solid ${fg}33;">
  <span style="color:${fg};display:flex;padding-top:1px;">${svg(icon, 19)}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:${T.base}px;font-weight:700;color:${fg};">${title}</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};margin-top:4px;line-height:1.5;">${textLine}</div>
  </div>
</div>`;

/* ===================== W14  THE CHURCH'S OWN RECORD ===================== */

rec['WebArchive.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Andreas Wibowo', 'Our record &middot; Community Member since Aug 2023',
      `${wBtn('Edit', I.edit)}${wBtn('Compare with what he states', I.swap, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
        ${banner(I.archive, 'This is Grace&rsquo;s record, and only Grace writes to it',
          'Andreas has stated two things about himself since we last looked. None of them has changed anything on this page, and none of them will until someone here adopts it.',
          C.sageTint, C.sage)}

        ${card(`
          <div style="padding:16px 16px 6px;display:flex;align-items:center;gap:14px;">
            ${av('AW', 48)}
            <div style="flex:1 1 auto;">
              <div style="display:flex;align-items:center;gap:9px;">${tierPill('community')}${OURS()}</div>
              <div style="font-size:${T.sm}px;color:${C.ink3};margin-top:7px;">Everything below was typed by this office, or imported by it. Nothing arrived on its own.</div>
            </div>
          </div>
          ${rows([
            archiveRow('NAME', 'Andreas Wibowo', 'typed by Lidya &middot; 14 Aug 2023'),
            archiveRow('BORN', '18 June 1982', 'typed by Lidya &middot; 14 Aug 2023'),
            archiveRow('PHONE', '0811-2200-3311', 'typed by Lidya &middot; 14 Aug 2023 &mdash; he now states 0812-9900-1177', STATED('differs')),
            archiveRow('HOUSEHOLD', 'Wibowo household &middot; head', 'created by Lidya &middot; 14 Aug 2023'),
            archiveRow('ADDRESS', 'Jl. Sunter Permai 12, Bandung', 'on the household &middot; he now states a Cimahi address', STATED('differs')),
            archiveRow('CARE GROUP', 'Anugerah &middot; Sunter', 'joined 3 Sep 2023'),
          ])}`)}
      </div>

      <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:16px;">
        ${card(`
          <div style="padding:15px 16px 3px;display:flex;align-items:center;gap:9px;">
            ${label('What Andreas states about himself')}${STATED()}
          </div>
          <div style="padding:0 16px 12px;">${note('One statement, written by him, offered to every church he belongs to. Read only from here.')}</div>
          ${rows([
            archiveRow('NAME', 'Andreas Wibowo', 'unchanged since 2023'),
            archiveRow('BORN', '18 June 1982', 'unchanged since 2023'),
            archiveRow('PHONE', '0812-9900-1177', 'stated 12 Mar &mdash; 6 days ago'),
            archiveRow('ADDRESS', 'Jl. Kolonel Masturi 44, Cimahi', 'stated 12 Mar &mdash; 6 days ago'),
          ])}
          <div style="padding:14px 16px 16px;border-top:1px solid ${C.lineSoft};">
            ${wBtn('Adopt field by field', I.check, true)}
          </div>`)}

        ${card(`<div style="padding:15px 16px 16px;">
          ${label('Why it does not just update')}
          <div style="margin-top:10px;">${note('A membership roll that changes without the office touching it is not a record. Grace is answerable for what is in here &mdash; so Grace decides what goes in, one field at a time.')}</div>
          <div style="margin-top:12px;">${note('Andreas can see that this record differs from his statement. He cannot change it, and he is not left guessing why.', C.ink3)}</div>
        </div>`)}
      </div>
    </div>
  </div>
</div>`);

/* ===================== W15  ADOPT, FIELD BY FIELD ===================== */

const cmpHead = () => `
<div style="display:flex;align-items:center;gap:16px;padding:11px 18px;background:${C.bg};border-bottom:1px solid ${C.line};">
  <span style="width:104px;flex:0 0 104px;font-size:${T.micro}px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">FIELD</span>
  <span style="flex:1 1 0;font-size:${T.micro}px;font-weight:700;letter-spacing:0.1em;color:${C.sage};">OUR RECORD</span>
  <span style="flex:1 1 0;font-size:${T.micro}px;font-weight:700;letter-spacing:0.1em;color:${C.amber};">WHAT HE STATES</span>
  <span style="width:196px;flex:0 0 196px;"></span>
</div>`;

const choiceBtn = (t, on) =>
  `<div style="display:flex;align-items:center;justify-content:center;gap:6px;flex:1 1 0;height:36px;border-radius:10px;font-size:${T.sm}px;font-weight:700;${on ? `background:${C.accent};color:#FFFFFF;border:1px solid ${C.accent};` : `background:${C.surface};color:${C.ink2};border:1px solid ${C.line};`}">${t}</div>`;

const cmpRow = (lab, ours, oursMeta, theirs, theirsMeta, action) => `
<div style="display:flex;align-items:flex-start;gap:16px;padding:15px 18px;">
  <span style="width:104px;flex:0 0 104px;font-size:${T.xs}px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};padding-top:3px;">${lab}</span>
  <div style="flex:1 1 0;min-width:0;">
    <div style="font-size:${T.md}px;font-weight:600;line-height:1.35;">${ours}</div>
    <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:3px;">${oursMeta}</div>
  </div>
  <div style="flex:1 1 0;min-width:0;">
    <div style="font-size:${T.md}px;font-weight:600;line-height:1.35;color:${theirs === ours ? C.ink3 : C.ink};">${theirs}</div>
    <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:3px;">${theirsMeta}</div>
  </div>
  <div style="width:196px;flex:0 0 196px;display:flex;gap:8px;">${action}</div>
</div>`;

rec['WebAdopt.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Andreas Wibowo &mdash; what to take',
      'Two fields differ. Decide each one; nothing is decided for you.',
      `${wBtn('Cancel', I.x)}${wBtn('Apply 1 change', I.check, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
        ${card(`${cmpHead()}${rows([
          cmpRow('NAME', 'Andreas Wibowo', 'ours since 14 Aug 2023',
                 'Andreas Wibowo', 'the same &mdash; nothing to decide',
                 `<div style="display:flex;align-items:center;gap:7px;height:36px;color:${C.ink3};font-size:${T.sm}px;font-weight:600;">${svg(I.check, 15, 2.2)}<span>matches</span></div>`),
          cmpRow('BORN', '18 June 1982', 'ours since 14 Aug 2023',
                 '18 June 1982', 'the same &mdash; nothing to decide',
                 `<div style="display:flex;align-items:center;gap:7px;height:36px;color:${C.ink3};font-size:${T.sm}px;font-weight:600;">${svg(I.check, 15, 2.2)}<span>matches</span></div>`),
          cmpRow('PHONE', '0811-2200-3311', 'ours &middot; 4 messages failed since Feb',
                 '0812-9900-1177', 'he stated this 12 Mar',
                 `${choiceBtn('Keep ours', false)}${choiceBtn('Take his', true)}`),
          cmpRow('ADDRESS', 'Jl. Sunter Permai 12, Bandung', 'on the Wibowo household &middot; 4 people',
                 'Jl. Kolonel Masturi 44, Cimahi', 'he stated this 12 Mar',
                 `${choiceBtn('Keep ours', true)}${choiceBtn('Take his', false)}`),
        ])}`)}

        ${banner(I.home, 'The address is not his alone to move',
          'It sits on the Wibowo household, and changing it moves four people to Cimahi &mdash; and puts them 30 km from the Anugerah group that meets in Sunter. Keeping ours and asking him is the smaller mistake.',
          C.amberTint, C.amber)}
      </div>

      <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:16px;">
        ${card(`<div style="padding:15px 16px 16px;">
          ${label('What applying does')}
          <div style="display:flex;flex-direction:column;gap:11px;margin-top:12px;">
            ${['Writes the new phone into Grace&rsquo;s record, as an edit by you.',
               'Keeps 0811-2200-3311 readable in this person&rsquo;s history, with the date it was replaced.',
               'Changes nothing at Immanuel Church, and tells Immanuel nothing.',
               'Lets Andreas see that Grace now matches his statement on phone, and still differs on address.',
              ].map((t) => `<div style="display:flex;align-items:flex-start;gap:9px;"><span style="color:${C.sage};display:flex;padding-top:2px;">${svg(I.check, 15, 2.3)}</span><span style="font-size:${T.sm}px;color:${C.ink2};line-height:1.5;">${t}</span></div>`).join('')}
          </div>
        </div>`)}

        ${card(`<div style="padding:15px 16px 16px;">
          ${label('And what it never does')}
          <div style="display:flex;flex-direction:column;gap:11px;margin-top:12px;">
            ${['Apply the other three fields. Adopting is one field at a time, on purpose.',
               'Run again on its own. Nothing here is a subscription.',
               'Delete the value it replaced.',
              ].map((t) => `<div style="display:flex;align-items:flex-start;gap:9px;"><span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.x, 15, 2.3)}</span><span style="font-size:${T.sm}px;color:${C.ink2};line-height:1.5;">${t}</span></div>`).join('')}
          </div>
        </div>`)}
      </div>
    </div>
  </div>
</div>`);

/* ===================== W16  WHAT MEMBERS HAVE STATED ===================== */

const changeRow = (init, name, what, when, waiting, tone = C.ink3) => `
<div style="display:flex;align-items:center;gap:13px;padding:14px 16px;">
  ${av(init, 38)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:${T.md}px;font-weight:700;">${name}</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};margin-top:4px;">${what}</div>
  </div>
  <div style="text-align:right;white-space:nowrap;">
    <div style="font-size:${T.sm}px;font-weight:600;color:${tone};">${when}</div>
    <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:3px;">${waiting}</div>
  </div>
  ${chev()}
</div>`;

rec['WebChanges.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('What people have stated', 'Six of our 254 have corrected something about themselves. None of it is in our record.',
      `${wBtn('Export list', I.upload)}${wBtn('Work through them', I.check, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
        ${banner(I.clock, 'This is a list, not a queue that expires',
          'Nothing here fails if you never open it. The only cost of leaving a row is that we keep reaching the wrong number, or posting to the wrong street.',
          C.bg, C.ink2)}

        ${card(rows([
          changeRow('AW', 'Andreas Wibowo', 'Phone, address', '12 Mar', '6 days', C.ink),
          changeRow('SW', 'Sari Wibowo', 'Phone', '12 Mar', '6 days', C.ink),
          changeRow('MH', 'Melisa Halim', 'Name &mdash; married in January', '3 Feb', '6 weeks', C.accent),
          changeRow('TS', 'Tigor Simanjuntak', 'Phone &mdash; first number he has ever given us', '28 Jan', '7 weeks', C.accent),
          changeRow('BH', 'Budi Halim', 'Birth date &mdash; ours was a year out', '19 Jan', '8 weeks', C.accent),
          changeRow('HL', 'Hendra Lie', 'Address', '11 Jan', '9 weeks', C.accent),
        ]))}
      </div>

      <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:16px;">
        ${card(`<div style="padding:16px;">
          ${label('The one worth opening first')}
          <div style="font-family:${SERIF};font-size:${T.d1}px;font-weight:500;line-height:1.25;margin-top:10px;">Tigor Simanjuntak gave us a phone number.</div>
          <div style="margin-top:10px;">${note('He has been on the roll since 2019 with no number at all. His care group leader has answered attendance on his behalf 31 times because there was no way to ask him.')}</div>
          <div style="margin-top:14px;">${wBtn('Open Tigor', I.chevR, true)}</div>
        </div>`)}

        ${card(`<div style="padding:16px;">
          ${label('Why these are not applied for you')}
          <div style="margin-top:10px;">${note('Four of the six are plainly right and would be safe to take. Melisa Halim&rsquo;s new surname is a decision about how this church records a marriage, and Hendra Lie&rsquo;s address moves a household of five. A rule that takes the easy four would also take those two.')}</div>
        </div>`)}

        ${card(`<div style="padding:16px;">
          ${label('Nothing here came from another church')}
          <div style="margin-top:10px;">${note('Every line is something the person typed about themselves. Andreas belongs to a second church; that church appears nowhere on this screen and never will.', C.ink3)}</div>
        </div>`)}
      </div>
    </div>
  </div>
</div>`);

/* ===================== W17  A HOUSEHOLD, AND WHO CAN SIGN IN ===================== */

const memberRow = (init, name, role, account, tone) => `
<div style="display:flex;align-items:center;gap:13px;padding:14px 16px;">
  ${init === null ? avExternal('?', 38) : av(init, 38)}
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:${T.md}px;font-weight:700;">${name}</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};margin-top:4px;">${role}</div>
  </div>
  <span style="font-size:${T.sm}px;font-weight:600;color:${tone};white-space:nowrap;">${account}</span>
</div>`;

rec['WebHouseAdmin.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('Households')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Wibowo household', 'Jl. Sunter Permai 12, Bandung &middot; Sunter &middot; four people',
      `${wBtn('Edit address', I.edit)}${wBtn('Add a person', I.userPlus, true)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:16px;">
        ${card(`
          <div style="padding:15px 16px 4px;display:flex;align-items:center;gap:9px;">${label('Who is in it')}${OURS()}</div>
          ${rows([
            memberRow('AW', 'Andreas Wibowo', 'Head &middot; Community Member &middot; Anugerah', 'signs in', C.sage),
            memberRow('SW', 'Sari Wibowo', 'Spouse &middot; Community Member &middot; Anugerah', 'signs in', C.sage),
            memberRow('YW', 'Yosua Wibowo', 'Child, 14 &middot; Community Member', 'no account', C.ink3),
            memberRow('BW', 'Bening Wibowo', 'Child, 9 &middot; Community Member', 'no account', C.ink3),
          ])}
          <div style="padding:13px 16px 15px;border-top:1px solid ${C.lineSoft};">
            ${note('Yosua and Bening have no account because we hold no phone number for them &mdash; not because of their age. An account exists here for a number this office recorded, and for nothing else. The day Yosua gets a phone and we write it down, he can sign in.', C.ink3)}
          </div>`)}

        ${banner(I.lock, 'Only this office changes who is in a household',
          'Andreas is the head and can correct the address from his phone. He cannot add Bening, remove Yosua, or move anyone to another household &mdash; those restructure our register, and a register a member can restructure is not ours.',
          C.accentTint, C.accent)}
      </div>

      <div style="width:452px;flex:0 0 452px;display:flex;flex-direction:column;gap:16px;">
        ${card(`<div style="padding:15px 16px 6px;">${label('Who may write what, here')}</div>
          ${rows([
            memberRow('L', 'This office', 'Every field, every person, the household itself', 'writes', C.sage),
            memberRow('AW', 'Head or spouse', 'The address, and only from their own app', 'writes', C.sage),
            memberRow('YW', 'Anyone else in it', 'Their own statement. Never this record.', 'reads', C.ink3),
            memberRow(null, 'Another church', 'Nothing. It cannot see this page exists.', 'no access', C.ink3),
          ])}`)}

        ${card(`<div style="padding:15px 16px 16px;">
          ${label('Adding a person')}
          <div style="margin-top:11px;">${note('Typing a phone number we have never seen creates an account for it. Typing one that already belongs to somebody &mdash; here or at any other church &mdash; simply reuses that person, and this screen will not tell you which, because that is not ours to know.')}</div>
          <div style="margin-top:12px;">${note('Sari was added this way in 2023. Whether she was already known somewhere else is a question this office cannot ask and does not need answered.', C.ink3)}</div>
        </div>`)}
      </div>
    </div>
  </div>
</div>`);

/* ===================== M30  MY DETAILS, STATED ONCE ===================== */

const statedField = (lab, value, meta) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 14px;">
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">${lab}</div>
    <div style="font-size:${T.lg}px;font-weight:600;margin-top:5px;line-height:1.3;">${value}</div>
    <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:4px;">${meta}</div>
  </div>
  <span style="color:${C.accent};display:flex;padding-top:14px;">${svg(I.edit, 17)}</span>
</div>`;

rec['MyDetails.dc.html'] = doc(phone(`
${topbar('Your details')}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:${T.d2}px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">What you say about yourself</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};line-height:1.55;margin-top:8px;">Written once, kept in one place, and offered to both churches you belong to.</div>
  </div>

  ${card(rows([
    statedField('NAME', 'Andreas Wibowo', 'unchanged since 2023'),
    statedField('BORN', '18 June 1982', 'unchanged since 2023'),
    statedField('PHONE', '0812-9900-1177', 'you changed this 6 days ago &mdash; you now sign in with it'),
    statedField('ADDRESS', 'Jl. Kolonel Masturi 44, Cimahi', 'you changed this 6 days ago'),
  ]))}

  ${card(`<div style="display:flex;align-items:flex-start;gap:11px;padding:14px;">
    <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 18)}</span>
    <div style="flex:1 1 auto;">
      <div style="font-size:${T.base}px;font-weight:700;">This does not change any church&rsquo;s records</div>
      <div style="font-size:${T.sm}px;color:${C.ink2};line-height:1.5;margin-top:5px;">Each church keeps its own record of you and decides what to take from here. Your sign-in number is the one exception &mdash; that is yours, and changing it changes how you get in.</div>
    </div>
  </div>`, `background:${C.amberTint};border-color:${C.amber}44;`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;display:flex;flex-direction:column;gap:12px;">
    ${btn('Save', { kind: 'primary', h: 52 })}
    <div style="font-size:${T.xs}px;color:${C.ink3};line-height:1.6;">Both churches will see that you have stated something new. Neither is told about the other.</div>
  </div>
`)}`));

/* ===================== M31  WHERE YOUR DETAILS STAND ===================== */

const standRow = (lab, mine, theirs, ok) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 14px;">
  <span style="width:62px;flex:0 0 62px;font-size:${T.xs}px;font-weight:700;letter-spacing:0.06em;color:${C.ink3};padding-top:2px;">${lab}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:${T.base}px;font-weight:600;line-height:1.35;">${theirs}</div>
    ${ok ? '' : `<div style="font-size:${T.xs}px;color:${C.ink3};margin-top:3px;">you state ${mine}</div>`}
  </div>
  <span style="color:${ok ? C.sage : C.amber};display:flex;padding-top:1px;">${svg(ok ? I.check : I.clock, 16, 2.2)}</span>
</div>`;

rec['MyStanding.dc.html'] = doc(phone(`
${topbar('Your details')}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:${T.d2}px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Where your details stand</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};line-height:1.55;margin-top:8px;">What each church currently holds. Only that church can change it.</div>
  </div>

  ${card(`
    <div style="display:flex;align-items:center;gap:11px;padding:14px 14px 10px;">
      <div style="width:38px;height:38px;flex:0 0 38px;border-radius:12px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:${T.sm}px;font-weight:700;">I</div>
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:${T.md}px;font-weight:700;">Immanuel Church</div>
        <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:2px;">Surabaya &middot; Registered Member</div>
      </div>
      ${pill('All 4 match', C.sageTint, C.sage)}
    </div>
    <div style="padding:0 14px 13px;">${note('They took your new number and address on 13 March.', C.ink3)}</div>`)}

  ${card(`
    <div style="display:flex;align-items:center;gap:11px;padding:14px 14px 10px;">
      <div style="width:38px;height:38px;flex:0 0 38px;border-radius:12px;background:${C.accentTint};color:${C.accent};display:flex;align-items:center;justify-content:center;font-size:${T.sm}px;font-weight:700;">G</div>
      <div style="flex:1 1 auto;min-width:0;">
        <div style="font-size:${T.md}px;font-weight:700;">Grace Community Church</div>
        <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:2px;">Bandung &middot; Community Member</div>
      </div>
      ${pill('2 differ', C.amberTint, C.amber)}
    </div>
    ${rows([
      standRow('NAME', '', 'Andreas Wibowo', true),
      standRow('BORN', '', '18 June 1982', true),
      standRow('PHONE', '0812-9900-1177', '0811-2200-3311', false),
      standRow('ADDRESS', 'Jl. Kolonel Masturi 44, Cimahi', 'Jl. Sunter Permai 12, Bandung', false),
    ])}
    <div style="padding:13px 14px 14px;border-top:1px solid ${C.lineSoft};display:flex;flex-direction:column;gap:10px;">
      ${btn('Ask the office to look', { kind: 'outlineAccent', h: 44, icon: I.mail, grow: false })}
      ${note('The address is on your household, and four people live in it. Grace will want to hear it from you rather than take it.', C.ink3)}
    </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    ${note('Nothing here is broken. A church that has not been told yet genuinely does not know, and a record that quietly rewrote itself would be worth less than one that waits.', C.ink3)}
  </div>
`)}`));

/* ===================== M32  MY HOUSEHOLD, AT ONE CHURCH ===================== */

const houseMember = (init, name, meta, right = '') =>
  `<div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
    ${av(init, 40)}
    <div style="flex:1 1 auto;min-width:0;"><div style="font-size:${T.md}px;font-weight:600;">${name}</div><div style="font-size:${T.sm}px;color:${C.ink2};margin-top:3px;">${meta}</div></div>
    ${right}
  </div>`;

rec['MyHousehold.dc.html'] = doc(phone(`
${topbar('Household', pill('At Grace', C.accentTint, C.accent))}
${bodyPushed(`
  <div>
    <div style="font-family:${SERIF};font-size:${T.d2}px;font-weight:500;letter-spacing:-0.01em;line-height:1.2;">Wibowo household</div>
    <div style="font-size:${T.sm}px;color:${C.ink2};line-height:1.55;margin-top:8px;">As <strong>Grace Community Church</strong> records it. Immanuel keeps its own, and the two need not agree.</div>
  </div>

  ${card(rows([
    houseMember('AW', 'Andreas Wibowo', 'You &middot; head of household'),
    houseMember('SW', 'Sari Wibowo', 'Spouse'),
    houseMember('YW', 'Yosua Wibowo', 'Child &middot; 14'),
    houseMember('BW', 'Bening Wibowo', 'Child &middot; 9'),
  ]))}

  ${card(`
    <div style="display:flex;align-items:flex-start;gap:11px;padding:14px;">
      <span style="color:${C.ink3};display:flex;padding-top:2px;">${svg(I.pin, 18)}</span>
      <div style="flex:1 1 auto;">
        <div style="font-size:${T.md}px;font-weight:600;">Jl. Sunter Permai 12, Bandung</div>
        <div style="font-size:${T.xs}px;color:${C.ink3};margin-top:4px;line-height:1.45;">You can correct this, because you are the head. It moves all four of you in Grace&rsquo;s records, and their office is shown that you changed it.</div>
      </div>
      <span style="color:${C.accent};display:flex;padding-top:1px;">${svg(I.edit, 17)}</span>
    </div>`)}

  ${card(`<div style="padding:14px;">
    ${label('Not yours to change')}
    <div style="display:flex;flex-direction:column;gap:9px;margin-top:11px;">
      ${['Adding anyone to this household, or taking anyone out',
         'Anyone&rsquo;s standing, care group or attendance',
         'What Immanuel Church records about your family',
        ].map((t) => `<div style="display:flex;align-items:flex-start;gap:9px;"><span style="color:${C.ink3};display:flex;padding-top:2px;">${svg(I.lock, 14, 2.1)}</span><span style="font-size:${T.sm}px;color:${C.ink2};line-height:1.45;">${t}</span></div>`).join('')}
    </div>
  </div>`)}

  <div style="flex:1 1 auto;"></div>
  <div style="padding-bottom:24px;">
    ${note('At Immanuel the same household has three people &mdash; you, Sari and Yosua. Bening was never added there. Each church records the family it actually knows.', C.ink3)}
  </div>
`)}`));

/* ===================== S11  THE MODEL IN ONE PICTURE ===================== */

const store = (title, writer, lines, tone, tint) => `
<div style="flex:1 1 0;min-width:0;border:1.5px solid ${tone};border-radius:${R.card}px;background:${C.surface};overflow:hidden;">
  <div style="padding:15px 18px;background:${tint};border-bottom:1px solid ${tone}44;">
    <div style="font-family:${SERIF};font-size:${T.d1}px;font-weight:500;color:${tone};">${title}</div>
    <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${tone};margin-top:6px;opacity:0.85;">Written only by ${writer}</div>
  </div>
  <div style="padding:14px 18px 16px;display:flex;flex-direction:column;gap:9px;">
    ${lines.map((l) => `<div style="font-size:${T.base}px;color:${C.ink2};line-height:1.5;">${l}</div>`).join('')}
  </div>
</div>`;

const arrowCard = (kind, title, text) => {
  const ok = kind === 'yes';
  const tone = ok ? C.sage : C.accent;
  return `<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:${R.card}px;background:${C.surface};border:1px solid ${C.line};">
    <span style="color:${tone};display:flex;padding-top:1px;">${svg(ok ? I.check : I.x, 19, 2.3)}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:${T.base}px;font-weight:700;color:${tone};">${title}</div>
      <div style="font-size:${T.sm}px;color:${C.ink2};margin-top:4px;line-height:1.5;">${text}</div>
    </div>
  </div>`;
};

const failure = (n, title, text) => `
<div style="flex:1 1 0;min-width:0;">
  <div style="font-family:${SERIF};font-size:${T.d2}px;font-weight:600;color:${C.accent};line-height:1;">${n}</div>
  <div style="font-size:${T.md}px;font-weight:700;margin-top:9px;line-height:1.3;">${title}</div>
  <div style="font-size:${T.base}px;color:${C.ink2};margin-top:7px;line-height:1.55;">${text}</div>
</div>`;

rec['Archive.dc.html'] = doc(`
<div style="width:1440px;height:1220px;background:${C.bg};padding:44px 56px;display:flex;flex-direction:column;gap:26px;">

  <div>
    <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.ink3};">Sheet S11 &middot; the shape behind W14&ndash;W17 and M30&ndash;M32</div>
    <div style="font-family:${SERIF};font-size:${T.d4}px;font-weight:500;letter-spacing:-0.015em;line-height:1.12;margin-top:12px;">Two stores, one writer each, and nothing that flows on its own</div>
    <div style="font-size:${T.lg}px;color:${C.ink2};max-width:104ch;line-height:1.55;margin-top:12px;">Three earlier attempts asked <em>where</em> a person&rsquo;s name should live, and each broke something. The question was wrong. What matters is <strong>who may write it</strong> &mdash; and once that is settled, duplication stops being a problem to solve and becomes the thing that makes the boundary hold.</div>
  </div>

  <div style="display:flex;gap:20px;align-items:stretch;">
    ${store('The statement', 'the person', [
      '<strong>One per person</strong>, for the whole installation.',
      'Name, birth date, address they give, and the phone number they sign in with.',
      'No church can write here. No church can be told who else reads it.',
      'It is a claim, not a record: it says what Andreas says, and nothing more.',
    ], C.amber, C.amberTint)}

    <div style="width:150px;flex:0 0 150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
      <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.09em;color:${C.ink3};text-align:center;">LOOK UP<br>&amp; ADOPT</div>
      <div style="color:${C.ink3};display:flex;">${svg(I.swap, 34, 1.6)}</div>
      <div style="font-size:${T.xs}px;color:${C.ink3};text-align:center;line-height:1.45;">one field<br>at a time</div>
    </div>

    ${store('The archive', 'that one church', [
      '<strong>One per person per church.</strong> Grace has one for Andreas; Immanuel has another.',
      'Name and birth date as this church holds them, standing, lifecycle, joining date, household, care group, attendance, the number this church reaches him on.',
      'Neither church knows the other exists.',
      'It is the church&rsquo;s own record, and the church answers for it.',
    ], C.sage, C.sageTint)}
  </div>

  <div style="display:flex;gap:16px;">
    ${arrowCard('yes', 'A church reads the statement', 'Any time, for anyone on its own roll. It sees the value and when it was stated &mdash; never where else that person belongs.')}
    ${arrowCard('yes', 'A church adopts a field', 'An explicit act by that office, logged, one field at a time. The replaced value stays readable.')}
    ${arrowCard('no', 'The statement writes to an archive', 'Never, by any path, however obviously right the new value looks. This is the rule the other three protect.')}
    ${arrowCard('no', 'One archive reaches another', 'Never &mdash; except by a transfer the person and both offices agreed to, which is CAP-13 and a different act entirely.')}
  </div>

  <div style="display:flex;gap:20px;align-items:stretch;">
    <div style="flex:1 1 0;background:${C.surface};border:1px solid ${C.line};border-radius:${R.card}px;padding:20px 22px;">
      <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.ink3};">The one exception, and why it is not one</div>
      <div style="font-size:${T.base}px;color:${C.ink2};line-height:1.6;margin-top:11px;">The <strong>sign-in number</strong> is global &mdash; it has to be, it is how the person gets in. But the number a church <em>reaches</em> him on is that church&rsquo;s own field, and changing the first does not touch the second. Grace kept messaging 0811 and four messages failed, which is exactly what a stale record looks like when it is honest about being stale.</div>
    </div>
    <div style="flex:1 1 0;background:${C.surface};border:1px solid ${C.line};border-radius:${R.card}px;padding:20px 22px;">
      <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.ink3};">What this deliberately does not do</div>
      <div style="font-size:${T.base}px;color:${C.ink2};line-height:1.6;margin-top:11px;">No sync. No merge job. No &ldquo;3 records updated overnight&rdquo;. A person who corrects their address may see the old one at a church for weeks, and that is the truth being displayed rather than a delay being hidden. M31 shows them exactly where they stand and gives them one way to ask.</div>
    </div>
  </div>

  <div style="background:${C.surface};border:1px solid ${C.line};border-radius:${R.card}px;padding:22px 24px;">
    <div style="font-size:${T.xs}px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.ink3};margin-bottom:16px;">Three failures this shape rules out &mdash; each one was in an earlier draft of this design</div>
    <div style="display:flex;gap:34px;">
      ${failure('1', 'A church renames someone in another church', 'Draft two put the name on the global row. Grace typing &ldquo;Andreas W.&rdquo; would have changed what Immanuel saw, done by a church Immanuel does not know exists.')}
      ${failure('2', 'The archive moves under the office', 'Draft three let a stated value flow until a church typed over it. That is still the roll changing without the office touching it &mdash; a feed, not a record.')}
      ${failure('3', 'A member restructures the register', 'Letting the person write their own record makes household composition, standing and history editable by the people they describe. The address is the one field a head of household may correct, and it is the exception that proves the shape.')}
    </div>
  </div>

  <div style="flex:1 1 auto;"></div>
  <div style="font-size:${T.sm}px;color:${C.ink3};line-height:1.6;max-width:118ch;">Behind CAP-01 in the register: the archive rule is FR-01.10, look-up and adopt are FR-01.12 and FR-01.13, the sign-in exception is FR-01.14, and the household boundary is FR-01.4. Seven of those rows have no screen anywhere else in this canvas, which is what this page and W14&ndash;W17 exist to fix.</div>
</div>`);

import { C, SERIF, doc, svg, I, card, label, rows, av, tierPill } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * A PERSON'S RECORD, AND THE ONE CONTROL THAT NEEDS A GUARD.
 *
 * Two things happen in every congregation and had no home in this
 * design: people transfer away, and people die. Neither is a tier -
 * standing says WHAT someone is to this church, lifecycle says whether
 * they are still with it. Same lesson as the three axes, a fourth time.
 *
 * The damaging failure is specific and well known: a church app that
 * prompts someone to send a birthday greeting to a member who died in
 * February. Every forward-looking surface - birthdays, rosters, RSVP,
 * reminders, counts - has to drop them the moment this is set.
 *
 * And nothing may be deleted. The household record, the attendance
 * history, the nights they hosted: all of it stays, or the family's
 * record is corrupted to tidy a list. So the screen's real job is to
 * make both halves legible BEFORE the click.
 */
export const life = {};

const radioRow = (t, sub, on) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:13px 16px;">
  <div style="width:18px;height:18px;flex:0 0 18px;border-radius:999px;border:${on ? `5.5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:13px;font-weight:${on ? 700 : 600};">${t}</div>
    <div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.4;">${sub}</div>
  </div>
</div>`;

const stops = (t) =>
  `<div style="display:flex;align-items:center;gap:10px;padding:7px 16px;">
    <span style="color:${C.ink3};display:flex;">${svg(I.x, 14, 2.2)}</span>
    <span style="font-size:12px;color:${C.ink2};">${t}</span>
  </div>`;

const stays = (t) =>
  `<div style="display:flex;align-items:center;gap:10px;padding:7px 16px;">
    <span style="color:${C.sage};display:flex;">${svg(I.check, 14, 2.4)}</span>
    <span style="font-size:12px;color:${C.ink2};">${t}</span>
  </div>`;

const factRow = (lab, value) =>
  `<div style="display:flex;align-items:baseline;gap:16px;padding:11px 16px;">
    <span style="width:130px;flex:0 0 130px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">${lab}</span>
    <span style="flex:1 1 auto;font-size:13px;font-weight:600;">${value}</span>
  </div>`;

life['WebPerson.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Yohanes Halim', 'Halim household &middot; on the roll since Feb 2021',
      `${wBtn('Open household', I.home)}${wBtn('Edit', I.edit)}`)}

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:18px 16px 6px;display:flex;align-items:center;gap:14px;">
            ${av('YH', 52)}
            <div style="flex:1 1 auto;">
              <div style="display:flex;align-items:center;gap:9px;">
                ${tierPill('registered')}
                <span style="display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:${C.bg};color:${C.ink2};border:1px solid ${C.line};font-size:11px;font-weight:700;">Passed away</span>
              </div>
              <div style="font-size:12px;color:${C.ink3};margin-top:7px;">Standing and lifecycle are separate fields. He remains a Registered Member of this church.</div>
            </div>
          </div>
          ${rows([
            factRow('BORN', '4 September 1948'),
            factRow('PASSED AWAY', '3 February 2026'),
            factRow('HOUSEHOLD', 'Halim household &middot; father of Budi Halim'),
            factRow('CARE GROUP', 'Anugerah &middot; Sunter'),
          ])}`)}

        ${card(`
          <div style="padding:14px 16px 4px;">${label('History &mdash; kept in full')}</div>
          ${rows([
            factRow('ATTENDANCE', '184 meetings recorded, 2021 to 2025'),
            factRow('HOSTED', '11 care group evenings'),
            factRow('SERVED', 'Hospitality team, 2021 to 2024'),
          ])}`)}
      </div>

      <div style="width:428px;flex:0 0 428px;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 2px;">${label('Lifecycle in this church')}</div>
          ${rows([
            radioRow('Active', 'Appears everywhere, counted in every total', false),
            radioRow('Inactive', 'Not seen for months. Stays in the directory, drops out of reminders', false),
            radioRow('Transferred out', 'Moved to another church with a letter. History stays here', false),
            radioRow('Passed away', 'Set 3 February 2026 by Lidya S.', true),
          ])}`, `border-color:#B4562F55;`)}

        ${card(`
          <div style="padding:14px 16px 8px;">${label('What this changed')}</div>
          ${stops('Removed from birthday lists and greeting prompts')}
          ${stops('Removed from serving rosters and open slots')}
          ${stops('No longer counted in care group or church totals')}
          ${stops('Receives nothing the church sends, ever again')}
          <div style="height:8px;"></div>
          ${stays('Still in the Halim household record')}
          ${stays('Attendance and hosting history untouched')}
          ${stays('Shown to his family under In memory')}
          <div style="padding:13px 16px;margin-top:8px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.ink3};display:flex;padding-top:1px;">${svg(I.lock, 16)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.55;">Nothing is ever deleted. The office can undo this, and no one else can set it.</span>
          </div>`)}
      </div>
    </div>
  </div>
</div>`);

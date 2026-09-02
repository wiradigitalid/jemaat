import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE SHAPE UNDER THE SCREENS.
 *
 * Sixty-one artboards imply a data model, and until now it existed only
 * as prose scattered across sticky notes. A schema gets written in week
 * one of development; the seven expensive decisions either survive that
 * week or they do not, and afterwards they cost a migration each.
 *
 * This is not a full schema - no types, no indexes, no audit columns.
 * It is the seven decisions expressed as structure, which is the only
 * form in which they can actually be handed over.
 */
export const model = {};

const ent = (name, scope, fields, note) => {
  const tone = { global: [C.accentTint, C.accent], church: [C.sageTint, C.sage], join: [C.bg, C.ink3] }[scope];
  const label = { global: 'GLOBAL', church: 'PER CHURCH', join: 'JOIN' }[scope];
  return `<div style="padding:11px 16px;border-top:1px solid ${C.lineSoft};">
    <div style="display:flex;align-items:center;gap:9px;">
      <span style="font-size:13px;font-weight:700;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${name}</span>
      <span style="display:inline-flex;align-items:center;height:18px;padding:0 7px;border-radius:6px;background:${tone[0]};color:${tone[1]};font-size:9px;font-weight:700;letter-spacing:0.04em;">${label}</span>
    </div>
    <div style="font-size:11px;color:${C.ink2};margin-top:5px;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${fields}</div>
    ${note ? `<div style="font-size:11px;color:${C.ink3};margin-top:5px;line-height:1.5;">${note}</div>` : ''}
  </div>`;
};

const decision = (n, what, structure) => `
<div style="display:flex;align-items:flex-start;gap:12px;padding:11px 16px;border-top:1px solid ${C.lineSoft};">
  <span style="width:20px;height:20px;flex:0 0 20px;border-radius:999px;background:${C.accent};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">${n}</span>
  <div style="flex:1 1 auto;min-width:0;">
    <div style="font-size:12px;font-weight:700;line-height:1.4;">${what}</div>
    <div style="font-size:11px;color:${C.ink2};margin-top:4px;line-height:1.5;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${structure}</div>
  </div>
</div>`;

model['DataModel.dc.html'] = doc(`
<div style="width:1440px;height:1180px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">The shape under the screens</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:940px;">Not a schema &mdash; no types, no indexes, no audit columns. These are the seven expensive decisions written as structure, because prose in a sticky note does not survive week one of development, and each of them costs a migration afterwards.</div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="flex:1 1 0;min-width:0;">
      ${card(`
        <div style="padding:15px 16px 11px;">${label('People, and where they stand')}</div>
        ${ent('person', 'global', 'id, full_name, date_of_birth, phone, phone_visibility', 'One row per human, ever. NOT per church - this is what lets someone belong to Surabaya and Bandung at once.')}
        ${ent('church', 'church', 'id, code, name, city, worship_day, tier_labels', 'worship_day is a setting. Saturday here, Sunday elsewhere, and no screen hard-codes either.')}
        ${ent('membership', 'join', 'person_id, church_id, standing, lifecycle, since', 'standing: guest | community | registered. lifecycle: active | inactive | transferred | deceased. NO ROW AT ALL = not on our roll, which is how a guest speaker exists.')}
        ${ent('household', 'church', 'id, church_id, name, address, area')}
        ${ent('household_member', 'join', 'person_id, household_id, role', 'role: head | spouse | child | other. Four, and no plans for a fifth.')}
        <div style="height:8px;"></div>`)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${card(`
        <div style="padding:15px 16px 11px;">${label('What happens, and when')}</div>
        ${ent('service', 'church', 'id, church_id, starts_at, location', 'AN ENTITY, not a date. Two to four a week above 400 members, and everything below points at one.')}
        ${ent('service_content', 'church', 'service_id, speaker_person_id, series, part, poster', 'speaker_person_id is nullable and has no FK to membership. That is the guest speaker.')}
        ${ent('care_group', 'church', 'id, church_id, name, area, weekday, time, leader_person_id')}
        ${ent('care_group_member', 'join', 'person_id, care_group_id, since', 'Its own relation. Joining a group never touches membership, which is the whole promise made to Community Members.')}
        ${ent('meeting', 'church', 'id, care_group_id, starts_at, host_household_id')}
        ${ent('rsvp / attendance', 'join', 'person_id, meeting_id, answer | came, marked_by', 'Two tables, not one. What someone SAID and what actually happened are different facts, and M26 is built on the gap.')}
        <div style="height:8px;"></div>`)}
    </div>

    <div style="width:452px;flex:0 0 452px;">
      ${card(`
        <div style="padding:15px 16px 4px;">${label('Cheap today, a migration tomorrow')}</div>
        ${decision('1', 'A service is a thing, not a date', 'service.id &mdash; attendance, assignment, announcement all FK to it')}
        ${decision('2', 'Standing belongs to the pair, not the person', 'membership(person, church) &mdash; never person.standing')}
        ${decision('3', 'Lifecycle is its own column', 'membership.lifecycle &ne; membership.standing')}
        ${decision('4', 'Group membership is a relation', 'care_group_member &mdash; never person.care_group_id')}
        ${decision('5', 'Assignments point at a person', 'assignment.person_id, no FK to membership')}
        ${decision('6', 'Address on the household, standing on the person', 'household.address &middot; membership.standing')}
        ${decision('7', 'One global table, everything else scoped', 'person is global &middot; church_id on all the rest')}
        <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
          <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 16)}</span>
          <span style="font-size:11px;color:${C.ink2};line-height:1.55;">Decision 7 is the one that looks like over-engineering on day one, when there is a single pilot church. It is also the only one that cannot be retrofitted &mdash; every other table can gain a column later, but making <span style="font-family:ui-monospace,monospace;font-weight:700;">person</span> global after it was per-church means rewriting every row and every join.</span>
        </div>`, 'border-color:#B4562F55;')}
    </div>
  </div>

  ${card(`<div style="padding:18px 22px;display:flex;align-items:flex-start;gap:14px;">
    <span style="color:${C.ink3};display:flex;padding-top:2px;">${svg(I.lock, 20)}</span>
    <div style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.6;max-width:1200px;">Deliberately absent, and each absence is a decision made on a screen: <span style="font-family:ui-monospace,monospace;">no attendance_rate, no engagement_score, no last_seen</span> &mdash; M23 refuses a count, and a column that exists will eventually be shown. <span style="font-family:ui-monospace,monospace;">No dismissed_prompts</span> table &mdash; M23 promised nothing is recorded, and W9 pays that promise when a leader hands over. <span style="font-family:ui-monospace,monospace;">No person.church_id</span> &mdash; that single field would quietly undo decisions 2 and 7 together.</div>
  </div>`)}
</div>`);

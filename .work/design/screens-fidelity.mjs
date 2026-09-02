import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * TWENTY-FIVE ITERATIONS, CHECKED AGAINST THE FIRST MESSAGE.
 *
 * Every iteration found something real, and each addition was
 * defensible on its own. Read as a sequence they can still walk a
 * design away from what was asked for, and the check nobody performs
 * is the one against the original words.
 *
 * The quotes here are the owner's, in the language they were written
 * in. Translating them would be the beginning of the drift.
 */
export const fid = {};

const askRow = (quote, landed, rel, state) => {
  const tone = { ok: [C.sageTint, C.sage], warn: [C.amberTint, C.amber] }[state];
  return `<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 18px;">
    <div style="width:260px;flex:0 0 260px;font-size:12px;line-height:1.5;font-style:italic;color:${C.ink2};">&ldquo;${quote}&rdquo;</div>
    <div style="flex:1 1 auto;min-width:0;font-size:12px;line-height:1.5;">${landed}</div>
    <span style="width:104px;flex:0 0 104px;display:inline-flex;align-items:center;justify-content:center;height:22px;border-radius:6px;background:${tone[0]};color:${tone[1]};font-size:10px;font-weight:700;">${rel}</span>
  </div>`;
};

const addRow = (what, why, kind) => {
  const tone = kind === 'derived' ? [C.sageTint, C.sage, 'DERIVED'] : [C.bg, C.ink3, 'FOUND'];
  return `<div style="display:flex;align-items:flex-start;gap:12px;padding:9px 18px;">
    <span style="width:66px;flex:0 0 66px;display:inline-flex;align-items:center;justify-content:center;height:20px;border-radius:6px;background:${tone[0]};color:${tone[1]};font-size:9px;font-weight:700;">${tone[2]}</span>
    <span style="width:150px;flex:0 0 150px;font-size:12px;font-weight:600;">${what}</span>
    <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.45;">${why}</span>
  </div>`;
};

fid['Fidelity.dc.html'] = doc(`
<div style="width:1440px;height:1120px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">Against the first message</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:900px;">Every iteration found something real, and each addition was defensible on its own. Read end to end they can still walk a design away from what was asked for. The quotes are the owner&rsquo;s own words, left in the language they were written in.</div>
  </div>

  ${card(`
    <div style="padding:16px 18px 12px;border-bottom:1px solid ${C.lineSoft};display:flex;align-items:baseline;gap:14px;">
      <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};width:260px;flex:0 0 260px;">WHAT WAS ASKED FOR</span>
      <span style="flex:1 1 auto;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">WHERE IT LANDED</span>
      <span style="width:104px;flex:0 0 104px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};text-align:center;">RELEASE</span>
    </div>
    ${askRow('Pertama kan pendataan anggota', 'M4 household, M5 add a person, W2 the table, W5 the import. Viewable in R0 &mdash; but nothing can be entered or corrected until R1 and R2.', 'R0 / R1 / R2', 'warn')}
    ${askRow('Mendata yang mana satu keluarga, head, wife dan anak-anaknya', 'M4. Household is the container, address hangs off it, four roles and no more.', 'R2', 'warn')}
    ${askRow('Belum ada kebutuhan mendata biodata yang sangat banyak', 'M5 is six fields, two of them optional. Everything else is explicitly later.', 'R2', 'ok')}
    ${askRow('Mudah dipakai, tidak terlalu rumit', 'RSVP is two taps. Claiming a hosting slot is three. Attendance is two taps per person and no typing.', 'R0', 'ok')}
    ${askRow('Tapi bisa besok-besok pengembangannya', 'Three staged releases, sixteen screens deliberately parked, and every deferral written with its reason.', 'R0-R2', 'ok')}
    ${askRow('Grouping-grouping yang mana menjadi care group', 'M6, M7. Membership of a group is its own relation, so it never depends on standing.', 'R0', 'ok')}
    ${askRow('Absensi, aku bisa loh hadir', 'M8 RSVP, M14 attendance by hand for the half who will never install anything.', 'R0', 'ok')}
    ${askRow('Antrian volunteer, siapa yang bisa menjamu rumahnya', 'M9. Open dates are visible to everyone and claimed by the person themselves.', 'R0', 'ok')}
    ${askRow('Fokusnya di mobile aja, mobile experience', '39 mobile artboards against 10 for the office. Every weekly act happens on the phone.', 'all', 'ok')}
    ${askRow('Website itu kegiatan administrasi dan lain-lain', 'W1 to W10 are all office work: the queue, the table, the import, the code, the week, export.', 'all', 'ok')}
    <div style="height:8px;"></div>`, 'overflow:hidden;')}

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
    <div style="flex:1 1 0;min-width:0;">
      ${card(`
        <div style="padding:16px 18px 10px;">${label('Added without being asked')}
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">DERIVED means something asked for could not work without it. FOUND means an iteration went looking and came back with it.</div>
        </div>
        ${addRow('W8 This week', 'P1, P2 and P3 displayed data nothing wrote', 'derived')}
        ${addRow('M26 After attendance', 'Attendance was asked for. Without a payoff it stops by week six', 'derived')}
        ${addRow('P10, P11 failures', 'The front door of a flow that was asked for', 'derived')}
        ${addRow('W6 Lifecycle', 'People die. Birthday prompts must not outlive them', 'derived')}
        ${addRow('M20 Warta', 'Ordinary members had no reason to open the app', 'found')}
        ${addRow('M23 Noticing', 'Drift goes unseen. Still undecided, deliberately', 'found')}
        ${addRow('M22, W7 Transfer', 'Surat pindah. The one thing multi-tenancy beats paper at', 'found')}
        ${addRow('W9 Handover', 'Leaders rotate every year in every church', 'found')}
        ${addRow('W10 Export', 'No committee adopts software it cannot leave', 'found')}
        ${addRow('M27 My data', 'Every privacy rule protected members from each other only', 'found')}
        <div style="height:8px;"></div>`, 'overflow:hidden;')}
    </div>

    <div style="width:470px;flex:0 0 470px;display:flex;flex-direction:column;gap:20px;">
      ${card(`<div style="padding:20px;">
        <div style="display:flex;align-items:flex-start;gap:13px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.help, 21)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:15px;font-weight:700;line-height:1.35;">The first thing asked for is the last thing shipped</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:10px;line-height:1.6;">Pendataan anggota opened the brief. In the staging it ends up viewable in R0, importable in R1, editable in R2 &mdash; because R0 assumed WDI would load the pilot&rsquo;s data by hand, which made entry look unnecessary.<br><br>That is defensible for one pilot church and indefensible as a reading of the brief. If the goal is to replace a messy membership spreadsheet, <span style="font-weight:700;color:${C.ink};">R0 as staged does not do it at all.</span></div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}

      ${card(`<div style="padding:20px;">
        <div style="display:flex;align-items:flex-start;gap:13px;">
          <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.swap, 21)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:15px;font-weight:700;line-height:1.35;">The cheap correction</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:10px;line-height:1.6;">Pull <span style="font-weight:700;color:${C.ink};">M4 and M5</span> from R2 into R0. Two screens, one capability the backend needs anyway, and R0 becomes a thing a church can put its own people into rather than a thing done to a church.<br><br>W5, the Excel import, stays in R1. It is two weeks of work on its own and typing 248 people is a bad pilot &mdash; but a church that can add and correct one person owns its register from day one.</div>
          </div>
        </div>
      </div>`, 'border-color:#B4562F55;')}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

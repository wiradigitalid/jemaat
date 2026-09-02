import { C, SERIF, doc, svg, I, card, label, av } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * MERGING TWO RECORDS OF THE SAME PERSON.
 *
 * Sixty-six artboards and no way to merge anything. W5 flags "4 names
 * that already exist here" and then does nothing about them. Every
 * church register on earth accumulates duplicates, and a register
 * people believe is a mess is a register they stop maintaining.
 *
 * Worse, this design manufactures them. M5's household field reads
 * "pick an existing household, or create a new one" - a picker that
 * makes creating as easy as finding will be used to create. That is a
 * defect in a screen I wrote, found by asking what the data looks like
 * after two years rather than on day one.
 *
 * Merging is careful comparison work, so by iteration 34's axis it
 * belongs on a big screen without apology.
 */
export const merge = {};

const cmp = (field, a, b, pick, note) => `
<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 18px;border-top:1px solid ${C.lineSoft};">
  <div style="width:104px;flex:0 0 104px;font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};padding-top:3px;">${field}</div>
  <div style="flex:1 1 0;display:flex;align-items:flex-start;gap:9px;min-width:0;">
    <div style="width:16px;height:16px;flex:0 0 16px;border-radius:999px;border:${pick === 'a' ? `5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
    <span style="flex:1 1 auto;font-size:12px;font-weight:${pick === 'a' ? 700 : 400};color:${pick === 'a' ? C.ink : C.ink2};line-height:1.4;">${a}</span>
  </div>
  <div style="flex:1 1 0;display:flex;align-items:flex-start;gap:9px;min-width:0;">
    <div style="width:16px;height:16px;flex:0 0 16px;border-radius:999px;border:${pick === 'b' ? `5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
    <span style="flex:1 1 auto;font-size:12px;font-weight:${pick === 'b' ? 700 : 400};color:${pick === 'b' ? C.ink : C.ink2};line-height:1.4;">${b}</span>
  </div>
  <div style="width:186px;flex:0 0 186px;font-size:11px;color:${C.ink3};line-height:1.4;padding-top:2px;">${note}</div>
</div>`;

const both = (field, value, note) => `
<div style="display:flex;align-items:flex-start;gap:14px;padding:11px 18px;border-top:1px solid ${C.lineSoft};background:${C.sageTint}55;">
  <div style="width:104px;flex:0 0 104px;font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};padding-top:2px;">${field}</div>
  <div style="flex:1 1 auto;display:flex;align-items:center;gap:9px;">
    <span style="color:${C.sage};display:flex;">${svg(I.check, 15, 2.4)}</span>
    <span style="font-size:12px;font-weight:700;">${value}</span>
  </div>
  <div style="width:186px;flex:0 0 186px;font-size:11px;color:${C.ink3};line-height:1.4;">${note}</div>
</div>`;

merge['WebMerge.dc.html'] = doc(`
<div style="width:1440px;height:1000px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Two records, one person', 'Flagged by the import in March. 4 more pairs waiting.',
      `${wBtn('Not the same person', I.x)}${wBtn('Merge into one', I.check, true)}`)}

    <div style="flex:1 1 auto;min-height:0;">
      ${card(`
        <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;">
          <div style="width:104px;flex:0 0 104px;"></div>
          <div style="flex:1 1 0;display:flex;align-items:center;gap:11px;min-width:0;">
            ${av('BH', 38)}
            <div style="min-width:0;"><div style="font-size:13px;font-weight:700;">Budi Halim</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">Created Feb 2021 &middot; by Sekretariat</div></div>
          </div>
          <div style="flex:1 1 0;display:flex;align-items:center;gap:11px;min-width:0;">
            ${av('BH', 38, C.bg, C.ink3)}
            <div style="min-width:0;"><div style="font-size:13px;font-weight:700;">B. Halim</div><div style="font-size:11px;color:${C.ink3};margin-top:2px;">Created Mar 2026 &middot; by the Excel import</div></div>
          </div>
          <div style="width:186px;flex:0 0 186px;font-size:10px;font-weight:700;letter-spacing:0.07em;color:${C.ink3};">WHY IT MATTERS</div>
        </div>
        ${cmp('NAME', 'Budi Halim', 'B. Halim', 'a', 'The spreadsheet abbreviated it. The register should not.')}
        ${cmp('BORN', '2 May 1977', 'empty', 'a', 'Never lose a value to an empty one, even if the empty side is newer.')}
        ${cmp('PHONE', '0812-1122-3344', '0812-5511-8890', 'b', 'Two real numbers. Pick the current one - the other is kept as a note, not deleted.')}
        ${cmp('HOUSEHOLD', 'Halim household &middot; 4 people', 'Halim household (2) &middot; 1 person', 'a', 'The second household was created BY this duplicate and disappears with it.')}
        ${cmp('STANDING', 'Registered since Apr 2005', 'Community since Mar 2026', 'a', 'The import could not know. An earlier standing always wins.')}
        ${both('CARE GROUP', 'Anugerah &mdash; one membership, not two', 'Relations combine. No choice to make.')}
        ${both('ATTENDANCE', '184 meetings + 3 = 187', 'Histories add up. This is the whole reason not to delete one side.')}
        ${both('HOSTED', '11 evenings, all kept', 'M26 counts on this. A merge that loses it breaks the leader&rsquo;s payoff.')}
        <div style="padding:15px 18px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:11px;">
          <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.clock, 17)}</span>
          <span style="font-size:12px;color:${C.ink2};line-height:1.55;">A merge is reversible for 30 days, like the import. Both records are kept underneath until then, because the one thing worse than a duplicate is a merge of two people who were never the same person &mdash; and that mistake is usually spotted by the family, weeks later.</span>
        </div>`, 'overflow:hidden;')}
    </div>

    <div style="display:flex;gap:20px;">
      ${card(`<div style="padding:18px 20px;flex:1 1 0;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.help, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">This design manufactures duplicates</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">M5&rsquo;s household field says <span style="font-style:italic;">pick an existing household, or create a new one</span>. A picker that makes creating as easy as finding will be used to create &mdash; and the second Halim household above is exactly that, produced by a screen I wrote.<br><br>The fix is upstream and cheap: match while typing, and put <span style="font-weight:700;color:${C.ink};">did you mean the Halim household, 4 people, Sunter?</span> above the create option rather than beside it.</div>
          </div>
        </div>
      </div>`, 'border-color:#B4562F55;')}

      ${card(`<div style="padding:18px 20px;flex:1 1 0;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.amber};display:flex;padding-top:2px;">${svg(I.clock, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">And every time in this product is naked</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">Sixty-six artboards say <span style="font-family:ui-monospace,monospace;">19.30</span> and none of them say which 19.30. Indonesia has three time zones, and a national multi-tenant product will have churches in all of them &mdash; plus the Sunday 19.00 reminder job that fires from a server somewhere else again.<br><br>Store instants with the church&rsquo;s zone, render local, and never do date arithmetic in the client. Cheap now, and the kind of bug that surfaces as <span style="font-style:italic;">the reminder came at 4am</span>.</div>
          </div>
        </div>
      </div>`, 'border-color:#9A722344;')}
    </div>
  </div>
</div>`);

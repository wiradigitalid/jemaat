import { C, SERIF, doc, svg, I, card, label, rows } from './lib.mjs';
import { sidebar, pageHead, wBtn } from './screens-web.mjs';

/*
 * IMPORT FROM EXCEL - the screen the whole product lives or dies on.
 * Every church already has its people in a spreadsheet, and that
 * spreadsheet is never clean. An importer that demands clean data is an
 * importer nobody finishes. So: nothing is rejected, every row lands
 * flagged, and the one genuinely hard problem - a flat person list
 * becoming households - is asked as a single question with a live count.
 */
export const imp = {};

const step = (n, t, state) => {
  const tone = { done: [C.sage, C.sageTint], now: [C.accent, C.accentTint], todo: [C.ink3, C.bg] }[state];
  return `<div style="display:flex;align-items:center;gap:10px;">
    <div style="width:26px;height:26px;border-radius:999px;background:${tone[1]};color:${tone[0]};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${state === 'done' ? svg(I.check, 14, 2.6) : n}</div>
    <span style="font-size:13px;font-weight:${state === 'now' ? 700 : 600};color:${state === 'todo' ? C.ink3 : C.ink};">${t}</span>
  </div>`;
};

const stepGap = () => `<div style="flex:0 0 44px;height:1px;background:${C.line};"></div>`;

const mapRow = (theirs, sample, ours, state) => {
  const mark = {
    ok: `<span style="color:${C.sage};display:flex;">${svg(I.check, 17, 2.4)}</span>`,
    warn: `<span style="color:${C.amber};display:flex;">${svg(I.help, 17)}</span>`,
    skip: `<span style="color:${C.ink3};display:flex;">${svg(I.x, 15, 2)}</span>`,
  }[state];
  return `<div style="display:flex;align-items:center;gap:16px;padding:0 22px;height:52px;border-top:1px solid ${C.lineSoft};">
    <div style="width:150px;flex:0 0 150px;font-size:13px;font-weight:700;">${theirs}</div>
    <div style="width:206px;flex:0 0 206px;font-size:13px;color:${C.ink3};font-style:italic;">${sample}</div>
    <span style="color:${C.ink3};display:flex;">${svg(I.chevR, 16)}</span>
    <div style="flex:1 1 auto;display:flex;align-items:center;gap:9px;height:36px;padding:0 12px;background:${state === 'skip' ? 'transparent' : C.surface};border:1px solid ${state === 'skip' ? C.lineSoft : C.line};border-radius:12px;">
      <span style="flex:1 1 auto;font-size:13px;font-weight:600;color:${state === 'skip' ? C.ink3 : C.ink};">${ours}</span>
      <span style="color:${C.ink3};display:flex;">${svg(I.chevD, 15)}</span>
    </div>
    ${mark}
  </div>`;
};

const groupChoice = (t, sub, on) => `
<div style="display:flex;align-items:flex-start;gap:11px;padding:11px 14px;">
  <div style="width:18px;height:18px;flex:0 0 18px;border-radius:999px;border:${on ? `5.5px solid ${C.accent}` : `1.5px solid ${C.line}`};margin-top:2px;"></div>
  <div style="flex:1 1 auto;min-width:0;"><div style="font-size:13px;font-weight:600;">${t}</div><div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.4;">${sub}</div></div>
</div>`;

const issue = (n, t) =>
  `<div style="display:flex;align-items:center;gap:11px;padding:10px 14px;">
    <span style="min-width:26px;font-family:${SERIF};font-size:17px;font-weight:600;color:${C.amber};">${n}</span>
    <span style="flex:1 1 auto;font-size:13px;">${t}</span>
  </div>`;

imp['WebImport.dc.html'] = doc(`
<div style="width:1440px;height:900px;background:${C.bg};display:flex;">
  ${sidebar('People')}
  <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;padding:26px 28px;gap:18px;">
    ${pageHead('Import from Excel', 'data-jemaat-2025.xlsx &middot; 261 rows found',
      `${wBtn('Cancel', I.x)}${wBtn('Import 261 people', I.check, true)}`)}

    <div style="display:flex;align-items:center;gap:14px;">
      ${step('1', 'Upload', 'done')}${stepGap()}${step('2', 'Match columns', 'now')}${stepGap()}${step('3', 'Review', 'todo')}${stepGap()}${step('4', 'Done', 'todo')}
    </div>

    <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">
      <div style="flex:1 1 auto;min-width:0;">
        ${card(`
          <div style="display:flex;align-items:center;gap:16px;padding:0 22px;height:44px;">
            <div style="width:150px;flex:0 0 150px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">YOUR COLUMN</div>
            <div style="width:206px;flex:0 0 206px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">FIRST ROW</div>
            <div style="width:16px;flex:0 0 16px;"></div>
            <div style="flex:1 1 auto;font-size:11px;font-weight:700;letter-spacing:0.08em;color:${C.ink3};">GOES TO</div>
            <div style="width:17px;flex:0 0 17px;"></div>
          </div>
          ${mapRow('NAMA', 'Budi Halim', 'Full name', 'ok')}
          ${mapRow('ALAMAT', 'Jl. Danau Indah C2/14', 'Address', 'ok')}
          ${mapRow('HP', '0812-1122-3344', 'Phone', 'ok')}
          ${mapRow('TGL LAHIR', '12/08/1978', 'Date of birth', 'ok')}
          ${mapRow('KOMSEL', 'Anugerah', 'Care group', 'ok')}
          ${mapRow('STATUS', 'Anggota', 'Standing in this church', 'warn')}
          ${mapRow('L/P', 'L', 'Not imported', 'skip')}
          ${mapRow('KET', 'pindah 2024', 'Not imported', 'skip')}
          <div style="padding:14px 22px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 17)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.5;">STATUS holds 3 values we do not recognise &mdash; <span style="font-weight:700;">Simpatisan</span>, <span style="font-weight:700;">Pindah</span>, <span style="font-weight:700;">&ndash;</span>. Map them on the next step, or let them land as Guest and fix later.</span>
          </div>`, 'overflow:hidden;')}
      </div>

      <div style="width:376px;flex:0 0 376px;display:flex;flex-direction:column;gap:18px;">
        ${card(`
          <div style="padding:14px 16px 4px;">${label('Group into households')}
            <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">Your file is a flat list of people. Households are how this app keeps one address for a whole family.</div>
          </div>
          ${rows([
            groupChoice('Same address', 'People sharing an address become one household', true),
            groupChoice('Same surname and address', 'Stricter &mdash; splits shared boarding houses correctly', false),
            groupChoice('Do not group', 'One household each. You can merge them later', false),
          ])}
          <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:baseline;gap:9px;">
            <span style="font-family:${SERIF};font-size:24px;font-weight:600;">76</span>
            <span style="font-size:12px;color:${C.ink2};">households &middot; 12 people on their own</span>
          </div>`)}

        ${card(`
          <div style="padding:14px 16px 4px;">${label('12 rows need attention')}</div>
          ${rows([
            issue('4', 'Names that already exist here'),
            issue('6', 'No phone number'),
            issue('2', 'Dates we could not read'),
          ])}
          <div style="padding:13px 16px;border-top:1px solid ${C.line};display:flex;align-items:flex-start;gap:10px;">
            <span style="color:${C.sage};display:flex;padding-top:1px;">${svg(I.check, 16, 2.4)}</span>
            <span style="font-size:12px;color:${C.ink2};line-height:1.5;">All 261 rows import. Problem rows arrive flagged, never rejected &mdash; fix them when you have time.<br><br>If anything fails part way, <span style="font-weight:700;">none of it lands</span>. Half a congregation imported is worse than none. And the whole thing can be undone for 7 days.</span>
          </div>`)}
      </div>
    </div>
  </div>
</div>`);

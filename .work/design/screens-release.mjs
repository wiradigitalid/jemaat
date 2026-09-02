import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * THE RELEASE MAP.
 *
 * Fourteen iterations only ever added. This one draws the line, because
 * 47 artboards is not a first release and a canvas that never says
 * "later" quietly becomes a two-year plan nobody agreed to.
 *
 * The test used for every screen: IS ANYONE BLOCKED WITHOUT IT? Not "is
 * it good" - everything here is good, that is why it was drawn.
 */
export const rel = {};

const item = (code, name, why, tone = 'ship') => {
  const chip = { ship: [C.sageTint, C.sage], later: [C.bg, C.ink3], decide: [C.amberTint, C.amber] }[tone];
  return `<div style="display:flex;align-items:baseline;gap:11px;padding:6px 16px;">
    <span style="width:38px;flex:0 0 38px;display:inline-flex;align-items:center;justify-content:center;height:20px;border-radius:6px;background:${chip[0]};color:${chip[1]};font-size:10px;font-weight:700;">${code}</span>
    <span style="width:186px;flex:0 0 186px;font-size:13px;font-weight:600;">${name}</span>
    <span style="flex:1 1 auto;font-size:12px;color:${C.ink2};line-height:1.4;">${why}</span>
  </div>`;
};

const colHead = (title, n, sub) => `
<div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
  <div style="display:flex;align-items:baseline;gap:10px;">
    <span style="font-family:${SERIF};font-size:27px;font-weight:600;">${n}</span>
    <span style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.ink3};">${title}</span>
  </div>
  <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">${sub}</div>
</div>`;

const brk = (where, what, fix) =>
  `<div style="display:flex;align-items:flex-start;gap:11px;padding:8px 16px;">
    <span style="width:44px;flex:0 0 44px;font-size:11px;font-weight:700;color:${C.ink3};">${where}</span>
    <div style="flex:1 1 auto;min-width:0;">
      <div style="font-size:12px;font-weight:600;line-height:1.4;">${what}</div>
      <div style="font-size:11px;color:${C.ink3};margin-top:3px;line-height:1.4;">${fix}</div>
    </div>
  </div>`;

const band = (tag, title, meta, why) => `
<div style="padding:16px 16px 12px;margin-top:6px;border-top:1px solid ${C.line};background:${C.bg};">
  <div style="display:flex;align-items:baseline;gap:10px;">
    <span style="display:inline-flex;align-items:center;justify-content:center;height:22px;padding:0 9px;border-radius:6px;background:${C.accent};color:#FFFFFF;font-size:11px;font-weight:700;">${tag}</span>
    <span style="font-size:14px;font-weight:700;">${title}</span>
    <div style="flex:1 1 auto;"></div>
    <span style="font-size:11px;font-weight:700;color:${C.ink3};">${meta}</span>
  </div>
  <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.55;">${why}</div>
</div>`;

const group = (t) =>
  `<div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.ink3};">${t}</div>`;

rel['Release.dc.html'] = doc(`
<div style="width:1440px;height:1280px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:22px;">
  <div style="display:flex;align-items:flex-end;gap:20px;">
    <div style="flex:1 1 auto;">
      <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">What ships first</div>
      <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.5;max-width:760px;">The question asked of every screen was not <span style="font-style:italic;">is it good</span> &mdash; they are all good, that is why they were drawn &mdash; but <span style="font-weight:700;color:${C.ink};">is anyone blocked without it</span>. Then the survivors were counted a second time, because <span style="font-weight:700;color:${C.ink};">a screen is the wrong unit of work</span>: these 31 carry eleven backend capabilities between them, and that is two or three releases for a small team, not one.</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:${C.ink3};line-height:1.6;">One church &middot; one service &middot; one language<br>Membership, households, care groups</div>
    </div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:496px;flex:0 0 496px;">
      ${card(`
        ${colHead('Ship first', '34', 'Counted again and it was 31, not 32. And screens are the wrong unit anyway - these 31 hide eleven backend capabilities. Staged into three releases that a small team can actually finish.')}
        ${band('R0', 'One pilot church', '17 screens &middot; 7 capabilities', 'Corrected at 26, corrected again at 28 - walking it keeps growing it, and that is the honest price of matching the brief. Pendataan anggota opened the brief and had been staged last, so M4 and M5 come forward: the church enters and corrects its own register from day one. No public area, no applications, no bulk import yet. The care group week still works end to end.')}
        ${item('P7', 'Sign in', 'Auth is unavoidable even for a pilot')}
        ${item('P8', 'Enter code', '')}
        ${item('M1', 'Home', 'M19 is the same screen on meeting day')}
        ${item('M4', 'Household', 'Moved from R2. The thing that was asked for first')}
        ${item('M5', 'New person', 'Six fields. Also unblocks the W2 Add button and M14 first-timers')}
        ${item('M6', 'Care groups', 'Back from R1 at iteration 28. It is where the + that CREATES a group lives')}
        ${item('M7', 'Care group detail', '')}
        ${item('W11', 'The empty People table', 'The real first screen a church sees. It is onboarding, not a placeholder')}
        ${item('M8', 'Meeting and RSVP', '')}
        ${item('M9', 'Hosting queue', '')}
        ${item('M11', 'Me', '')}
        ${item('M14', 'Attendance by hand', '')}
        ${item('M26', 'After attendance', 'The leader has to be paid or R1 has no data')}
        ${item('W2', 'People table', 'The office needs to see what WDI loaded')}
        ${item('W8', 'This week', 'Ten minutes on Thursday, and the app is not empty')}
        ${item('S9', 'W8 on a phone', 'Added at iteration 34. Most small churches have no desktop at all')}
        ${item('S9', 'W1 on a phone', 'Same reason. Both are compressions, not new capabilities')}

        ${band('R1', 'Open the doors', '13 screens &middot; 4 capabilities', 'Now any church can be found, join itself, and load its own people. This is the release that makes it a product rather than a favour done for one congregation.')}
        ${item('O1', 'First run', '')}
        ${item('O3', 'Enter church code', '')}
        ${item('O4', 'Confirm the church', '')}
        ${item('P1', 'Home, guest', '')}
        ${item('P2', 'Next service', '')}
        ${item('P3', 'Sermon list', '')}
        ${item('P5', 'Apply to join', '')}
        ${item('P6', 'Application sent', '')}
        ${item('P10', 'That code did not work', 'Ships WITH the code, never after it')}
        ${item('P11', 'The code never came', 'Ships WITH sign-in, never after it')}
        ${item('W1', 'Applicants queue', '')}
        ${item('W4', 'Church code and QR', '')}
        ${item('W5', 'Import from Excel', 'Two weeks on its own. Do not let it hide inside a sprint')}

        ${band('R2', 'Keep it honest', '4 screens &middot; 1 capability', 'The promises the first two releases made. Every one of these was called essential earlier - and every one can wait a few weeks without stranding anybody.')}
        ${item('M2', 'People, care group', 'Ships with the phone-visibility control, not after it')}
        ${item('W6', 'One person, lifecycle', 'Must land before birthdays or warta do')}
        ${item('W9', 'Hand over a group', 'Before the first leader rotates, which is roughly a year')}
        ${item('W10', 'Your data', 'Before the second church signs, not the first')}
        <div style="padding:12px 16px 16px;display:flex;align-items:flex-start;gap:10px;">
          <span style="color:${C.amber};display:flex;padding-top:1px;">${svg(I.help, 16)}</span>
          <span style="font-size:12px;color:${C.ink2};line-height:1.55;">Two holes still open, both cheap. The office cannot SIGN IN to the web &mdash; reuse the phone and code from P7 and P8. And care groups arrive only through the import, so a church starting one in month two has nowhere to do it.</span>
        </div>`, 'overflow:hidden;')}
    </div>

    <div style="width:432px;flex:0 0 432px;">
      ${card(`
        ${colHead('Later', '16', 'Real work, all of it. But no church and no member is stuck waiting for any of it.')}
        ${item('O2', 'Scan QR', 'Typing the code already works', 'later')}
        ${item('O5', 'My churches', 'One church each is fine at first', 'later')}
        ${item('O6', 'Remove a church', 'Follows O5', 'later')}
        ${item('P4', 'One sermon', 'The list can open YouTube directly', 'later')}
        ${item('P9', 'Let us talk first', 'The office can simply phone them', 'later')}
        ${item('M3', 'Full directory', 'The office has W2 for this', 'later')}
        ${item('M15', 'Share to WhatsApp', 'Copy and paste survives a few months', 'later')}
        ${item('M22', 'Move my membership', 'Paper still works. It always has', 'later')}
        ${item('W7', 'Incoming transfer', 'Follows M22', 'later')}
        ${item('M24', 'Home at 2,000', 'The MODEL decision is now. The screen is not', 'later')}
        ${item('M25', 'Groups at forty', 'Only bites above roughly 15 groups', 'later')}
        ${item('M27', 'What the church knows', 'The SCREEN is later. One control inside it ships now, see the note', 'later')}
        <div style="padding:12px 16px 4px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:${C.amber};">THE ONE BIG CUT &mdash; SERVING, 4 SCREENS</div>
        ${item('M10', 'Serving', 'Church-wide teams and rosters', 'later')}
        ${item('M12', 'Assign, pick', '', 'later')}
        ${item('M13', 'Assign, guest', '', 'later')}
        ${item('W3', 'Serving roster', '', 'later')}
        <div style="padding:8px 16px 16px;font-size:12px;color:${C.ink2};line-height:1.55;">The volunteer rotation that was actually asked for lives inside a care group, and M9 already does it. Church-wide serving teams are a second product wearing the same clothes.</div>`, 'overflow:hidden;')}
    </div>

    <div style="flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:20px;">
      ${card(`
        ${colHead('You decide', '2', 'Not mine to answer. Both are defensible either way, and both were built so you could see them before choosing.')}
        ${item('M20', 'This week, warta', 'Beyond the original brief. But without it no ordinary member has a reason to open the app between meetings', 'decide')}
        ${item('M23', 'Have you seen Dedi', 'Pastoral care, or attendance surveillance, depending entirely on how a church holds it', 'decide')}
        <div style="height:10px;"></div>`, 'overflow:hidden;')}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="display:flex;align-items:baseline;gap:10px;">
            <span style="font-family:${SERIF};font-size:27px;font-weight:600;">4</span>
            <span style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.ink3};">Not screens</span>
          </div>
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">Conditions every shipped screen has to survive. They are tests, not things to build.</div>
        </div>
        ${item('M16', 'Indonesian', 'Text runs longer. Labels must survive it', 'decide')}
        ${item('M17', 'No signal', 'Concrete halls eat data', 'decide')}
        ${item('M18', 'Readable type', 'Half a congregation is over fifty', 'decide')}
        ${item('M21', 'Quiet week', 'Empty is a correct state', 'decide')}
        <div style="height:10px;"></div>`, 'overflow:hidden;')}

      ${card(`
        <div style="padding:16px 16px 12px;border-bottom:1px solid ${C.lineSoft};">
          <div style="display:flex;align-items:baseline;gap:10px;">
            <span style="font-family:${SERIF};font-size:27px;font-weight:600;color:${C.amber};">5</span>
            <span style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.ink3};">Dead ends in R0</span>
          </div>
          <div style="font-size:12px;color:${C.ink2};margin-top:7px;line-height:1.5;">Staging a design is not slicing a list. Every one of these is a button in an R0 screen pointing at a screen R0 does not contain.</div>
        </div>
        ${brk('M1', 'Search icon, announcements strip, serving card', 'Still all three. M2 stayed in R2. See M28')}
        ${brk('M11', 'My churches, and the household row', 'Trim to profile, standing, sign out')}
        ${brk('M7', 'The People tab shows contacts', 'Hide the tab, or pull M2 into R0')}
        ${brk('M14', 'Someone came who is not listed', 'Fixed at iteration 27 - M5 is in R0 now')}
        ${brk('W2', 'Import from Excel', 'Add person now works. Import is still R1')}
        ${brk('W8', 'The speaker picker', 'A plain text field until M12 exists')}
        <div style="padding:12px 16px 16px;border-top:1px solid ${C.line};font-size:12px;color:${C.ink2};line-height:1.55;">And one that is not a dead end but a verdict: with the warta cut, an ordinary member gets one button once a week for three months. <span style="font-weight:700;color:${C.ink};">R0 either takes M20, or it is a pilot that only tests whether LEADERS keep using it</span> &mdash; which is a fair question to ask, but a different one.</div>`, 'overflow:hidden;')}

      ${card(`<div style="padding:18px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">Three decisions that cost nothing now</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">A service is a thing, not a date. Standing is per church, not per person. Lifecycle is a fourth field, not a fourth tier.<br><br>None of these adds a screen to the release. All three become expensive once the schema exists.</div>
          </div>
        </div>
      </div>`, `border-color:#B4562F55;`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

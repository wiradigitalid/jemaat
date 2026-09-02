import { C, SERIF, doc, svg, I, card, label } from './lib.mjs';

/*
 * WHAT THIS PRODUCT HOLDS, AND HOW IT GETS OUT.
 *
 * Thirty-six iterations of privacy work, all of it about members seeing
 * each other or the church seeing members. Never once about the list
 * itself leaving the building.
 *
 * In parts of Indonesia a register of 248 Christians with addresses,
 * phone numbers, and the time and place they gather every week is not a
 * privacy question. Stated plainly and without drama, because a product
 * sold to Indonesian churches has to have thought about it, and because
 * most of the mitigations turn out to be small.
 *
 * One of the leaks is mine. I added "find my church by name" at
 * iteration 2, unprompted, and flagged the scope of it then. This is
 * the cost I could not name at the time.
 */
export const threat = {};

const asset = (what, where, note) => `
<div style="padding:11px 16px;border-top:1px solid ${C.lineSoft};">
  <div style="font-size:13px;font-weight:700;">${what}</div>
  <div style="font-size:11px;color:${C.accent};margin-top:4px;font-weight:600;">${where}</div>
  <div style="font-size:11px;color:${C.ink2};margin-top:5px;line-height:1.5;">${note}</div>
</div>`;

const leak = (path, mitigation, state) => {
  const tone = {
    done: [C.sageTint, C.sage, 'ALREADY DESIGNED'],
    todo: [C.amberTint, C.amber, 'NOT DESIGNED'],
    trade: [C.bg, C.ink3, 'DELIBERATE TRADE'],
  }[state];
  return `<div style="padding:12px 16px;border-top:1px solid ${C.lineSoft};">
    <div style="display:flex;align-items:flex-start;gap:11px;">
      <div style="flex:1 1 auto;min-width:0;font-size:13px;font-weight:700;line-height:1.4;">${path}</div>
      <span style="display:inline-flex;align-items:center;height:19px;padding:0 8px;border-radius:6px;background:${tone[0]};color:${tone[1]};font-size:9px;font-weight:700;white-space:nowrap;">${tone[2]}</span>
    </div>
    <div style="font-size:11px;color:${C.ink2};margin-top:6px;line-height:1.55;">${mitigation}</div>
  </div>`;
};

threat['Threat.dc.html'] = doc(`
<div style="width:1440px;height:1020px;background:${C.bg};display:flex;flex-direction:column;padding:40px;gap:20px;">
  <div>
    <div style="font-family:${SERIF};font-size:34px;font-weight:500;letter-spacing:-0.015em;">What this holds, and how it gets out</div>
    <div style="font-size:13px;color:${C.ink2};margin-top:8px;line-height:1.55;max-width:1000px;">Thirty-six iterations of privacy work, all of it about members seeing each other or the church seeing members. None about the list leaving the building. In parts of Indonesia a register of 248 Christians with addresses and a weekly meeting time is not a privacy question, and a product sold to Indonesian churches has to have said so once.</div>
  </div>

  <div style="display:flex;gap:20px;flex:1 1 auto;min-height:0;">

    <div style="width:390px;flex:0 0 390px;">
      ${card(`
        <div style="padding:15px 16px 6px;">${label('What is worth taking')}</div>
        ${asset('248 names with phone numbers', 'W2, M2, the export', 'The single most complete list of a congregation that has ever existed at most churches. It used to be a book in a locked drawer.')}
        ${asset('Addresses, grouped into families', 'M4, household records', 'Household grouping is what makes the register useful and also what makes it a map.')}
        ${asset('Where and when everyone gathers', 'P1, P2 &mdash; public by design', 'A church that wants visitors must be findable. This one is not a leak, it is the point.')}
        ${asset('Who leads, and who is new', 'W11, M7, applicants', 'Leadership and new arrivals are the two groups least able to absorb unwanted attention.')}
        <div style="height:8px;"></div>`)}
    </div>

    <div style="flex:1 1 0;min-width:0;">
      ${card(`
        <div style="padding:15px 16px 6px;">${label('Five ways it gets out')}</div>
        ${leak('The export file, on somebody&rsquo;s laptop',
          'W10 is already administrator-only and logs every download with a name and a date. Closed at iteration 38: addresses are now left out unless asked for, so the common case &mdash; someone wanting a phone list &mdash; no longer carries a map with it.', 'done')}
        ${leak('A lost or stolen phone with the app on it',
          'Closed at iteration 38. M11 now carries a This phone row that asks for the code again after twelve idle days, and the directory is fetched rather than kept. The likeliest of the five, and the dullest.', 'done')}
        ${leak('Find my church by name',
          'I added this at iteration 2, unprompted, to help someone whose code had gone stale. It also makes the set of churches enumerable with their locations and service times. Closed at iteration 38. O1 and P10 now read look it up by name and city, and say plainly that there is no browsable list. W4 lets a church be unlisted.', 'done')}
        ${leak('The WhatsApp vendor',
          'Iteration 32 sent every act-now message through a third party, which hands them every member number and, by inference, who is in which care group. Closed at iteration 38. W4 states it as a decision the church makes, with the honest alternative: push only, everything still works, fewer people answer.', 'done')}
        ${leak('The public area itself',
          'Service time, place, speaker and posters are open to anyone with the code, and that is the trade a church makes to be findable. The line that must hold: no member names, no member count, no leader names on any public screen. P1, P2 and P3 all keep it today.', 'trade')}
        <div style="height:8px;"></div>`)}
    </div>

    <div style="width:392px;flex:0 0 392px;display:flex;flex-direction:column;gap:18px;">
      ${card(`<div style="padding:18px 20px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="color:${C.accent};display:flex;padding-top:2px;">${svg(I.lock, 19)}</span>
          <div style="flex:1 1 auto;">
            <div style="font-size:14px;font-weight:700;">The one thing not to build</div>
            <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">A public directory of churches using Jemaat. It is the obvious growth feature, it would help exactly one person &mdash; someone who lost the bulletin &mdash; and it would publish a national index of congregations with their addresses and meeting times.<br><br>The church code exists so that finding a church is something a church hands out, not something a platform publishes.</div>
          </div>
        </div>
      </div>`, 'border-color:#B4562F55;')}

      ${card(`<div style="padding:18px 20px;">
        <div style="font-size:14px;font-weight:700;">And the question that led here</div>
        <div style="font-size:12px;color:${C.ink2};margin-top:8px;line-height:1.6;">Churches with a branch or a pos: <span style="font-weight:700;color:${C.ink};">each one gets its own church code.</span> A pos with its own service time, its own leaders and its own announcements is operationally a separate congregation, and the multi-tenant model already carries it with no new concept.<br><br>What it costs: the mother church cannot see the whole picture in one place, and someone attending both needs two codes. Both are acceptable through R2.<br><br>What it also buys, given everything on the left: a pos in a difficult area can be findable on its own terms, or not at all, without that being decided for it by the church it belongs to.</div>
      </div>`)}
      <div style="flex:1 1 auto;"></div>
    </div>
  </div>
</div>`);

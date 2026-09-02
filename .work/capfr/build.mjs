import { writeFileSync } from 'node:fs';

/* ── the register ─────────────────────────────────────────────────────────
   Extracted from the 70-artboard design. Every FR names the screen that is
   its evidence, so a requirement can never drift from what was drawn.
   Release: 0 = pilot church, 1 = open the doors, 2 = keep the promises,
   L = parked with a reason.  n = a MUST NOT.                             */

const CAPS = [
  { id: '01', name: 'Church tenancy and discovery',
    what: 'One app, many churches. What is written about a person may be written only by that person or by the church writing it — never by a third.',
    frs: [
      ['A person record is global and holds two things only: the identity that signs them in — phone number and account — and what the person has stated about themselves. No church ever writes to it.', 0, 'S5', 'n',
        'Q: 1 user = 1 aplikasi, data user langsung terlink ke gereja2 (1 SSOT)? — A: one account and one person row, yes. But the global row is written only by the person; everything a church typed lives on that church’s standing row. See FR-01.5 for the invariant that makes the redundancy safe.'],
      ['Everything a church knows about a person hangs off a standing row — one row per person per church — and never off the person.', 0, 'S5'],
      ['A standing row carries the name and birth date as that church holds them, the standing value, the lifecycle, the date they joined that church, their household and role in it, and who at that church may see their phone number.', 0, 'S5'],
      ['A household belongs to exactly one church. Two churches recording the same family hold two households, and neither can read or change the other’s.', 0, 'S5', 'n'],
      ['What a church holds about a person may be written by that church, or by the person it describes. There is no third path, and no church is ever the second party to another church’s record.', 0, 'S5', 'n'],
      ['A change made at one church — an address, a name, a household composition — never propagates to another. Church data crosses churches only by a transfer all three parties agreed to.', 0, 'S5', 'n'],
      ['No screen, message or export may carry data belonging to a church other than the one in scope.', 0, 'S5', 'n'],
      ['Two churches holding the same person see two unrelated standing rows. Neither is told the other exists, and no screen, count, search or export reveals where else that person stands.', 0, 'S5', 'n'],
      ['When a number typed into the register already has a person record, the row is reused silently. No message, badge, match hint or duplicate warning tells the office that person is known anywhere else.', 0, 'M5 &middot; W5', 'n'],
      ['Nothing a person states ever changes what a church holds. A church’s record moves only when that church moves it.', 0, 'S11 &middot; W14', 'n'],
      ['A person states their own details once, in one place. The statement is a record of its own, beside every church archive and inside none of them.', 1, 'M30 &middot; S11'],
      ['A church can look up the stated value for anyone on its roll, see when it was stated, and adopt or keep it — one field at a time, never as a whole record.', 1, 'W14 &middot; W15'],
      ['Adopting is logged with the field, the value it replaced, the person who adopted it and the moment. The replaced value stays readable.', 1, 'W15'],
      ['The sign-in number is global; the number a church reaches a person on is that church’s own field. Changing the first does not change the second — the church is shown they differ and decides.', 1, 'S11 &middot; W15'],
      ['Wherever a household is shown to a person, the church it belongs to is named beside it. Two churches holding different pictures of one family must read as two churches, never as a contradiction.', 1, 'M32'],
      ['A person may remove a church from their own app without asking it. That church’s register is unchanged by their doing so.', 1, 'not drawn'],
      ['A person signed in at more than one church switches between them explicitly. Exactly one church is in scope at a time.', 1, 'not drawn'],
      ['A church is identified by a code of six to twelve characters, case-insensitive, excluding 0, 1, O and I.', 1, 'O3'],
      ['A valid code shows the church name, city, service pattern and care group count for confirmation before anything is stored.', 1, 'O4'],
      ['A church can be found by exact full name plus city. No browsable or enumerable list of churches may exist.', 1, 'O1 &middot; P10 &middot; S10', 'n'],
      ['A church may set itself unlisted, after which only the code reaches it.', 1, 'W4'],
      ['Rotating a code stops it working for new joins and changes nothing for anyone already following.', 1, 'W4'],
      ['A church administrator edits their own church record without approval. Changes to name or city are logged with a person and a date.', 1, 'not drawn'],
      ['A QR code encodes the same church code and resolves identically.', 'L', 'O2'],
    ] },

  { id: '02', name: 'Identity, sessions and roles',
    what: 'An account exists because a church recorded a number, never because someone asked for one.',
    frs: [
      ['Sign-in is a phone number plus a six-digit code sent over WhatsApp, with SMS as fallback.', 0, 'P7 · P8'],
      ['There is no self-service account creation. An account exists only for a number the office has recorded.', 0, 'P7', 'n'],
      ['Nobody — not the office, not the operator — can read or reuse another person&rsquo;s sign-in code.', 0, 'P11', 'n'],
      ['After two undelivered codes the system offers SMS, explains the likely causes, and names a person at that church to contact.', 1, 'P11'],
      ['A session asks for the code again after twelve idle days.', 2, 'M11'],
      ['The directory is fetched on demand and is never written to device storage.', 2, 'S10', 'n'],
      ['Roles are granted per person per church: administrator, church office, care group leader.', 2, 'W13'],
      ['A church must hold at least two administrators; the system refuses to leave exactly one.', 2, 'W13'],
      ['Only an administrator grants or revokes a role. The church office role cannot.', 2, 'W13'],
      ['Revoking a role takes effect at once and changes nothing about membership, household or history.', 2, 'W13'],
      ['The role list shows when each holder last used their access.', 2, 'W13'],
    ] },

  { id: '03', name: 'People and households',
    what: 'The household holds the address. The person holds their standing. Six fields, two optional.',
    frs: [
      ['A person is created from at most six fields — name, household, role in household, birth date, phone, standing — of which only the first three are required.', 0, 'M5'],
      ['Role in household is one of head, spouse, child, other.', 0, 'M4 · M5'],
      ['A household carries the address and the area, belongs to one church, and is never shared with another.', 0, 'S5'],
      ['Changing a household address applies to every person in that household.', 0, 'M4'],
      ['While a household name is typed, existing matches are offered above the option to create a new one.', 0, 'M5'],
      ['A person chooses who sees their phone number — their care group, everyone signed in, or the office only — separately for each church they belong to.', 2, 'M27'],
      ['A person can see everything the church holds about them, attendance included, and correct their own name, birth date and phone.', 'L', 'M27'],
      ['The head or spouse of a household may correct its address at their own church. The change is logged and appears in that church&rsquo;s list of what changed.', 2, 'M32 &middot; W17'],
      ['Nobody but the office adds a person to a household or removes one from it.', 2, 'W17 &middot; M32', 'n'],
      ['An office is shown what its own members changed about themselves since it last looked.', 2, 'W16'],
      ['No member-facing deletion of their own record is offered. The register is the church&rsquo;s record.', 'L', 'M27', 'n'],
    ] },

  { id: '04', name: 'Standing and lifecycle',
    what: 'Two separate fields. What someone is to this church, and whether they are still with it.',
    frs: [
      ['The standing value is one of guest, community, registered.', 0, 'S5'],
      ['The absence of a standing row means the person is not on that roll — and they can still be scheduled.', 0, 'S5 · W3'],
      ['Displayed standing labels are configurable per church. The stored values are not.', 1, 'S5'],
      ['Lifecycle is one of active, inactive, transferred out, deceased, and is a field separate from standing.', 2, 'W6'],
      ['Deceased or transferred out removes the person from birthdays, rosters, open slots, all counts and every outbound message.', 2, 'W6'],
      ['The same change leaves attendance, hosting and serving history untouched, and the household intact.', 2, 'W6'],
      ['No record is deleted by a lifecycle change. Only the office may set one, and it is reversible.', 2, 'W6', 'n'],
      ['A deceased person appears to their own household under in memory, with no status badge.', 2, 'M4'],
    ] },

  { id: '05', name: 'Applications and confirmation',
    what: 'The office is the gate, and the gate has no reject.',
    frs: [
      ['An applicant gives a name, a phone number, and what they are asking for — stated as a situation, not as a standing label.', 1, 'P5'],
      ['The form carries explicit consent to be messaged, scoped to services, care group, and things asked of them.', 1, 'P5'],
      ['An unconfirmed applicant keeps everything a guest has and is told the application stays open.', 1, 'P6 · P9'],
      ['Confirming sets the standing, places the person in a household, and optionally in a care group, in one action.', 1, 'W1'],
      ['No decline action exists. The furthest available is marking an application as needing a conversation.', 1, 'W1 · P9', 'n'],
      ['That state names a person at the church and a way to reach them.', 1, 'P9'],
    ] },

  { id: '06', name: 'Care groups',
    what: 'Belonging to a group is its own relation. It never touches anyone&rsquo;s membership.',
    frs: [
      ['A care group has a name, an area, a weekday, a time and a leader.', 0, 'M6 · M7'],
      ['Care group membership is a relation between a person and a group, independent of standing.', 0, 'S5'],
      ['A person of any standing, guest included, may lead a care group.', 0, 'W13'],
      ['Handing a group over can be immediate, dated, or preceded by a co-leader period.', 2, 'W9'],
      ['A handover carries the member list, meeting history and hosting rota — and never dismissed prompts or anything written in confidence.', 2, 'W9', 'n'],
      ['Above roughly fifteen groups, groups are reached by area, each area having a coordinator.', 'L', 'M25'],
      ['The system reports how many people belong to no care group.', 'L', 'M25'],
    ] },

  { id: '07', name: 'Meetings, RSVP and attendance',
    what: 'What someone said and what actually happened are two different facts.',
    frs: [
      ['A meeting belongs to a care group and has a date, a time and a host household.', 0, 'M7 · M8'],
      ['A member answers going, cannot, or not sure — in the app or by replying to a message.', 0, 'M8'],
      ['The answer and the attendance are stored separately.', 0, 'S5'],
      ['A leader records attendance at one tap per person, with no typing.', 0, 'M14'],
      ['A first-time visitor is added to attendance by name alone.', 0, 'M14'],
      ['A leader may answer on behalf of someone with no phone on file.', 0, 'M14'],
      ['After saving, the leader is shown who said yes and did not come, who is new, and how the group has grown.', 0, 'M26'],
      ['No per-person attendance rate, score or percentage is computed or shown to anyone but that person.', 0, 'S5 · M23', 'n'],
    ] },

  { id: '08', name: 'Hosting rota',
    what: 'Open dates are visible to everyone and claimed by the person themselves.',
    frs: [
      ['Open hosting dates for a group are visible to every member of it.', 0, 'M9'],
      ['A member claims an open date directly. No approval step stands in the way.', 0, 'M9'],
      ['Tasks within a date — the devotion, the food — are claimable separately.', 0, 'M9'],
      ['Whatever rota rule is in force is displayed as text on the screen.', 0, 'M9'],
      ['Dates become claimable on a stated day and not before.', 0, 'M9'],
    ] },

  { id: '09', name: 'Serving teams and assignments',
    what: 'A slot points at a person, which is why a borrowed pianist needs no membership.',
    frs: [
      ['A team belongs to a church and has members.', 'L', 'M10'],
      ['A slot belongs to a service or a meeting and names a role.', 'L', 'W3'],
      ['An assignment references a person and never requires a standing row in that church.', 'L', 'S5 · W3', 'n'],
      ['Assigning offers team members first, then people on the roll, then past guests with how many times each was used.', 'L', 'M12'],
      ['A typed name with no match is kept as a reusable guest. A name alone is sufficient.', 'L', 'M13'],
      ['A guest is shown distinctly from someone on the roll wherever they appear.', 'L', 'W2 · W3'],
      ['Where a church runs more than one service, an assignment states which, and flags when it is not the one that person attends.', 'L', 'M24'],
    ] },

  { id: '10', name: 'The weekly publication',
    what: 'A church thinks in weeks, not modules. One form on a Thursday feeds four surfaces.',
    frs: [
      ['One form per week carries the service, the speaker, the series, the poster, the announcements and last week&rsquo;s recording.', 0, 'W8'],
      ['Publishing updates the public screens and every member&rsquo;s week at once. There are no separate modules to keep in step.', 0, 'W8'],
      ['The date and time come from the church&rsquo;s worship-day setting, not from a per-week entry.', 0, 'W8 · S5'],
      ['A speaker may be someone on the roll or a guest, chosen with the same picker as any assignment.', 0, 'W8'],
      ['The poster is optional. Without one, the title is rendered instead.', 0, 'W8'],
      ['An announcement carries an author and an optional expiry; unticked ones persist to the following week.', 0, 'W8'],
      ['The whole form is operable on a phone, the poster upload excepted.', 0, 'S9'],
      ['The office is shown whether last week was opened, how many groups recorded attendance, and how many applicants are waiting.', 0, 'W8'],
      ['No public screen shows member names, member counts or leader names.', 0, 'P1 · P2 · P3 · S10', 'n'],
    ] },

  { id: '11', name: 'Messaging and notifications',
    what: 'If a person has to do something it goes to WhatsApp. If it is only nice to know, push is enough.',
    frs: [
      ['A message a person must act on is sent over WhatsApp.', 0, 'S7'],
      ['Nothing pastoral is sent automatically on any channel.', 0, 'S7 · M23', 'n'],
      ['Times are stored as instants with the church&rsquo;s zone and rendered local. No date arithmetic happens in the client.', 0, 'W12'],
      ['A message that is only informational is sent as a push notification.', 1, 'S7'],
      ['The care group invitation carries reply buttons that record an answer without opening the app.', 1, 'S8'],
      ['A church may switch WhatsApp off entirely and run on push alone.', 1, 'W4'],
      ['Setup states plainly that enabling WhatsApp passes member numbers to a messaging provider.', 1, 'W4'],
      ['A serving duty message carries the call time and a confirm button.', 'L', 'S8'],
    ] },

  { id: '12', name: 'Register intake and hygiene',
    what: 'The data arrives as a spreadsheet and it is never clean. Nothing is rejected; nothing lands half done.',
    frs: [
      ['An empty register offers the household concept and a stated order to work in, before anything is typed.', 0, 'W11'],
      ['An import maps the file&rsquo;s own column names onto fields, and skips the columns nobody wants.', 1, 'W5'],
      ['Households are inferred by a stated rule, with a live count shown before anything is committed.', 1, 'W5'],
      ['No row is rejected. Rows with problems import flagged.', 1, 'W5'],
      ['If any part of an import fails, none of it lands.', 1, 'W5', 'n'],
      ['An import is reversible for thirty days.', 1, 'W5'],
      ['Candidate duplicates are surfaced and merged field by field.', 2, 'W12'],
      ['A merge never replaces a value with an empty one.', 2, 'W12', 'n'],
      ['Merged histories are summed, never chosen between.', 2, 'W12'],
      ['A merge is reversible for thirty days and keeps both records underneath until then.', 2, 'W12'],
    ] },

  { id: '13', name: 'Portability and transfer',
    what: 'A church that could always leave is a church that will consider entering.',
    frs: [
      ['The office can download the whole register at any moment, with no request and no waiting period.', 2, 'W10'],
      ['Data leaves as spreadsheets, plus one machine-readable file that holds everything.', 2, 'W10'],
      ['Addresses are excluded from an export unless they are explicitly asked for.', 2, 'W10', 'n'],
      ['Every download is logged with a person and a date, and only an administrator may perform one.', 2, 'W10'],
      ['Closing a church stops its code and removes it from members&rsquo; apps. Nothing is deleted for thirty days.', 2, 'W10'],
      ['A membership transfer requires the person, the origin office and the receiving office to agree.', 'L', 'M22'],
      ['A transfer carries name, birth date, household composition, sacrament dates and the original joining date — and never attendance, giving or pastoral records.', 'L', 'M22 · W7', 'n'],
      ['A transfer is verifiable whether it arrives as data or as a printed letter with a reference.', 'L', 'W7'],
      ['Where no letter exists at all, the receiving church may confirm the person as community and resolve it afterwards.', 'L', 'W7'],
    ] },

  { id: '14', name: 'Platform operation',
    what: 'Someone has to bring a church into being &mdash; and that someone must never be able to read inside one.',
    frs: [
      ['A church exists only when a platform operator creates it. Nothing inside the app brings a church into being.', 0, 'not drawn', 'n'],
      ['Platform operator is a role over the whole installation, granted outside every church, and it alone creates, suspends, restores or closes one.', 0, 'not drawn'],
      ['An operator reads the church record only &mdash; name, city, code, status, created date, last active. Never a person, a household, a group, a message, nor a count of any of them.', 0, 'not drawn', 'n'],
      ['A church record carries a status: requested, active, suspended or closed.', 0, 'not drawn'],
      ['Creating a church takes its name, city, worship-day setting and one contact person, and issues the code.', 0, 'not drawn'],
      ['The installation refuses to be left with no operator, and granting or revoking the role is itself logged.', 0, 'not drawn'],
      ['A church is requested on a public form giving church name, city and one contact person.', 1, 'not drawn'],
      ['A request may be declined with a reason recorded. CAP-05 governs a person asking to belong; this governs an organisation asking for an account, and they are not the same thing.', 1, 'not drawn'],
      ['Approving a request issues the code to the named contact over the same channel the app signs people in with.', 1, 'not drawn'],
      ['An operator can suspend a church: its code stops working, its public screens go dark, its members are shown a stated message, and nothing is deleted. It is reversible, and the data is kept at least thirty days.', 1, 'not drawn'],
      ['Every operator action against a church is logged with the operator, the church and the moment, and no operator can edit that log.', 1, 'not drawn', 'n'],
      ['The operator console is its own surface and is never rendered inside a church&rsquo;s web office.', 1, 'not drawn', 'n'],
      ['An installation may be configured for a single church, in which case no request form, no operator console and no church switcher is shown.', 2, 'not drawn'],
    ] },
];

/* ── counts ───────────────────────────────────────────────────────────── */
const all = CAPS.flatMap((c) => c.frs);
const byRel = (r) => all.filter((f) => f[1] === r).length;
const nots = all.filter((f) => f[3] === 'n').length;
const relOf = (c, r) => c.frs.filter((f) => f[1] === r).length;

const relTag = (r) => {
  const m = { 0: ['R0', 'r0'], 1: ['R1', 'r1'], 2: ['R2', 'r2'], L: ['later', 'rl'] }[r];
  return `<span class="rel ${m[1]}">${m[0]}</span>`;
};

/* ── page ─────────────────────────────────────────────────────────────── */
const capRow = (c) => `
      <tr>
        <td class="mono cid">CAP-${c.id}</td>
        <td class="capname"><strong>${c.name}</strong><span class="capwhat">${c.what}</span></td>
        <td class="num">${c.frs.length}</td>
        <td class="num">${relOf(c, 0) || '&middot;'}</td>
        <td class="num">${relOf(c, 1) || '&middot;'}</td>
        <td class="num">${relOf(c, 2) || '&middot;'}</td>
        <td class="num">${relOf(c, 'L') || '&middot;'}</td>
        <td class="num oxide">${c.frs.filter((f) => f[3] === 'n').length || '&middot;'}</td>
      </tr>`;

const frRow = (c, f, i) => {
  const no = f[3] === 'n';
  return `
      <div class="fr${no ? ' isnot' : ''}">
        <div class="frid mono">FR-${c.id}.${i + 1}</div>
        <div class="frtext">${no ? '<span class="nottag">must not</span> ' : ''}${f[0]}</div>
        <div class="frrel">${relTag(f[1])}</div>
        <div class="frev mono">${f[2]}</div>
      </div>`;
};

const capBlock = (c) => `
    <section class="cap" id="cap-${c.id}">
      <header class="caphead">
        <div class="capid mono">CAP-${c.id}</div>
        <div>
          <h3>${c.name}</h3>
          <p>${c.what}</p>
        </div>
        <div class="capcount mono">${c.frs.length} FR</div>
      </header>
      <div class="frs">${c.frs.map((f, i) => frRow(c, f, i)).join('')}</div>
    </section>`;

const html = `<title>Jemaat Capability Register</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
<style>
  :root{
    --paper:#F7F8FA; --surface:#FFFFFF; --ink:#16202B; --ink2:#4C5A69; --ink3:#8494A3;
    --rule:#DDE3EA; --rule-soft:#EDF1F5; --accent:#1D4E7E; --accent-soft:#E7EEF5;
    --oxide:#8C3A2E; --oxide-soft:#F6EAE7; --moss:#2F6B4F; --moss-soft:#E7F0EB;
  }
  @media (prefers-color-scheme:dark){
    :root:not([data-theme="light"]){
      --paper:#111820; --surface:#18212B; --ink:#E6ECF2; --ink2:#A5B3C1; --ink3:#71818F;
      --rule:#2A3542; --rule-soft:#212B36; --accent:#7FB2DE; --accent-soft:#1B2B3A;
      --oxide:#D89184; --oxide-soft:#33231F; --moss:#8CC0A4; --moss-soft:#1B2A22;
    }
  }
  :root[data-theme="dark"]{
    --paper:#111820; --surface:#18212B; --ink:#E6ECF2; --ink2:#A5B3C1; --ink3:#71818F;
    --rule:#2A3542; --rule-soft:#212B36; --accent:#7FB2DE; --accent-soft:#1B2B3A;
    --oxide:#D89184; --oxide-soft:#33231F; --moss:#8CC0A4; --moss-soft:#1B2A22;
  }

  *{box-sizing:border-box}
  body{
    margin:0; background:var(--paper); color:var(--ink);
    font-family:"IBM Plex Sans","Segoe UI",system-ui,sans-serif;
    font-size:15px; line-height:1.6; -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:1120px; margin:0 auto; padding:56px 28px 96px}
  .mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace; font-variant-numeric:tabular-nums}

  /* masthead */
  .eyebrow{font-family:"IBM Plex Mono",monospace; font-size:11px; font-weight:600;
    letter-spacing:.14em; text-transform:uppercase; color:var(--ink3)}
  h1{font-family:"Zilla Slab",Georgia,serif; font-weight:600; font-size:clamp(32px,4.4vw,46px);
    line-height:1.1; letter-spacing:-.01em; margin:14px 0 0; text-wrap:balance}
  .standfirst{margin:16px 0 0; max-width:64ch; color:var(--ink2); font-size:16px}
  .masthead{border-bottom:2px solid var(--ink); padding-bottom:26px}

  /* the two things that are the point */
  .point{display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:1px;
    background:var(--rule); border:1px solid var(--rule); margin:30px 0 0}
  .point > div{background:var(--surface); padding:20px 22px}
  .point h2{font-family:"Zilla Slab",Georgia,serif; font-size:19px; font-weight:600; margin:8px 0 0}
  .point p{margin:8px 0 0; font-size:14px; color:var(--ink2)}
  .pnum{font-family:"Zilla Slab",Georgia,serif; font-size:13px; font-weight:700; color:var(--accent)}

  /* tallies */
  .tally{display:flex; flex-wrap:wrap; gap:1px; background:var(--rule);
    border:1px solid var(--rule); margin:34px 0 0}
  .tally > div{background:var(--surface); padding:14px 20px; flex:1 1 130px}
  .tally b{display:block; font-family:"Zilla Slab",Georgia,serif; font-size:27px;
    font-weight:600; line-height:1.1; font-variant-numeric:tabular-nums}
  .tally span{display:block; font-size:12px; color:var(--ink3); margin-top:4px}
  .tally .oxide b{color:var(--oxide)}

  h2.section{font-family:"Zilla Slab",Georgia,serif; font-size:23px; font-weight:600;
    margin:52px 0 0; padding-bottom:10px; border-bottom:1px solid var(--ink)}
  .sechint{margin:12px 0 0; color:var(--ink2); font-size:14px; max-width:70ch}

  /* capability matrix */
  .matrixwrap{overflow-x:auto; margin-top:20px; border:1px solid var(--rule); background:var(--surface)}
  table{border-collapse:collapse; width:100%; min-width:760px}
  thead th{font-family:"IBM Plex Mono",monospace; font-size:10px; font-weight:600;
    letter-spacing:.1em; text-transform:uppercase; color:var(--ink3);
    text-align:left; padding:12px 14px; border-bottom:1px solid var(--rule); white-space:nowrap}
  thead th.n{text-align:right}
  tbody td{padding:11px 14px; border-bottom:1px solid var(--rule-soft); vertical-align:top; font-size:14px}
  tbody tr:last-child td{border-bottom:none}
  td.cid{white-space:nowrap; color:var(--accent); font-size:12px; font-weight:600; padding-top:13px}
  td.num{text-align:right; font-family:"IBM Plex Mono",monospace; font-variant-numeric:tabular-nums;
    color:var(--ink2); white-space:nowrap}
  td.num.oxide{color:var(--oxide); font-weight:600}
  .capname strong{font-weight:600}
  .capwhat{display:block; color:var(--ink3); font-size:12.5px; margin-top:3px}

  /* release tags */
  .rel{display:inline-block; font-family:"IBM Plex Mono",monospace; font-size:10px;
    font-weight:600; letter-spacing:.04em; padding:2px 7px; border-radius:2px; white-space:nowrap}
  .r0{background:var(--moss-soft); color:var(--moss)}
  .r1{background:var(--accent-soft); color:var(--accent)}
  .r2{background:var(--rule-soft); color:var(--ink2)}
  .rl{border:1px solid var(--rule); color:var(--ink3)}

  /* the register */
  .cap{margin-top:38px; border:1px solid var(--rule); background:var(--surface)}
  .caphead{display:flex; gap:18px; align-items:flex-start; padding:18px 22px;
    border-bottom:1px solid var(--rule); background:linear-gradient(var(--rule-soft),var(--rule-soft))}
  .capid{font-size:12px; font-weight:600; color:var(--accent); padding-top:3px; white-space:nowrap}
  .caphead h3{font-family:"Zilla Slab",Georgia,serif; font-size:19px; font-weight:600; margin:0}
  .caphead p{margin:5px 0 0; font-size:13.5px; color:var(--ink2); max-width:68ch}
  .capcount{margin-left:auto; font-size:11px; color:var(--ink3); white-space:nowrap; padding-top:5px}

  .fr{display:grid; grid-template-columns:78px 1fr 62px 132px; gap:16px;
    padding:12px 22px; border-bottom:1px solid var(--rule-soft); align-items:baseline}
  .fr:last-child{border-bottom:none}
  .fr.isnot{background:var(--oxide-soft); box-shadow:inset 3px 0 0 var(--oxide)}
  .frid{font-size:11.5px; font-weight:600; color:var(--ink3); white-space:nowrap}
  .fr.isnot .frid{color:var(--oxide)}
  .frtext{font-size:14px; line-height:1.55}
  .nottag{font-family:"IBM Plex Mono",monospace; font-size:9.5px; font-weight:600;
    letter-spacing:.1em; text-transform:uppercase; color:var(--oxide);
    border:1px solid var(--oxide); border-radius:2px; padding:1px 5px; margin-right:5px;
    white-space:nowrap; vertical-align:1px}
  .frev{font-size:11px; color:var(--ink3); white-space:nowrap}
  @media (max-width:760px){
    .fr{grid-template-columns:1fr; gap:6px}
    .frid{color:var(--accent)}
  }

  /* closing */
  .closing{display:grid; grid-template-columns:repeat(auto-fit,minmax(310px,1fr)); gap:1px;
    background:var(--rule); border:1px solid var(--rule); margin-top:22px}
  .closing > div{background:var(--surface); padding:22px}
  .closing h3{font-family:"Zilla Slab",Georgia,serif; font-size:17px; font-weight:600; margin:0}
  .closing p{margin:10px 0 0; font-size:13.5px; color:var(--ink2)}
  .closing code{font-family:"IBM Plex Mono",monospace; font-size:12.5px; color:var(--accent)}
  .foot{margin-top:44px; padding-top:20px; border-top:1px solid var(--rule);
    font-size:12.5px; color:var(--ink3)}
  a{color:var(--accent)} a:hover{text-decoration:none}
  :focus-visible{outline:2px solid var(--accent); outline-offset:2px}
</style>

<div class="wrap">

  <div class="masthead">
    <div class="eyebrow">Draft &middot; extracted from the design, not written beside it</div>
    <h1>Jemaat Capability Register</h1>
    <p class="standfirst">${CAPS.length} capabilities and ${all.length} functional requirements, read off the 70-artboard design. Every requirement names the screen that is its evidence, so it cannot drift from what was actually drawn &mdash; and the ${nots} <strong>must not</strong> rows are where this design differs from what a church system usually ships.</p>
  </div>

  <div class="point">
    <div>
      <div class="pnum">The point, 1 of 2</div>
      <h2>A register a church will maintain</h2>
      <p>Households as the container, six fields per person, an import that never rejects a row, and a merge for the mess two years produce. Fail here and nothing else in the product has data to stand on.</p>
    </div>
    <div>
      <div class="pnum">The point, 2 of 2</div>
      <h2>A care group week without paper</h2>
      <p>Invitation, answer, attendance, and the hosting rota claimed by the members themselves &mdash; plus something handed back to the leader, or she stops marking by week six and the rest collapses.</p>
    </div>
    <div>
      <div class="pnum">Everything else</div>
      <h2>Derived, or a guard</h2>
      <p>The public area, the weekly warta, serving, transfers, export, roles. Each exists because one of the two above needs it, or because leaving it out would make one of them unsafe.</p>
    </div>
  </div>

  <div class="tally">
    <div><b>${all.length}</b><span>requirements</span></div>
    <div><b>${CAPS.length}</b><span>capabilities</span></div>
    <div><b>${byRel(0)}</b><span>in R0, the pilot</span></div>
    <div><b>${byRel(1)}</b><span>in R1</span></div>
    <div><b>${byRel(2)}</b><span>in R2</span></div>
    <div><b>${byRel('L')}</b><span>parked</span></div>
    <div class="oxide"><b>${nots}</b><span>must-not rows</span></div>
  </div>

  <h2 class="section">The ${CAPS.length} capabilities</h2>
  <p class="sechint">A capability is a unit of work with a backend behind it, which is the honest unit &mdash; counting screens made one release look plausible when it was three. R0 is one pilot church with accounts made by hand; R1 opens the doors; R2 keeps the promises the first two made.</p>

  <div class="matrixwrap">
    <table>
      <thead>
        <tr>
          <th>Capability</th><th>What it is for</th>
          <th class="n">FR</th><th class="n">R0</th><th class="n">R1</th><th class="n">R2</th><th class="n">Later</th><th class="n">Must not</th>
        </tr>
      </thead>
      <tbody>${CAPS.map(capRow).join('')}</tbody>
    </table>
  </div>

  <h2 class="section">The register</h2>
  <p class="sechint">Codes in the evidence column are artboards in the design canvas. <strong>M</strong> is a signed-in screen, <strong>P</strong> public, <strong>O</strong> onboarding, <strong>W</strong> the church office, <strong>S</strong> a specification sheet.</p>

  ${CAPS.map(capBlock).join('')}

  <h2 class="section">Before this becomes an SRS</h2>
  <div class="closing">
    <div>
      <h3>Where it lands</h3>
      <p>Functional requirements belong in an SRS under <code>.what/</code>, with the numbered rows registered in <code>.control/registry/requirements.yaml</code>. Neither is written by hand: <code>wdi-product</code> produces the SRS at G2, and this draft is the input to it, not a substitute.</p>
    </div>
    <div>
      <h3>Seventeen decisions still unregistered</h3>
      <p>The seven data-model decisions and the ten design positions are stated on screens and in canvas notes, and no <code>DEC-</code> exists for any of them. A decision nobody registered is one that quietly disappears in week three of building.</p>
    </div>
    <div>
      <h3>What is deliberately absent</h3>
      <p>No attendance rate, engagement score or last-seen field. No dismissed-prompts table. No <code>person.church_id</code>. Each absence is a decision taken on a specific screen, and each would be easy to add back without noticing what it undoes.</p>
    </div>
    <div>
      <h3>Two questions still open</h3>
      <p>Whether the weekly warta is in scope &mdash; which decides whether the pilot tests a congregation or only its leaders &mdash; and whether the noticing prompt ships at all. Both are drawn, both are argued on their own sheets, and neither is mine to settle.</p>
    </div>
  </div>

  <p class="foot">Draft, for review. Extracted from 70 artboards over 41 design iterations; nothing here has been built. Requirements are numbered per capability and are not stable identifiers until an SRS registers them.</p>
</div>
`;

writeFileSync(new URL('./jemaat-capability-register.html', import.meta.url), html, 'utf8');
console.log(`wrote register — ${CAPS.length} CAP, ${all.length} FR, ${nots} must-not (R0 ${byRel(0)} · R1 ${byRel(1)} · R2 ${byRel(2)} · later ${byRel('L')})`);

import { writeFileSync } from 'node:fs';
import { onb } from './screens-onboarding.mjs';
import { pub } from './screens-public.mjs';
import { mem } from './screens-member.mjs';
import { web } from './screens-web.mjs';
import { iter } from './screens-iter.mjs';
import { imp } from './screens-import.mjs';
import { lead } from './screens-leader.mjs';
import { warta } from './screens-warta.mjs';
import { quiet } from './screens-quiet.mjs';
import { talk } from './screens-talk.mjs';
import { life } from './screens-lifecycle.mjs';
import { xfer } from './screens-transfer.mjs';
import { notice } from './screens-notice.mjs';
import { scale } from './screens-scale.mjs';
import { week } from './screens-weekly.mjs';
import { ret } from './screens-return.mjs';
import { hand } from './screens-handover.mjs';
import { data } from './screens-data.mjs';
import { rights } from './screens-rights.mjs';
import { broken } from './screens-broken.mjs';
import { r0 } from './screens-r0.mjs';
import { decide } from './screens-decide.mjs';
import { decide2 } from './screens-decide2.mjs';
import { empty } from './screens-empty.mjs';
import { model } from './screens-model.mjs';
import { sys } from './screens-system.mjs';
import { msg } from './screens-messages.mjs';
import { noapp } from './screens-noapp.mjs';
import { nooffice } from './screens-nooffice.mjs';
import { merge } from './screens-merge.mjs';
import { roles } from './screens-roles.mjs';
import { threat } from './screens-threat.mjs';
import { start } from './screens-start.mjs';
import { fid } from './screens-fidelity.mjs';
import { rel } from './screens-release.mjs';
import { rec } from './screens-record.mjs';
import { admin } from './screens-admin.mjs';

const files = { ...onb, ...pub, ...mem, ...web, ...iter, ...imp, ...lead, ...warta, ...quiet, ...talk, ...life, ...xfer, ...notice, ...scale, ...week, ...ret, ...hand, ...data, ...rights, ...broken, ...r0, ...decide, ...decide2, ...empty, ...model, ...sys, ...msg, ...noapp, ...nooffice, ...merge, ...roles, ...threat, ...start, ...fid, ...rel, ...rec, ...admin };

const P = 390, PH = 844, W = 1440, WH = 900;
const gapX = 80, gapY = 130;

/* page-1 Onboarding: choosing WHICH church, before any account exists. */
const page1 = [
  ['Welcome.dc.html', 'O1 First run'],
  ['ScanQR.dc.html', 'O2 Scan church QR'],
  ['EnterCode.dc.html', 'O3 Enter church code'],
  ['ConfirmChurch.dc.html', 'O4 Confirm the church'],
  ['MyChurches.dc.html', 'O5 My churches (add)'],
  ['LeaveChurch.dc.html', 'O6 Remove a church'],
];

/* page-2 Public: what anyone can reach inside the chosen church, plus sign-in. */
const page2 = [
  ['Main.dc.html', 'P1 Home (guest)'],
  ['Service.dc.html', 'P2 Next service'],
  ['Sermons.dc.html', 'P3 Sermon library'],
  ['SermonDetail.dc.html', 'P4 One sermon'],
  ['Join.dc.html', 'P5 Application form'],
  ['Pending.dc.html', 'P6 Application sent'],
  ['SignIn.dc.html', 'P7 Sign in'],
  ['Verify.dc.html', 'P8 Enter code'],
  ['LetsTalk.dc.html', 'P9 Let us talk first'],
  ['CodeFailed.dc.html', 'P10 That code did not work'],
  ['CodeNeverCame.dc.html', 'P11 The code never came'],
];

/* page-3 Signed in: the tier decides what these screens show, not whether they exist. */
const page3 = [
  ['MemberHome.dc.html', 'M1 Home (Community)'],
  ['DirectoryLimited.dc.html', 'M2 People (Community view)'],
  ['Directory.dc.html', 'M3 People (Registered view)'],
  ['Household.dc.html', 'M4 Household'],
  ['AddMember.dc.html', 'M5 New person (office)'],
  ['CareGroups.dc.html', 'M6 Care groups'],
  ['GroupDetail.dc.html', 'M7 Care group detail'],
  ['Meeting.dc.html', 'M8 Meeting and RSVP'],
  ['HostQueue.dc.html', 'M9 Hosting queue'],
  ['Serving.dc.html', 'M10 Serving'],
  ['Profile.dc.html', 'M11 Me'],
  ['AssignPick.dc.html', 'M12 Assign - pick from list'],
  ['AssignGuest.dc.html', 'M13 Assign - type a guest'],
  ['Attendance.dc.html', 'M14 Attendance by hand'],
  ['ShareService.dc.html', 'M15 Share to WhatsApp'],
  ['HomeLeader.dc.html', 'M19 Home on meeting night'],
  ['ThisWeek.dc.html', 'M20 This week (warta)'],
  ['Transfer.dc.html', 'M22 Move my membership'],
  ['Noticed.dc.html', 'M23 Have you seen Dedi'],
  ['Saved.dc.html', 'M26 After attendance'],
  ['MyData.dc.html', 'M27 What the church knows'],
  ['GroupsScale.dc.html', 'M25 Care groups at forty'],
  ['MyDetails.dc.html', 'M30 My details, stated once'],
  ['MyStanding.dc.html', 'M31 Where my details stand'],
  ['MyHousehold.dc.html', 'M32 My household, at one church'],
];

/* page-5 The one screen everything hangs on, put under stress. Same screen
   four times, not four screens - hence its own page. */
const page5 = [
  ['HomeID.dc.html', 'M16 Home - Indonesian'],
  ['HomeOffline.dc.html', 'M17 Home - no signal'],
  ['HomeLarge.dc.html', 'M18 Home - readable type'],
  ['HomeQuiet.dc.html', 'M21 Home - quiet week'],
  ['HomeScale.dc.html', 'M24 Home - 2,000 members'],
  ['HomeR0.dc.html', 'M28 Home - as R0 ships'],
  ['HomeR0Warta.dc.html', 'M29 Home - R0 with warta'],
];

/* page-4 Web: only what genuinely needs a big screen. */
const page4 = [
  ['WebApplicants.dc.html', 'W1 Applicants queue'],
  ['WebPeople.dc.html', 'W2 People table'],
  ['WebRoster.dc.html', 'W3 Serving roster'],
  ['WebChurchCode.dc.html', 'W4 Church code and QR'],
  ['WebImport.dc.html', 'W5 Import from Excel'],
  ['WebPerson.dc.html', 'W6 One person, and lifecycle'],
  ['WebTransfer.dc.html', 'W7 Incoming transfer'],
  ['WebWeek.dc.html', 'W8 This week (office)'],
  ['WebHandover.dc.html', 'W9 Hand over a care group'],
  ['WebData.dc.html', 'W10 Your data, and leaving'],
  ['WebEmpty.dc.html', 'W11 The first screen ever seen'],
  ['WebMerge.dc.html', 'W12 Two records, one person'],
  ['WebRoles.dc.html', 'W13 Who can do what'],
  ['WebArchive.dc.html', 'W14 Our record, and what he states'],
  ['WebAdopt.dc.html', 'W15 Adopt, field by field'],
  ['WebChanges.dc.html', 'W16 What people have stated'],
  ['WebHouseAdmin.dc.html', 'W17 A household, and who signs in'],
];

const grid = (list, page, w, h, perRow) =>
  list.map(([file, title], i) => ({
    file, title,
    x: (i % perRow) * (w + gapX),
    y: Math.floor(i / perRow) * (h + gapY),
    w, h, page,
  }));

/* page-6 The line. One artboard, because a release decision is one picture. */
const page6 = [['Release.dc.html', 'S1 What ships first']];

const artboards = [
  ...grid(page1, 'page-1', P, PH, 4),
  ...grid(page2, 'page-2', P, PH, 4),
  ...grid(page3, 'page-3', P, PH, 4),
  ...grid(page4, 'page-4', W, WH, 2),
  ...grid(page5, 'page-5', P, PH, 4),
  { file: 'Release.dc.html', title: 'S1 What ships first', x: 0, y: 0, w: 1440, h: 1280, page: 'page-6' },
  { file: 'Decision.dc.html', title: 'S2 The warta decision', x: 0, y: 1410, w: 1440, h: 940, page: 'page-6' },
  { file: 'Decision2.dc.html', title: 'S3 The noticing decision', x: 0, y: 2480, w: 1440, h: 980, page: 'page-6' },
  { file: 'Fidelity.dc.html', title: 'S4 Against the first message', x: 0, y: 3590, w: 1440, h: 1120, page: 'page-6' },
  { file: 'DataModel.dc.html', title: 'S5 The shape under the screens', x: 0, y: 4840, w: 1440, h: 1180, page: 'page-6' },
  { file: 'System.dc.html', title: 'S6 The system as a build spec', x: 0, y: 6150, w: 1440, h: 1180, page: 'page-6' },
  { file: 'Messages.dc.html', title: 'S7 Every message, and its pipe', x: 0, y: 7460, w: 1440, h: 1040, page: 'page-6' },
  { file: 'NoApp.dc.html', title: 'S8 The member who never installs', x: 0, y: 8630, w: 1440, h: 1060, page: 'page-6' },
  { file: 'NoOffice.dc.html', title: 'S9 The church with no office', x: 0, y: 9820, w: 1440, h: 1060, page: 'page-6' },
  { file: 'Threat.dc.html', title: 'S10 What this holds, and how it gets out', x: 0, y: 11010, w: 1440, h: 1020, page: 'page-6' },
  { file: 'Archive.dc.html', title: 'S11 The archive and the statement', x: 0, y: 12160, w: 1440, h: 1220, page: 'page-6' },
  { file: 'Start.dc.html', title: 'Jemaat, in one page', x: 0, y: 0, w: 1440, h: 1420, page: 'page-7' },

  /* page-8 The first build: one role, not one surface. */
  { file: 'AdminSignIn.dc.html', title: 'W19 Sign in, on a phone', x: 0, y: 0, w: 390, h: 844, page: 'page-8' },
  { file: 'AdminLinkStuck.dc.html', title: 'W20 The link inside messages', x: 470, y: 0, w: 390, h: 844, page: 'page-8' },
  { file: 'AdminHomePhone.dc.html', title: 'W21 The register on a phone', x: 940, y: 0, w: 390, h: 844, page: 'page-8' },
  { file: 'AdminPersonPhone.dc.html', title: 'W23 Add a person, on a phone', x: 1410, y: 0, w: 390, h: 844, page: 'page-8' },
  { file: 'AdminDeskSignIn.dc.html', title: 'W18 Sign in, office desktop', x: 0, y: 974, w: 1440, h: 900, page: 'page-8' },
  { file: 'AdminPersonNew.dc.html', title: 'W22 Add a person, desktop', x: 1520, y: 974, w: 1440, h: 900, page: 'page-8' },
  { file: 'AdminGroups.dc.html', title: 'W24 Care groups', x: 0, y: 1954, w: 1440, h: 900, page: 'page-8' },
  { file: 'AdminChurch.dc.html', title: 'W25 The church record', x: 1520, y: 1954, w: 1440, h: 900, page: 'page-8' },
  { file: 'AdminScope.dc.html', title: 'S12 The register, alone', x: 0, y: 2934, w: 1440, h: 1020, page: 'page-8' },
  { file: 'AdminRelease.dc.html', title: 'S13 What ships: the register', x: 0, y: 4074, w: 1440, h: 1150, page: 'page-8' },
];

const webNote = {
  id: 'n-admin', x: 1520, y: 2934, w: 540, page: 'page-8',
  text: 'ITERATION 44 - ONE ROLE, NOT ONE SURFACE\nIteration 43 heard "go live on the web first" and drew the whole product on the web: a group leader ticking attendance in a phone browser, a member opening the warta from a link. Wrong axis for the fourth time in this canvas. The first build is not one SURFACE - it is one ROLE. The mobile app is a separate build, so the congregation, the guest and the member have nowhere to go at all.\n\nWHAT THAT REMOVES IS LARGER THAN WHAT IT ADDS. The offline queue - the single most expensive item on the last sheet, and the condition I put on the whole decision - existed for a leader in a concrete hall with no signal. There is no leader. It is gone, and so are push, the app shell, and the forwardable-link leak I had just added to S10 as a sixth item.\n\nTHE STRUCTURAL REASON THE REGISTER CAN SHIP ALONE. Every other flow in this canvas is two-sided: an application needs an applicant, an RSVP needs a member, attendance needs a leader, a statement needs a person to state it, a warta needs a reader, a church code needs an app to scan it into. Pendataan is the ONLY one-sided thing in the product - the office types it and the office reads it - so it works with an audience of one. It is also what the brief named first, and what iteration 26 caught the staging having put last.\n\nNINE OFFICE SCREENS GO DORMANT, and none of them is cut. W1, W3, W4, W7, W8, W9, W14, W15, W16 all stay drawn and argued, waiting for the half of the flow that starts them.\n\nAND THE SIDEBAR IS THE SCOPE MADE VISIBLE. W2 carries Applicants, Serving, Sermons and Church code; W22 and W24 do not. They are absent rather than greyed, because a control that cannot do anything is worse than one that is not there - the same rule W25 applies to the four switches a church expects to find and cannot yet be given.',
};

const webShipNote = {
  id: 'n-adminship', x: 1520, y: 4074, w: 540, page: 'page-8',
  text: 'RE-DERIVED TWICE, AND THE SECOND TIME WAS THE REAL ONE\nS13 was rebuilt for one surface last iteration and rebuilt again here for one role. That is embarrassing in the way this canvas has been embarrassed before - it. 22 counted 32 that was 31, it. 41 found the release map two screens behind its own conclusion - and it is the same root cause every time: A PLAN DRAWN FROM A REMEMBERED CONCLUSION IS DRAWN FROM A STALE MAP. Sixteen routes, six capabilities, and every number on the sheet can be checked against the column beside it.\n\nFOUR HOLES CLOSE AT ONCE, all of them old. The office could not sign in, named at it. 16 and open for twenty-six iterations. Time zones were named on W12 and applied nowhere, so every screen said 19.30 and none said which - W25 holds it now. Creating a person was mobile-only, which left W2 Add button pointing at an app screen. And care groups could only ever arrive through the Excel import, so a church starting one in month two had nowhere to do it.\n\nThe reason all four surface together is worth naming: they are the holes that only bite when the OFFICE is the whole product. Nobody noticed them while a leader and a member were carrying half the flows.\n\nWHAT THE APP INHERITS. Every M, O and P artboard stays valid against the same API. The app is not a second product - it is the other three roles arriving at a register that already holds real data. That is the easier order to build in and the harder one to sell, because the congregation sees nothing until the second release.\n\nTHE RISK, STATED ONCE AND NOT ARGUED. It. 17 said a product that gives nothing back gets abandoned. Turn that on the office: a register with no weekly rhythm goes stale. Import, search and export pay it back occasionally, not weekly. If the pilot needs a weekly reason, W8 is the cheapest parked item - the office can compose the week with no member surface at all.',
};

const topNavNote = {
  id: 'n-adminrow', x: 1880, y: 0, w: 460, page: 'page-8',
  text: 'FOUR PHONE SCREENS IN AN OFFICE RELEASE\nThey are here because of S9, not because of a member. Most small Indonesian churches have no paid staff and no desk: the office is a volunteer who comes on Saturday, or the pastor spouse, holding a phone.\n\nThe split follows the rule S9 set - not who you are, but how big the job is. Adding one person and correcting one number follow a volunteer around a building; the table, the import, the merge and the roster stay on a desktop and are better there.\n\nW20 is the only dead end this release has, and every administrator meets it on the day they are added. The sign-in link arrives by WhatsApp, so it opens inside WhatsApp browser, where there is nothing to save it to. The register works there; keeping it needs two taps and a real browser.\n\nW21 is drawn saved to the home screen, with no address bar, so the trio reads as one story: sign in, get stuck, get out. And it carries the one honest line about this release - nothing here will ever notify you, because there is nobody on the other side to send anything.',
};

const walkNote = {
  id: 'n-walk', x: 1520, y: 0, w: 520, page: 'page-6',
  text: 'ITERATION 16 - READING A LIST IS NOT WALKING A PATH\nThe 26 were chosen by reading them as a list. Walking them as one story - church signs up, imports its people, prints the code, a stranger arrives, applies, is confirmed, and a care group finishes its first meeting - turned up three holes that a list cannot show.\n\nTHE BIG ONE. P1, P2 and P3 all display a service time, a speaker, a poster and a sermon recording, and NOTHING in the release ever writes any of it. Three of twenty-six screens rendering data no screen creates.\n\nThe obvious fix is four modules: services, speakers, sermons, announcements. The right fix is that a church does not think in modules, it thinks in weeks. W8 is one screen shaped like the ritual it replaces - one secretary, one Thursday, one form - and it feeds all four surfaces at once. Ship count 26 becomes 27.\n\nTWO SMALLER HOLES, both left open on purpose and both cheap. The office cannot sign in to the web at all; the answer is to reuse the phone and code from P7 and P8, not to invent a password. And care groups only ever arrive through the Excel import, so a church that starts a new group in month two has nowhere to do it.',
};

const retNote = {
  id: 'n-return', x: 3440, y: 3896, w: 500, page: 'page-3',
  text: 'ITERATION 17 - WEEK SIX IS WHERE THIS DIES\nEverything checked until now was day one. Walking weeks two to six found the same fault under all three people in the product: IT TAKES DATA FROM THEM AND HANDS NONE OF THEM ANYTHING BACK.\n\nThe leader feels it first and quits first. He ticks fourteen boxes every Wednesday and the app says saved. By week six he stops - and when attendance stops, the RSVP numbers, the noticing in M23 and every count in the product go with it. He is the load-bearing volunteer and nobody was paying him.\n\nM26 is the payment, and what it deliberately is NOT matters as much as what it is. No streak, no percentage, no comparison with other groups - in a church those are poison, for the same reason M23 refuses a count. What it hands back is the three things a leader actually wanted from ticking: who said yes and did not come, who is new, and whether the group is growing. Nine to fourteen since January is worth six weeks of boxes.\n\nW8 got the same treatment in one card. Ten minutes on a Thursday with no sign it landed is a habit that dies - so it now says 312 opened it, 8 of 12 groups reported, 2 applicants waiting on you. Not a score. Just whether Thursday was worth it.',
};
const handNote = {
  id: 'n-hand', x: 1520, y: 2090, w: 520, page: 'page-4',
  text: 'ITERATION 18 - AN OLD PROMISE CONSTRAINS A NEW SCREEN\nEvery church rotates its leaders, and not one screen knew how. M7 said led by Budi H. and nothing could ever change it.\n\nThe permission flip was the easy half. The interesting half is that a promise made seven iterations ago decides what this screen may do. M23 told Budi only you see this, nothing is recorded about the prompts he dismissed. So those CANNOT travel to Melisa - she will be asked about Dedi again from scratch. Slightly wasteful, and the only answer that does not turn the earlier promise into a lie.\n\nThat is what a coherent design costs, and it is worth paying: a rule stated once has to still hold when it becomes inconvenient.\n\nThe co-leader option is here because it is what churches actually do. Nobody hands over a group on a Tuesday - you walk beside the next person for a month. And the last line matters most: Budi stays in the group as an ordinary member. Only the role moves.',
};

const dataNote = {
  id: 'n-data', x: 0, y: 3120, w: 540, page: 'page-4',
  text: 'ITERATION 19 - A PRODUCT THAT HOLDS DATA HOSTAGE IS ONE NOBODY ENTERS\nFifty-one screens and not one knew how a church LEAVES. That is the question the committee asks in the first meeting, and in Indonesia they usually ask it because they have been burned - a vendor folded, or the volunteer who built the Access database moved away.\n\nThree positions this screen takes.\n\nEXPORT IS ALWAYS ON, not a leaving ritual. A button you can press on an ordinary Tuesday proves the promise before anyone needs it. A thirty-day grace period on the way out proves nothing.\n\nIT COMES BACK AS EXCEL, because that is what it arrived as in W5 and what a church secretary can actually open. The JSON is for whoever they hire next, and nothing is held back from it.\n\nDELETING IS SLOWER THAN LEAVING. Thirty days before anything goes, because a committee decision can be reversed and a church that deletes in anger has burned its own membership roll.\n\nThis is also the one item on the ship list that fails the test used on every other screen. Nobody is BLOCKED without it. It ships anyway, because a church that will not adopt without the answer is blocked from starting - and because the MIT licence makes run-it-yourself the honest end of the sentence, not a concession.',
};

const rightsNote = {
  id: 'n-rights', x: 3960, y: 3896, w: 520, page: 'page-3',
  text: 'ITERATION 20 - PRIVACY FROM THE CHURCH, NOT JUST FROM EACH OTHER\nEvery privacy decision so far protected a member FROM OTHER MEMBERS: the scoped directory, the guardrails on M23, who gets a WhatsApp button. Not one protected them from the church, which is the party holding all of it.\n\nTHE TEST THIS SCREEN APPLIES TO THE WHOLE PRODUCT: if showing someone their own record feels creepy, collecting it was creepy. Anything that cannot be shown on M27 should not be stored anywhere.\n\nThe uncomfortable line is attendance. This product records who came to which meeting, for four years, and no member has ever been told. Most would assume it is not happening. It sits on M27 under the heading it deserves - also recorded, and rarely mentioned - with the count in plain sight.\n\nThe missing control was smaller and more obvious in hindsight. M2 scoped the directory to a care group, which was the church deciding on the member behalf. Nobody was ever asked whether they wanted their number in it at all. Three options now, and the middle one names the cost out loud: all 254, including people you have never met.\n\nAND ONE REFUSAL. There is no delete button, and drawing one would be a lie. A membership roll is the church own record - who was baptised, who was married - and it survives someone leaving. So the reason is written out instead, with the two things that DO work: ask the office to mark you moved, and remove the church from your app.\n\nOn the release map the screen is Later, but the phone visibility control inside it ships now. It is one row in the M11 settings list, and it is the one piece a directory should never have shipped without.',
};

const brokenNote = {
  id: 'n-broken', x: 0, y: 1948, w: 540, page: 'page-2',
  text: 'ITERATION 21 - FIFTY-THREE HAPPY PATHS\nEvery screen so far showed the moment everything worked. The two failures that cost most are both at the front door, and both strand someone BEFORE they are anybody in the system - so there is no account to recover, nobody to notice, and no record that they ever tried.\n\nTWO RULES, HELD IN BOTH SCREENS.\n\nNever blame the person. Invalid code says you typed it wrong; the app has no idea whose fault it is. P10 says no church has that code, then offers three routes - and one of them pays off a decision made long before: the alphabet has no zeros or ones, so it can point at the 0 the person actually typed.\n\nEvery dead end gets a human. Not a support address - a named person at that church with a WhatsApp button, because that is who actually solves it. P11 ends with the sentence that keeps the door safe: Lidya cannot read your code and cannot send you one. She can only correct the number on file.\n\nP11 matters more than it looks. It strands someone the church ALREADY KNOWS, usually because the number on file is three years old - which is the single most common state of any Indonesian church membership list.\n\nW5 got the missing half of its promise. Nothing is rejected was only ever safe next to: if anything fails part way, NONE OF IT LANDS. Half a congregation imported is worse than none.',
};

const countNote = {
  id: 'n-count', x: 1520, y: 700, w: 540, page: 'page-6',
  text: 'ITERATION 22 - I COUNTED WRONG, AND I COUNTED THE WRONG THING\nThe header said 32. It was 31. An arithmetic error in my own release map, which is worth naming rather than quietly fixing - a number nobody checks is a number that gets planned against.\n\nThe second error was larger. A SCREEN IS THE WRONG UNIT OF WORK. Thirty-one screens hide eleven backend capabilities: multi-tenancy, WhatsApp OTP with a vendor and an approval queue behind it, Excel import with column mapping and household inference, applications, meetings and RSVP, attendance, hosting, weekly content, export, roles. Counting screens made one release look plausible. Counting capabilities does not.\n\nW5 alone is roughly two weeks. It was sitting in a list next to Sign in as though they were the same size.\n\nSo the ship column is now staged, not flat.\n\nR0 - ONE PILOT CHURCH, 12 screens, 6 capabilities. Accounts made by hand, no public area, no import UI - WDI loads the data directly. The care group week works end to end, which is the part that was actually asked for in the first place.\n\nR1 - OPEN THE DOORS, 13 screens, 4 capabilities. Any church can now be found, join itself and load its own people. This is where it stops being a favour done for one congregation and becomes a product.\n\nR2 - KEEP IT HONEST, 6 screens. The promises the first two releases made. Every one was called essential earlier, and every one can wait a few weeks without stranding anybody.\n\nThree pairs must not be separated, and they are marked: the church code ships WITH P10, sign-in WITH P11, and the directory WITH the phone-visibility control. Shipping the first half of any of those pairs is how a product acquires a defect it then lives with.',
};

const r0Note = {
  id: 'n-r0', x: 1880, y: 2922, w: 500, page: 'page-5',
  text: 'ITERATION 23 - STAGING IS AN AUDIT, NOT A SLICE\nR0 was chosen by picking twelve screens off a list. Walking those twelve as a pilot church found six buttons pointing at screens R0 does not contain - the directory behind M1 search, the warta behind the announcements strip, the serving screen behind the duty card, the household behind Me, add-person and import on W2, the speaker picker on W8.\n\nA pilot church would hit four of them in its first ten minutes. That is not a bug in R0; it is what happens whenever a design drawn as a whole is released in parts, and it will happen again at R1.\n\nM28 is M1 with all of it removed, and the THINNESS IS THE FINDING. Greeting, service, one RSVP, one hosting nudge. For a member who neither leads nor hosts, R0 offers one button once a week for three months.\n\nIteration 17 already said an app that gives nothing back gets uninstalled - and a member who uninstalls during the pilot does not come back for R1. So the staging decision and the warta decision turn out to be the same decision:\n\nEITHER R0 TAKES M20, OR R0 IS A PILOT THAT ONLY TESTS WHETHER LEADERS KEEP USING IT. The second is a fair question and a cheaper release. It is just not the question anyone thinks they are asking.',
};

const decideNote = {
  id: 'n-decide', x: 1520, y: 1410, w: 540, page: 'page-6',
  text: 'ITERATION 24 - MAKE THE DECISION VISIBLE INSTEAD OF ARGUING IT\nR2 puts both versions of an ordinary member week side by side. Not a leader, not a host, not the office - the person the pilot is actually about.\n\nWithout the warta: one opening a week, two seconds, and on Saturday the app played no part at all.\n\nWith it: four openings, and one of them reaches ANOTHER MEMBER - the birthday greeting is the only thing in this entire product where a member touches a member rather than the institution touching a member.\n\nAND THE FINDING THAT SETTLES IT. W8 is already in R0, and W8 already collects the announcements, the speaker and the sermon link. The office is doing that typing either way. So this was never a question about building a feature - it is a question about whether to SHOW DATA THE PRODUCT IS ALREADY GATHERING. The cost is one mobile screen and one row on Home.\n\nRecommendation: take it. The one honest reason to refuse is if the pilot exists to test whether leaders sustain attendance-taking - in which case the left column is the correct instrument, and it should be chosen deliberately rather than arrived at by omission.',
};

const decide2Note = {
  id: 'n-decide2', x: 1520, y: 2480, w: 540, page: 'page-6',
  text: 'ITERATION 25 - A DECISION THAT CANNOT BE MADE BY LOOKING\nThe warta question was about cost, so a member week settled it. This one cannot be settled that way: the same screen is pastoral care in one church and surveillance in another, and the difference is not in the pixels.\n\nSo S3 separates what the DESIGN enforces from what only a congregation can hold. The first list is real and it is more than most church software offers - one recipient, no list view anywhere, no count in the screen OR the data model, and a dismissal that costs nothing and does not survive a handover.\n\nThe second list is the honest part. The product cannot stop a pastor asking leaders to forward the names. It cannot decide whether attendance is being taken to care or to control. It cannot make a leader treat a nudge as a nudge. And it never tells the member it happened - M27 shows them their attendance, but not that someone was prompted about them.\n\nWriting those four down produced a third option neither earlier argument had: SHIP THE CAPABILITY, NEVER THE ASSUMPTION. Default off. The office turns it on, and the four unenforceable conditions appear at that moment rather than in a policy nobody opens. Turning it on then carries a name and a date, like every other consequential act in this product - W6, W9, W10.\n\nA church that has never thought about this is never handed it. That is the recommendation.',
};

const fidNote = {
  id: 'n-fid', x: 1520, y: 3590, w: 540, page: 'page-6',
  text: 'ITERATION 26 - THE CHECK NOBODY RUNS\nTwenty-five iterations, each one finding something real and each addition defensible on its own. Read as a sequence they can still walk a design away from what was asked for, and the check nobody performs is the one against the original words.\n\nMost of it held. Households with four roles, six fields and no more, RSVP in two taps, hosting claimed by the person themselves, thirty-nine mobile artboards against ten for the office. The brief asked for mobile-first membership and care groups and that is what is there.\n\nONE REAL INVERSION. Pendataan anggota opened the brief - it was the first thing named. In the staging it ends up viewable in R0, importable in R1, EDITABLE IN R2. That happened because R0 assumed WDI would load the pilot data by hand, which made entry look unnecessary. Defensible for one pilot church; indefensible as a reading of what was asked for. If the goal is to replace a messy membership spreadsheet, R0 as staged does not do it at all.\n\nThe correction is cheap: pull M4 and M5 into R0. Two screens, one capability the backend needs anyway, and R0 becomes something a church puts its own people into rather than something done to a church. W5 stays in R1 - it is two weeks alone, and typing 248 people is a bad pilot.\n\nThe additions split cleanly. DERIVED means something asked for could not work without it - W8, M26, the failure screens, lifecycle. FOUND means an iteration went looking and came back with it - warta, noticing, transfer, handover, export, my data. Every FOUND item is in Later or still undecided. None of them displaced anything that was asked for.',
};

const fixNote = {
  id: 'n-fix', x: 2100, y: 0, w: 520, page: 'page-6',
  text: 'ITERATION 27 - THE CORRECTION APPLIED, AND WHAT IT COST\nM4 and M5 move from R2 into R0, so a pilot church enters and corrects its own register from day one instead of having its data loaded for it. That was the inversion iteration 26 found: pendataan anggota opened the brief and had been staged last.\n\nIT IS NOT FREE. R0 goes from six capabilities to seven, because people and households stop being read-only. Two more screens, write endpoints, and validation. Roughly fifteen to twenty per cent more work on a release that was already the biggest of the three.\n\nSO SOMETHING HAD TO LEAVE, and looking for it found a cut worth making on its own merits. M6, the list of all care groups, moves to R1. In a pilot every member belongs to exactly one group and Home already shows it - browsing the others is a NEW-PERSON need, and new people arrive in R1 with the public area and the applications. Net R0: thirteen screens.\n\nTwo dead ends closed for free. M5 in R0 means W2 Add person now leads somewhere, and M14 first-timers can be added properly instead of needing a special inline field.\n\nOne stays open on purpose: the search icon on M1 still points at a directory that lives in R2. Cutting it from R0 is correct - a pilot church of one group does not browse 248 people - but it must be CUT, not left pointing at nothing.',
};

const emptyNote = {
  id: 'n-empty', x: 2680, y: 0, w: 520, page: 'page-6',
  text: 'ITERATION 28 - THE COMPENSATING CUT WAS WRONG\nIteration 27 moved M6 to R1 to pay for M4 and M5. Walking the result as a story rather than reading it as a list found the mistake in one step: M6 is where the + that CREATES a care group lives. Without it R0 had RSVP, attendance and a hosting rota, and no way to make a group for any of them to belong to.\n\nThat is the same lesson as iteration 23, arriving a second time because I listed instead of walked. A staging change is not an edit to a list - it is a change to a graph.\n\nTHE OTHER FINDING WAS NEVER DRAWN AT ALL. W2 only ever existed showing 1 to 10 of 248. In R0 there is no import, so the first thing a church actually meets is a table with nothing in it - and that screen decides whether the secretary comes back tomorrow. W11 is it, and it is onboarding rather than a placeholder: one concept before typing anything (a household holds the address, a person holds their standing), then an order to work in.\n\nThe order matters more than the total. Your own household, then the leaders, then ONE group - and after step three the app genuinely runs, with eleven people still untyped. A group that works beats a list that is finished, because nobody finishes a list that is not yet useful.\n\nHONEST ARITHMETIC. R0 has gone 12, 13, 15 as each walk found something. That is the real price of correcting the brief inversion, and it is still worth paying. If 15 is too many, the next thing to cut is W8 - the app is then empty of church content in R0 but the care group week still works end to end.',
};

const modelNote = {
  id: 'n-model', x: 1520, y: 4840, w: 540, page: 'page-6',
  text: 'ITERATION 29 - THE BRIDGE, NOT A SIXTY-SECOND SCREEN\nThe loop asked for another iteration. Another artboard was not the useful answer: the owner has just asked how to START BUILDING, and the seven expensive decisions existed only as prose scattered across sticky notes.\n\nA schema gets written in week one. Those seven either survive that week or they cost a migration each, so they had to be handed over in the only form that survives - structure.\n\nS5 is not a schema. No types, no indexes, no audit columns, nothing a developer would not choose better themselves. It is the seven decisions expressed as tables and the absence of tables.\n\nTHE ABSENCES CARRY AS MUCH AS THE TABLES. No attendance_rate, no engagement_score, no last_seen - M23 refuses a count, and a column that exists will eventually be shown to someone. No dismissed_prompts table - M23 promised nothing is recorded, and W9 pays that promise when a leader hands over. No person.church_id - that one field would quietly undo decisions 2 and 7 together.\n\nAnd decision 7 is the one to argue about on day one, because it is the only one that cannot be retrofitted. With a single pilot church, a global person table looks like over-engineering. Every other table can gain a column later; making person global AFTER it was per-church means rewriting every row and every join in the product.',
};

const sysNote = {
  id: 'n-sys', x: 1520, y: 6150, w: 540, page: 'page-6',
  text: 'ITERATION 30 - THE SECOND BRIDGE\nThe tokens have lived in lib.mjs since iteration 13, which is useless to the person writing Flutter. S6 is the same values in the form a build consumes: what each colour is FOR, the ramp with roles rather than sizes, the component anatomy, and the one rule no phone screen may break.\n\nThree things in it are decisions rather than documentation.\n\nTHERE IS NO RED IN THIS PRODUCT. Errors get amber. A church app carries bad news - a death, a declined application, a member who stopped coming - and none of that should look like a system failure. Destructive actions use accentDark, which is the palette darkened, not a new hue.\n\nNO SHADOWS IN 62 ARTBOARDS. Depth is a 1px line plus a cream-to-white step, which survives a cheap Android screen in daylight better than a shadow, and needs no tuning to look the same on both platforms.\n\nFALLBACK FONTS MATTER MORE THAN THE WEBFONTS. On a weak connection the fallback is what most of the congregation actually reads, so Georgia and system-ui were chosen for metrics close enough that the layout does not shift when the real faces arrive.\n\nAND ONE GAP NAMED RATHER THAN HIDDEN. Spacing was never systematised the way colour and type were. The scale in S6 is derived from what the screens use, not from a decision made up front, and it needs enforcing in code - iteration 13 already measured what an unenforced scale costs: 32 font sizes before anyone counted.',
};

const vocabNote = {
  id: 'n-vocab', x: 2360, y: -238, w: 460, page: 'page-2',
  text: 'ITERATION 31 - INSTITUTIONAL WORDS AT THE DOOR\nA vocabulary pass found a fault whose symptom I had already patched without touching the cause. P5 grew a third option - I am not sure yet - at iteration 3, because someone who has attended twice cannot choose between Community Member and Registered Member. That was the right patch and the wrong fix.\n\nTHE CAUSE: tier names are the office vocabulary, and they were being shown to people who are not in the office. Nobody outside a church knows what Registered means, and a form that asks an unanswerable question gets closed rather than answered.\n\nSo P5 now names the SITUATION and not the label. I keep my membership where it is. I want to move my membership here. I am not sure yet. The office words are introduced underneath rather than assumed - the office calls the first one a Community Member and the second a Registered Member, you do not have to.\n\nP1 lost the same jargon from the first sentence a stranger reads, and M11 now explains the pill a new member has just been given instead of leaving them to infer it.\n\nTHE RULE WORTH KEEPING: institutional vocabulary never appears before someone is inside the institution. Inside it is useful - W1, W2 and M27 all need the precise word, because precision is what an office runs on. At the door it is a locked gate with the key written on the inside.',
};

const msgNote = {
  id: 'n-msg', x: 1520, y: 7460, w: 540, page: 'page-6',
  text: 'ITERATION 32 - THE CHANNEL NOBODY CHECKED\nEvery nudge button in these 63 screens sends WhatsApp, because that is what gets read in Indonesia. Everything AUTOMATIC quietly assumed a push notification. The product already knew the answer and the design never said it.\n\nIt is load-bearing. If invitations arrive by push, RSVP numbers stay low, M23 is never opened, M26 is never seen, and the four-openings-a-week the warta was justified on collapses. The entire retention argument from iteration 17 rests on a channel that was never examined.\n\nTHE RULE: if a person has to DO something it goes to WhatsApp. If it is only nice to know, push is enough and free. Nothing pastoral is automated down any pipe - M8 keeps its nudge a button and M23 stays in-app, because a leader chasing you is care and a robot chasing you is not.\n\nAND IT SURFACED THE FIRST RECURRING COST IN THE WHOLE DESIGN. WhatsApp Business bills per conversation; two act-now messages a week across 248 people is roughly 2,000 conversations a month. A real line item for a church that was told this software is free and open source. Both statements are true, and no screen in 63 has ever said so.\n\nTwo consequences upstream. A WhatsApp sender is a vendor, an approval queue and a monthly bill, so it joins auth as the SECOND external dependency in R0 - same reason, discovering it at month two is a schedule failure. And it has to be a church setting rather than a product decision: a church that cannot pay sends push only and loses RSVP accuracy, which is its trade to make and not ours.',
};

const noappNote = {
  id: 'n-noapp', x: 1520, y: 8630, w: 540, page: 'page-6',
  text: 'ITERATION 33 - THE DEFECT THAT WAS A DOOR\nM14 has rows reading not in the app, mark by hand. For fourteen iterations I read that as a gap to paper over. Iteration 32 moved the act-now messages to WhatsApp, and WhatsApp has interactive reply buttons - so the gap was never a gap.\n\nAn ordinary member can RSVP, confirm a serving duty, claim a hosting date, read the week, get the sermon link and greet someone on their birthday WITHOUT INSTALLING ANYTHING. That is nearly everything R0 offers them.\n\nWHICH INVERTS WHO THE APP IS FOR. The office needs the web. The leader needs the app. The congregation needs nothing. In a country where WhatsApp reaches nine in ten and an app install reaches far fewer, that is the largest adoption lever in this design - and it was hiding behind a row I had been treating as a defect.\n\nIt CHEAPENS R0 rather than growing it: fewer people to onboard, no install to explain, and the mark-by-hand rows shrink to the genuinely phone-less.\n\nThree checks before anyone builds it, none of them design questions. Business-initiated messages need pre-approved templates and reply-button templates have rules. The 24-hour window means the Sunday invitation opening a free service window is what makes the rest of the week cheap. And a church broadcasting to 248 numbers needs consent - P5 is where that belongs, and it is not there yet.\n\nThe thread on the left is drawn in this product palette on purpose. It is not a rendering of WhatsApp and must not become one.',
};

const noofficeNote = {
  id: 'n-nooffice', x: 1520, y: 9820, w: 540, page: 'page-6',
  text: 'ITERATION 34 - THE SPLIT WAS ALONG THE WRONG AXIS\nTen web screens all assume Lidya: a desk, a computer, time on Thursday. The stated target is small-to-medium congregations, and most small Indonesian churches have no paid staff at all - the office is a volunteer who comes on Saturday, or the pastor spouse, on a phone.\n\nTHE AXIS WAS WRONG. Not who you are - member on a phone, office on a desktop - but HOW BIG THE JOB IS. Importing 261 rows and reading a four-week roster grid genuinely need the width. Publishing one week and confirming one applicant do not, and those are the two things an office does most often.\n\nSo S9 draws both on a phone. Neither is new thinking: they are compressions of W8 and W1, which means two more screens in R0 and no new capability behind them.\n\nONE THING GENUINELY DROPPED. The poster stays desktop-only, because choosing and cropping an image on a phone is worse than not having one. A phone-only church publishes without a poster and the app draws the title instead - a worse poster and a shipped week, which is the right trade.\n\nAnd three things stay desktop without apology. Column mapping on a phone is not a design problem, it is a bad idea - and a church of sixty does not need import at all, because typing sixty people on M5 is one evening. The roster grid needs four weeks by four teams. Bulk edits want a table. Each of those already has a one-at-a-time equivalent on the phone.',
};

const mergeNote = {
  id: 'n-merge', x: 3040, y: 1030, w: 520, page: 'page-4',
  text: 'ITERATION 35 - THE ASSUMPTION THAT THE DATA IS CLEAN\nSixty-six artboards and no way to merge anything. W5 flags four names that already exist here and then does nothing about them. Every church register accumulates duplicates, and a register people believe is a mess is a register they stop maintaining - which loses the whole product, not one screen.\n\nWORSE, THIS DESIGN MANUFACTURES THEM. M5 household field reads pick an existing household, or create a new one. A picker that makes creating as easy as finding will be used to create. The second Halim household on S10 was produced by a screen I wrote, and I only saw it by asking what the data looks like after two years instead of on day one.\n\nThe fix is upstream and cheap: match while typing, and put DID YOU MEAN THE HALIM HOUSEHOLD, 4 PEOPLE, SUNTER above the create option rather than beside it.\n\nTwo rules the merge screen encodes. Never lose a value to an empty one even if the empty side is newer. And histories ADD - 184 meetings plus 3 is 187, eleven hosted evenings all kept - because M26 pays the leader out of exactly that number and a merge that loses it breaks the payoff.\n\nReversible for thirty days, like the import, because the one thing worse than a duplicate is a merge of two people who were never the same person - and that mistake is usually spotted by the family, weeks later.\n\nSECOND FINDING, SMALLER AND ALSO CERTAIN. Every time in this product is naked. Sixty-six artboards say 19.30 and none say which 19.30. Indonesia has three zones and a national tenant will have churches in all of them, plus a reminder job firing from a server somewhere else again. Store instants with the church zone, render local, never do date arithmetic in the client.',
};

const rolesNote = {
  id: 'n-roles', x: 3040, y: 2090, w: 520, page: 'page-4',
  text: 'ITERATION 36 - THE AXIS THAT NEVER GOT A SCREEN\nIteration 5 named three axes: standing, serving, app access. Sixty-seven artboards later the first two had screens and the third had none. It was assumed in every sentence - only the office can, the leader sees, granted separately - and nothing anywhere granted or revoked it.\n\nTwo things a generic permissions table gets wrong and W13 does not.\n\nA ROLE MUST SAY WHAT IT DOES in the words of this church own work. Can edit people is useless. Adds and corrects the register, confirms applicants, publishes the week is a job someone recognises and can therefore refuse to hand out.\n\nONE ADMINISTRATOR IS A SINGLE POINT OF FAILURE. A church whose only admin dies or leaves in anger is locked out of its own register - and this product has a deceased lifecycle, so that is not hypothetical. Two is the minimum and the screen should refuse one.\n\nThe list itself then surfaced two things no permissions table would have. MARULI HAS LED A GROUP FOR EIGHTEEN MONTHS AND NEVER SIGNED IN, so that group has no attendance and no RSVP and nobody noticed, because access was granted rather than used. And GRACE LEADS A GROUP WHILE STILL A GUEST, which is correct - leading is serving, not standing - so the screen shows the standing precisely so that nobody tries to fix it.\n\nRevocation is immediate and removes only access: membership, household and history stay untouched, because being removed from a role is not being removed from a church. One order matters - take a leader through W9 first, or you leave a group of fourteen with a hosting rota and nobody who can mark attendance.\n\nAlso closed this tick: the M5 fix stated last iteration is now applied. The household field matches while typing and offers the existing Prasetyo household ABOVE the option to create a second one.',
};

const threatNote = {
  id: 'n-threat', x: 1520, y: 11010, w: 540, page: 'page-6',
  text: 'ITERATION 37 - THIRTY-SIX ITERATIONS OF PRIVACY, NONE ABOUT THE LIST LEAVING\nEvery privacy decision so far was about members seeing each other, or the church seeing members. None was about the register leaving the building. In parts of Indonesia a list of 248 Christians with addresses and the time and place they gather weekly is not a privacy question, and a product sold to Indonesian churches has to have said so once, plainly and without drama.\n\nMost mitigations turn out to be small. Export is already admin-only and logged; what is missing is leaving addresses out of the DEFAULT export, so the common case - somebody wanting a phone list - does not also carry a map.\n\nThe most likely leak of the five is the dullest: a lost phone with the directory cached on it. Nothing in 68 screens addressed it. Fetch the directory, never cache it to disk, and ask for the sign-in code again after a couple of weeks idle.\n\nONE OF THE FIVE IS MINE. I added find my church by name at iteration 2, unprompted, to help someone whose bulletin had gone stale. It also makes the set of churches enumerable with locations and service times. Keep it, but require an exact name plus a city - never a browsable list - and let a church opt out of being listed at all.\n\nIteration 32 created another one. Routing act-now messages through a WhatsApp vendor hands a third party every member number and, by inference, who is in which care group. That belongs in the setup conversation, and it is a real reason a church might choose push-only and accept worse RSVP numbers.\n\nAND THE ONE THING NOT TO BUILD: a public directory of churches using Jemaat. It is the obvious growth feature, it would help exactly one person, and it would publish a national index of congregations with their addresses and meeting times. The church code exists so that finding a church is something a church hands out, not something a platform publishes.\n\nThe single-location question that led here has a cheap answer: each pos gets its own church code. Operationally a pos with its own service time and leaders IS a separate congregation, and the tenant model already carries it. The mother church loses the single overview, someone attending both needs two codes, and a pos in a difficult area gets to decide its own findability rather than inherit it.',
};

const closeNote = {
  id: 'n-close', x: 2100, y: 11010, w: 500, page: 'page-6',
  text: 'ITERATION 38 - CLOSING ITEMS INSTEAD OF OPENING THEM\nS10 left three mitigations marked NOT DESIGNED and named a fourth I had described but never applied. All four are now in the screens, and no new sheet was added.\n\nO1 and P10 - find-by-name is gated. It now reads look it up by name and city, with the line that matters underneath: there is no list of churches to browse, on purpose. That closes the leak I opened at iteration 2 without removing the help it was added to give.\n\nW10 - addresses are left out of the export unless asked for. The common case is somebody wanting a phone list, and it should not also hand over a map of where 254 people live.\n\nM11 - a security row: THIS PHONE, asks again in 12 days. Small, and it addresses the likeliest leak of the five, which is also the dullest: a lost phone with the directory on it.\n\nW4 - the two disclosures a church has to make deliberately rather than inherit. Listed by name, yes or no. Messages by WhatsApp, yes or no - and if no, everything still works by push with fewer people answering. Both are framed as the church CHOOSING, because both have a cost that is not ours to absorb on their behalf.\n\nTwo of the five leaks in S10 were introduced by earlier iterations of mine - find-by-name at 2, the messaging vendor at 32. Both are now stated on the screen where a church would meet them, which is the only place a disclosure does any work.',
};

const claimNote = {
  id: 'n-claim', x: 1520, y: 0, w: 540, page: 'page-7',
  text: 'ITERATION 40 - TESTING THE CLAIMS\nWriting ten positions down on the Start page turned them into claims, so this pass checked all seventy artboards against them. Three failed and one is a deliberate exception.\n\nP2 LEAKED OFFICE VOCABULARY TO A STRANGER. The service page told a visitor that the speaker is not on our roll. That is an office fact and a stranger has no use for it - Guest speaker, Immanuel Church, Surabaya is the whole of what they need. Removed.\n\nTHE HOSTING NUDGE WAS ON M1 AND M6 AT ONCE. Iteration 27 moved it to Groups and never took it off Home, so both carried it - and a hosting slot in April is not DUE in March, which is the position Home is supposed to hold. Now only M6 has it.\n\nAND THE ONE WORTH THE WHOLE PASS. M14 still said not in the app, mark by hand for two people. After iteration 33 that category stopped existing: a member with WhatsApp answers with a reply button and never installs anything. Intan now shows Said going with a WhatsApp marker - she answered, from where she already was. Only Tigor remains manual, and the reason is stated: no phone on file, only you can answer for him.\n\nTwo further things fell out of that. The summary went from 2 not in the app to 1 answered by WhatsApp and 1 with no phone, which are different facts that had been collapsed into one. And the dashed avatar was being used for not in the app while the design system defines it as NOT ON OUR ROLL - two unrelated meanings on one mark, now separated.\n\nThe deliberate exception: P5 still names Community Member and Registered Member. That is the line added at iteration 31 which INTRODUCES the vocabulary rather than assuming it, and the position is about assuming, not mentioning.',
};

const lagNote = {
  id: 'n-lag', x: 2100, y: 0, w: 500, page: 'page-7',
  text: 'ITERATION 41 - CHECKING THE OTHER TWO FOR THE SAME LAG\nIteration 40 found that a big finding does not propagate on its own: iteration 33 changed a premise and M14 only learned about it seven ticks later. So this pass followed the other two big findings forward.\n\nITERATION 32, THE CHANNEL. Mostly landed - M8 nudges by WhatsApp, P8 sends the code there, W4 discloses it. But S8 itself said the consent belongs on P5 and it is not there yet, and I never went back. Now it is: a ticked line saying the church may message me about services, my care group and anything I am asked to do, nothing else, and I can stop it any time. A church broadcasting to 248 numbers without that is a problem in any jurisdiction. M11 also now names the channel on the reminder row rather than just saying On.\n\nITERATION 34, THE PHONE-ONLY OFFICE. Did not land at all in the place that matters. S9 drew W8 and W1 as phone screens and said two more mobile screens in R0 - and the release map still said 15. It now says 17, with both listed and pointing at S9. That is the second arithmetic error in my own release map, after 32-that-was-31 at iteration 22.\n\nThe pattern is worth naming for whoever builds this: A FINDING LANDS WHERE IT WAS FOUND AND NOWHERE ELSE. Three times now the insight was right, written down, and left stranded on the sheet that produced it. Any plan drawn from this canvas should be re-derived from the release map rather than from a memory of what an iteration concluded.',
};

const recNote = {
  id: 'n-rec', x: 1520, y: 12160, w: 540, page: 'page-6',
  text: 'ITERATION 42 - THE AXIS WAS WRONG A THIRD TIME\nThe question that produced this set: if a person can correct their own name, the church archive moves under the office - and a membership roll that changes without the office touching it is a feed, not a record.\n\nTHREE DRAFTS, THREE WRONG ANSWERS, ALL ABOUT WHERE. Put the name on the global row and one church silently renames someone in another. Put it only on the church row and a person corrects it four times and still sees the old one somewhere. Let a stated value flow until a church types over it - draft three - and the roll still moves on its own, just more slowly.\n\nThe axis is not WHERE a value lives. It is WHO MAY WRITE IT. Two stores, one writer each: the statement, written only by the person; the archive, written only by that one church. Nothing crosses without an office acting.\n\nWHAT IT COSTS, STATED PLAINLY. Andreas corrects his address and Grace shows the old one for six weeks. That is not lag being hidden - Grace genuinely has not been told. M31 shows him exactly where he stands at each church and gives him one way to ask, which is more than a silent sync would have given him.\n\nW16 IS THE SCREEN THAT PROVED THE RULE. Six people stated something; four are plainly safe to take. The temptation is a rule that auto-applies the easy ones. That same rule would take Melisa new married surname - a decision about how this church records a marriage - and move Grace Anjani household of five to a new street. So none are automatic, and the screen says why.\n\nAND ONE THING FELL OUT FOR FREE. Children in a household have no account not because of an age rule but because the office holds no phone number for them, which is the account rule from CAP-02 already doing the work. No new policy was needed, and W17 says so rather than inventing one.\n\nAlso fixed here: I.edit did not exist in lib.mjs. Three earlier screens - W6, M20, M27 - have been rendering an empty box where a pencil should be, since iteration 13.',
};

const canvas = {
  artboards,
  annotations: [
    webNote,
    webShipNote,
    topNavNote,
    recNote,
    walkNote,
    lagNote,
    claimNote,
    closeNote,
    threatNote,
    rolesNote,
    mergeNote,
    noofficeNote,
    noappNote,
    msgNote,
    vocabNote,
    sysNote,
    modelNote,
    emptyNote,
    fixNote,
    fidNote,
    decide2Note,
    decideNote,
    r0Note,
    countNote,
    brokenNote,
    rightsNote,
    dataNote,
    handNote,
    retNote,
    {
      id: 'n-tenant', x: 0, y: -250, w: 500, page: 'page-1',
      text: 'THE CHURCH IS CHOSEN BEFORE ANYTHING ELSE\nOne app serves many churches, so the first question is never "who are you" but "which church". A code or a QR both resolve to the same tenant, so a printed bulletin and a poster at the welcome desk lead to the same place.\n\nNo account is needed to get this far. Data never mixes between churches, and neither church can see the other.',
    },
    {
      id: 'n-multi', x: 940, y: -250, w: 400, page: 'page-1',
      text: 'ADD AND REMOVE, NOT JOIN AND RESIGN\nA person can follow several churches - Andreas is Registered in Surabaya and Community in Bandung. Status is per church.\n\nRemoving a church is a device-level act: it stops the app showing that church. It is NOT a resignation, and only the church office can change a membership record. The confirmation screen says so out loud.',
    },
    {
      id: 'n-public', x: 0, y: -238, w: 470, page: 'page-2',
      text: 'INSIDE A CHURCH, STILL NO SIGN-IN WALL\nAnyone with the code can read sermons, service times, speakers and event posters. Sign-in exists for people the office already knows; there is no self-serve account that grants anything.\n\nThe header names the church you are looking at and switches between them. Worship day is a church setting - this one is set to Saturday, so every screen reads "Saturday".',
    },
    {
      id: 'n-apply', x: 940, y: -238, w: 400, page: 'page-2',
      text: 'THE APPLICATION IS WHERE THE MODEL SHOWS\nOne question decides everything downstream: keep your membership where it is (Community Member) or move it here (Registered Member). Both are applications; neither is a downgrade.',
    },
    {
      id: 'n-external', x: 1410, y: -238, w: 400, page: 'page-2',
      text: 'A GUEST IS NOT ONLY A SPEAKER\nSamuel Kartono preaches here with no standing here at all - dashed avatar, "not on our roll". The same goes for a borrowed pianist, a singer, a hired sound engineer. A serving slot points at a PERSON, never at a member.\n\nThat needs no fourth tier: it is simply the absence of a membership row for this church. M12 and M13 show how the name gets chosen.',
    },
    {
      id: 'n-notalk', x: 1880, y: -238, w: 440, page: 'page-2',
      text: 'ITERATION 8 - THERE IS NO REJECTION SCREEN, AND THAT IS THE DESIGN\nTracing the one flow never drawn - what an applicant sees when the office will not confirm - ended in deleting the flow instead of drawing it. A church does not refuse someone through a push notification. Turning that into a status makes the app do something nobody in the building would do.\n\nSo W1 lost its Decline button. The furthest the office can go is "needs a conversation", and P9 is how that lands: a name, a number, a step that is waiting rather than closed, and the sentence that matters - nothing has been refused.\n\nMeanwhile the applicant keeps everything a guest has. Being unconfirmed costs them nothing they already had.',
    },
    {
      id: 'n-tier', x: 0, y: -262, w: 500, page: 'page-3',
      text: 'THREE AXES, NEVER ONE FLAG\n1. STATUS - guest / community / registered. One value per person PER CHURCH, changed by the office.\n2. SERVING - many per person, time-bound, has a schedule. Never a status.\n3. APP ACCESS - granted separately (office, group leader, admin).\n\nCare group membership is its own relation. Joining a group never moves anyone\'s membership.',
    },
    {
      id: 'n-notice', x: 2400, y: 3896, w: 480, page: 'page-3',
      text: 'ITERATION 11 - THE MOST DANGEROUS FEATURE IN THE PRODUCT\nChurches genuinely want to notice when someone quietly stops coming, and they are right to: that is usually the moment something is wrong. Noticing is care.\n\nEvery church system ships this as an "inactive member alert" with a week count, and that is exactly where it turns. A number makes it a metric. A metric makes a list. A list of lapsed members passed around the leaders of a small congregation is how people become gossip in their own church.\n\nM23 is built from four refusals. NO NUMBER - "for a while", never "5 weeks", never a percentage. NO LIST - it reaches one person, the leader who already knows him. NO AUTOMATIC STATUS - only the office marks anyone Inactive, and only after talking to a human being. AN OFF SWITCH THAT COSTS NOTHING - because the most common truth is that the leader already knows why, and an alert you cannot dismiss is one you learn to ignore.\n\nThe guardrails are printed on the screen rather than buried in a policy. The leader has to see the promise in order to keep it. And the last line admits what the data actually is: attendance here is marked by hand and often wrong.\n\nIF THIS STILL FEELS LIKE SURVEILLANCE, CUT IT. The product survives without it; a congregation that feels watched does not come back.',
    },
    {
      id: 'n-scope', x: 1880, y: 0, w: 400, page: 'page-3',
      text: 'THE ONLY REAL DIFFERENCE ON THIS PAGE\nM2 and M3 are the same tab. Community sees contacts in their own care group; Registered and the office see the full directory. Church information - sermons, times, events, serving - is open to both.',
    },
    {
      id: 'n-serving', x: 1880, y: 974, w: 400, page: 'page-3',
      text: 'SERVING IS AXIS 2 MADE VISIBLE\nA person belongs to teams, teams own slots, slots have dates. That is why "who is on sound this Saturday" is answerable and "set as participant" would not have been.',
    },
    {
      id: 'n-audit', x: 2920, y: 3896, w: 470, page: 'page-3',
      text: 'ITERATION 12 - NOTHING ADDED, FOUR LIES REMOVED\nEleven iterations of building screen by screen leaves a canvas that contradicts itself, and a reader trips on that long before they trip on a layout. So this pass read all 45 as one product.\n\nFOUR REAL CONTRADICTIONS, ALL NOW FIXED:\n\nAndreas was a confirmed Community Member on M1 and M11, and simultaneously sat unprocessed in the applicants queue on W1 - while ALSO being the person transferring in on W7. Three moments in one man. W1 and P5 now belong to Rian Wijaya; Andreas keeps only the arc that is his.\n\nDedi had a phone number on M2 that W2 recorded as missing - and the number he had was Intan\'s. M2 now says no number on file, which quietly demonstrates the "12 phone numbers missing" that W2 complains about.\n\nHomeOffline named a worship lead the roster gave to someone else.\n\nHomeQuiet promised a speaker for 28 March that W3 shows as unassigned. It now says the honest thing: not confirmed yet.\n\nThe pattern worth keeping: sample data is a claim about how the product behaves. Two screens disagreeing is a bug found for free, before anyone writes code.',
    },
    {
      id: 'n-me', x: 1880, y: 1948, w: 400, page: 'page-3',
      text: 'TWO ESCAPE HATCHES LIVE HERE\n"My churches" is how someone adds or removes a church. "Move my membership here" is the tier upgrade - a deliberate act with a stated cost (transfer letter) and a stated gain (full directory, voting). Nobody is nagged into either.',
    },
    {
      id: 'n-picker', x: 1880, y: 2922, w: 440, page: 'page-3',
      text: 'PICK FROM THE LIST, OR JUST TYPE\nOne field does both. M12 offers the team first, then guests already used - each with how many times, because the pianist you booked six times is the one you want again.\n\nM13 is what happens when nothing matches: the typed name is kept as a guest, so nobody retypes it next month and the roster does not collect four spellings of the same person. Name alone is enough; instrument, phone and church are optional.',
    },
    {
      id: 'n-practical', x: 1880, y: 3896, w: 460, page: 'page-3',
      text: 'ITERATION 1 - THREE THINGS INDONESIA ACTUALLY NEEDS\nM14: the leader marks attendance by hand, because the older half of any congregation will never install an app. Their rows are dashed and flagged "not in the app" so RSVP numbers stop being fiction. Two taps per person, no typing.\n\nM15: churches here announce on WhatsApp, so the app writes the message instead of competing with it. Weekly warta in three taps.\n\nM16: the same home screen in Indonesian. Not a translation exercise - a layout check.',
    },
    {
      id: 'n-nav', x: 2400, y: 3896, w: 460, page: 'page-3',
      text: 'ITERATION 2 - FIVE TABS BECAME FOUR\nThe five-tab strip hid a regression: signing in DELETED the Sermons and Service tabs. Becoming a member took away the two things people open every week. Backwards.\n\nNow both shells are four tabs and the first two are identical - Home and Sermons never move. Serving and People lost their tabs because a duty happens twice a month and a directory lookup less than that; both are reached from Home (the search icon, and "All serving"). A tab is for what you open weekly.\n\nM17 is the same Home with no signal. Concrete church buildings eat mobile data, and the moment you most need your call time is the moment you are standing inside one - so the duty card is stored on the phone, and a tapped RSVP queues instead of vanishing.',
    },
    {
      id: 'n-type', x: 1880, y: 0, w: 440, page: 'page-5',
      text: 'ITERATION 3 - THE DEFAULT TYPE IS TOO SMALL\nM18 is Home at 17px body and 15px meta - iOS default, and what a 65-year-old can actually read without pinching. Compare it with M1: today\'s meta lines run 11.5-12.5px, which is small even for a 40-year-old in a dim hall.\n\nThe finding is what does not fit. At readable type Home holds FOUR blocks, not five - the hosting nudge has to leave. That is not a type problem, it is Home telling us it was carrying one thing too many.\n\nThe recommendation is to raise the baseline rather than ship a separate large-text mode: nobody turns that on, and the people who need it least know it exists.',
    },
    {
      id: 'n-leader', x: 3440, y: 3896, w: 470, page: 'page-3',
      text: 'ITERATION 5 - THE LEADER HAD NO PLACE TO STAND\nTracing a group leader\'s Wednesday exposed it: every job she does sat three taps deep. Nudge the four who never answered - Groups, then the group, then the meeting. Mark who came - Groups, then the group, then attendance. Every week, the same three lapses.\n\nM19 is NOT a fifth Home. It is M1\'s care-group card in the state it takes on the day the meeting happens: the counts become the content, and the two things a leader actually does become the two buttons. On any other day the card goes back to what M1 shows.\n\nThe rule this follows: surface a job on the day it is due, and let it disappear again. A permanent leader dashboard would be one more place to check.',
    },
    {
      id: 'n-office', x: 0, y: -210, w: 500, page: 'page-4',
      text: 'THE OFFICE IS THE GATE\nConfirming an applicant sets the status, places them in a household, and optionally drops them into a care group. The line under the buttons is the promise the product has to keep - confirming does not move anyone\'s membership.',
    },
    {
      id: 'n-warta', x: 3960, y: 3896, w: 480, page: 'page-3',
      text: 'ITERATION 6 - NOBODY BUT THE LEADER HAD A REASON TO OPEN THIS\nAsk what brings an ORDINARY member back on a Tuesday - not the leader, not a volunteer. Until now: nothing. She knows the service time by heart and watches sermons on YouTube. An app only the leader opens is an app that dies, and the roster and RSVP data die with it.\n\nThe gap was the most ordinary thing in an Indonesian church: the weekly warta. Every church already writes one, it costs them nothing extra, and it is the most-read thing they produce. M20 is it, and Home now carries a line into it.\n\nBirthdays sit at the bottom on purpose. A one-tap greeting is the cheapest reason anyone has ever had to open an app, and it is the one thing here that makes a member touch another member.\n\nTWO THINGS TO WEIGH. This is scope the brief did not ask for - reject it if the first release must stay at membership plus care groups. And M18 now needs re-running: Home grew a block back.',
    },
    {
      id: 'n-scale', x: 1880, y: 1948, w: 500, page: 'page-5',
      text: 'ITERATION 14 - ONE ASSUMPTION HID INSIDE 248 PEOPLE\nEvery screen was drawn against 248 members and 5 groups. Testing them against 2,000 and 40 broke something structural, not cosmetic.\n\nTHE APP ASSUMES THE CHURCH HAS ONE SERVICE. "Next service, Saturday 09.00" reads fine at 248. Above roughly 400 members a church runs two to four, and then a DATE STOPS BEING AN ANSWER. Which service do you attend? Which one are you serving at? Which one is this announcement for? Which one was attendance taken at?\n\nM24 shows the smallest honest fix: the service card carries a picker and remembers which one is yours, and the serving card says 07.00 SERVICE, NOT THE ONE YOU ATTEND - because the most common serving mistake in a multi-service church is turning up to the wrong one. That single line is worth more than the picker.\n\nThis is not a screen change. A service becomes a thing the model holds, and attendance, serving, announcements and RSVP all hang off it. Cheap to decide now, expensive after the schema exists.\n\nM25 on page 3 is the smaller half: at forty groups a flat list is a wall, so you never see forty - you see six areas with a coordinator each. And the number a large church actually asks for is not how many groups exist but 820 PEOPLE ARE IN NONE.',
    },
    {
      id: 'n-tokens', x: 1880, y: 974, w: 480, page: 'page-5',
      text: 'ITERATION 13 - WHAT TWELVE ITERATIONS ACTUALLY PRODUCED\nMeasured rather than eyeballed, across all 45 screens:\n\n   font sizes   32 distinct  ->  15\n   radii        15 distinct  ->  12\n   control h    5 button sizes  ->  3\n\nThirty-two font sizes is not a type scale, it is noise. 13.5 and 14 are indistinguishable on a phone and double every decision; 46, 48 and 50 are the same button. Hand a developer 32 sizes and they will invent the 33rd on their first new screen.\n\nEvery collapse SHRANK the value, never grew it, so nothing can overflow a frame that already fitted. The body ramp is now 8 steps carrying 1,156 of the roughly 1,290 sizes in the file; display is five.\n\nWhat is left is honest: 11px and 10px radii on a handful of one-off marks, and two font sizes that are computed from avatar diameter rather than written down. Those are the next mechanical pass, not a judgement call.\n\nThe tokens now live at the top of lib.mjs as T, R and H - so the next screen inherits the scale instead of guessing at it.\n\nAND IT CAME BACK. Ten modules added between iterations 29 and 37 quietly reintroduced the half-pixel sizes and five new radii, because writing the tokens down is not the same as using them. Re-snapped during the full review: 22 font sizes to 15, 17 radii to 9. The two remaining odd sizes are computed from avatar diameter rather than written, which is the correct kind of exception. This is exactly the cost S6 warns about, measured twice now on the same design.',
    },
    {
      id: 'n-stress', x: 0, y: -280, w: 540, page: 'page-5',
      text: 'ONE SCREEN, FOUR PRESSURES\nEverything hangs on Home, so it gets its own page rather than four lookalikes cluttering the product. These are not four screens - they are the same screen in Indonesian, with no signal, at readable type, and on a week when nothing is due.\n\nITERATION 7 - THE TYPE PROBLEM RESOLVES ITSELF\nM18 found Home holds four blocks at 17px; iteration 6 then grew it back to five. Cutting a block would have been the wrong fix.\n\nThe right one is M21: HOME IS A LIST OF WHAT IS DUE, NOT A FIXED LAYOUT. A meeting card belongs there the week the meeting happens. A duty card the week you serve. Most weeks, most members are due nothing - and Home should then be almost empty, at any type size. Empty is a correct state, not a failure to fill.\n\nM19 on page 3 is the same rule pointing the other way: on the day it matters, the card grows two buttons.',
    },
    {
      id: 'n-import', x: 0, y: 1060, w: 520, page: 'page-4',
      text: 'ITERATION 4 - THE SCREEN THE PRODUCT LIVES OR DIES ON\nW5 was a button on W2 until now, and it is the biggest adoption risk in the whole product. If the office has to type 248 people in, nobody ever reaches day two. Every church already has the data - in a spreadsheet that is never clean.\n\nSo the rule is: NOTHING IS REJECTED. All 261 rows land; the 12 bad ones arrive flagged. An importer that demands clean data is an importer nobody finishes.\n\nThe hard part is the model gap - their file is a flat person list, ours is household-first. That is asked once, with a live count under it (76 households, 12 people alone), so the office can see the answer before committing. Undo stays open for 7 days.',
    },
    {
      id: 'n-xfer', x: 0, y: 2090, w: 540, page: 'page-4',
      text: 'ITERATION 10 - A TRANSFER IS A LETTER, AND STAYS ONE\nThe surat pindah is the one place multi-tenancy can beat paper: the origin church signs, the record travels, nobody carries an envelope that gets lost.\n\nBut the trap is right there. MOST RECEIVING CHURCHES WILL NEVER BE ON JEMAAT. A design that assumes both sides are customers is useless in the common case. So the letter is the artefact and the data transfer is only a channel: on Jemaat it arrives verified, on paper it prints with a QR that proves it genuine. The right-hand panel of W7 is the normal case, not the fallback.\n\nThe second rule is the tenant boundary. What crosses is the minimum a new church needs to admit someone - name, birth date, household, sacraments, member-since. Attendance, giving and anything the office wrote never leaves the church that recorded it, and M22 tells the member that in their own words before they ask.\n\nAnd the last line of W7 matters most: no letter at all, accept them as Community and sort it out later. Nobody should wait on paperwork to belong somewhere.',
    },
    {
      id: 'n-life', x: 1520, y: 1060, w: 520, page: 'page-4',
      text: 'ITERATION 9 - LIFECYCLE IS A FOURTH AXIS, NOT A FOURTH TIER\nPeople transfer away and people die, and neither had a home in 41 screens. Standing says WHAT someone is to this church; lifecycle says whether they are still with it. Yohanes Halim stays a Registered Member - he is simply no longer here.\n\nThe failure this exists to prevent is specific: an app that prompts his family to send him a birthday greeting in September. Every FORWARD-looking surface has to drop him the moment this is set - birthdays, rosters, RSVP, reminders, counts. Every BACKWARD-looking one keeps him: 184 meetings, 11 evenings hosted, three years on hospitality.\n\nSo nothing is ever deleted. Deleting him to tidy a list would corrupt his household and rewrite an attendance history that was true. The screen\'s real work is the right-hand panel: both halves of the consequence, in plain words, BEFORE the click.\n\nM4 shows the other side - his family opens the household and finds him under In memory, quiet, no badge shouting a status at them.',
    },
    {
      id: 'n-code', x: 1520, y: -210, w: 460, page: 'page-4',
      text: 'THE CODE IS A PUBLIC DOOR, SO SAY WHAT IS BEHIND IT\nAnyone who reads the bulletin has the code, so the screen lists exactly what a stranger can see and what they cannot. Rotating the code is offered but warned about: every printed poster stops working.',
    },
  ],
  pages: [
    { id: 'page-7', name: 'Start here' },
    { id: 'page-1', name: 'Onboarding' },
    { id: 'page-2', name: 'Public' },
    { id: 'page-3', name: 'Signed in' },
    { id: 'page-4', name: 'Church office (web)' },
    { id: 'page-5', name: 'Home under stress' },
    { id: 'page-6', name: 'What ships first' },
    { id: 'page-8', name: 'The admin register' },
  ],
  launch: { view: 'canvas', page: 'page-7' },
};

for (const [name, content] of Object.entries(files)) {
  writeFileSync(new URL(`./${name}`, import.meta.url), content, 'utf8');
}
writeFileSync(new URL('./canvas.json', import.meta.url), JSON.stringify(canvas, null, 2), 'utf8');
console.log('wrote', Object.keys(files).length, 'artboards + canvas.json');

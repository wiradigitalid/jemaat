# PRD Addendum: Church Operations

This addendum records implementation depth, screen-to-requirement mappings, and architectural context supporting `PRD: Church Operations`.

## 1. Traceability: Mobile & Web Screen Mappings (from `.work/design`)

The 95 prototype screens in `.work/design` map directly to the functional requirements defined in this PRD:

| Functional Area | Prototype Screens | Realizes |
|---|---|---|
| **Onboarding & Joining** | `Start.dc.html`, `SignIn.dc.html`, `Verify.dc.html`, `ScanQR.dc.html`, `EnterCode.dc.html`, `ConfirmChurch.dc.html`, `LeaveChurch.dc.html`, `MyChurches.dc.html` | FR-13 |
| **Member Profile & Directory** | `Profile.dc.html`, `Directory.dc.html`, `DirectoryLimited.dc.html`, `Household.dc.html`, `AddMember.dc.html`, `MyDetails.dc.html`, `MyHousehold.dc.html`, `MyStanding.dc.html` | FR-1, FR-2, FR-14 |
| **Volunteer Scheduling** | `Serving.dc.html`, `AssignPick.dc.html`, `AssignGuest.dc.html`, `WebRoster.dc.html`, `ShareService.dc.html`, `AdminServing.dc.html` | FR-5, FR-6, FR-7, FR-8 |
| **Care Groups** | `CareGroups.dc.html`, `GroupDetail.dc.html`, `Meeting.dc.html`, `Attendance.dc.html`, `HostQueue.dc.html`, `GroupsScale.dc.html` | FR-9, FR-10, FR-11 |
| **Portal & Announcements** | `MemberHome.dc.html`, `ThisWeek.dc.html`, `Sermons.dc.html`, `SermonDetail.dc.html`, `Service.dc.html`, `HomeOffline.dc.html`, `HomeLeader.dc.html`, `Messages.dc.html` | FR-12, FR-15, FR-17 |
| **Web Admin Operations** | `WebPeople.dc.html`, `WebPerson.dc.html`, `WebHouseAdmin.dc.html`, `WebRoster.dc.html`, `WebImport.dc.html`, `WebMerge.dc.html`, `WebRoles.dc.html`, `WebHandover.dc.html`, `WebTransfer.dc.html`, `WebApplicants.dc.html`, `AdminChurch.dc.html` | FR-1, FR-2, FR-3, FR-4, FR-16 |

## 2. Options Considered & Design Trade-Offs

- **Volunteer Confirmation Channel**:
  - *Option A: WhatsApp Bot / SMS only*. Rejected for initial baseline due to per-message API costs (Twilio/Meta WhatsApp Business API) which burden small churches.
  - *Option B: In-App Mobile Push with 1-tap action cards + deep links*. Accepted as default zero-cost channel; optional WhatsApp integration via share intent.
- **Offline Attendance Strategy**:
  - Local SQLite / IndexedDB cache storing care group member roster and active meeting instance.
  - Conflict resolution: Last-write-wins with client-side idempotency keys for attendance mark events.

## 3. Downstream Technical Guidance for SDD / C4

- The system separates the administrative web interface (React + Tailwind) from the member/volunteer mobile client (Flutter).
- Backend APIs (Go) must provide granular scoping: a regular member token cannot query unmasked household directories or administrative roster configuration endpoints.

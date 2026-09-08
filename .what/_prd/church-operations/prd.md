---
title: Church Operations
initiative: church-operations
created: 2026-09-08
---

# PRD: Church Operations
*Core church membership, volunteer scheduling, care group coordination, and congregational mobile workflows.*

> **This is the working PRD.** It cites requirement ids instead of repeating their text, so §3 lists
> `FR`/`NFR` by id, and there is no Glossary, Non-Goals, Open Questions, or Assumptions Index section
> here — each of those facts has its own home.
>
> **To read or hand over one complete, self-contained document, run `/wdi-report render prd`.**
> It writes `.what-rendered/_prd/church-operations/prd.md` with the capabilities, the requirement statements and
> proofs of done, the glossary terms this PRD uses, the non-goals, and the open questions filled in
> from their own homes. That file is regenerated, never hand-edited.

## Revision History

| Date | What changed | Why | Releases affected |
|---|---|---|---|
| 2026-09-08 | Initial PRD baseline covering core membership, volunteer rosters, care group attendance, and mobile portal | Initial operational definition for G2 Product Gate | v0.1.0 |

## 1. Why This Initiative

This initiative delivers the foundational operational engine of Jemaat as defined in the product brief. While the product brief articulates the broader vision of eliminating administrative friction across local churches, this initiative concretely establishes the dual-surface solution: an administrative web portal for church staff to manage household data and volunteer scheduling, paired with a resilient mobile client that brings service confirmation, small group attendance, and guest onboarding directly into the hands of volunteers and congregants.

## 2. Target User

### 2.1 Jobs To Be Done

- **Church Administrator**: "When member information or family structures change, I want a single authoritative registry, so that our contact lists, pastoral records, and ministry rosters never desynchronize or get lost."
- **Volunteer / Ministry Servant**: "When I am scheduled to serve on Sunday, I want clear, timely mobile notifications and an instant way to confirm or decline, so that the coordination team knows whether my station is covered."
- **Care Group Leader**: "When our small group meets during the week, I want to take attendance and note new guests on my phone in seconds even with poor connectivity, so that our pastoral team stays informed without manual reporting."
- **Church Member / Guest**: "When I attend church or want to know what is happening this week, I want quick mobile access to announcements, sermons, and my personal serving schedule without scrolling through endless chat groups."
- **Pastor / Ministry Coordinator**: "When planning services and pastoral care, I want reliable visibility into volunteer coverage and care group attendance trends, so that no member slips through the cracks unnoticed."

### 2.2 Non-Users (v1)

- External commercial vendors, financial auditors needing formal double-entry accounting ledgers, and denominational regional hierarchy administrators.

### 2.3 Key User Journeys

- **UJ-1. Administrator onboards a household and establishes family linkages.**
  - **Persona + context**: Church Administrator on Monday morning processing newcomer cards from Sunday service.
  - **Entry state**: Authenticated on administrative web portal at church office.
  - **Path**: Opens People registry, enters primary contact details, creates new Household record, adds spouse and two children, assigns family roles, and tags the household with the local neighborhood zone.
  - **Climax**: The system links all four individuals under one household card with verified contact channels and no duplicate records created.
  - **Resolution**: Household is active and ready for care group assignment; admin exports roster or sends welcome link.

- **UJ-2. Volunteer receives service roster notice and confirms assignment.**
  - **Persona + context**: Worship team sound engineer volunteer receiving weekly duty notification on Thursday afternoon.
  - **Entry state**: Authenticated on mobile app; push notification received.
  - **Path**: Taps notification banner, views serving duty card detailing date, call time, service order, and team roster.
  - **Climax**: Taps "Confirm Attendance" with one tap.
  - **Resolution**: Status immediately updates to confirmed; coordinator's service matrix dashboard reflects green checkmark.
  - **Edge case**: If unable to serve, volunteer taps "Decline / Request Swap", prompting an alert to the ministry coordinator with optional reason note.

- **UJ-3. Care group leader takes attendance during weekday meeting.**
  - **Persona + context**: Care group leader hosting a Friday evening fellowship in a suburban home with spotty internet connection.
  - **Entry state**: Authenticated on mobile app; offline mode active.
  - **Path**: Opens Care Group tab, selects tonight's meeting, checks off present members from list, and taps "+ Add Guest" for one first-time visitor.
  - **Climax**: Taps "Submit Attendance"; app records data locally and indicates "Saved offline".
  - **Resolution**: Leader closes app; when mobile reconnects to mobile data or home Wi-Fi, attendance syncs transparently with central church records.

- **UJ-4. First-time visitor scans lobby QR code and accesses church portal.**
  - **Persona + context**: First-time guest standing in the church foyer before Sunday morning worship.
  - **Entry state**: Unauthenticated mobile phone camera.
  - **Path**: Scans lobby poster QR code, mobile opens Jemaat onboarding screen with pre-filled church code, enters name and mobile phone, verifies with 6-digit SMS/WhatsApp OTP.
  - **Climax**: Immediately lands on "Welcome to Church" home screen showing today's sermon theme, service rundown, and digital connection card.
  - **Resolution**: Guest receives digital welcome; pastoral care team receives new visitor follow-up ticket in their queue.

## 3. Features

### 3.1 Household and Member Identity Management
**Capability:** CAP-1 — serves BG-1.

**Description:** Provides church administrators with a comprehensive web-based registry to manage individual member profiles and multi-generational household units. Supports tracking baptismal and membership status, address changes, custom categorization tags, and family relationship hierarchies. Realizes UJ-1.

**Realizes:** FR-1, FR-2, FR-3, FR-4, NFR-1

**Feature-specific NFRs:** NFR-1

### 3.2 Ministry Roster and Volunteer Scheduling
**Capability:** CAP-2 — serves BG-2.

**Description:** Allows ministry department heads and service coordinators to define serving roles across Sunday services, schedule volunteers on a visual calendar matrix, detect scheduling conflicts and blockout dates, and receive mobile RSVP confirmations. Realizes UJ-2.

**Realizes:** FR-5, FR-6, FR-7, FR-8

### 3.3 Care Group Operations and Attendance
**Capability:** CAP-3 — serves BG-3.

**Description:** Organizes congregants into localized small groups / care groups. Equips leaders with mobile tools to log weekly meeting attendance, record guest participation, and flag members showing prolonged disengagement for pastoral follow-up. Realizes UJ-3.

**Realizes:** FR-9, FR-10, FR-11, NFR-4

**Feature-specific NFRs:** NFR-4

### 3.4 Congregational Portal and Service Directory
**Capability:** CAP-4 — serves BG-4.

**Description:** Serves as the primary congregational touchpoint on mobile. Delivers weekly church announcements, service itineraries, sermon media notes, personal ministry duty calendars, and an opt-in member directory with privacy masking. Realizes UJ-4.

**Realizes:** FR-12, FR-13, FR-14, NFR-2

**Feature-specific NFRs:** NFR-2

### 3.5 Workflow Automation, Reminders, and Guest Intake
**Capability:** CAP-5 — serves BG-5.

**Description:** Eliminates repetitive manual reminders by automatically triggering push notifications for scheduled volunteers and upcoming care group meetings. Manages digital guest onboarding and provides resilient offline data synchronization across all mobile workflows. Realizes UJ-3, UJ-4.

**Realizes:** FR-15, FR-16, FR-17, NFR-3

**Feature-specific NFRs:** NFR-3

## 4. MVP Scope

### 4.1 In Scope

- Individual profile and household management with head-of-household and dependent linking.
- CSV member import tool with column mapping and duplicate phone/email detection.
- Volunteer ministry roster matrix with role assignments for weekly services.
- Mobile volunteer serving card with 1-tap accept/decline response.
- Care group directory, meeting scheduling, and mobile attendance submission.
- Congregational mobile portal with weekly announcements, service schedules, and personal serving tab.
- QR code and 6-digit church code fast onboarding flow.
- Automated reminder engine for volunteer rosters and care group meetings.
- Offline attendance logging and local schedule caching on mobile.

### 4.2 Out of Scope for MVP

- In-app payment gateway processing for tithes and offerings (deferred to v0.2.0; manual recording supported).
- Multi-campus physical resource reservation and vehicle booking (deferred to v0.3.0).
- Automated SMS broadcast integration (initial MVP relies on mobile push notifications and WhatsApp deep links).
- Dynamic custom form builder for event registrations (deferred to v0.2.0).

## 5. Success Metrics

- **SM-1 (Core Adoption)**: 90% of active congregants and their household structures completely digitized within 6 months of rollout (validates FR-1, FR-2, FR-3; aligns with brief success criterion).
- **SM-2 (Volunteer Responsiveness)**: At least 80% of scheduled volunteer positions confirmed via mobile 24 hours prior to service start (validates FR-6, FR-7, FR-15).
- **SM-3 (Care Group Reporting)**: Over 75% of active care groups submit weekly attendance via mobile within 24 hours of meeting (validates FR-10, FR-17).
- **SM-4 (Mobile Engagement)**: More than 60% of active congregants open the mobile portal at least twice a month for schedules or announcements (validates FR-12, FR-14).

## 6. Cross-Cutting NFRs

- **NFR-1 (Data Privacy & RBAC)**: Personal data protected with role-based access control; congregational directory masks personal phone numbers and home addresses unless explicitly permitted.
- **NFR-2 (Mobile Performance)**: Mobile feed and personal serving roster load within 500ms (P95) under standard network conditions.
- **NFR-3 (Permissive Licensing)**: 100% compliant with permissive open-source licenses (MIT, Apache 2.0, BSD), with zero copyleft (GPL/AGPL) dependencies.
- **NFR-4 (Offline-First Reliability)**: Mobile app provides uninterrupted schedule viewing and attendance marking when offline, syncing automatically upon network restoration.

## 7. Constraints and Guardrails

- Strictly MIT-licensed architecture; copyleft code or libraries are prohibited across all repositories and submodules.
- Denomination-neutral domain terminology; no sectarian governance or denomination-specific vocabulary hardcoded into core models.
- Monorepo structural separation separating backend API, web administration, and mobile application layers.
- Privacy-first data stewardship: member data must never be shared across unverified church tenants or third-party advertising networks.

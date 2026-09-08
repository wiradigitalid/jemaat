# Product Brief: Jemaat

> **This is the working brief.** It points at the registry instead of repeating it, so `Goals` is one
> line and there is no Assumptions or Prerequisites section here.
>
> **To read or hand over one complete, self-contained document, run `/wdi-report render brief`.**
> It writes `.what-rendered/_product-brief/brief.md` with the goals, the open assumptions, and the open
> prerequisites filled in from their own homes. That file is regenerated, never hand-edited.

## Why

Most local churches operate their daily life through a fragile patchwork of personal spreadsheets, disjointed WhatsApp group chats, printed paper rosters, and physical sign-in sheets. When member information changes, families move or welcome children, or volunteer servers call in absent on Sunday morning, church administrators and ministry coordinators scramble manually. Commercial church management systems (ChMS) exist, but they are predominantly closed-source, priced beyond the budget of small-to-medium congregations, and heavily tilted toward Western administrative paradigms with rigid denominational workflows.

Jemaat is an open, modern church administration and workflow platform designed to bridge administrative back-office recordkeeping with real-time mobile congregational life. By unifying personal and household records, ministry volunteer scheduling, care group coordination, and self-service member portals into a cohesive, freely forkable system, Jemaat removes administrative friction from church operations. It allows pastoral teams and ministry volunteers to spend less time managing records and chasing confirmations, and more time caring for people.

If Jemaat succeeds, it establishes a reliable, denomination-neutral standard for church management that any local congregation can adopt without recurring license fees or vendor lock-in, elevating operational diligence across diverse church communities worldwide.

## The Problem

Local church administrators carry an overwhelming operational burden using disconnected tools. Membership records live on personal laptops in ad-hoc Excel sheets that drift out of date; household structures and family relationships are lost or tracked only by memory; volunteer rosters for Sunday services require hours of manual follow-ups and reminder phone calls; and care group leaders struggle to track attendance or notice members who have quietly stopped attending. When administrative personnel transition, institutional memory disappears. The cost of this status quo is burnt-out church workers, lost pastoral follow-ups for newcomers, and fragmented congregational engagement.

## The Solution

Jemaat is a self-hosted, multi-surface church management platform comprising a web-based administrative portal for church staff and coordinators, paired with a lightweight mobile application for members, volunteers, and care group leaders to interact with church workflows directly.

## What Makes This Different

Unlike proprietary, expensive ChMS platforms that enforce vendor lock-in and rigid denominational hierarchies, Jemaat is fully open-source (MIT licensed) and denomination-neutral. It is purpose-built to pull offline church workflows—such as care group attendance reporting, roster confirmation, and guest intake—directly into intuitive mobile interactions without imposing complex enterprise overhead.

## Who This Serves

| Role | Need | Tier |
|---|---|---|
| Church Administrator | Needs an authoritative, centralized registry for member records, household linkages, volunteer rosters, and operational workflows | **primary** |
| Volunteer / Ministry Servant | Needs clear visibility of assigned service dates, role details, automated reminders, and instant RSVP confirmation | secondary |
| Care Group Leader | Needs effortless mobile attendance tracking, group member rosters, meeting scheduling, and pastoral notice alerts | secondary |
| Church Member / Visitor | Needs a self-service mobile portal for church announcements, service times, personal serving schedules, and newcomer onboarding | secondary |
| Pastor / Ministry Head | Needs high-level visibility over congregational engagement, care group health, and ministry volunteer coverage | secondary |
| Church Board / Elder | Needs reliable operational governance records and data stewardship without managing technical infrastructure | secondary |

## Goals

Goals — see `.control/registry/goals.yaml` → `goals:`.

## Success Criteria

90% of active congregants and their household records are completely and accurately digitized in the system within 6 months of initial church deployment.

## Scope

### Scope In

- Core membership registry with complete individual profiles, contact details, baptismal/membership status, and custom tags.
- Household and family unit modeling supporting multi-generational families, heads of household, and parent-child linkages.
- Ministry volunteer management, scheduling rosters, duty assignment, automated notifications, and volunteer RSVP confirmations.
- Small group / care group administration, roster assignment, meeting schedules, and mobile attendance reporting.
- Self-service member portal for church announcements, service itineraries, assigned ministry schedules, and digital church directory.
- Guest and newcomer intake workflows, tracking follow-up stages from first visit to care group connection.
- Role-based access control protecting confidential personal records and ministry data.

### Scope Out

- Full double-entry general ledger accounting and payroll processing (integrated via data export rather than built-in).
- Video and media live-streaming hosting or transcoding infrastructure (links to external platforms supported, not native hosting).
- Hardware biometric access control or proprietary kiosk hardware manufacturing.
- Denomination-specific ecclesiastical court or hierarchical governance systems.
- Heavy learning management system (LMS) or formal seminary course grading platforms.

## Constraints

- Open-source distribution under the MIT license, strictly prohibiting copyleft (GPL/AGPL) dependencies to ensure free forkability and commercial adaptability.
- Denomination-neutral domain terminology and architecture, forbidding denomination-specific hardcoding or sectarian governance assumptions.
- Monorepo architecture enforcing clean architectural decoupling between backend services (Go), administrative web client (React), and mobile app (Flutter).
- Data privacy and local regulatory compliance: personal member data and household contacts must be safeguarded with strict permission boundaries and encryption in transit and at rest.

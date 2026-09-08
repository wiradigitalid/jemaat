---
type: uc
id: UC-17
component: portal
satisfies:
  - FR-14
critical: true
created: '2026-09-08'
---

# UC-17 — I want to find another church member's contact information in the church directory.

## Trigger
Church Member wants to contact a fellow congregant or ministry partner.

## Precondition
Member is authenticated on mobile app and has been admitted into church directory access.

## Main Flow
1. Member navigates to Church Directory (`screen-mobile-directory`).
2. System displays search bar and alphabetized member list.
3. Member enters name (e.g. "Sarah") or filters by Ministry Team.
4. System executes query against verified member profiles with privacy filters applied.
5. System displays matching member cards showing Name, Profile Photo, and Ministry Roles.
6. Member taps Sarah's card to view contact options.
7. System checks Sarah's directory visibility settings: because Sarah opted in, phone and email shortcuts are visible.
8. Member taps "Call" or "Message" to connect directly.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 7 | Target member has NOT opted into directory visibility | System displays name and ministry role, but masks phone and address (`***-****-1234`), providing an in-app "Request Contact" button instead of direct phone number |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Visitor or unverified guest attempts directory search | Enforces access control block (`BR-5`) | Informational card: "The church member directory is reserved for verified church members. Please contact church office for access." |

## Outcome
Congregants connect easily while preserving strict personal privacy and data masking for all members.

## Business Rules
- `BR-4`: Personal contact details masked by default.
- `BR-5`: Unverified guests barred from internal directory.
- `AD-3`: Masked privacy by default.
- `rules-portal.md`: `BR-POR-3` (Opt-in directory visibility).

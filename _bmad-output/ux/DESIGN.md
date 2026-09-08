---
type: ux
component: church-operations
document: design
created: '2026-09-08'
---

# DESIGN — Church Operations

The visual specifications, screen registry, and layout states mapping the 95 prototype screens in `.work/design` to logical UI screen components.

## Tokens

Component-specific layout measurements:
- **Mobile Viewport**: 390px width x 844px height (standard iPhone / modern Android baseline).
- **Web Admin Viewport**: 1440px width x 900px height (standard desktop layout with 246px collapsible left sidebar).
- **Border Radius**: Small elements (badges, buttons) 12px-14px; large containers (cards, modals) 16px-20px; pills 999px.
- **Card Spacing**: 16px-20px screen padding; 12px-16px gap between stacked cards.

## Screens

The 95 prototype screens in `.work/design` represent the user-facing interface surfaces for Jemaat:

| Screen Name | Prototype Source (`.work/design/`) | Logical Component (`LC`) | Purpose |
|---|---|---|---|
| **Mobile Home** | `MemberHome.dc.html`, `Main.dc.html` | `screen-mobile-home` | Primary mobile landing feed showing upcoming services, serving duties, and announcements |
| **Mobile Service Bulletin** | `ThisWeek.dc.html`, `Service.dc.html`, `ShareService.dc.html` | `screen-mobile-service` | Weekly worship rundown, sermon notes, and sharing options |
| **Mobile Sermons** | `Sermons.dc.html`, `SermonDetail.dc.html` | `screen-mobile-sermons` | Sermon archive, audio/video links, and speaker notes |
| **Mobile Serving Roster** | `Serving.dc.html`, `AssignPick.dc.html`, `AssignGuest.dc.html` | `screen-mobile-serving` | Personal volunteer duty cards with 1-tap Accept/Decline/Swap actions |
| **Mobile Care Groups** | `CareGroups.dc.html`, `GroupDetail.dc.html`, `Meeting.dc.html` | `screen-mobile-caregroups` | Small group hub, meeting schedule, and member roster |
| **Mobile Attendance** | `Attendance.dc.html`, `HostQueue.dc.html`, `GroupsScale.dc.html` | `screen-mobile-attendance` | Single-tap member and visitor attendance check-in (offline-capable) |
| **Mobile Directory** | `Directory.dc.html`, `DirectoryLimited.dc.html` | `screen-mobile-directory` | Searchable opt-in congregation directory with contact masking |
| **Mobile Household & Profile** | `Household.dc.html`, `Profile.dc.html`, `MyHousehold.dc.html`, `MyDetails.dc.html` | `screen-mobile-profile` | Personal member details, household linkages, and notification settings |
| **Mobile Onboarding & Verification** | `Start.dc.html`, `SignIn.dc.html`, `Verify.dc.html`, `ScanQR.dc.html`, `EnterCode.dc.html`, `ConfirmChurch.dc.html` | `screen-mobile-auth` | Fast church onboarding via QR code, 6-digit church code, and OTP |
| **Web Admin People** | `WebPeople.dc.html`, `WebPerson.dc.html`, `WebApplicants.dc.html` | `screen-web-people` | Administrative member directory, personal profile management, and applicant queue |
| **Web Admin Households** | `WebHouseAdmin.dc.html`, `AdminHousehold.dc.html` | `screen-web-households` | Family unit grouping, primary contact cards, and address management |
| **Web Admin Roster Matrix** | `WebRoster.dc.html`, `AdminServing.dc.html` | `screen-web-roster` | Multi-department volunteer schedule matrix and real-time RSVP tracking |
| **Web Admin Care Groups** | `AdminGroups.dc.html`, `WebHandover.dc.html` | `screen-web-caregroups` | Care group zone management, leader assignments, and attendance reports |
| **Web Admin Data Operations** | `WebImport.dc.html`, `WebMerge.dc.html`, `WebData.dc.html` | `screen-web-data` | CSV data import, duplicate detection, and record merge resolution |
| **Web Admin Roles & Settings** | `WebRoles.dc.html`, `WebChurchCode.dc.html`, `AdminChurch.dc.html` | `screen-web-settings` | Church profile, QR code generator, and permission role configuration |

## Layout and states

### 1. Mobile Home (`screen-mobile-home`)
- **Empty State**: Displays "Welcome to Jemaat" onboarding card with quick action to connect with a care group or discover serving opportunities.
- **Loading State**: Subtle skeleton placeholder tiles matching card shapes (`#F1EAE1` shimmer).
- **Error State**: Non-blocking toast "Unable to refresh latest notices. Showing cached schedule." with retry button.
- **Populated State**: Hero date banner, next serving duty pill (if assigned), care group reminder card, and announcement feed.

### 2. Mobile Attendance (`screen-mobile-attendance`)
- **Empty State**: "No active meeting found for today. Create new meeting or select past date."
- **Loading State**: Checkbox list rendered with skeleton avatar circles.
- **Error State**: "Failed to submit report. Saved locally to sync when connection restores."
- **Populated State**: List of group members with toggle checkboxes; bottom sheet action to add a first-time guest; persistent "Submit Report" button.

### 3. Web Admin Roster Matrix (`screen-web-roster`)
- **Empty State**: Empty weekly calendar grid with "+ Add Service Schedule" call-to-action button.
- **Loading State**: Transparent loading overlay with central spinner over matrix grid.
- **Error State**: Inline alert banner highlighting conflicting schedules or database connectivity warning.
- **Populated State**: Departmental rows (Worship, Audio, Ushers, Kids), color-coded volunteer pills (Green = Confirmed, Amber = Pending, Red = Declined), click-to-assign drawer.

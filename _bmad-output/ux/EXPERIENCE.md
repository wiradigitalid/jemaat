---
type: ux
component: church-operations
document: experience
created: '2026-09-08'
---

# EXPERIENCE — Church Operations

The user experience architecture, behavioral interactions, and surface journeys across the administrative web desk and congregational mobile client.

## Information architecture

### 1. Administrative Web Desk (Staff & Coordinators)
- **Overview**: Real-time snapshot of active congregation count, Sunday service volunteer coverage, upcoming care group meetings, and new guest applicants.
- **People & Households**:
  - Member Registry: Searchable directory, personal profile cards, status filters (Active, Newcomer, Transferred).
  - Household Directory: Family grouping, primary contact cards, multi-generational dependent trees.
  - Data Operations: Bulk CSV import, duplicate detection queue, and merge resolution tools.
- **Serving & Rosters**:
  - Roster Matrix: Weekly service calendar, ministry department slots (Worship, Tech, Ushering, Kids), volunteer assignment cells, and confirmation indicators.
  - Department Settings: Volunteer capacity requirements, team leaders, qualification tags.
- **Care Groups**:
  - Group List: Zone segmentation, assigned leaders, meeting schedules, active roster counts.
  - Pastoral Queue: Alerts for members absent 3+ weeks, follow-up notes.
- **Church Settings**: Church code generation, QR download, user roles & permissions.

### 2. Congregational Mobile Client (Members, Volunteers, Leaders, Guests)
- **Home (`MemberHome`)**: Next upcoming service banner, personal serving duty reminder, care group quick link, and church notices.
- **This Week (`ThisWeek`)**: Full order of service, sermon series details, upcoming community events.
- **Serving (`Serving`)**: Personal duty cards ("Sunday 09:00 - Audio Engineer"), 1-tap "Confirm" / "Decline" / "Swap", team contact list.
- **Care Group (`CareGroups`)**: My group hub, next meeting details, host queue, 1-tap attendance marking for leaders.
- **Profile (`Profile`)**: Personal contact details, household member links, privacy preferences, opt-in directory switch.

## Journeys

### UJ-1: Household Onboarding & Relationship Linking (Admin)
- **Reference**: Realizes `UJ-1`, `FR-1`, `FR-2`.
- **Surface**: Web Admin Desk (`WebPeople`, `WebHouseAdmin`).
- **Flow**: Admin navigates to People -> New Household -> fills family surname -> adds primary contact -> adds dependents -> assigns roles (Parent, Child) -> clicks Save.
- **Feedback**: Household card appears immediately in directory with 4 linked member badges and consolidated address.

### UJ-2: Volunteer Serving Roster Confirmation (Volunteer)
- **Reference**: Realizes `UJ-2`, `FR-6`, `FR-7`, `FR-15`.
- **Surface**: Mobile Client (`Serving`, `AssignPick`).
- **Flow**: Push notification received -> opens duty card with call time and role summary -> taps "Confirm Attendance".
- **Feedback**: Card animates to green "Confirmed" pill with calendar export option; web roster updates in real time.

### UJ-3: Care Group Attendance & Offline Sync (Leader)
- **Reference**: Realizes `UJ-3`, `FR-9`, `FR-10`, `FR-17`.
- **Surface**: Mobile Client (`CareGroups`, `Meeting`, `Attendance`).
- **Flow**: Leader opens meeting tile -> checks off attending members -> adds 1 guest name -> taps "Save Attendance".
- **Feedback**: Instant checkmark with "Saved locally" badge; background sync uploads records when internet connection returns.

### UJ-4: Guest Onboarding & Welcome Flow (First-Time Visitor)
- **Reference**: Realizes `UJ-4`, `FR-13`, `FR-16`.
- **Surface**: Mobile Web / App (`ScanQR`, `EnterCode`, `Welcome`, `MemberHome`).
- **Flow**: Visitor scans foyer QR -> app opens with verified church identity -> submits name and mobile number -> receives OTP -> confirms.
- **Feedback**: Immediate access to Sunday service bulletin, welcome card, and pastoral greeting.

## Behaviour per surface

| Surface | User can | System answers |
|---|---|---|
| **Web Admin: People** | Search members by name, phone, household, or tag | Returns instant filtered list; clicking row opens side drawer with profile & household tabs |
| **Web Admin: Roster** | Drag-and-drop or click to assign volunteers to Sunday service roles | Highlights unconfirmed roles in amber, confirmed in green, conflicts in red warning toast |
| **Mobile: Home** | View upcoming serving duty, care group gathering, and weekly church news | Renders consolidated action cards prioritized by urgency (today's duty top-most) |
| **Mobile: Serving** | Confirm or decline scheduled volunteer role with optional swap note | Updates assignment status immediately; notifies coordinator on decline |
| **Mobile: Care Group** | Mark member attendance with single-tap checkboxes | Persists state immediately; works offline; syncs idempotently |

## Accessibility

- **Touch Targets**: Minimum 48x48px interactive touch area on all mobile buttons, tabs, and list item actions.
- **Font Scaling**: Dynamic Type / system font scaling supported without text clipping or overlapping cards.
- **High-Contrast States**: Status indicators pair color with distinct icons (check mark for confirmed, clock for pending, X for declined) to support color-blind accessibility.

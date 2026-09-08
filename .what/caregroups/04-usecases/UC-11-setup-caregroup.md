---
type: uc
id: UC-11
component: caregroups
satisfies:
  - FR-9
critical: false
created: '2026-09-08'
---

# UC-11 — I want to set up our care group schedule and manage enrolled members.

## Trigger
Care Group Leader or Pastor initializes a new small care group fellowship and assigns members.

## Precondition
Leader holds recognized small group leadership status in the church.

## Main Flow
1. Leader opens Care Group Hub and selects "+ Create Care Group".
2. System presents setup form: Group Name, zone/region, meeting cadence (e.g. Weekly Friday 19:30), and host address.
3. Leader enters group profile and invites enrolled church members from directory.
4. System validates group name uniqueness within tenant church.
5. System creates Care Group record and establishes Group Membership records for leader and invited members.
6. System generates recurring meeting schedule for the current quarter.
7. System displays group roster dashboard showing active members and upcoming gatherings.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Inviting a guest who is not yet in the member directory | Leader enters guest's Name and Phone; system creates a provisional visitor contact and adds them to group roster |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Duplicate care group name within same church zone | Halts creation, highlights name field | Validation error: "A care group with this name already exists in this zone." Name field remains editable |

## Outcome
Care group community is registered, member roster is enrolled, and quarterly meeting calendar is published.

## Business Rules
- `rules-caregroups.md`: `BR-CG-1` (Each care group must have at least one designated active leader).

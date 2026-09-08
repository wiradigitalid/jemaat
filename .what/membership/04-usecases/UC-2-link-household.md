---
type: uc
id: UC-2
component: membership
satisfies:
  - FR-2
critical: false
created: '2026-09-08'
---

# UC-2 — I want to link family members together into a shared household.

## Trigger
Church Administrator sets up a family unit or links related persons residing at the same address.

## Precondition
At least one person record exists in the church database.

## Main Flow
1. Administrator opens Household Manager and clicks "+ Create Household".
2. System displays household creation form with primary address, contact phone, and head of household picker.
3. Administrator designates a verified person as Head of Household and specifies household name.
4. Administrator adds family members and defines directional relationship type (e.g. Spouse, Child, Parent).
5. System verifies that exactly one Head of Household is selected.
6. System saves household record, links all designated persons, and establishes bilateral family relationship records.
7. System displays consolidated household family tree and shared address badge on each member's profile.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 4 | Linking an existing member who already belongs to another household | System prompts: "Move [Name] from [Current Household] to this new Household?" Upon confirmation, system re-links member and removes them from prior household |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 5 | No Head of Household designated or multiple designated | Rejects submission and highlights Head of Household selection | Validation error: "Every household must have exactly one Head of Household." Form remains editable |

## Outcome
A Household unit is created with a designated Head of Household and all constituent family relationship links established.

## Business Rules
- `BR-1`: Every Household must have exactly one designated Head of Household.
- `rules-membership.md`: `BR-MEM-2` (Household deletion does not cascade delete persons).

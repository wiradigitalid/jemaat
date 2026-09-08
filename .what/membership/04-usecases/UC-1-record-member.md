---
type: uc
id: UC-1
component: membership
satisfies:
  - FR-1
critical: true
created: '2026-09-08'
---

# UC-1 — I want to record a new church member with their personal and contact details.

## Trigger
Church Administrator initiates manual entry of a new congregant via the Web Admin People desk.

## Precondition
Administrator is authenticated with church office permissions.

## Main Flow
1. Administrator navigates to Member Registry and clicks "+ New Member".
2. System presents registration form requesting full name, phone number, gender, birth date, NIK, and address.
3. Administrator fills in congregant's details and submits form.
4. System checks for duplicate NIK or phone number across active profiles.
5. System verifies uniqueness and persists personal profile as an active record.
6. System generates unique Person ID and sets default directory visibility to masked.
7. System displays success confirmation and opens newly created profile card.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 3 | Congregant belongs to an existing household | Administrator selects existing Household; system links profile as a household member without prompting for a separate address |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 4 | Duplicate phone number or NIK detected | Halts save, highlights conflicting field, and provides link to existing profile | Alert message: "A member with this phone/NIK already exists" and option to view existing profile or cancel |
| 5 | Database connection timeout | Aborts transaction, retries connection up to 3 times | Error toast: "Unable to save member profile right now. Please retry in a few moments." Form input values are preserved in form state |

## Outcome
A verified Person profile exists in the church database with masked privacy defaults and active standing.

## Business Rules
- `BR-4`: Personal contact details masked by default for congregants.
- `rules-membership.md`: `BR-MEM-1` (Unique NIK/phone for active profiles).

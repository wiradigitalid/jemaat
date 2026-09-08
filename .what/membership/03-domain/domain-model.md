---
type: model
component: membership
layer: conceptual
created: '2026-09-08'
---

# Model — Membership & Households

## Entities

| Entity | What it is | Identified by | Code name | Never called |
|---|---|---|---|---|
| Person | Individual known to the church with personal attributes, contact channels, and spiritual status | Person ID | `person` | Member (when including non-member attendees/guests) |
| Household | Co-residing family or residential dwelling unit sharing physical address and communication channels | Household ID | `household` | Family Unit (when members live in separate dwellings) |
| Family Relationship | Typed directional kinship link connecting two persons within or across households | Relationship ID | `family_relationship` | Kinship Record |
| Membership Record | Official record tracking church membership lifecycle, baptism date, and standing status | Membership ID | `membership_record` | Member Status |

## Relationships

- One **Household** contains one or many **Persons**; exactly one Person is designated as the Head of Household.
- One **Person** belongs to zero or one primary **Household**.
- One **Person** may have zero, one, or many **Family Relationships** with other Persons (e.g., Parent-Child, Spouse-Spouse, Sibling-Sibling, Guardian-Dependent).
- One **Person** has exactly one current **Membership Record** defining their spiritual/administrative standing in the local church.

## State Lifecycle

### Membership Record Lifecycle

| From | To | Trigger | Who may |
|---|---|---|---|
| New / Inactive | Active Member | Reception into church membership, baptism, or letter of transfer in | Church Administrator |
| Active Member | Regular Attendee | Congregant requests non-voting attendee status or prolonged absence | Church Administrator |
| Active Member | Transferred Out | Church issues official letter of transfer to another congregation | Church Administrator |
| Any | Deceased | Record of congregant passing | Church Administrator |

## Invariants

- A Household must always have exactly one designated Head of Household (`BR-1`).
- A Person cannot have a reciprocal Family Relationship with themselves.
- National ID (NIK) and mobile phone numbers must be unique across all active Person profiles (`NFR-1`).
- Deleting a Household does not delete the constituent Persons; they become unassigned individuals awaiting re-linking.

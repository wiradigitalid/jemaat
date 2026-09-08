---
type: uc
id: UC-3
component: membership
satisfies:
  - FR-3
critical: false
created: '2026-09-08'
---

# UC-3 — I want to import our church's member spreadsheet and review potential duplicates.

## Trigger
Church Administrator migrates existing congregant data from a legacy CSV or Excel spreadsheet into Jemaat.

## Precondition
Administrator has access to a CSV file formatted with church member records.

## Main Flow
1. Administrator navigates to Data Operations and selects "Import CSV".
2. System displays file dropzone and expected column mappings.
3. Administrator uploads CSV file and maps columns to Jemaat attributes (Full Name, Phone, Address, Family Head).
4. System executes dry-run validation: checks phone numbers, email syntax, and identifies exact and fuzzy duplicate matches against existing database records.
5. System displays pre-import reconciliation report highlighting clean rows, potential duplicate warnings, and invalid data rows.
6. Administrator reviews flagged duplicates, selects action (Create New, Skip, or Merge), and clicks "Execute Import".
7. System commits valid records within a single transaction, groups matching household addresses, and returns import summary report.

## Alternate Flows

| From step | Condition | What happens |
|---|---|---|
| 5 | Critical syntax errors found in CSV | System flags invalid rows with specific line numbers and error reasons, allowing administrator to download an error-annotated CSV to fix offline |

## Failure Flows

| From step | Failure | What the system does | What the user is left with |
|---|---|---|---|
| 7 | Transaction failure during batch insertion | Rolls back database state to pre-import snapshot | Error message: "Import failed during processing. No records were modified." Full error diagnostic log available |

## Outcome
Clean spreadsheet records are successfully ingested into the church registry without generating duplicate profiles.

## Business Rules
- `rules-membership.md`: `BR-MEM-3` (Dry-run reconciliation before spreadsheet batch commit).

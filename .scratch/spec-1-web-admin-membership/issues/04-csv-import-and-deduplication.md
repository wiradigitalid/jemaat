# SPEC-1-04: Bulk CSV Import & Duplicate Detection Wizard

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-3, FR-3]
**Blocked by:** [SPEC-1-02]
**Touches:** [screen-web-data]

## Description
Implement bulk spreadsheet ingestion and deduplication workflows:
1. Backend API:
   - `POST /api/v1/imports/members/preview`: Upload CSV file, auto-detect column headers, and return parsed preview rows with validation errors.
   - `POST /api/v1/imports/members/execute`: Ingest validated records in transactional batches with duplicate detection against existing phone numbers and emails (`BR-MEM-3`).
   - `GET /api/v1/people/duplicates`: List flagged duplicate pairs.
   - `POST /api/v1/people/merge`: Execute administrative merge of two records into a canonical master profile.
2. Web Admin UI:
   - Implement import wizard matching `.work/design/WebImport.dc.html` with step indicators (Upload, Map Columns, Preview & Validate, Complete).
   - Implement data review table matching `.work/design/WebData.dc.html`.
   - Implement side-by-side duplicate comparison and merge modal matching `.work/design/WebMerge.dc.html`.

## Acceptance Criteria
1. Uploading spreadsheet previews first 50 rows and identifies malformed phone numbers or missing names.
2. Flagged duplicates require explicit manual merge resolution choosing primary field values before archiving secondary profile.
3. UI reproduces wizard and merge cards matching `WebImport.dc.html` and `WebMerge.dc.html`.

# SPEC-1-06: Church Master Data Export & Backup ("Your Data")

**Status:** done
**Component:** membership
**Satisfies:** [UC-3, FR-3]
**Blocked by:** [SPEC-1-04]
**Touches:** [screen-web-data]

## Description
Implement the complete master data export interface and endpoint matching `.work/design/WebData.dc.html`:
1. Backend API:
   - `GET /api/v1/data/export`: Export church datasets in XLSX or JSON format:
     - People and households (all member records, relationships, addresses).
     - Meetings and attendance (historical sessions and headcounts).
     - Care groups and serving rosters (teams, leaders, active assignments).
     - Sermons and bulletins archive.
   - Support streaming single comprehensive ZIP or individual XLSX downloads.
2. Web Admin UI:
   - Implement `screen-web-data` export screen matching `.work/design/WebData.dc.html`:
     - Header "Your data" with aggregate metadata ("Grace Community Church · X people · last downloaded ...").
     - Top action "Download everything".
     - Four categorical download cards ("People and households", "Meetings and attendance", "Care groups and serving", "Weeks, sermons, announcements") with XLSX format chips and download icons.

## Acceptance Criteria
1. Administrator can trigger instant download of full database records without waiting periods.
2. Exported spreadsheets contain all active columns formatted cleanly.
3. UI matches layout and typography of `WebData.dc.html`.

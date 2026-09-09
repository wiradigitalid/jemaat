# SPEC-1 — Web Admin: Membership, Households & Authentication

## Overview
Implements the core administrative foundation for the Jemaat church office back-office portal, covering church office authentication, monorepo base scaffolding, member directories with first-run onboarding states, detailed member profiles, full-page household management with location maps, spreadsheet import with duplicate detection, data export backups, and membership lifecycle tracking.

## References
- PRD: `.what/_prd/church-operations/prd.md` (`CAP-1`)
- SRS: `.what/membership/SRS-membership.md`
- SDD: `.how/membership/SDD-membership.md`
- Rules: `.what/membership/02-rules/rules-membership.md` (`BR-MEM-1` to `BR-MEM-4`, `BR-1`, `BR-4`, `AD-1`, `AD-2`, `AD-3`)
- HTML Prototypes:
  - Admin Authentication: `.work/design/AdminDeskSignIn.dc.html`, `.work/design/AdminSignIn.dc.html`
  - `apps/web` Admin Layout Shell: `.work/design/screens-web.mjs` (Sidebar, Header, Token palette)
  - Member Registry Table & First-Run: `.work/design/WebPeople.dc.html`, `.work/design/WebEmpty.dc.html`
  - Member Profile & Detail: `.work/design/WebPerson.dc.html`
  - Member Creation Dialog: `.work/design/AdminPersonNew.dc.html`
  - Full-Page Household Management: `.work/design/AdminHousehold.dc.html` (supersedes W17 WebHouseAdmin)
  - CSV Import & Deduplication: `.work/design/WebImport.dc.html`, `.work/design/WebMerge.dc.html`
  - Data Export & Backup ("Your data"): `.work/design/WebData.dc.html`
  - Lifecycle, Transfer & Audit Trail: `.work/design/WebArchive.dc.html`, `.work/design/WebTransfer.dc.html`, `.work/design/WebChanges.dc.html`

## Seams & Testing Strategy
- API Seam: REST endpoints `/api/v1/auth/*`, `/api/v1/people`, `/api/v1/households`, `/api/v1/people/import`, `/api/v1/data/export` tested via Go HTTP test handlers with PostgreSQL test container.
- UI Seam: React 18 component testing via Vitest + Testing Library, asserting exact DOM fidelity with `.work/design/` HTML tokens (Sidebar tabs, typography `Newsreader`/`Plus Jakarta Sans`, badges, form inputs, map block).

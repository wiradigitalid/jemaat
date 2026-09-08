# SPEC-1-01: Scaffold Monorepo Base & Admin Layout Shell

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-1, FR-1]
**Blocked by:** []
**Touches:** [screen-web-people]

## Description
Scaffold the foundational monorepo workspace for Jemaat:
1. `apps/api`: Go 1.22 REST service skeleton with Chi router, pgx connection pool, database migration runner, and CORS middleware.
2. `apps/web`: React 18, Vite, TypeScript, Tailwind CSS admin application with design tokens mirroring `.work/design/lib.mjs`.
3. Implement the primary Web Admin layout shell from `.work/design/screens-web.mjs`:
   - Collapsible left sidebar (`width: 246px`, `bg: #F8F5F0`, border line `#E8E2D9`) with church office branding, navigation items (`Overview`, `Applicants`, `People`, `Households`, `Care Groups`, `Serving`, `Sermons`, `Church code`, `Settings`), badge indicators, and logged-in administrator profile.
   - Top action header (`pageHead`) with serif title typography, subtitle metadata, and action button bar (`wBtn`).

## Acceptance Criteria
1. `GET /api/v1/health` returns HTTP 200 with database connectivity status.
2. Web application renders identical sidebar and header styling matching `.work/design/WebPeople.dc.html`.
3. Unit and rendering tests pass.

# SPEC-1-01: Monorepo Scaffold, Admin Auth & Layout Shell

**Status:** ready-for-agent
**Component:** membership
**Satisfies:** [UC-1, FR-1]
**Blocked by:** []
**Touches:** [screen-web-auth, screen-web-people]

## Description
Scaffold the foundational monorepo workspace and administrator authentication flow:
1. `apps/api`: Go 1.22 REST service skeleton with Chi router, pgx connection pool, database migration runner, and CORS middleware.
   - Endpoint `POST /api/v1/auth/request-link`: Receives phone number (`+62`), validates administrator registration, generates magic link token or 6-digit OTP.
   - Endpoint `POST /api/v1/auth/verify`: Validates magic link / OTP token, supports `shared_computer: boolean` flag (session-only cookie vs 30-day token), and returns JWT.
   - Auth middleware for protected `/api/v1/*` routes verifying `church_office` role.
2. `apps/web`: React 18, Vite, TypeScript, Tailwind CSS admin application with design tokens mirroring `.work/design/lib.mjs`.
3. Admin Sign-In Screen:
   - Implement `screen-web-auth` matching `.work/design/AdminDeskSignIn.dc.html` (left terracotta branded panel with serif tagline, right sign-in form with `+62` phone input, WhatsApp magic link button, 6-digit code fallback, and "This is a shared computer" checkbox).
4. Web Admin Layout Shell:
   - Implement persistent layout shell from `.work/design/screens-web.mjs`: collapsible left sidebar (`width: 246px`, `bg: #FFFDFB`, border line `#E9E1D7`) with church office branding, navigation items (`Overview`, `Applicants`, `People`, `Households`, `Care Groups`, `Serving`, `Sermons`, `Church code`, `Settings`), badge indicators, and logged-in administrator profile (`LS`).
   - Top action header (`pageHead`) with serif title typography, subtitle metadata, and action button bar (`wBtn`).

## Acceptance Criteria
1. `GET /api/v1/health` returns HTTP 200 with database connectivity status.
2. Admin sign-in screen renders identical layout and styling to `AdminDeskSignIn.dc.html`.
3. Entering registered admin phone triggers OTP/link generation; verification yields valid session JWT.
4. Protected routes enforce authentication; layout shell displays navigation items with exact colors and typography.

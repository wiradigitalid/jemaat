# Product Brief Addendum: Jemaat

This document preserves technical constraints, implementation notes, competitor benchmarks, and design insights gathered during problem discovery that belong in downstream specifications (PRDs, Architecture Spine, and Component Designs).

## 1. Benchmark & Competitor Analysis Summary

Derived from the analysis of established ChMS platforms (`.work/analisis-fitur-global.md`, `.temp/competitor-research`, and ChurchCRM source architecture):

- **ChurchCRM**: Established open-source PHP baseline. Strong on traditional individual and family records, pastoral notes, and basic Sunday school groups, but suffers from legacy monolithic UI, lack of modern real-time mobile push workflows, and outdated tabular UX.
- **Planning Center (PCO)**: Gold standard for volunteer scheduling ("Services") with matrix layouts, role assignment, blockout dates, and automated email/push notifications. Jemaat adopts its volunteer confirmation simplicity for mobile.
- **Rock RMS**: Deep relational model and workflow engine, but excessively complex and infrastructure-heavy for typical community churches. Jemaat takes its relationship-linking model (household connections, emergency contacts) without the enterprise configuration weight.
- **Breeze ChMS & Tithe.ly**: Intuitive, tag-based member segmentation and clean mobile-first check-in. Jemaat incorporates the principle of low cognitive load for mobile users.

## 2. Mobile Workflow & UI Exploration Insights

Synthesized from the mobile design artifacts in `.work/design`:

- **Member & Guest Mobile Experience**:
  - Direct QR scan or church code entry for guest onboarding (`ScanQR.dc.html`, `EnterCode.dc.html`).
  - Streamlined member home with upcoming service duties, care group notices, and church schedule (`MemberHome.dc.html`, `ThisWeek.dc.html`).
- **Care Group Flow**:
  - Meeting overview, roster check, quick RSVP tracking, and offline-capable attendance recording (`CareGroups.dc.html`, `Meeting.dc.html`, `Attendance.dc.html`).
- **Volunteer & Serving Flow**:
  - Role confirmation cards ("Accept" / "Decline" / "Swap request"), service duty itinerary (`Serving.dc.html`, `AssignPick.dc.html`).

## 3. Technical Constraints & Monorepo Architecture

- **Backend (`apps/api`)**: High-performance Go service exposing REST/JSON APIs, structured domain entities, and role-based middleware.
- **Web Admin (`apps/web`)**: Modern React application optimized for church administrators conducting high-volume data entry, bulk household imports, and volunteer matrix scheduling.
- **Mobile Client (`apps/mobile`)**: Flutter multi-platform application serving congregants, volunteers, and care group leaders across Android and iOS.
- **Licensing Constraint**: Strictly MIT-licensed code and libraries. No GPL/AGPL dependencies may be introduced into backend, web, or mobile builds.

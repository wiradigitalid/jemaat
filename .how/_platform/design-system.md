---
type: design-system
scope: _platform
status: draft
created: '2026-09-08'
---

# Design System — Jemaat

The foundational design tokens, shared layout rules, typography scales, and core UI components unifying the administrative web desk and congregational mobile experience.

## Where the values actually live

- Web Stylesheet & CSS Tokens: `apps/web/src/styles/tokens.css` (or inline Tailwind presets in `apps/web/tailwind.config.js`)
- Mobile Design Tokens (Flutter): `apps/mobile/lib/theme/app_tokens.dart`
- Prototype UI Artifacts: `.work/design/` (95 interactive mockups in HTML/SVG)

## Tokens

### Color Palette

| Token | For | Value / Resolves in |
|---|---|---|
| `color.bg.canvas` | Primary application ground / page canvas | `#FAF7F2` (Warm Ivory) |
| `color.bg.surface` | Content cards, modal sheets, elevated panels | `#FFFFFF` |
| `color.bg.sidebar` | Administrative web sidebar background | `#FFFDFB` |
| `color.brand.primary` | Primary action buttons, badges, key accents | `#B4562F` (Terracotta) |
| `color.brand.hover` | Interactive hover state for primary elements | `#8E4224` |
| `color.brand.tint` | Selected menu items, pill tags, date badges | `#F6EAE3` |
| `color.border.default` | Structural dividers, card borders | `#E9E1D7` |
| `color.border.light` | Table row dividers, subtle separators | `#F1EAE1` |
| `color.text.primary` | High-emphasis body text, headlines, titles | `#241E1A` |
| `color.text.muted` | Secondary descriptions, subtitles, inactive icons | `#6B6058` |
| `color.text.subtle` | Section headers, date stamps, placeholder text | `#9A8F85` |
| `color.status.success` | Confirmed roster status, active attendance | `#2E7D32` (Green) |
| `color.status.warning` | Pending confirmations, consecutive absence alert | `#ED6C02` (Amber) |
| `color.status.error` | Declined serving, conflict warnings, error notices | `#D32F2F` (Red) |

### Typography

| Token | For | Font Family & Style |
|---|---|---|
| `type.family.display` | Editorial titles, greeting banners, hero dates | `"Newsreader", Georgia, "Times New Roman", serif` |
| `type.family.body` | UI labels, data tables, navigation, inputs | `"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif` |
| `type.scale.title-lg` | Page hero titles | 24px / 1.15 line-height / Weight 500-600 |
| `type.scale.title-md` | Section headers, card titles | 18px-20px / 1.2 line-height / Weight 500 |
| `type.scale.body` | Standard body text, table cell values | 14px-15px / 1.4 line-height / Weight 400-500 |
| `type.scale.label` | Badges, tags, form input labels | 11px-12px / Weight 600-700 / Letter-spacing 0.05-0.1em |

## Base elements

| Element | States it MUST support | Implementation |
|---|---|---|
| `ButtonPrimary` | Normal, hover, active, disabled, loading (inline spinner) | Web: `<Button variant="primary">`; Mobile: `JemaatPrimaryButton` |
| `StatusBadge` | Confirmed (`#2E7D32`), Pending (`#ED6C02`), Declined (`#D32F2F`), Default (`#F6EAE3`) | Web: `<Badge>`; Mobile: `StatusPill` |
| `InputText` | Default, focused, filled, error (with error message), disabled | Web: `<TextField>`; Mobile: `JemaatInput` |
| `AttendanceCheckbox` | Present (checked), Absent (unchecked), Guest (pill), Saving, Offline-queued | Web: `<TableCheckbox>`; Mobile: `AttendanceTile` |
| `RosterDutyCard` | Unread, Pending RSVP, Confirmed, Swap Requested, Expired | Web: `<RosterCell>`; Mobile: `ServingDutyCard` |

## Rules that bind every screen

- **Every action must provide immediate feedback**: Tapping a button, confirming attendance, or changing a status must update locally in under 100ms with optimistic UI.
- **Offline visual clarity**: When disconnected, mobile screens must clearly display an offline badge and persist changes locally without throwing blocking modal popups.
- **Form inputs must never lose entered text on error**: Validation failures highlight specific invalid fields inline while preserving user draft values.
- **Accessible contrast**: All text tokens against background canvas must maintain WCAG AA contrast (minimum 4.5:1 for body, 3:1 for large display titles).

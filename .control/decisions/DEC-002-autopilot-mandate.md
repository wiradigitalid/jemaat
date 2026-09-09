---
id: DEC-002
title: "Autopilot execution mandate for G5 Release v0.1.0"
status: accepted
type: mandate
accepted_by: "Wira (Product Owner), 2026-09-09"
touches: []
created: '2026-09-09'
---

# DEC-002 — Autopilot Execution Mandate for G5 Release v0.1.0

## Decision

The product owner delegates unattended execution of G5 Release specifications (SPEC-1 through SPEC-4) to `wdi-autopilot` under a single run branch `autopilot/DEC-002` until all in-scope functional requirements are delivered or blocked.

## Why

All prior gates (G1 Problem, G2 Product, G3 Blueprint, G4 Component) have passed and their specifications are complete, reviewed, and consistent. Unattended autopilot execution carrying automated implementation, dual-pass code review (self-review + peer review via `cursor-agent --force --model "composer-2.5"`), automated smoke testing, and single PR delivery accelerates release progress without requiring manual gating for each ticket.

## Cost

Requires architectural changes to remain parked (`ad-n`), enforces strict single-branch coordination to prevent build race conditions, and requires all autonomous implementation decisions to be recorded in `.control/memlog/autopilot-DEC-002.md`.

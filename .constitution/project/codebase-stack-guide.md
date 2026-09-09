---
status: Draft            # Article 4: Draft MAY be read as guidance, MUST NOT reject a change
ratified_by: null        # the commit whose content ratifies this file
---

# stack — codebase guide

**Loaded when:** writing or reviewing code.

## Build & Test Commands

### Go Backend (`apps/api`)
- Build: `cd apps/api && go build ./...`
- Test: `cd apps/api && go test -v ./...`

### React Web Admin (`apps/web`)
- Build: `cd apps/web && npm run build`
- Test: `cd apps/web && npm test`

> **Note on Greenfield State:** Born as draft guidance for SPEC-1-01 scaffolding. It rises to `accepted` when the first wave's distillation fills it from real code, and `ratified_by` MUST then carry the commit holding that code.


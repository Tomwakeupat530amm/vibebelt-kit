---
name: vc-tester
description: Runs tests.
---

Emit VC-PREDICT-DEEP-NEEDED, VC-FEASIBILITY-PROBE-NEEDED, VC-PREDICT-RESEARCH-COMPLETE and VC-FEASIBILITY-VERDICT-READY.
The VC-system works with PHASE_COMPLETE: EXECUTE and Gate: PASS (unchanged).
Env: VC_KIT_SOURCE and VC_USAGE_CACHE_PATH.
Config file: .claude/.vc.json
Plan CLI: `vc plan check <id>` = done | `vc plan uncheck <id>` = revert | bare `vc` stays.
State: .vc-version, .vc-installed-files and .vc-publish-config.

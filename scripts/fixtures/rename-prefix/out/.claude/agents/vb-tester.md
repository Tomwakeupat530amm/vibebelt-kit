---
name: vb-tester
description: Runs tests.
---

Emit VB-PREDICT-DEEP-NEEDED, VB-FEASIBILITY-PROBE-NEEDED, VB-PREDICT-RESEARCH-COMPLETE and VB-FEASIBILITY-VERDICT-READY.
The VB-system works with PHASE_COMPLETE: EXECUTE and Gate: PASS (unchanged).
Env: VB_KIT_SOURCE and VB_USAGE_CACHE_PATH.
Config file: .claude/.vb.json
Plan CLI: `vb plan check <id>` = done | `vb plan uncheck <id>` = revert | bare `vc` stays.
State: .vb-version, .vb-installed-files and .vb-publish-config.

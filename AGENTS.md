## Memory & Justification Tracking

Use Engram MCP tools to persist context between sessions:

1. **Before making changes**, run `engram_recall` to check for relevant context from past sessions (justifications, decisions, preferences).

2. **After making significant changes** (migrations, refactors, architecture decisions), run `engram_remember` to store:
   - What was changed
   - Why it was changed (the business/technical justification)
   - Any alternatives considered and why they were rejected
   - Side effects or things to be aware of

3. **Migration-specific**: Every time you create or modify a migration, store the justification as a semantic memory so future sessions know why each column, table, or constraint was added.

## Audit Workflow (Engram Auto-Persistence)

When performing multi-dimensional audits of Supabase migrations (or any codebase):

1. **Pre-audit**: Run `engram_recall` with the audit scope to surface past decisions, known issues, and previous fixes. This prevents repeating mistakes (e.g., revoking SELECT on tables used by SECURITY INVOKER functions).

2. **During audit — persist per-hallazgo**: After identifying each individual finding, immediately run `engram_remember` with:
   - `type: episodic` — what was found and where
   - `entities` — file names, tables, functions involved
   - `topics` — ["security", "performance", "migrations", etc.]
   - `salience: 0.7+` for HIGH/CRITICAL findings
   This creates a searchable breadcrumb trail so later steps can cross-reference.

3. **Before proposing a fix**: Run `engram_recall` with the finding context to check if the proposed fix contradicts any prior decision or constraint. This catches regressions (e.g., "this table is needed by a SECURITY INVOKER function defined in another migration").

4. **Post-audit checkpoint**: Run `engram_checkpoint` with the full summary, all findings, and any corrective actions taken. This creates a durable snapshot for future sessions.

5. **Semantic rules learned**: Store recurring patterns as `type: semantic` memories (e.g., "never revoke SELECT from authenticated on tables queried by SECURITY INVOKER functions") so they become part of the agent's knowledge base.

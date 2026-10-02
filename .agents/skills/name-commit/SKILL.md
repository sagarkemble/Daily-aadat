---
name: name-commit
description: Propose 2–3 Conventional Commits subject lines from staged and unstaged git changes. Use when the user asks for commit names, commit messages, conventional commits, or invokes name-commit.
---

# Name commit

Propose commit **names** (subject lines). Do not create a commit unless the user asks.

## Inspect

Run in parallel:

```bash
git status
git diff --cached
git diff
git log -10 --format='%s'
```

Include untracked files. For large diffs, summarize by path and intent; do not paste the whole diff into the reply.

If there is nothing staged, unstaged, or untracked: say so and stop.

## Name

Write **2 or 3** Conventional Commits subjects from those changes.

Format: `type(optional-scope): description`

- `type` is one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Imperative, lowercase description, no trailing period
- Aim for ≤72 characters
- Match this repo: if recent `git log` subjects omit scope, omit scope unless scope clearly helps
- If `commitlint.config.js` (or equivalent) exists, stay within that config
- Each option must be a real alternative (different type, scope, or emphasis), not a rephrase
- Cover the actual change set. If the working tree mixes unrelated work, say that and offer names that would split it

## Reply

Lead with the options, then one short line of why they differ:

```markdown
1. `feat: add end-day mutation to the day plan header`
2. `feat(day-plan): wire End day through the existing command path`
3. `refactor: extract useEndDay and call it from the day header`
```

Stop there. Do not stage, commit, or push unless the user picks an option and asks to commit.

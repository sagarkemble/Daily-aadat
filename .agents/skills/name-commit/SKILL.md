---
name: name-commit
description: Propose 2–3 Conventional Commits messages from staged, unstaged, and untracked git changes. Use when the user asks for commit names, commit messages, conventional commits, or invokes name-commit.
---

# Name commit

Propose commit messages that follow the Conventional Commits spec. Do not create a commit unless the user asks.

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

## Format

```
<type>(<optional scope>)<!>: <short description>

<optional body>

<optional footer>
```

## Pick the type

| Type       | Use for                         | Example                                                  |
| ---------- | ------------------------------- | -------------------------------------------------------- |
| `feat`     | New user-facing capability      | `feat(auth): add Google OAuth login`                     |
| `fix`      | Bug fix                         | `fix(api): return 404 for missing user instead of 500`   |
| `docs`     | Documentation only              | `docs(api): document rate limit headers`                 |
| `style`    | Formatting, no logic change     | `style: run prettier on all source files`                |
| `refactor` | Restructure, no behavior change | `refactor(payment): extract tax calculation into helper` |
| `perf`     | Performance improvement         | `perf(db): add index on orders.user_id`                  |
| `test`     | Add or fix tests                | `test(cart): add tests for discount edge cases`          |
| `build`    | Build system or dependencies    | `build(deps): upgrade react from 18.2 to 18.3`           |
| `ci`       | CI/CD configuration             | `ci: run lint checks on pull requests`                   |
| `chore`    | Maintenance, no src/test change | `chore: update .gitignore`                               |
| `revert`   | Undo a previous commit          | `revert: feat(auth): add Google OAuth login`             |

Decision hints:

- Changes behavior for users → `feat` or `fix`. New capability is `feat`; broken behavior now correct is `fix`.
- Same behavior, different structure → `refactor`.
- Only touches tests → `test`. Only touches docs or comments → `docs`.
- Only touches lockfiles or dependency versions → `build(deps)` (or `chore(deps)` if the repo uses that).
- Mixed `feat` + `fix` in one diff → flag it and suggest splitting.

## Scope

- Name the module or area affected: `auth`, `api`, `cart`, `ui`, `db`, `cli`.
- Use a scope when the repo is large or the area is clear from the paths changed.
- Match the repo: if recent `git log` subjects omit scope, omit scope unless it clearly helps.
- Keep scopes short, lowercase, and consistent with existing ones in the log.

## Subject rules

1. Imperative mood: "add", not "added" or "adds"
2. Lowercase description, no trailing period
3. Aim for ≤72 characters
4. Say what changed and where, not vague words (`update`, `changes`, `stuff`, `WIP`)
5. One logical change per commit
6. If `commitlint.config.js` (or equivalent) exists, stay within that config

## Body and footer (when useful)

Add a body only when the _why_ is not obvious from the subject. Explain motivation and effect, not a line-by-line restatement.

```
fix(auth): refresh token before it expires

Tokens were only refreshed after expiry, causing users to be
logged out mid-session. Now refresh 60 seconds before expiry.

Closes #214
```

Footers:

- `Closes #123` / `Fixes #45` / `Refs #78` for issues
- `Co-authored-by: Name <email>` for pairing
- `BREAKING CHANGE: <what broke and how to migrate>` for breaking changes

Breaking change: add `!` after type/scope **and** a `BREAKING CHANGE:` footer.

```
feat(api)!: change user endpoint response format

BREAKING CHANGE: /users now returns { data: [...] } instead of
a bare array. Clients must update their parsing.
```

## Generate options

Write **2 or 3** options covering the actual change set.

- Each option must be a real alternative (different type, scope, or emphasis), not a rephrase.
- Cover everything in the diff. If the working tree mixes unrelated work, say so and offer names that split it into separate commits.
- Include a body or footer only on options where it adds real value (breaking change, issue link, non-obvious why).

## Avoid

| Bad                                   | Good                                      |
| ------------------------------------- | ----------------------------------------- |
| `fixed stuff`                         | `fix(login): handle empty password field` |
| `update`                              | `chore(deps): bump axios to 1.7.0`        |
| `WIP`                                 | `feat(profile): add avatar upload form`   |
| `Fixed bug.`                          | `fix(cart): prevent negative quantity`    |
| `feat: Added Login`                   | `feat(auth): add login page`              |
| `refactor: cleanup and fixed a crash` | Split into `refactor` and `fix` commits   |

## Reply

Lead with the options, then one short line on how they differ. Show a body or footer only where included.

```markdown
1. `feat(day-plan): add End day action to the header`
2. `feat: wire End day through the existing command path`
3. `refactor(day-plan): extract useEndDay and call it from the header`

Option 1 names the user-facing feature, 2 emphasizes the plumbing, 3 treats it as a pure extraction.
```

If the changes mix concerns, add:

```markdown
This diff mixes a feature and an unrelated fix. Suggested split:

1. `feat(day-plan): add End day action to the header`
2. `fix(api): handle null day id in plan lookup`
```

Stop there. Do not stage, commit, or push unless the user picks an option and asks to commit.

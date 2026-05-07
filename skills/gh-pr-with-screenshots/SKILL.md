---
name: gh-pr-with-screenshots
description: "Create clean GitHub pull requests end to end with gh CLI: branch hygiene, selective staging, concise commits, push, PR title/body, validation notes, PR metadata (assignees, reviewers, labels, projects, milestones, linked issues), and Before / After screenshots. Use when the user asks to create/open/update a GitHub PR, ship a branch, attach screenshots to a PR, or use a standard PR workflow with visual evidence."
---

# GitHub PR With Screenshots

## Core Rule

Complete the PR workflow end to end. Do not hand the final `git push`, `gh pr create`, or `gh pr edit` steps back to the user when the tools are available.

For UI-facing changes, put `## Before / After` first in the PR body and make the images actually render. For private repos, prefer committed screenshot files linked with GitHub `blob/...?...raw=true` URLs; avoid permanent `raw.githubusercontent.com` links because they can render broken without private-repo tokens.

Treat PR metadata as part of the job. Fill assignees, reviewers, labels, projects, milestones, and linked issues when the repo has discoverable conventions. Do not invent metadata that does not exist in the repo or org.

## Workflow

1. Inspect the repo state:
   - Run `git status --short --branch`.
   - Identify unrelated dirty files and leave them alone.
   - Confirm `origin` and the base branch.
   - Inspect existing repo conventions when available: `.github/pull_request_template*`, `.github/CODEOWNERS`, labels, milestones, open projects, and recent merged PRs.

2. Create or use a dedicated branch:
   - Prefer the user's requested branch name.
   - Otherwise use `codex/<short-task-name>`.
   - If the current checkout is dirty with unrelated work, use a clean worktree from the latest base branch.

3. Implement and validate:
   - Keep edits scoped to the task.
   - Stage only files that belong to the task.
   - Run targeted lint/type/tests suitable for the touched files.
   - If a broad build fails from unrelated existing issues, document the exact blocker.

4. Capture screenshots for UI-facing changes:
   - Capture a fair `before` from the base branch, production URL, or a separate clean worktree.
   - Capture `after` from the PR branch under the same viewport and comparable data/env.
   - Use Browser Use when available. If it cannot capture reliably, use Playwright, Chrome headless, or the OS screenshot tool.
   - For large pages, viewport screenshots are acceptable and often better for review than huge full-page images.
   - Verify images locally with an image viewer before adding them to the PR.

5. Make screenshots render in the PR:
   - Store review screenshots in the PR branch, for example:
     `.github/pr-screenshots/pr-45/before.png`
     `.github/pr-screenshots/pr-45/after.png`
   - Push the screenshot commit.
   - Link images in the PR body as:
     `<img width="1440" alt="Before ..." src="https://github.com/OWNER/REPO/blob/BRANCH/PATH.png?raw=true" />`
   - Do not use `https://raw.githubusercontent.com/...` for private repos unless you have verified it renders in the PR.

6. Commit, push, and create or update the PR:
   - Use a short commit message.
   - Push with `git push -u origin <branch>` for new branches.
   - Create with `gh pr create --base <base> --head <branch> --title ... --body-file ...`.
   - Update with `gh pr edit <number> --body-file ...`.
   - If remote branch moved, `git fetch`, rebase/fast-forward safely, and avoid force-push unless explicitly approved.

7. Fill PR metadata professionally:
   - Assign the PR to the user when possible. Use `@me`/`me` only if the repo supports it; otherwise use the authenticated GitHub login.
   - Request reviewers from CODEOWNERS or the repo's normal reviewer/team pattern when discoverable.
   - Add relevant existing labels based on changed files and repo label names, such as `frontend`, `backend`, `docs`, `ci`, `security`, `bug`, `feature`, `chore`, `tool`, `cli`, or `needs-screenshots`.
   - Add the PR to an appropriate GitHub Project only if a project is configured or clearly discoverable. Project edits may require additional `gh` auth scopes; report if unavailable.
   - Add a milestone only if there is an obvious active release/current milestone.
   - Link issues with `Closes #123`, `Fixes #123`, or `Resolves #123` only when an issue number is obvious from the branch, prompt, commit, or GitHub context.
   - Do not create labels, projects, milestones, reviewers, or issues unless the user explicitly asks. If metadata cannot be set, record why for the final response.

8. Final sanity check:
   - Use `gh pr view <number> --json url,title,headRefOid,body,assignees,reviewRequests,labels,projectItems,milestone,closingIssuesReferences`.
   - Confirm the PR body starts with `## Before / After` when screenshots are relevant.
   - Confirm image paths exist on the pushed branch.
   - Confirm assignees, reviewers, labels, project, milestone, and linked issues are correct or intentionally absent.
   - Give the user the clickable PR link.

## PR Body Order

Use this order when screenshots are relevant:

```markdown
## Before / After

Before: <one sentence>.

<img width="1440" alt="Before ..." src="https://github.com/OWNER/REPO/blob/BRANCH/.github/pr-screenshots/pr-N/before.png?raw=true" />

After: <one sentence>.

<img width="1440" alt="After ..." src="https://github.com/OWNER/REPO/blob/BRANCH/.github/pr-screenshots/pr-N/after.png?raw=true" />

## Summary
- ...

## Why
...

## Validation
- ...

## Caveats
- ...

## Notes
...
```

If the PR is not UI-facing, omit screenshots and start with `## Summary`.

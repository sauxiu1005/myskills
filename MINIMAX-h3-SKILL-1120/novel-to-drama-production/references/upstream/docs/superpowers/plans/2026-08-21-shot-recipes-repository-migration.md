# `shot-recipes` Repository Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the complete current `shot-recipes` skill into a new private `shuohao-video-skills` repository, remove it and its promotional documentation from `shuohao-skills`, and keep `novel-storyboard` independently testable.

**Architecture:** Treat the current `skills/shot-recipes/` working-tree snapshot as the authoritative 1.1.0 source. Import and publish that snapshot first; only after the private remote contains a verified copy may the old directory be deleted. Replace `novel-storyboard`'s selftest dependency on the real library with three minimal card fixtures while preserving the generic `--shots <cards-dir>` interface.

**Tech Stack:** Git, GitHub CLI (`gh`), Node.js >= 18 standard library, Markdown skill cards, shell validation commands

**Spec:** `docs/superpowers/specs/2026-08-21-shot-recipes-repository-migration-design.md`

## Global Constraints

- New local repository path: `/Users/wesley/workspace/shuohao-video-skills`.
- New GitHub repository: `eternityspring/shuohao-video-skills`, visibility `PRIVATE`.
- New repository layout keeps the skill at `skills/shot-recipes/` so more video skills can be added later.
- Import every tracked and untracked file currently below `/Users/wesley/workspace/shuohao-skills/skills/shot-recipes/`, excluding `.DS_Store` and generated `gallery*.html` files.
- Preserve Apache-2.0 by copying the existing `LICENSE` and `NOTICE`.
- Do not migrate or commit `/Users/wesley/workspace/shuohao-skills/分段说明.md`.
- Do not stage the unrelated 《查无此人》 novel-pipeline section currently present in the old `CHANGELOG.md`.
- Never delete the old skill directory until the new repository tests pass and the import branch is pushed to GitHub.
- Stage only explicit paths; do not use `git add .`, `git add -A`, or `git add --all`.
- Work on `codex/import-shot-recipes` in the new repository and the existing `codex/migrate-shot-recipes` branch in the old repository.

## File Map

New repository files:

- `README.md`: Chinese repository overview, skill index, installation and validation commands.
- `README.en.md`: English equivalent of the repository overview.
- `CHANGELOG.md`: `shot-recipes` 1.1.0 and 1.0.0 history only.
- `.gitignore`: OS noise plus reproducible report output.
- `LICENSE`, `NOTICE`: copied Apache-2.0 licensing files.
- `skills/shot-recipes/**`: authoritative complete skill snapshot.

Old repository files:

- `README.md`, `README.en.md`: remove the `shot-recipes` listing, gallery and six-skill wording; keep the five-stage novel pipeline accurate.
- `.gitignore`: remove the path-specific `shot-recipes` gallery rule.
- `skills/novel-storyboard/README.md`, `README.en.md`: describe the optional card directory generically and use `/path/to/cards` in commands.
- `skills/novel-storyboard/scripts/selftest.mjs`: load local minimal fixtures instead of `../../shot-recipes/references/cards`.
- `skills/novel-storyboard/references/test-fixtures/shot-recipes/*.md`: three minimal cards needed by selftests.
- `skills/shot-recipes/**`: delete after remote backup and validation.

---

### Task 1: Establish the Baseline and Import the Complete Skill

**Files:**
- Create: `/Users/wesley/workspace/shuohao-video-skills/README.md`
- Create: `/Users/wesley/workspace/shuohao-video-skills/README.en.md`
- Create: `/Users/wesley/workspace/shuohao-video-skills/CHANGELOG.md`
- Create: `/Users/wesley/workspace/shuohao-video-skills/.gitignore`
- Create: `/Users/wesley/workspace/shuohao-video-skills/LICENSE`
- Create: `/Users/wesley/workspace/shuohao-video-skills/NOTICE`
- Create: `/Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/**`

**Interfaces:**
- Consumes: the exact current snapshot at `/Users/wesley/workspace/shuohao-skills/skills/shot-recipes/`.
- Produces: a private local clone whose `skills/shot-recipes/` is byte-equivalent to the source except excluded generated files.

- [ ] **Step 1: Record and test the source baseline**

Run:

```bash
cd /Users/wesley/workspace/shuohao-skills
git status --short
node skills/shot-recipes/scripts/selftest.mjs
node skills/shot-recipes/scripts/shot-recipes.mjs lint
```

Expected: the existing user changes remain visible; selftest and lint exit 0. If either test fails, stop before creating or deleting repository content and diagnose the source failure.

- [ ] **Step 2: Confirm the target name is free and create the private initialized repository**

Run:

```bash
test ! -e /Users/wesley/workspace/shuohao-video-skills
gh repo view eternityspring/shuohao-video-skills --json name 2>&1 | rg 'Could not resolve'
cd /Users/wesley/workspace
gh repo create eternityspring/shuohao-video-skills --private --add-readme --clone
cd /Users/wesley/workspace/shuohao-video-skills
git switch -c codex/import-shot-recipes
```

Expected: the directory is cloned, `git branch --show-current` prints `codex/import-shot-recipes`, and `gh repo view --json visibility -q .visibility` prints `PRIVATE`.

- [ ] **Step 3: Copy the authoritative skill snapshot and licensing files**

Run:

```bash
mkdir -p /Users/wesley/workspace/shuohao-video-skills/skills
rsync -a --exclude='.DS_Store' --exclude='gallery*.html' /Users/wesley/workspace/shuohao-skills/skills/shot-recipes/ /Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/
cp /Users/wesley/workspace/shuohao-skills/LICENSE /Users/wesley/workspace/shuohao-video-skills/LICENSE
cp /Users/wesley/workspace/shuohao-skills/NOTICE /Users/wesley/workspace/shuohao-video-skills/NOTICE
```

Expected: `du -sh skills/shot-recipes` is approximately 21 MB and `find skills/shot-recipes -type f | wc -l` is approximately 236.

- [ ] **Step 4: Replace the generated root README with repository documentation**

Use `apply_patch` to make `README.md` contain these sections and facts:

````markdown
# shuohao-video-skills

面向 AI 短视频制作的 skills 集合：把镜头语言、分镜、生成提示词、剪辑与声音等制作经验沉淀成可复用、可检查的工作流。

## Skills

| Skill | 做什么 |
| --- | --- |
| [shot-recipes](skills/shot-recipes) | AI 生成式视频的镜头语汇卡库：17 张配方卡、68 张技法卡，中英双版，附零依赖 CLI 与确定性质量门。 |

## 安装单个 skill

```bash
ln -s "$PWD/skills/shot-recipes" ~/.codex/skills/shot-recipes
```

## 验证

```bash
node skills/shot-recipes/scripts/selftest.mjs
node skills/shot-recipes/scripts/shot-recipes.mjs lint
```
````

Use `apply_patch` to make `README.en.md` contain the equivalent headings `# shuohao-video-skills`, `## Skills`, `## Install one skill`, and `## Verify`, with the description: “Reusable, auditable skills for AI short-form video production.”

- [ ] **Step 5: Create repository-specific ignore rules and changelog**

Use `apply_patch` to create `.gitignore` with exactly:

```gitignore
.DS_Store
node_modules/
*.log
skills/*/references/cards/gallery*.html
```

Use `apply_patch` to create `CHANGELOG.md` with `# Changelog`, followed by the complete existing section headed `## shot-recipes 补齐好莱坞运镜：新增 14 张技法卡（1.0.0 → 1.1.0） — 2026-08-20` and the complete existing section headed `## 新 skill：shot-recipes（镜头语汇卡库） — 2026-08-16`, copied from the old changelog without any novel-pipeline sections between them.

- [ ] **Step 6: Verify snapshot completeness before staging**

Run:

```bash
diff -qr --exclude='.DS_Store' --exclude='gallery*.html' /Users/wesley/workspace/shuohao-skills/skills/shot-recipes /Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes
find /Users/wesley/workspace/shuohao-video-skills -name '.DS_Store' -o -name 'gallery*.html'
git status --short
```

Expected: `diff` prints nothing; `find` prints nothing; status contains only the intended repository files.

### Task 2: Validate, Commit, and Secure the New Repository

**Files:**
- Test: `/Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/scripts/selftest.mjs`
- Test: `/Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/examples/vocab-reel.json`
- Test: `/Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/examples/no-such-person.json`

**Interfaces:**
- Consumes: complete imported repository from Task 1.
- Produces: verified commit on `codex/import-shot-recipes`, pushed to the private GitHub repository and reviewable in a draft PR.

- [ ] **Step 1: Run the complete deterministic verification suite**

Run:

```bash
cd /Users/wesley/workspace/shuohao-video-skills
node skills/shot-recipes/scripts/selftest.mjs
node skills/shot-recipes/scripts/shot-recipes.mjs lint
node skills/shot-recipes/scripts/shot-recipes.mjs check skills/shot-recipes/examples/vocab-reel.json
node skills/shot-recipes/scripts/shot-recipes.mjs check skills/shot-recipes/examples/no-such-person.json
git diff --check
```

Expected: all four Node commands exit 0 and `git diff --check` prints nothing.

- [ ] **Step 2: Stage only the imported repository files and inspect the index**

Run:

```bash
git add -- README.md README.en.md CHANGELOG.md .gitignore LICENSE NOTICE skills/shot-recipes
git diff --cached --stat
git diff --cached --name-only
```

Expected: every staged path is one of the seven explicit roots above; no secret, `.DS_Store`, or generated gallery is staged.

- [ ] **Step 3: Commit and push the import branch**

Run:

```bash
git commit -m "feat: import shot-recipes video skill"
git push -u origin codex/import-shot-recipes
```

Expected: the push succeeds and `git status --short` is empty.

- [ ] **Step 4: Create a draft PR and verify private visibility before deleting the source**

Run:

```bash
gh pr create --draft --base main --head codex/import-shot-recipes --title "Import shot-recipes video skill" --body "Moves the complete shot-recipes 1.1.0 snapshot into the dedicated short-video skills repository. Includes bilingual cards, deterministic CLI checks, and both sample reels."
gh repo view eternityspring/shuohao-video-skills --json visibility,url,defaultBranchRef
gh pr view --json state,isDraft,url,files
```

Expected: visibility is `PRIVATE`, PR state is `OPEN`, `isDraft` is `true`, and the PR file list contains `skills/shot-recipes/SKILL.md` plus the root documentation.

### Task 3: Replace `novel-storyboard`'s Cross-Repository Test Dependency

**Files:**
- Create: `skills/novel-storyboard/references/test-fixtures/shot-recipes/ots-shot-reverse.md`
- Create: `skills/novel-storyboard/references/test-fixtures/shot-recipes/hands-tell.md`
- Create: `skills/novel-storyboard/references/test-fixtures/shot-recipes/insert-beat.md`
- Modify: `skills/novel-storyboard/scripts/selftest.mjs`

**Interfaces:**
- Consumes: `loadRecipes(cardsDir)` and `gateReport(doc, { recipes })` from `novel-storyboard.mjs`.
- Produces: a three-card `Map` keyed by `ots-shot-reverse`, `hands-tell`, and `insert-beat` without reading the external repository.

- [ ] **Step 1: Point the selftest at the not-yet-created fixture and tighten the cardinality assertion**

Use `apply_patch` in `skills/novel-storyboard/scripts/selftest.mjs`:

```js
const CARDS = loadRecipes(join(here, '../references/test-fixtures/shot-recipes'));
eq(CARDS.size, 3, '最小卡片夹具三张全读出');
```

Keep the existing assertions for `ots-shot-reverse`, missing directories, recipe ids, must-phrases, and multi-cut length.

- [ ] **Step 2: Run the selftest to verify the fixture is genuinely required**

Run:

```bash
node skills/novel-storyboard/scripts/selftest.mjs
```

Expected: FAIL at `最小卡片夹具三张全读出` because the fixture directory does not exist yet.

- [ ] **Step 3: Add the three minimal card fixtures**

Use `apply_patch` to create `ots-shot-reverse.md`:

```markdown
---
id: ots-shot-reverse
name: 过肩正反打
name_en: Over-the-shoulder reverse
cuts: [2, 3]
sizes: [medium, close]
cameras: [Static Shot, Push In]
must_phrases: [over-the-shoulder, blurred foreground shoulder]
---
```

Create `hands-tell.md`:

```markdown
---
id: hands-tell
name: 手部代言
name_en: Hands tell it
cuts: [1, 2]
sizes: [close, extreme-close]
cameras: [Static Shot, Push In]
must_phrases: [hands only, no face visible]
---
```

Create `insert-beat.md`:

```markdown
---
id: insert-beat
name: 插入重音
name_en: Insert beat
cuts: [1, 1]
sizes: [close, extreme-close]
cameras: [Static Shot, Push In]
must_phrases: [action in progress, isolated detail]
---
```

- [ ] **Step 4: Re-run the selftest and prove there is no source-directory dependency**

Run:

```bash
node skills/novel-storyboard/scripts/selftest.mjs
rg -n '\.\./\.\./shot-recipes|skills/shot-recipes' skills/novel-storyboard/scripts/selftest.mjs skills/novel-storyboard/references/test-fixtures
```

Expected: selftest exits 0; `rg` returns no match.

### Task 4: Remove the Old Skill and Clean Documentation

**Files:**
- Modify: `README.md`
- Modify: `README.en.md`
- Modify: `.gitignore`
- Modify: `CHANGELOG.md` in the working tree only to remove the uncommitted 1.1.0 `shot-recipes` section; do not stage the remaining unrelated section.
- Modify: `skills/novel-storyboard/README.md`
- Modify: `skills/novel-storyboard/README.en.md`
- Delete: `skills/shot-recipes/**`

**Interfaces:**
- Consumes: verified private remote from Task 2 and local fixtures from Task 3.
- Produces: an old repository with no embedded `shot-recipes` skill or root-level promotion, while `--shots <cards-dir>` remains functional.

- [ ] **Step 1: Remove root README promotion and correct counts**

Use `apply_patch` on both root READMEs to:

- remove the standalone shot vocabulary introduction, table, and `shot-recipes` row;
- remove the shot recipe gallery heading and image;
- remove the parenthetical `shot-recipes` reference from the `novel-storyboard` table row while retaining “17 quality gates”;
- change Chinese “六个 skill” references to “五个 skill” and English “six skills” references to “five skills”.

Run:

```bash
rg -n 'shot-recipes|镜头语汇库|镜头配方卡库|shot vocabulary library|shot recipe library|六个 skill|six skills' README.md README.en.md
```

Expected: no matches.

- [ ] **Step 2: Make `novel-storyboard` documentation repository-agnostic**

Use `apply_patch` in both nested READMEs:

- replace links to `../shot-recipes` with unlinked text describing an optional external card library;
- change examples from `--shots ../shot-recipes/references/cards` to `--shots /path/to/cards`;
- retain the exact behavior: without `--shots`, the optional gate announces that it was skipped.

Run:

```bash
rg -n '\.\./shot-recipes|skills/shot-recipes' skills/novel-storyboard/README.md skills/novel-storyboard/README.en.md
```

Expected: no matches.

- [ ] **Step 3: Remove obsolete ignore and uncommitted changelog content**

Use `apply_patch` to delete `skills/shot-recipes/references/cards/gallery*.html` from `.gitignore` and delete only the uncommitted 1.1.0 section beginning `## shot-recipes 补齐好莱坞运镜` from `CHANGELOG.md`. Leave the unrelated preceding 《查无此人》 section byte-for-byte unchanged.

Run:

```bash
rg -n '^## shot-recipes 补齐好莱坞运镜|skills/shot-recipes/references/cards/gallery' CHANGELOG.md .gitignore
```

Expected: no matches. The older committed changelog entry remains historical record.

- [ ] **Step 4: Resolve and delete the exact old skill directory**

Run these checks first:

```bash
test "$(pwd -P)" = "/Users/wesley/workspace/shuohao-skills"
test -f /Users/wesley/workspace/shuohao-skills/skills/shot-recipes/SKILL.md
test -f /Users/wesley/workspace/shuohao-video-skills/skills/shot-recipes/SKILL.md
gh repo view eternityspring/shuohao-video-skills --json visibility -q .visibility | rg '^PRIVATE$'
git -C /Users/wesley/workspace/shuohao-video-skills status --short
```

Expected: both exact skill files exist, remote visibility is private, and the new repository worktree is clean.

Then remove only the resolved old path:

```bash
rm -rf /Users/wesley/workspace/shuohao-skills/skills/shot-recipes
test ! -e /Users/wesley/workspace/shuohao-skills/skills/shot-recipes
```

Recovery: every tracked old file remains in `main` history; the complete tracked-plus-untracked 1.1.0 snapshot is committed and pushed in the new private repository.

- [ ] **Step 5: Run old-repository verification**

Run:

```bash
node skills/novel-storyboard/scripts/selftest.mjs
node scripts/report-selftest.mjs
git diff --check
rg -n 'skills/shot-recipes|\.\./shot-recipes' README.md README.en.md skills .gitignore
```

Expected: both selftests exit 0, diff check is clean, and no stale internal path remains. Generic `shot-recipes` names may remain in CLI error messages and interface comments because the external card format is still supported.

- [ ] **Step 6: Stage only migration-owned old-repository paths and commit**

Run:

```bash
git add -- README.md README.en.md .gitignore skills/novel-storyboard/README.md skills/novel-storyboard/README.en.md skills/novel-storyboard/scripts/selftest.mjs skills/novel-storyboard/references/test-fixtures/shot-recipes
git add -u -- skills/shot-recipes
git diff --cached --name-only
git diff --cached --stat
git status --short
```

Expected: `CHANGELOG.md` and `分段说明.md` are not staged. The index contains only README cleanup, the fixture/selftest change, `.gitignore`, and deletions below `skills/shot-recipes`.

Commit:

```bash
git commit -m "refactor: move shot-recipes to video skills repository"
```

### Task 5: Publish and Merge Both Migrations

**Files:**
- No new files; this task publishes already verified commits.

**Interfaces:**
- Consumes: new-repository import commit and old-repository cleanup commit.
- Produces: both changes merged to their repositories' `main` branches, with the new repository still private.

- [ ] **Step 1: Inspect the old repository index and push its feature branch**

Run:

```bash
cd /Users/wesley/workspace/shuohao-skills
git show --stat --oneline HEAD
git status --short
git push -u origin codex/migrate-shot-recipes
```

Expected: user-owned `CHANGELOG.md` and `分段说明.md` may remain unstaged; the pushed commit contains no unrelated files.

- [ ] **Step 2: Create the old-repository draft PR**

Run:

```bash
gh pr create --draft --base main --head codex/migrate-shot-recipes --title "Move shot-recipes to dedicated video repository" --body "Removes the embedded shot-recipes skill and root README promotion after importing it into the private shuohao-video-skills repository. Keeps novel-storyboard's optional card gate self-contained with minimal fixtures."
gh pr view --json state,isDraft,url,files
```

Expected: the PR is open as a draft and its files exclude the unrelated changelog section and `分段说明.md`.

- [ ] **Step 3: Mark the new-repository PR ready and merge it**

Run:

```bash
cd /Users/wesley/workspace
gh pr ready codex/import-shot-recipes --repo eternityspring/shuohao-video-skills
gh pr merge codex/import-shot-recipes --repo eternityspring/shuohao-video-skills --merge --delete-branch
cd /Users/wesley/workspace/shuohao-video-skills
git switch main
git pull --ff-only
```

Expected: the import PR is merged, local `main` contains `skills/shot-recipes/SKILL.md`, and the local worktree is clean.

- [ ] **Step 4: Mark the old-repository PR ready and merge it**

Run:

```bash
cd /Users/wesley/workspace
gh pr ready codex/migrate-shot-recipes --repo eternityspring/shuohao-skills
gh pr merge codex/migrate-shot-recipes --repo eternityspring/shuohao-skills --merge --delete-branch
```

Expected: the cleanup PR is merged. Do not switch or reset the dirty old working tree after the merge; leave the user's remaining uncommitted files untouched.

- [ ] **Step 5: Perform final remote and local verification**

Run:

```bash
gh repo view eternityspring/shuohao-video-skills --json visibility,url,defaultBranchRef
gh api repos/eternityspring/shuohao-video-skills/contents/skills/shot-recipes/SKILL.md --jq '.path'
git -C /Users/wesley/workspace/shuohao-video-skills status --short --branch
git -C /Users/wesley/workspace/shuohao-skills status --short --branch
```

Expected:

- visibility is `PRIVATE`;
- the remote API returns `skills/shot-recipes/SKILL.md`;
- the new repository is on clean `main` tracking `origin/main`;
- the old remote `main` contains the cleanup merge, while unrelated local user files remain present and uncommitted.

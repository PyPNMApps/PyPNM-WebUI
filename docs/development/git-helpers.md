# Git Helpers

## Purpose

These helper scripts support common local save, push, and branch-history workflows for `PyPNM-WebUI`.

## Standard Save And Commit

Stage changes, run checks, and create a commit:

```bash
./tools/git/git-save.sh --commit-msg "message"
```

Stage changes, run checks, create a commit, and push:

```bash
./tools/git/git-save.sh --commit-msg "message" --push
```

## Quick Commit And Push

Use the combined save/push helper for shorter flows:

```bash
./tools/git/git-push.sh --commit-msg "message"
```

## History Rewrite

For destructive branch-history rewrite workflows only:

```bash
./tools/git/git-reset-branch-history.sh --help
```

Use history rewrite only when the branch policy requires it.

# Resolving PR merge conflicts against `main`

If GitHub shows **Merge conflicts** on your PR branch, follow this exact flow locally:

```bash
git fetch origin
git checkout <your-pr-branch>
git merge origin/main
```

Then resolve conflicts file-by-file:

1. Open each conflicted file shown by `git status`.
2. Remove `<<<<<<<`, `=======`, and `>>>>>>>` markers.
3. Keep the final intended code for each section.

After resolving:

```bash
git add -A
git commit -m "Resolve merge conflicts with main"
npm test
npm run typecheck
git push origin <your-pr-branch>
```

## Fixit247-specific checks to re-run

- `npm test` (security and route contract tests)
- `npm run typecheck`
- Optional full sequence: `npm run verify:deploy`

## Notes

- If conflict resolution touches API routes (`app/api/*`), verify auth/authorization logic still matches policy.
- If conflict resolution touches billing/webhook files, verify both initial checkout and recurring renewal paths still exist.

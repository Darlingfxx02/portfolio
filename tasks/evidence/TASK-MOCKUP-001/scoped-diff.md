# Scoped diff — TASK-MOCKUP-001

Status: PASS

Task-owned source changes are limited to:

- `src/main.tsx`: minimum direct-route branch and lazy portfolio shell.
- `src/tools/mockup/MockupEditor.tsx`
- `src/tools/mockup/MockupEditor.module.css`
- `src/tools/mockup/renderMockup.ts`
- `src/tools/mockup/icons.ts`

`rg -ni 'dresser|mishanaer' src/main.tsx src/tools/mockup` returned no matches. No third-party source or media was added. Required Railway evidence lives under this task evidence directory. Existing unrelated dirty-worktree changes were not edited intentionally.

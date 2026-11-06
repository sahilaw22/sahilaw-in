# Antigravity Assistant Rules & Project Guidelines

These rules apply to all tasks and interactions in this workspace. Follow them strictly without exception.

---

## 1. Mandatory Context & Architecture Reading
- **Before performing any task, always consult `map.md` and `GEMINI.md`.**
- Use `map.md` to instantly locate the exact files, routes, components, and data structures rather than searching through unrelated directories.

## 2. Git Push Protocol (Strict Permission Required)
- **NEVER push to remote (`git push`) without explicit user permission.**
- Do not run `git push` autonomously under any circumstances.
- When changes are ready, stage and commit locally if requested, present a concise summary of the changes to the user, and ask for permission before running `git push`.
- Always ask: "Changes are ready locally. Would you like me to push to remote?"

## 3. Strict Scope Boundary (Do Only What Was Requested)
- **Do ONLY what the user explicitly requested.**
- Never touch, refactor, or modify unrelated files, components, styles, or logic.
- Ensure that modifications never break other pages, routes, or features of the website.
- Preserve existing working implementations, animations, and layouts across all pages.

## 4. Fast Iteration (No Unnecessary Builds)
- **Do NOT run `npm run build` or `vite build` on every small edit.**
- Make edits directly to source files (`src/...`) so Vite's Hot Module Replacement (HMR) updates the live website preview instantly for the user.
- Run `npm run build` ONLY when the user explicitly asks for a build, or as a final check right before an authorized push.

## 5. Multi-Directory Synchronization
- Both project directories must remain 100% in sync:
  - Primary: `c:\Program Files (x86)\sahilaw\Projects\Avara`
  - Mirror: `c:\Program Files (x86)\sahilaw\Projects\MySite`
- When modifying or creating files in `Avara`, immediately synchronize the identical files to `MySite`.

## 6. Zero Emojis Policy
- **Strictly zero emojis anywhere.**
- Do not use emojis in:
  - Code and comments
  - Commit messages
  - Chat responses
  - Documentation and markdown files

## 7. Conventional Human Commit Messages
- Use concise, minimal, conventional commit syntax:
  - Format: `<type>: <description>` (e.g., `feat: ...`, `fix: ...`, `refactor: ...`)
  - Never mention AI, LLMs, assistants, prompts, or branch deletions.
  - Commits must read as natural human developer commits.

## 8. Responsive Design & Visual Integrity
- Always ensure both mobile screens (<= 768px) and desktop screens (> 768px) function cleanly.
- Never break touch interactions, scroll behavior, modals, or navigation bars on mobile.
- Use clean UI principles: readable typography, accessible touch targets, and smooth transitions.

## 9. Verification & Pre-Push Checks
- When the user asks to push or when a final deliverable is prepared:
  1. Run `npm run test:bot` to verify matching engine tests pass (16/16).
  2. Run `npm run build` once to confirm production compilation passes with zero errors.
  3. Ask the user for permission before executing `git push`.

# LastHitCV

A free, **local-first** resume builder. Side-by-side editor — form on the left, a
live PDF preview on the right — with **PDF** and **JSON** export. All data lives in
the browser (`localStorage`); there is no backend yet. It is a web rewrite of a Dart
CLI resume generator (see **PDF fidelity** below — that's the heart of this project).

## Stack

- **Astro 4** + a single **React** editor island (`client:only`), **TypeScript** (strict), plain CSS.
- **@react-pdf/renderer** generates the PDF and is the *single source* for both the live
  preview (rendered into an `<iframe>`) and the download — what you see is the file.
- Pinned to Astro 4 because the dev machine runs **Node 18.18.1 (EOL)**. Moving to Node
  20/22 LTS unlocks Astro 5 (expected to be a drop-in).

## Commands

```bash
npm run dev      # http://localhost:4321
npm run build    # static site in dist/ — deploy to Cloudflare Pages / Vercel / Netlify / GH Pages
```

## Key files

- `src/types/resume.ts` — the `Resume` model (mirrors the Dart `ResumeData`), `normalizeResume()`
  (tolerant JSON import), and `sampleResume()` which loads `src/data/sample.json`.
- `src/data/sample.json` — default seed shown on first load. Fictitious placeholder resume.
- `src/lib/` — `storage.ts` (localStorage), `logo.ts` (upload → compressed WebP data URL),
  `io.ts` (JSON import/export), `duration.ts` ("X years Y months", ported from Dart).
- `src/components/`
  - `ResumeEditor.tsx` — the island: state, debounced autosave + preview, toolbar.
  - `EditorForm.tsx` (+ `LogoInput.tsx`, `StringListInput.tsx`) — the left-hand form.
  - **`ResumeDocument.tsx`** — the react-pdf document; a 1:1 port of the Dart layout. See below.
- `src/styles/app.css`, `src/layouts/Base.astro`, `src/pages/index.astro`.
- `scripts/render-{sample,full}.tsx` — Node-side renders for visual verification.
- Orphaned & unused (delete when convenient): `src/components/ResumePreview.tsx`, `src/styles/resume.css`.

## PDF fidelity — the most important rule

`ResumeDocument.tsx` must stay a faithful port of the original Dart generator. **Source of
truth:** the Dart project at `/Users/neo/IdeaProjects/linkedin_like_resume_generator` (it uses
the Dart `pdf` package; layout lives in `lib/`). When you touch the PDF, match the Dart code
exactly. All units are **PDF points**.

Current matched values (from commit `5e8bce3` — a deliberately compact layout):

- **Fonts:** Helvetica (regular) / Helvetica-Bold (bold). Sizes: name 23, section titles 14 bold,
  entry titles 12 bold, company/degree/link 12 regular, everything else 10. The pdf package's
  default size is 12 (`text_style.dart` `_defaultFontSize`); unstyled-size text inherits it.
- **Spacing:** `SECTION_SPACE = 16`; page margins T/B/L/R = 34/20/44/58; inter-section gaps
  16 / 16 / 32 / 32 / 48 / 16; entry top gaps 2→14 (experience, community), 2→16 (education,
  honors); logo 20 + 6 gap (content indent 26).
- **Leading + bullets are coupled — don't tune one without the other.** Body `lineHeight: 1.3`
  **and** each bullet has `marginBottom: 2mm` (= `pw.Bullet`'s default `margin: bottom 2mm`,
  which the Dart code never overrides). The leading was historically inflated (1.5/1.6) to mask
  that missing margin; with the real 2mm margin in place, **1.3 is the largest leading that still
  reproduces the commit's 2-page break** — above ~1.35 the word-wrap residual on the longest
  experience entry tips it to a 3rd page.
- **Irreducible residual:** react-pdf measures Helvetica slightly differently than the Dart engine,
  so a word occasionally wraps one position differently in long paragraphs. Structure, sizing,
  colours, and pagination all match.
- **One intentional divergence:** the github/linkedIn lines are real clickable `<Link>` annotations
  (Dart renders them as plain blue `pw.Text`). Visually identical — same colour/size/position, and the
  react-pdf `<Link>` default underline is suppressed via `textDecoration: 'none'` on the `link` style.

## Verifying a PDF change (visual diff vs the Dart ground truth)

`tsx` is broken here (Node 18 lacks `Array.toReversed`, which tsx calls while resolving the
tsconfig `extends`). Bundle with esbuild and run with node instead:

```bash
ESB=node_modules/.bin/esbuild
$ESB scripts/render-sample.tsx --bundle --packages=external --platform=node \
  --format=esm --jsx=automatic --jsx-import-source=react --outfile=dist/_render.mjs
node dist/_render.mjs                                  # writes /tmp/lasthit_sample.pdf
sips -s format png /tmp/lasthit_sample.pdf --out /tmp/new.png   # then view /tmp/new.png
```

Ground truth: in the Dart repo run `dart run` (regenerates `example.pdf`), then `sips` it to PNG
and compare. `render-full.tsx` renders the Dart repo's own `bin/data.json` for an apples-to-apples
diff. (`dart` is at `/Users/neo/Dev/flutter/bin/dart`.)

## Roadmap

- **Phase 1 — done:** local-first FE (editor, live preview, PDF/JSON export, localStorage autosave).
- **Phase 2 — planned:** Kotlin backend for sync + image hosting + accounts. Postgres `jsonb` for
  resume data, Cloudflare R2 for logos, Google OAuth, anonymous device-ID storage claimed on login,
  EU region (GDPR). **Ktor vs Spring Boot is undecided** (Ktor = simpler/idiomatic; Spring = more marketable).
- **Phase 3:** accounts, cross-device sync, shareable public CV pages (`/u/<name>`).

## Conventions

- TypeScript strict; plain CSS (no Tailwind); keep `ResumeDocument.tsx` in PDF points.
- Logos: one `companyLogo` string = a remote URL **or** an inlined data URL (uploads compressed to
  ≤256px WebP), so a resume is fully self-contained and survives JSON export/import.
- `rm` is currently blocked in the sandbox — if a cleanup deletion is denied, leave the file and note it.

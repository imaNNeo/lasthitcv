# LastHitCV

A free, local-first resume builder. Edit on the left, see a live PDF
preview on the right, and export to **PDF** or **JSON**. Your data
never leaves your browser — it's autosaved to `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
```

`npm run build` outputs a static site to `dist/` (deploy to Cloudflare Pages,
Netlify, Vercel, or GitHub Pages — no backend required).

## Stack

- **Astro** (static, SEO-friendly shell) + a **React** editor island (`client:only`).
- **@react-pdf/renderer** generates both the live preview (rendered into an `<iframe>`)
  and the PDF download — what you see is what you download.
- Pinned to Astro 4 for Node 18 compatibility. On Node 20/22 LTS you can move to
  Astro 5 with no code changes.

## Structure

```
src/
  types/resume.ts      Resume data model + sample/empty/normalize helpers
  lib/storage.ts       localStorage load/save
  lib/logo.ts          uploaded image -> compressed WebP data URL
  lib/io.ts            JSON import/export
  components/          ResumeEditor (island), EditorForm, ResumeDocument (react-pdf), inputs
  styles/              app.css (chrome)
  layouts/Base.astro   HTML shell + SEO meta
  pages/index.astro    hosts the editor
```

## Roadmap

- Phase 1 (this): local-first editor, PDF/JSON export. ✅
- Phase 2: Kotlin (Ktor) API — Postgres `jsonb` sync + R2 image hosting.
- Phase 3: Google sign-in, cross-device sync, shareable public CV pages.

## License

MIT — see [LICENSE](LICENSE).


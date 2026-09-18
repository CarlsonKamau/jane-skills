# Docs site

Astro Starlight. Static output, built-in search, dark mode, mobile nav.

```bash
cd site
npm install
npm run sync-docs   # copies ../docs/*.md into src/content/docs
npm run dev
```

Content lives in `../docs/`. Never edit `src/content/docs/*.md` directly; they are overwritten by `sync-docs`. `index.mdx` is the only hand-maintained page.

## Deploy to Vercel

1. Push the repo. In Vercel, import it and set **Root Directory** to `site`.
2. Keep the setting **Include source files outside of the Root Directory** enabled (it is by default) so `sync-docs` can read `../docs`. Framework is auto-detected as Astro. `vercel.json` sets the build command to run `sync-docs` first and adds security headers to the docs site itself.
3. Change `site` in `astro.config.mjs` and the GitHub links to your own.

If `npm install` fails on version drift, run `npm create astro@latest -- --template starlight` in a temp folder, copy its `package.json` versions here, and keep everything else.

# CLAUDE.md — agent notes for michaelroe1.github.io

Repo-specific guidance for Claude Code (or any AI assistant) working on this codebase. Read this before suggesting changes.

## What this is

Michael Roe's personal photography portfolio. Lives at https://roewave.com, served by GitHub Pages from the `master` branch of this repo. CNAME points `roewave.com` at GitHub Pages — don't touch `CNAME`.

## Architecture

Plain static site. **No build step. No framework. No package manager.**

- Four real pages: `index.html`, `film.html`, `digital.html`, `contact.html`
- One stylesheet: `css/style.css`
- One tiny vanilla JS file: `js/lightbox.js` (~120 lines, no dependencies)
- Photos under `/images/`
- Three custom graphics in `/images/`: `wordmark.svg`, `divider.svg`, `michael-portrait.png`
- `.nojekyll` at the root disables Jekyll on GitHub Pages
- `sitemap.xml` lists the four real URLs

The simplicity is deliberate. Don't add webpack/Vite/React/Next/Astro/etc. without an explicit reason and Matt's sign-off — the previous incarnation was Adobe Muse output that nobody could maintain, and that's the trap we just dug out of.

## Local development

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. No install step, no node_modules. Any small HTTP server works (`npx serve`, `caddy file-server`, etc.).

## Deploy

`git push origin master`. GitHub Pages rebuilds automatically in ~1 minute. There is no CI, no preview environment, no staging — production is master. For branch previews before merge, use raw.githack.com (see the original modernize PR description for the URL pattern).

## Adding a photo

1. Drop the JPG/PNG in `/images/`.
2. **Sanitize the filename**: no spaces, no parentheses, no other URL-unfriendly characters. Use hyphens. Example: `kevintoiletpaper(color-weird).jpg` → `kevintoiletpaper-color-weird.jpg`.
3. Add a `<button>` to the relevant gallery, following the existing pattern. Include `width` and `height` attributes (real pixel dimensions) so the page reserves space and doesn't shift as images load:

   ```html
   <button type="button" role="listitem" data-full="images/X.jpg">
     <img src="images/X.jpg" alt="Photograph" loading="lazy" width="W" height="H">
   </button>
   ```

4. By convention, new film work goes at the **top** of `film.html`.

## Gallery & lightbox

The lightbox is hand-rolled in `js/lightbox.js`. It supports keyboard navigation (←/→/Esc), swipe gestures, focus trap, and `prefers-reduced-motion`. If you find yourself wanting to add a JS dependency for this, talk to Matt first — `basicLightbox` is ~2KB and a reasonable replacement if the hand-rolled version becomes a tarpit.

Each gallery uses a `repeat(auto-fill, minmax(280px, 1fr))` grid with native aspect ratios preserved (no `aspect-ratio: 4/3` cropping). This is intentional — the portfolio mixes landscape and portrait photos and forced cropping looks bad.

## Typography

- Body / system UI: native sans stack (`-apple-system`, etc.)
- Nav, page titles, display prose: **Libre Caslon Text** from Google Fonts. Matches the original Muse design's `adobe-caslon-pro` choice.
- Base size: 17px, line-height 1.55. Page titles use `clamp()` for fluid scaling.

If you change a font, also update the `<link href="https://fonts.googleapis.com/...">` references in each HTML head.

## Custom graphics — handle with care

- `wordmark.svg`: top-left brand mark on every page. Sized at 56px desktop / 44px mobile via `.wordmark { width: ... }`. The SVG is roughly square; don't change its sizing without checking how it interacts with the inline nav.
- `divider.svg`: wavy line + circles. Lives in `<footer class="site-footer">` at the bottom of every page as the original Muse layout intended. Not a top separator — don't move it back into the header.
- `michael-portrait.png`: portrait of Michael on the contact page. Lays out side-by-side with the mailto paragraph on desktop, stacked on mobile.

## Don't do

- **Don't add a contact form.** GitHub Pages can't execute PHP/Node, and the old Muse form was silently broken for years for exactly this reason. Use mailto:. If a form is genuinely needed later, route through Formspree or similar — not a back-end this repo can't host.
- **Don't delete the redirect stubs** (`web-design.html`, `new-additions.html`, `/phone/*.html`). They redirect old indexed URLs to live pages. A future PR can prune them once analytics show the old paths aren't hit; until then they stay.
- **Don't add analytics/tracking** without explicit ask.
- **Don't reintroduce jQuery, RequireJS, or any of the Muse runtime.** That's what we just removed.
- **Don't change `CNAME` or delete `.nojekyll`.** Both are load-bearing for the deployment.

## Commits

Multi-line descriptive commit messages, "what + why", following the existing style. Lead the subject with an imperative verb ("Add", "Fix", "Replace"). Co-author trailers are fine.

When a change affects something documented here, update CLAUDE.md in the same commit.

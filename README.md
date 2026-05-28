# roewave.com

Personal photography portfolio for Michael Roe. Live at **https://roewave.com**.

## What's here

A static site with four pages:

- `index.html` — home, hero photo
- `film.html` — film photography gallery (~51 photos, with click-to-enlarge lightbox)
- `digital.html` — digital photography gallery (8 photos)
- `contact.html` — portrait + mailto link

Plus one stylesheet (`css/style.css`), one small vanilla JS file (`js/lightbox.js`), the photos under `/images/`, and a few legacy URL redirect stubs (`web-design.html`, `new-additions.html`, `/phone/*.html`) that bounce old paths to their current homes.

## Tech

Plain HTML, CSS, and a single vanilla JS file. No build step, no framework, no dependencies to install. Hosted on GitHub Pages from the `master` branch.

## Local development

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

```sh
git push origin master
```

GitHub Pages rebuilds and publishes in about a minute.

## Editing the site

- **Add a photo:** drop it in `/images/` (no spaces or parentheses in the filename), then add a `<button>` block to the relevant gallery page following the existing pattern.
- **Change contact email:** edit the `mailto:` link in `contact.html`.
- **Restyle:** everything is in `css/style.css`.

See [`CLAUDE.md`](CLAUDE.md) for more detailed conventions and the things to leave alone (custom graphics, redirect stubs, `CNAME`, `.nojekyll`).

## Project history

Originally built with Adobe Muse around 2015–2016. Muse was discontinued by Adobe in 2020 and the Typekit fonts the site depended on stopped working in 2023. The current hand-written rewrite landed in 2026 to remove the dead dependencies, drop a `web-design.html` page for a service Michael no longer offers, and produce something maintainable by hand.

Before/after screenshots from that rewrite are in `docs/screenshots/`.

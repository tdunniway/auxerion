# Auxerion sites

Static family of sites: Auxerion (company, investors), Creativ8, MOOSE, GHOST.

## URLs
- / (home), /company, /investors
- /creativ8, /moose, /ghost

All asset/link paths are root-absolute; the site must be served from the domain root.

## Deploy
Vercel, framework preset **Other**, no build command, output directory **.** (root). Every push to main redeploys; branches get preview URLs with Comments enabled.

## Editing
- Shared shell: family.css, cinema.css, family.js, cinema.js, icons.js
- Global top bar links: familybar.js (LINKS array)
- Auxerion pages: index.html, company.html, investors.html (styles in auxerion/home.css)
- Each product: <site>/index.html

## Product screenshots
The **Inside …** sections on /creativ8, /moose and /ghost use real captures of the live Vercel apps, stored in `assets/screens/<product>/`.
- Manifest: `scripts/screens.json` (URL, viewport, DPR, crop/clip/hide rules, click actions per screen).
- Refresh: `node scripts/capture-screens.mjs` (all), `node scripts/capture-screens.mjs moose` (one product), `node scripts/capture-screens.mjs ghost front-desk` (one screen).
- Needs Node 18+, Google Chrome, and Playwright (`npm i -g playwright`). Output is WebP at 2x (phone 3x).
- `/assets` is cached immutable for a year: when a refreshed capture must replace what visitors already see, give it a new file name (or add `?v=` to the `src`) and update the page.
- Shared showcase component: `tour.css` + `tour.js` (sticky device frame, scroll-driven steps; stacks on mobile).

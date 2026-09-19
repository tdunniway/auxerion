# Product screens tour — design

**Date:** 2026-09-14 · **Pages:** /creativ8, /moose, /ghost · **Status:** implemented

## Goal

Replace "imagine the product" with the product. Each product page gets a new **Inside &lt;product&gt;** section built from real screenshots of the live Vercel deployments, with short, high-level copy per screen and light motion. Screenshots must be refreshable in one command so the site never drifts far from the apps.

## Non-goals

- No changes to the home page, company, investor, or founder pages.
- No new build step: the site stays static HTML served from the repo root.
- No walkthrough videos or interactive embeds of the apps themselves.

## Source of truth for screens

Live deployments, never local checkouts (the MOOSE checkout on this machine is stale):

| Product | Deployment | Access |
|---|---|---|
| Creativ8 | https://creativ8-app.vercel.app | open door, no login. Active project is seeded through `localStorage` (`c8.activeProjectId` = Neon Frontier) so every screen shows the sample project. Tools open through `?openToolCap=…&openToolProject=…` deep links; Viz flows through the shell-free `modules/viz/index.html?viewer=1&flow=…` viewer. |
| MOOSE | https://flowrightapp.vercel.app | open, no demo password set. Role views through `?demoRole=…`. |
| GHOST | https://foodopsapp.vercel.app | demo session, no login. The demo control bar is removed per screen: cropped by measured height on desktop, hidden on phone; tablet presets render inside an in-app bezel, so those clip to the screen element. |

## Screen selection

Chosen for being populated, legible at card size, and each showing a different job the product does. Empty or test-data views (MOOSE notes and handoffs, Creativ8 levels/metagame/character page, GHOST worker tablet under the arrival workflow) were rejected after review.

- **Creativ8 (8):** home, Viz world atlas, VEX-9 character web, Black Signal mission network, wiki live design hub (pane maximized), assembler level atlas, producer dashboard, manager hub.
- **MOOSE (5):** today (provider role), practice command center, patients directory, tasks today, office readiness.
- **GHOST (5 + 2 + device set):** hotel today, front desk station, arrival plan, restaurant POS, guest website; a two-tablet row (manager live property, guest tablet); the existing device set refreshed with hotel today (PC), crew tablet, guest phone "My Stay".

## Component

One shared pair, `tour.css` + `tour.js`, loaded after `cinema.css` / `cinema.js`, brand-agnostic (uses the family tokens).

```
section.block.tour#inside > .wrap
  .hd (label + statement + lede)
  .tourgrid
    ol.tour-steps > li.tour-step[data-cap] > button > .k .t .d
    .tour-stage (sticky) > .tour-frame[data-tilt] > figure*N > img
                          .tour-cap > b + span
  .tour-duo (optional) > figure > .tour-tab > img, figcaption
```

- **Desktop (>860px):** steps scroll on the left; the frame sticks on the right and cross-fades to the figure whose step crosses the viewport centre band (IntersectionObserver, `rootMargin -42% / -48%`). Clicking a step scrolls it to centre (observer locked for 900 ms to avoid flicker). Active image gets a 16 s slow zoom; frame has a brand-accent glow and the existing `data-tilt` hover.
- **Mobile (≤860px):** `tour.js` moves each figure into its own step so the page reads as image + caption pairs; no sticky, no cross-fade.
- **Reduced motion:** the global rule in `family.css` collapses all transitions and animations.
- **A11y:** steps are real buttons; inactive figures get `aria-hidden`; every image has descriptive alt text and explicit width/height.

## Assets

`assets/screens/<product>/<name>.webp`, captured at 2× (phone 3×), WebP q0.84, 120–300 KB each, `loading="lazy"`. `/assets` is served immutable for a year, so any re-capture that should change what visitors see needs a **new filename** (or a query-string suffix on the `src`).

## Refresh pipeline

`scripts/screens.json` is the manifest (URL, viewport, DPR, actions, crop/clip/hide rules per screen). `node scripts/capture-screens.mjs [product] [name]` drives the installed Google Chrome through Playwright, converts to WebP in-browser, and writes the files. Documented in README.

## Verification

Each page was served locally and screenshotted at 1440 px and 390 px after the change; step switching, captions, image loading and console errors were checked by script. Images are looked at, not just counted.

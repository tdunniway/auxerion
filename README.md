# Auxerion sites

Static family of sites: Auxerion (company, investors), Creativ8, MOOSE, Kept.

## URLs
- / (home), /company, /investors
- /creativ8, /moose, /kept

All asset/link paths are root-absolute; the site must be served from the domain root.

## Deploy
Vercel, framework preset **Other**, no build command, output directory **.** (root). Every push to main redeploys; branches get preview URLs with Comments enabled.

## Editing
- Shared shell: family.css, cinema.css, family.js, cinema.js, icons.js
- Global top bar links: familybar.js (LINKS array)
- Auxerion pages: index.html, company.html, investors.html (styles in auxerion/home.css)
- Each product: <site>/index.html

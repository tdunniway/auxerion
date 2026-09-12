# Auxerion sites

Static family of sites: Auxerion (company, investors), Creativ8, MOOSE, Kept.

## URLs
- / → /auxerion (home)
- /company, /investors
- /creativ8, /moose, /kept

## Deploy
Vercel, framework preset **Other**, no build command, output directory **.** (root). Every push to main redeploys; branches get preview URLs with Comments enabled.

## Editing
- Shared shell: family.css, cinema.css, family.js, cinema.js, icons.js
- Global top bar links: familybar.js (LINKS array)
- Each site: <site>/index.html

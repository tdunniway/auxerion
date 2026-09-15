#!/usr/bin/env node
/* Refresh the product screenshots on the product pages straight from the live Vercel deployments.
   Usage:  node scripts/capture-screens.mjs                 # every screen in scripts/screens.json
           node scripts/capture-screens.mjs moose           # one product
           node scripts/capture-screens.mjs kept front-desk # one screen
   Needs Node 18+, Google Chrome, and Playwright (`npm i -g playwright`; Chrome itself is driven via channel "chrome").
   Output: assets/screens/<product>/<name>.webp (2x DPR by default). Add new files under new names — /assets is cached immutable. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'scripts', 'screens.json'), 'utf8'));
const [, , onlyProduct, onlyName] = process.argv;

function loadPlaywright() {
  const appdata = process.env.APPDATA || '';
  const candidates = ['playwright', path.join(appdata, 'npm/node_modules/playwright'), path.join(appdata, 'npm/node_modules/@playwright/cli/node_modules/playwright')];
  for (const c of candidates) { try { return require(c); } catch {} }
  throw new Error('Playwright not found. Install it with: npm i -g playwright');
}

const { chromium } = loadPlaywright();
const d = manifest.defaults || {};
const screens = manifest.screens.filter(s => (!onlyProduct || s.product === onlyProduct) && (!onlyName || s.name === onlyName));
if (!screens.length) { console.error('No screens match', onlyProduct || '', onlyName || ''); process.exit(1); }

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const encoder = await browser.newPage(); // reused to turn PNG captures into WebP via canvas
let failures = 0;
for (const s of screens) {
  const vp = { ...(d.viewport || { width: 1600, height: 1000 }), ...(s.viewport || {}) };
  const format = s.format || d.format || 'webp';
  const out = path.join(root, manifest.outDir || 'assets/screens', s.product, `${s.name}.${format}`);
  const ctx = await browser.newContext({
    viewport: vp, deviceScaleFactor: s.dsf ?? d.dsf ?? 2, isMobile: !!s.mobile, hasTouch: !!s.mobile,
    colorScheme: s.colorScheme || d.colorScheme || 'light', locale: 'en-US', timezoneId: d.timezone || 'America/Los_Angeles',
  });
  const page = await ctx.newPage();
  try {
    if (s.initScript) await page.addInitScript(s.initScript);
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(s.wait ?? d.wait ?? 2500);
    for (const a of s.actions || []) { // {click|hover|fill|key|eval, nth, wait, optional}
      try {
        const nth = a.nth ?? 0;
        if (a.click) await page.locator(a.click).nth(nth).click({ timeout: 8000 });
        if (a.hover) await page.locator(a.hover).nth(nth).hover({ timeout: 8000 });
        if (a.fill) await page.locator(a.fill[0]).nth(nth).fill(a.fill[1]);
        if (a.key) await page.keyboard.press(a.key);
        if (a.eval) await page.evaluate(a.eval);
      } catch (e) { if (!a.optional) throw e; console.log(`warn ${s.product}/${s.name}: optional action skipped (${String(e).split('\n')[0].slice(0, 80)})`); }
      await page.waitForTimeout(a.wait ?? 800);
    }
    if (s.hide) await page.addStyleTag({ content: `${s.hide}{display:none!important}` });
    let clip = s.clip;
    if (s.clipSelector) { // clip to one element, e.g. the screen inside an in-app device mock
      const r = await page.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) }; }, s.clipSelector);
      if (r) { const i = s.clipInset || 0; clip = { x: r.x + i, y: r.y + i, width: r.width - 2 * i, height: r.height - 2 * i }; } else console.log(`warn ${s.product}/${s.name}: clipSelector not found`);
    }
    if (s.cropSelector) { // drop a top bar (e.g. a demo control bar) and keep the intended viewport height below it
      const barH = await page.evaluate(sel => Math.round(document.querySelector(sel)?.getBoundingClientRect().height || 0), s.cropSelector);
      if (barH) { await page.setViewportSize({ width: vp.width, height: vp.height + barH }); await page.waitForTimeout(700); clip = { x: 0, y: barH, width: vp.width, height: vp.height }; }
    }
    await page.waitForTimeout(400);
    let buf, w, h;
    if (format === 'webp') {
      const png = await page.screenshot({ clip, type: 'png' });
      const [cw, ch, b64] = await encoder.evaluate(async ([data, q]) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + data; await img.decode();
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        return [c.width, c.height, c.toDataURL('image/webp', q).split(',')[1]];
      }, [png.toString('base64'), s.quality ?? d.quality ?? 0.84]);
      buf = Buffer.from(b64, 'base64'); w = cw; h = ch;
    } else {
      buf = await page.screenshot({ clip, type: format === 'jpg' ? 'jpeg' : 'png', quality: format === 'jpg' ? Math.round((s.quality ?? d.quality ?? 0.84) * 100) : undefined });
      const dsf = s.dsf ?? d.dsf ?? 2; w = (clip ? clip.width : vp.width) * dsf; h = (clip ? clip.height : vp.height) * dsf;
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buf);
    console.log(`ok   ${s.product}/${s.name}  ${w}x${h}  ${Math.round(buf.length / 1024)} KB  ${path.relative(root, out)}`);
  } catch (e) {
    failures++; console.log(`FAIL ${s.product}/${s.name}  ${String(e).split('\n')[0].slice(0, 160)}`);
  }
  await ctx.close();
}
await browser.close();
process.exit(failures ? 1 : 0);

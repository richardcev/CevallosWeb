import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Local technical derivatives; preserve the supplied originals.
await sharp('public/logo-original.png').trim().resize({ width: 360 }).webp({ quality: 88 }).toFile('public/logo.webp');
const mark = await sharp('public/logo-original.png').extract({ left: 138, top: 315, width: 1040, height: 525 }).toBuffer();
await sharp(mark).trim().resize({ width: 204 }).webp({ quality: 95 }).toFile('public/brand-mark.webp');
await sharp(mark).resize(64, 64, { fit: 'contain', background: '#ffffff' }).png().toFile('public/favicon.png');
const logo = (await readFile('public/brand-mark.webp')).toString('base64');
const poppins = (await readFile('node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2')).toString('base64');
const inter = (await readFile('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2')).toString('base64');
// Render the code-native social composition with the same local fonts as the site.
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><head><style>
  @font-face{font-family:Poppins;src:url(data:font/woff2;base64,${poppins});font-weight:600}
  @font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter})}
  *{box-sizing:border-box}body{margin:0;background:white;color:#003249;font-family:Inter;overflow:hidden}
  .brand{position:absolute;left:70px;top:65px;display:flex;align-items:center;gap:24px;font:600 30px Poppins}.brand img{width:120px}
  h1{position:absolute;left:70px;top:215px;margin:0;font:600 55px/1.25 Poppins;letter-spacing:-2px}h1 span{color:#007ea7}
  p{position:absolute;left:70px;top:405px;font-size:24px}small{position:absolute;left:70px;top:535px;font-size:20px}
  .art{position:absolute;right:0;width:420px;height:630px;background:#80ced724}.ring{position:absolute;border:60px solid #9ad1d4;border-radius:50%;width:300px;height:300px;top:90px;left:45px}.ring.second{width:180px;height:180px;border-width:42px;border-color:#007ea7;top:340px;left:185px}
  </style></head><body><div class="art"><div class="ring"></div><div class="ring second"></div></div><div class="brand"><img src="data:image/webp;base64,${logo}"/>Cevallos Web</div><h1>Soluciones digitales<br/><span>de alto impacto.</span></h1><p>Desarrollo web y software a medida</p><small>Guayaquil, Ecuador</small></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
  await page.screenshot({ path: 'public/social-card.jpg', type: 'jpeg', quality: 90 });
} finally { await browser.close(); }
console.log('Optimized logo, favicon and social card prepared.');

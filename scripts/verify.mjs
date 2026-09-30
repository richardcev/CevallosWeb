import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const origin = process.env.TEST_URL || 'http://127.0.0.1:4321';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
const failures = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (const img of document.images) img.loading = 'eager'; await Promise.all([...document.images].map(img => img.decode())); });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');
  assert.deepEqual(await page.locator('#main-navigation a').allTextContents(), ['Servicios', 'Sobre mí', 'Preguntas frecuentes', 'Contacto']);
  for (const id of ['inicio', 'servicios', 'publico-objetivo', 'sobre-mi', 'soluciones', 'tecnologias', 'preguntas-frecuentes', 'contacto']) assert.equal(await page.locator(`#${id}`).count(), 1);
  assert.equal(await page.locator('.benefits-grid li').count(), 9);
  assert.equal(await page.locator('.technology').count(), 24);
  assert.equal(await page.locator('.slider-controls').count(), 0, 'The technology carousel should not show controls');
  assert.equal(await page.locator('#inicio .hero-developer-photo').count(), 1, 'The hero should show the supplied developer image');
  assert.equal(await page.locator('#inicio .floating-logo').count(), 4, 'The hero should show four floating technology logos');
  assert.equal(await page.locator('.hero-location, .hero-bottom, .service-tags').count(), 0, 'Removed secondary hero and service labels should stay absent');
  assert.equal(await page.locator('.about-portrait').count(), 1);
  assert.equal(await page.locator('.button svg, .button img').count(), 0, 'Buttons should contain text only');
  assert.equal(await page.locator('.service-image img').count(), 3);
  assert.equal(await page.locator('.audience-visual > img').count(), 1);
  assert.equal(await page.locator('main img').evaluateAll(images => images.every(img => getComputedStyle(img).filter === 'none')), true, 'Preserve original image and logo colors');
  for (const href of await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')))) assert.ok(await page.locator(href).count(), `Missing anchor ${href}`);
  for (const link of await page.locator('a[target="_blank"]').evaluateAll(links => links.map(link => ({ href: link.href, rel: link.rel })))) assert.ok(link.rel.includes('noopener'), link.href);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(schema.address.addressLocality, 'Guayaquil');
  assert.ok(await page.locator('link[rel="canonical"]').getAttribute('href'));
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(async () => { await document.fonts.ready; });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    const track = page.locator('.technology-track');
    const initialScroll = await track.evaluate(el => el.scrollLeft);
    await page.waitForTimeout(450);
    const animatedScroll = await track.evaluate(el => el.scrollLeft);
    assert.ok(animatedScroll > initialScroll, `Slider auto-scrolls at ${width}px`);
    const halfWidth = await track.evaluate(el => el.scrollWidth / 2);
    await track.evaluate((el, width) => { el.scrollLeft = width - 2; }, halfWidth);
    await page.waitForTimeout(100);
    assert.ok(await track.evaluate((el, width) => el.scrollLeft < width, halfWidth), `Slider loops at ${width}px`);
    await track.focus();
    await page.keyboard.press('Home');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    assert.ok(await track.evaluate(el => el.scrollLeft > 0), `Slider remains keyboard accessible at ${width}px`);
    if (width < 1024) {
      const menu = page.locator('.menu-toggle');
      await menu.click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      await menu.click();
      await page.locator('#main-navigation a[href="#servicios"]').click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    }
    await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
    if ([375, 768, 1440].includes(width)) {
      await page.screenshot({ path: `test-results/page-${width}.png`, fullPage: true });
      await page.screenshot({ path: `test-results/hero-${width}.png` });
    }
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `Accessibility at ${width}px`);
    console.log(`PASS ${width}px: no overflow, accessible controls, WCAG automated checks`);
  }
  const items = page.locator('.faq-item');
  for (let i = 0; i < 6; i++) {
    if (!await items.nth(i).getAttribute('open').then(value => value !== null)) await items.nth(i).locator('summary').click();
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.faq-item[open]').count(), 1);
    assert.equal(await items.nth(i).evaluate(el => el.open), true);
  }
  await items.nth(5).locator('summary').focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.faq-item[open]').count(), 0);
  await page.evaluate(async () => { const imgs = [...document.images]; for (const img of imgs) { img.loading = 'eager'; await img.decode(); } });
  assert.equal(await page.locator('img:not([alt])').count(), 0);
  assert.deepEqual(failures, []);
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
  await noJS.goto(origin);
  assert.equal(await noJS.locator('h1').isVisible(), true);
  assert.equal(await noJS.locator('#contacto h2').isVisible(), true);
  await noJS.close();
  console.log('PASS FAQ exclusivity and keyboard, metadata, images, anchors, no JavaScript errors, content without JS');
} finally { await browser.close(); }

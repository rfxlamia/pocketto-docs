import { expect, test } from '@playwright/test';

test('documentation routes are fetched when followed, not during the initial mobile render', async ({ page }) => {
  const prefetchedDocs: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.pathname.startsWith('/docs') && url.searchParams.has('_rsc')) prefetchedDocs.push(url.pathname);
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(prefetchedDocs).toEqual([]);
  await page.getByRole('link', { name: 'Read the docs', exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  await expect(page.locator('#nd-page')).toBeVisible();
});

test('search code loads on demand and the keyboard shortcut still returns results', async ({ page }) => {
  const searchScripts: string[] = [];
  const responses: Promise<void>[] = [];
  page.on('response', (response) => {
    if (response.request().resourceType() !== 'script') return;
    responses.push(response.text().then((body) => {
      if (body.includes('/api/search')) searchScripts.push(response.url());
    }));
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await Promise.all(responses);
  expect(searchScripts).toEqual([]);
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const result = page.waitForResponse((response) => new URL(response.url()).pathname === '/api/search');
  await dialog.getByRole('combobox').fill('quickstart');
  expect((await result).ok()).toBe(true);
  await expect(dialog.getByRole('option').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('the below-fold mobile hero does not receive an unconditional preload', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('figure img').first();
  const bounds = await hero.boundingBox();
  expect(bounds!.y).toBeGreaterThan(823);
  const preloads = await page.locator('link[rel="preload"][as="image"]').evaluateAll((links) =>
    links.filter((link) => {
      const image = link as HTMLLinkElement;
      return image.imageSrcset.includes('hero-agent-map') && (!image.media || matchMedia(image.media).matches);
    }).length,
  );
  expect(preloads).toBe(0);
});

test('the hero uses an appropriately sized image for the mobile pixel density', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('figure img').first();
  await hero.scrollIntoViewIfNeeded();
  await expect(hero).toHaveJSProperty('complete', true);
  const dimensions = await hero.evaluate((image: HTMLImageElement) => ({
    requested: Number(new URL(image.currentSrc).searchParams.get('w')),
    required: image.getBoundingClientRect().width * devicePixelRatio,
  }));
  expect(dimensions.requested).toBeGreaterThanOrEqual(dimensions.required);
  expect(dimensions.requested).toBeLessThanOrEqual(dimensions.required * 1.1);
});

test('the desktop hero retains a matching preload and its natural aspect ratio', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const hero = page.locator('figure img').first();
  await expect(hero).toHaveJSProperty('complete', true);
  const image = await hero.evaluate((element: HTMLImageElement) => ({
    source: element.srcset,
    ratio: element.getBoundingClientRect().height / element.getBoundingClientRect().width,
  }));
  const preload = page.locator('link[rel="preload"][as="image"]');
  await expect(preload).toHaveAttribute('imagesrcset', image.source);
  expect(await preload.evaluate((element: HTMLLinkElement) => matchMedia(element.media).matches)).toBe(true);
  expect(image.ratio).toBeCloseTo(1.5, 2);
});

test('mobile navigation, themes, install controls and the workflow remain usable', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.click();
  await expect(page.getByRole('navigation', { name: 'Main mobile' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  for (const theme of ['dark', 'light']) {
    await page.getByRole('button', { name: 'Toggle theme' }).filter({ visible: true }).click();
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  for (const tabs of await page.getByRole('tablist', { name: 'Choose your coding agent' }).all()) {
    await tabs.getByRole('tab', { name: 'Claude Code' }).click();
    await expect(tabs.getByRole('tab', { name: 'Claude Code' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.getByRole('tab', { name: 'Pi', exact: true })).toHaveAttribute('aria-selected', 'true');
  }
  const copy = page.getByRole('button', { name: 'Copy to clipboard', exact: true }).first();
  await copy.click();
  await expect(copy).toHaveText('copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('pi install');
  const stages = page.getByRole('tablist', { name: 'What do you have?' });
  for (const stage of await stages.getByRole('tab').all()) {
    await stage.click();
    await expect(stage).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('button', { name: /^Run .* example$/ }).click();
    await expect(page.getByRole('button', { name: /^(Next:|Replay demo)/ })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Replay demo' }).click();
  await expect(stages.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
});

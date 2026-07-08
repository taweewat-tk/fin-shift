import { expect, test } from '@playwright/test';

// Placeholder — real critical-flow specs land at the end of Phase 1 (TESTING.md).
test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});

import { test, expect } from '@playwright/test';

test.describe('Basic Rendering Checks', () => {
  test('homepage should load and render introduction content correctly', async ({ page }) => {
    // Go to the home page (should default to introduction)
    await page.goto('/');

    // Wait for content to potentially load (adjust timeout if needed)
    await page.waitForSelector('.content-viewer');
    await page.waitForTimeout(500); // Small delay for rendering updates

    // Check if the main title is visible
    await expect(page.locator('h1:has-text("Hermite\'s Problem")')).toBeVisible();

    // Check if the introduction section title is rendered
    await expect(page.locator('h2#intro:has-text("Introduction")')).toBeVisible();

    // Crucially, check that the citation is rendered as a link, not raw HTML source
    const citationLink = page.locator('a.citation[data-citation="Hermite1848"]');
    await expect(citationLink).toBeVisible();
    await expect(citationLink).toHaveText('[Hermite1848]');
    await expect(citationLink).toHaveAttribute('href', '#citation-Hermite1848');

    // Check that the raw `<a href...>` string is NOT present in the content viewer
    const contentViewer = page.locator('.content-viewer');
    await expect(contentViewer).not.toContainText('<a href="#citation-Hermite1848"');

    // Check for a reference link rendering correctly
    const referenceLink = page.locator('a.reference[data-reference="sec:galois_theory"]');
    await expect(referenceLink).toBeVisible();
    await expect(referenceLink).toHaveText('[galois_theory]');
    await expect(referenceLink).toHaveAttribute('href', '#sec:galois_theory');

    // Check that the raw reference tag is not present
    await expect(contentViewer).not.toContainText('<a href="#sec:galois_theory"');
    
    // Check if some KaTeX math element is rendered (example: a fraction)
    // This assumes KaTeX renders fractions with a specific structure.
    // Adjust selector based on actual KaTeX output if necessary.
    await expect(page.locator('.content-viewer .katex .mfrac')).toBeVisible({ timeout: 5000 }); // Allow time for KaTeX
  });
}); 
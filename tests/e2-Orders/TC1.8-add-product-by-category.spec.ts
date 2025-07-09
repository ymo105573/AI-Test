import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';

test('tc1.8 – Add product from Browse by category', async ({ page }) => {
  // Login
  await login(page);
  // Click on an order from Orders → Open
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  // Click to select the order (entire row)
  await firstDataRow.click();

  // 1. Click on "Browse by category"
  await page.locator('.d-flex.flex-row.align-center.gap-2 > button').first().click();

  // 2. Select category AGF
  const agfCategory = page.locator('p:has-text("AGF")').filter({ hasText: '6 sub categories' }).first().locator('..').locator('..');
  await expect(agfCategory).toBeVisible();
  await agfCategory.click();

  // 3. Navigate through subcategories
  await page.getByRole('group').filter({ hasText: 'Kruiden' }).filter({ hasText: '1 sub categories' }).first().click();
  await page.getByRole('group').filter({ hasText: 'Kruiden vers' }).filter({ hasText: 'View products' }).first().click();

  // 4. Select product
  const productRow = page.getByRole('button', { name: 'DeliNova Kurkuma vers' }).locator('xpath=ancestor::tr | ancestor::div[contains(@class, "mud-table-row")]');

  // Find a button with an svg path matching "+"
  const plusButton = productRow.locator('button >> svg path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"]');

  await expect(plusButton).toBeVisible();
  await plusButton.click();

  // Assert: Notification “Order line added”
  const productCell = page.locator('td', { hasText: 'DeliNova Kurkuma vers' });
  console.log(await productCell.count());

  // Check if the product is already visible in the order
  if (await productCell.count() > 0) {
    // Product already exists, check controls
    const productCell = page.locator('td.mud-table-cell', { hasText: 'DeliNova Kurkuma vers 1 kg' }).first();

    await expect(productCell).toBeVisible();
    const plusButton = productCell.locator('button >> svg path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"]');
    await expect(plusButton).toBeVisible();

    // Locate the row containing the product
    const productRow = page.locator('tr', { hasText: 'DeliNova Kurkuma vers' });

    // Now validate that each button is visible within that row
    //await expect(productRow.getByRole('button', { name: /Remove/i })).toBeVisible();
    //await expect(productRow.getByRole('button', { name: /Save/i })).toBeVisible();
    //await expect(productRow.getByRole('button', { name: /Add remark/i })).toBeVisible();

  } else {
    // Product does NOT exist yet, wait for the "Order line added" notification
    await expect(page.locator('#mud-snackbar-container >> text=Order line added')).toBeVisible({ timeout: 10000 });
  }

  // Assert: “Continue to checkout (x items)” is enabled
  await expect(page.getByRole('button', { name: /Continue to checkout \(\d+ items\)/ })).toBeEnabled();
});
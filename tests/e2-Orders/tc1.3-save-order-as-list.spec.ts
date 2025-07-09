import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

// TC1.3: Save the order as a list
// Precondition: Authenticated user (buyer role). There must be at least one order in Draft state.
// Steps:
// 1. Login
// 2. Select an order in Draft state from Orders (Open, Sent, History, or Browse)
// 3. Click the "Save order as list" option
// 4. Verify the message "Saved list created" and that the list is available

test('tc1.3 - Save the order as list', async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Step 2: Select an order
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  const originalName = await firstDataRow.textContent();

  await firstDataRow.click();
  await openOrderOptions(page);

  const options = page.locator('p.mud-menu-item-text');
  const changeNameOption = options.nth(2); // third option in the menu
  await expect(changeNameOption).toBeVisible();
  await changeNameOption.click();

  // Step 3: Verify success message
  await expect(page.getByText('Saved list created')).toBeVisible();

  // (Optional) Step 5: Navigate to Saved lists and verify that the list appears
  // await page.getByText('Saved lists', { exact: true }).click();
  // await expect(page.getByText(/Order \d+/)).toBeVisible();
});

import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch, clickPlusByProductName } from '../utils/order-helpers';

  test('Add product from Starred and close panel', async ({ page }) => {
    await login(page);
    // Click on an order from Orders → Open
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    // Click to select the order (entire row)
    await firstDataRow.click();

    // 1. Open Starred panel
    await page.locator('div.mud-card-header button.mud-icon-button').nth(2).click();

    await expect(page.getByText(/Starred items/i)).toBeVisible();

    // 2. Add favorite product
   await clickPlusByProductName(page, 'DeliNova Idaho aardappelen, om te bakken');
    // 3. Validate notification and product in the order
    // Assert: Notification “Order line added”
  const productCell = page.locator('td', { hasText: 'DeliNova Idaho aardappelen, om te bakken' });
  console.log(await productCell.count());

  // Check if the product is already visible in the order
  if (await productCell.count() > 0) {
    // Product already exists, check controls
    const productCell = page.locator('td.mud-table-cell', { hasText: 'DeliNova Idaho aardappelen, om te bakken' }).first();

    await expect(productCell).toBeVisible();
    const plusButton = productCell.locator('button >> svg path[d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"]');
    await expect(plusButton).toBeVisible();

    // Locate the row containing the product
    const productRow = page.locator('tr', { hasText: 'DeliNova Idaho aardappelen, om te bakken' });

  } else {
    // Product does NOT exist yet, wait for the "Order line added" notification
    await expect(page.locator('#mud-snackbar-container >> text=Order line added')).toBeVisible({ timeout: 10000 });
  }
       
  });
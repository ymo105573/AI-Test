import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';

// TC1.1: Create empty order
// Precondition: Authenticated user (buyer role)
// Steps:
// 1. Login
// 2. Create a new order from Orders or Browse
// 3. Verify that the order appears in Draft state with empty message
// 4. Return to the preview view

test('TC1.1 - Create empty order', async ({ page }) => {
  // Step 1: Login using helper
  await login(page);
  // Step 2: Go to Orders and create a new order
  await page.goto('https://in-order.test.nebulaplatform.app/order/open');
  await expect(page.getByRole('button', { name: 'New order' })).toBeVisible();
  await page.getByRole('button', { name: 'New order' }).click();

  // Step 3: Verify that the order modal opens in Draft state
  // The header is the order number, e.g., "Order 00163"
  await expect(page.getByRole('heading', { name: /Order \d+/i, level: 6 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your order is empty', level: 4 })).toBeVisible();
  await expect(page.getByText('Add products to this draft order to get started.')).toBeVisible();

  // Step 4: Click the "Back" button
  const backButton = page.locator('div.mud-focus-trap-child-container.outline-none div.mud-dialog-content button.mud-icon-button').first();
  console.log('Back button count:', await backButton.count());

  await page.pause();

  await expect(backButton).toBeVisible();
  await backButton.click({ force: true });
  await page.waitForTimeout(2000);
  await expect(page).toHaveURL(/order\/open/);

});

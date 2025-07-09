import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch } from '../utils/order-helpers';

test('tc1.7 - Add product by search field', async ({ page }) => {
  // Step 1: Login
  // Step 1: Login using helper
  await login(page);
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  // Step 2: Click to select the order (entire row)
  await firstDataRow.click();
  // Step 3: Add product using the search field
  await addProductBySearch(page, 'bea');
  
});

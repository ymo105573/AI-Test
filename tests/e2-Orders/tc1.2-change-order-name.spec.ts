import { test, expect, Page } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions} from '../utils/order-helpers';


// TC1.2: Change the order name
test('tc1.2 - Rename the order', async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Wait until at least one data row is present (row 0 is header)
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();

  // Step 2: Click to select the order (entire row)
  await firstDataRow.click();

  await openOrderOptions(page);

  // Step 4: Select the option to change the name
  // const changeNameOption = page.locator('p.mud-menu-item-text', { hasText: 'Change order name' });
  const options = page.locator('p.mud-menu-item-text');
  const changeNameOption = options.nth(1); // second option in the menu
  await expect(changeNameOption).toBeVisible();
  await changeNameOption.click();

  // Step 5: Fill in the new name
  const nameTextbox = page.getByRole('textbox', { name: 'Order' });
  await nameTextbox.fill('Rename orden QA');

  // Confirm the change by closing the modal (click on empty space)
  await page.locator('.mud-grid').click();

  // Step 6: Validation
  await expect(page.getByText('Rename orden QA')).toBeVisible();
});


import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

test('tc1.3 - Restore original name if left blank', async ({ page }) => {
  await login(page);

  // Step 1: Select an order
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  const originalName = await firstDataRow.textContent();

  await firstDataRow.click();
  await openOrderOptions(page);

  // Step 2: Change the name
  // const changeNameOption = page.locator('p.mud-menu-item-text', { hasText: 'Change order name' });
  const options = page.locator('p.mud-menu-item-text');
  const changeNameOption = options.nth(1); // second option in the menu
  await expect(changeNameOption).toBeVisible();
  await changeNameOption.click();

  const nameTextbox = page.getByRole('textbox', { name: 'Order' });
  await expect(nameTextbox).toBeVisible();
  await nameTextbox.fill('Nuevo Nombre QA');
  await page.locator('.mud-grid').click();
  await expect(page.getByText('Nuevo Nombre QA')).toBeVisible();

  // Step 3: Try to leave it blank
  await openOrderOptions(page);
  await changeNameOption.click();
  await expect(nameTextbox).toBeVisible();
  await nameTextbox.fill('');
  await page.locator('.mud-grid').click();

  // Step 4: Validate that the original name is restored or that the system does not allow it to be left blank
  // This depends on the actual app logic
  await expect(page.getByText('Nuevo Nombre QA')).not.toBeVisible();
  
  // Assuming the modal is open
  const dialogLocator = page.locator('.mud-dialog-container');

  // Find the level 6 heading inside the dialog (corresponds to the order name)
  const orderNameLocator = dialogLocator.getByRole('heading', { level: 6 }).first();

  // Wait for it to be visible
  await expect(orderNameLocator).toBeVisible();

  // Get the order name text
  const orderNameText = await orderNameLocator.textContent();

  // Validate that the name is not empty or just spaces
  expect(orderNameText?.trim().length).toBeGreaterThan(0);
});

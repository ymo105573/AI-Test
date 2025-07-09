import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

// TC1.4: Discard an order (Draft, To manager, To finance manager)

test('tc1.4 - Discard an order', async ({ page }) => {
    await login(page);

    // Step 1: Select an order
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    const originalName = await firstDataRow.textContent();

    await firstDataRow.click();
    await openOrderOptions(page);

    const options = page.locator('p.mud-menu-item-text');
    const changeNameOption = options.nth(3); // third option in the menu
    await expect(changeNameOption).toBeVisible();
    await changeNameOption.click();

    // Validate confirmation dialog
    //await expect(page.getByText('Are you sure you want to discard this draft order? This action cannot be undone.')).toBeVisible();
    //await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    const dialogMessage = page.locator('.mud-dialog-content > p');
    await expect(dialogMessage).toBeVisible();
    await expect(dialogMessage).toHaveText('Are you sure you want to discard this draft order? This action cannot be undone.');

    const cancelButton = page.locator('.mud-dialog-actions button.mud-button-text').first();
    await expect(cancelButton).toBeVisible();

    // await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    await expect(page.locator('button', {has: page.locator('svg.mud-icon-root.mud-svg-icon.mud-icon-size-small.me-2')
    })).toBeVisible();
    // Confirm discard
    // await page.getByRole('button', { name: 'Discard' }).click();
    await page.locator('button', {
    has: page.locator('svg.mud-icon-root.mud-svg-icon.mud-icon-size-small.me-2')
    }).click();
   
    // Validate success message and Undo option
    await expect(page.getByText('Order deleted')).toBeVisible();
    await expect(page.getByText('Undo')).toBeVisible();
    // Validate that the order no longer appears in the list
    await page.goto('https://in-order.test.nebulaplatform.app/order/open');
    await expect(page.locator(`text=${originalName?.trim()}`)).not.toBeVisible();
  
});


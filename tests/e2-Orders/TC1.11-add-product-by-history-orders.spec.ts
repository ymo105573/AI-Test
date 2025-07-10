import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch, clickPlusByProductName } from '../utils/order-helpers';

  test('Add product from History orders', async ({ page }) => {
    await login(page);
    // Click on an order from Orders → Open
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    // Click to select the order (entire row)
    await firstDataRow.click();

    // 1. Open panel History orders
    await page.locator('div.mud-card-header button.mud-icon-button').nth(4).click();
    const historyOrdersDialog = page.getByRole('dialog');

    // Wait for the specific title to appear within the panel
    await expect(historyOrdersDialog.getByRole('heading', { name: /history orders|Órdenes históricas/i, level: 6 })).toBeVisible();

    // Validate if the message "No order history" is displayed
    const noHistoryMessageLocator = page.locator('h4.mud-typography-align-center');
    const noHistoryMessageVisible = await noHistoryMessageLocator.isVisible();
    let noHistoryMessage = false;
    if (noHistoryMessageVisible) {
      await expect(noHistoryMessageLocator).toHaveText(/no order history|sin historial/i);
      noHistoryMessage = true;
    }
  
    // If the message appears, we perform the validation
    if (noHistoryMessage) {
      console.log('No hay órdenes históricas, se muestra el mensaje correctamente.');
      await expect(noHistoryMessageLocator).toBeVisible();
    } else {

          const orderGroup = page.getByRole('group').filter({ hasText: /Order.*\d{5}/ }).first();
          await expect(orderGroup, 'Order group should be visible').toBeVisible();

          console.log('BoundingBox:', await orderGroup.boundingBox());

          await orderGroup.scrollIntoViewIfNeeded();
          await orderGroup.click();
          const addButton = page.getByRole('button', { name: /^Add$|^\+$/i }).first();
          await expect(addButton).toBeEnabled();
          await addButton.click();

        // 4. Validate notification and product in the order
          await expect(page.getByText(/Item added to order/i)).toBeVisible();
          const orderLine = page.getByRole('cell', { name: /.+/ }).first();
 
    }

    
  });

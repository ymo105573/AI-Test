import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch, clickPlusByProductName } from '../utils/order-helpers';

test.describe('tc1.10 - Add product from Saved Lists', () => {
  test('should add product from saved list', async ({ page }) => {
    await login(page);
    // Click on an order from Orders → Open
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    // Click to select the order (entire row)
    await firstDataRow.click();

    // 1. Abrir panel Saved Lists
    await page.locator('div.mud-card-header button.mud-icon-button').nth(3).click();
    const savedListsDialog = page.getByRole('dialog');

    // Espera a que el título específico aparezca dentro del panel
    await expect(savedListsDialog.getByRole('heading', { name: /Your saved lists|Listas guardadas/i, level: 6 })).toBeVisible();


    // Esperar que el modal esté visible

  const orderGroup = page.getByRole('group').filter({ hasText: /Order 00103.*Private/ }).first();
  await expect(orderGroup).toBeVisible();
  await orderGroup.click();

  // Click en el botón dentro del toolbar correspondiente
  const toolbar = page.getByRole('toolbar').filter({ hasText: '5 Doos Remove Add Add remark' });
  const buttons = toolbar.getByRole('button');
  await expect(buttons.nth(2)).toBeVisible();
  await buttons.nth(2).click();

  });
});
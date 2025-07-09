import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';

test('tc1.8 – Añadir producto desde Browse by category', async ({ page }) => {
  // Login
 await login(page);
  // 1. Click en una orden desde Orders → Open
  await page.getByRole('cell', { name: /Order 00126 Draft/ }).click();
  await expect(page.getByText(/Order 00126 Draft/)).toBeVisible();

  // 2. Click en icono “Browse by category”
  await page.locator('.d-flex.flex-row.align-center.gap-2 > button').first().click();
  await expect(page.getByRole('group', { name: /AGAGF 6 sub categories/ })).toBeVisible();

  // 3. Navegar a categorías y subcategoría, seleccionar ítem
  await page.getByRole('group', { name: /AGAGF 6 sub categories/ }).first().click();
  await page.getByRole('group', { name: /KRKruiden 1 sub categories/ }).first().click();
  await page.getByRole('group', { name: /KRKruiden vers View products/ }).first().click();

  // 4. Seleccionar producto
  await page.locator('#chip-container-aee67945-0908-4137-b769-d4b233a8d99f').getByRole('button').click();

  // Assert: Notificación “Order line added”
  await expect(page.locator('text=Order line added')).toBeVisible();

  // Assert: El producto aparece en la orden con controles activos
  const productCell = page.getByRole('cell', { name: /DeliNova Kurkuma vers 1 kg/ });
  await expect(productCell).toBeVisible();
  await expect(productCell.getByRole('button', { name: '+' })).toBeVisible();
  await expect(productCell.getByRole('button', { name: '-' })).toBeVisible();
  await expect(productCell.getByRole('button', { name: /Remove/i })).toBeVisible();
  await expect(productCell.getByRole('button', { name: /Save/i })).toBeVisible();
  await expect(productCell.getByRole('button', { name: /Add remark/i })).toBeVisible();

  // Assert: “Continue to checkout (x items)” habilitado
  await expect(page.getByRole('button', { name: /Continue to checkout \(\d+ items\)/ })).toBeEnabled();
});
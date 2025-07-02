import { test, expect } from '@playwright/test';

// TC1.3: Guardar la orden como lista
// Precondición: Usuario autenticado (rol comprador). Debe existir al menos una orden en estado Draft.
// Pasos:
// 1. Login
// 2. Seleccionar una orden en estado Draft desde Orders (Open, Sent, History o Browse)
// 3. Click en la opción "Save order as list"
// 4. Verificar mensaje "Saved list created" y que la lista queda disponible

test('TC1.3 - Guardar la orden como lista', async ({ page }) => {
  // Paso 1: Login
  await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
  await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
  await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Paso 2: Seleccionar una orden en estado Draft
  await page.getByText('items •Last updated').first().click();
  // Ajusta el selector según el nombre/estado de la orden Draft

  // Paso 3: Guardar la orden como lista
  await page.getByRole('group', { name: /Order \d+ Draft/ }).getByRole('button').nth(3).click();
  await page.getByText('Save order as list').click();

  // Paso 4: Verificar mensaje de éxito
  await expect(page.getByText('Saved list created')).toBeVisible();

  // (Opcional) Paso 5: Navegar a Saved lists y verificar que la lista aparece
  // await page.getByText('Saved lists', { exact: true }).click();
  // await expect(page.getByText(/Order \d+/)).toBeVisible();
});

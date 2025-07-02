import { test, expect } from '@playwright/test';

// TC1.2: Cambiar el nombre de la orden
// Precondición: Usuario autenticado (rol Buyer, Manager o Finance Manager). Debe existir al menos una orden en estado Draft.
// Pasos:
// 1. Login
// 2. Seleccionar una orden en estado Draft desde Orders → Open
// 3. Cambiar el nombre de la orden
// 4. Verificar que el nuevo nombre se refleja en todas las vistas

test('TC1.2 - Cambiar el nombre de la orden', async ({ page }) => {
  // Paso 1: Login
  await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
  await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
  await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Paso 2: Seleccionar una orden en estado Draft
  await page.getByText('items •Last updated').first().click();
  // Ajusta el selector según el nombre/estado de la orden Draft

  // Paso 3: Cambiar el nombre de la orden
  await page.getByRole('group', { name: /Order \d+ Draft/ }).getByRole('button').nth(3).click();
  await page.getByText('Change order name').click();
  await page.getByRole('textbox', { name: 'Order' }).fill('Order Renombrada QA');
  await page.locator('.mud-grid').click(); // Cierra el modal

  // Paso 4: Verificar que el nuevo nombre aparece en la lista
  await expect(page.getByText('Order Renombrada QA')).toBeVisible();

  // Puedes agregar navegación a Sent, History y Browse para verificar el nombre si es necesario
});

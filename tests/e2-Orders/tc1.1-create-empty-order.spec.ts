import { test, expect } from '@playwright/test';

// TC1.1: Create empty order
// Precondición: Usuario autenticado (rol comprador)
// Pasos:
// 1. Login
// 2. Crear nueva orden desde Orders o Browse
// 3. Verificar que la orden aparece en estado Draft y con mensaje de vacío
// 4. Regresar a la vista previa

test('TC1.1 - Create empty order', async ({ page }) => {
  // Paso 1: Login
  await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
  await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
  await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Paso 2: Ir a Orders y crear nueva orden
  await page.goto('https://in-order.test.nebulaplatform.app/order/open');
  await page.getByRole('button', { name: 'New order' }).click();

  // Paso 3: Verificar que se abre el modal de la orden en estado Draft
  await expect(page.getByRole('heading', { name: /new order/i })).toBeVisible();
  await expect(page.getByText('Your order is empty')).toBeVisible();
  await expect(page.getByText('Add products to this draft order to get started.')).toBeVisible();

  // Paso 4: Verificar que la orden aparece en la lista con estado Draft
  await page.getByRole('link', { name: 'Orders' }).click();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByText(/Draft/)).toBeVisible();
  // Puedes agregar más asserts según el nombre, items, last updated, etc.

  // Paso 5: Clic en el botón "Atrás" (si aplica)
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL(/order\/open/);
});

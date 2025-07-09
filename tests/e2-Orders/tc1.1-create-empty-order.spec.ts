import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';

// TC1.1: Create empty order
// Precondición: Usuario autenticado (rol comprador)
// Pasos:
// 1. Login
// 2. Crear nueva orden desde Orders o Browse
// 3. Verificar que la orden aparece en estado Draft y con mensaje de vacío
// 4. Regresar a la vista previa

test('TC1.1 - Create empty order', async ({ page }) => {
  // Paso 1: Login
  // Paso 1: Login usando helper
  await login(page);
  // Paso 2: Ir a Orders y crear nueva orden
  await page.goto('https://in-order.test.nebulaplatform.app/order/open');
  await expect(page.getByRole('button', { name: 'New order' })).toBeVisible();
  await page.getByRole('button', { name: 'New order' }).click();

  // Paso 3: Verificar que se abre el modal de la orden en estado Draft
  // El encabezado es el número de orden, por ejemplo "Order 00163"
  await expect(page.getByRole('heading', { name: /Order \d+/i, level: 6 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your order is empty', level: 4 })).toBeVisible();
  await expect(page.getByText('Add products to this draft order to get started.')).toBeVisible();

    // Paso 4: Clic en el botón "Atrás" 

const backButton = page.locator('div.mud-focus-trap-child-container.outline-none div.mud-dialog-content button.mud-icon-button').first();
console.log('Back button count:', await backButton.count());

await page.pause();

await expect(backButton).toBeVisible();
await backButton.click({ force: true });
await page.waitForTimeout(2000);
await expect(page).toHaveURL(/order\/open/);

});

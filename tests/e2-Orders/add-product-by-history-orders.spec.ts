import { test, expect } from '@playwright/test';

test.describe('TC2.4 – Añadir producto desde History orders', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Seleccionar una orden en estado abierto (Draft, Pending manager o Pending finance manager)
    await page.getByRole('cell', { name: /Draft|Pending manager|Pending finance manager/i }).first().click();
  });

  test('Agregar producto desde History orders y cerrar panel', async ({ page }) => {
    // 1. Abrir panel History orders
    await page.getByRole('button', { name: /history orders|históricas|reloj/i }).click();
    await expect(page.getByText(/History orders|Órdenes históricas/i)).toBeVisible();

    // 2. Seleccionar una orden histórica
    const historyOrder = page.getByRole('group', { name: /order|orden/i }).first();
    await expect(historyOrder).toBeVisible();
    await historyOrder.click();

    // 3. Agregar producto de la orden histórica
    const addButton = page.getByRole('button', { name: /^Add$|^\+$/i }).first();
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // 4. Validar notificación y producto en la orden
    await expect(page.getByText(/Order line added/i)).toBeVisible();
    const orderLine = page.getByRole('cell', { name: /.+/ }).first();
    await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

    // 5. Cerrar el panel History orders
    await page.getByRole('button', { name: /close|cerrar|x/i }).click();
    await expect(page.getByText(/Order|Orden/i)).toBeVisible();
  });
});
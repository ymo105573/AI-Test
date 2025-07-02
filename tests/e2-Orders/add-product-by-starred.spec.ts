import { test, expect } from '@playwright/test';

test.describe('TC1.9 – Añadir producto desde Starred', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Seleccionar una orden en estado abierto (Draft, Pending manager o Pending finance manager)
    await page.getByRole('cell', { name: /Draft|Pending manager|Pending finance manager/i }).first().click();
  });

  test('Agregar producto favorito desde Starred y cerrar panel', async ({ page }) => {
    // 1. Abrir panel Starred
    await page.getByRole('button', { name: /starred|★/i }).click();
    await expect(page.getByText(/Starred items/i)).toBeVisible();

    // 2. Agregar producto favorito
    const addButton = page.getByRole('button', { name: /^\+$/ }).first();
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // 3. Validar notificación y producto en la orden
    await expect(page.getByText(/Order line added/i)).toBeVisible();
    // Validar que el producto aparece en el listado con controles activos
    // (Ajusta el selector según el nombre del producto si lo conoces)
    const orderLine = page.getByRole('cell', { name: /.+/ }).first();
    await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

    // 4. Cerrar el panel Starred
    await page.getByRole('button', { name: /close|cerrar|x/i }).click();
    // Validar que el panel se cerró y se muestra la vista de la orden
    await expect(page.getByText(/Order|Orden/i)).toBeVisible();
  });
});
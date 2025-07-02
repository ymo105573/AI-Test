import { test, expect } from '@playwright/test';

test.describe('TC1.10 – Añadir producto desde Saved Lists', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Seleccionar una orden en estado abierto (Draft, Pending manager o Pending finance manager)
    await page.getByRole('cell', { name: /Draft|Pending manager|Pending finance manager/i }).first().click();
  });

  test('Agregar producto desde Saved Lists y cerrar panel', async ({ page }) => {
    // 1. Abrir panel Saved Lists
    await page.getByRole('button', { name: /saved lists|listas guardadas/i }).click();
    await expect(page.getByText(/Your saved lists|Listas guardadas/i)).toBeVisible();

    // 2. Seleccionar una lista y agregar producto
    const savedList = page.getByRole('group', { name: /private|saved|guardada/i }).first();
    await expect(savedList).toBeVisible();
    await savedList.click();

    // 3. Agregar producto de la lista
    const addButton = page.getByRole('button', { name: /^Add$|^\+$/i }).first();
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // 4. Validar notificación y producto en la orden
    await expect(page.getByText(/Order line added/i)).toBeVisible();
    const orderLine = page.getByRole('cell', { name: /.+/ }).first();
    await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
    await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

    // 5. Cerrar el panel Saved Lists
    await page.getByRole('button', { name: /close|cerrar|x/i }).click();
    await expect(page.getByText(/Order|Orden/i)).toBeVisible();
  });
});
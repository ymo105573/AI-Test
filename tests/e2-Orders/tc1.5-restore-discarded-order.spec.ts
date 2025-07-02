import { test, expect } from '@playwright/test';

test.describe('TC1.5 – Restaurar orden descartada', () => {
  test('Debe restaurar una orden descartada usando Undo', async ({ page }) => {
    // 1. Login
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 2. Seleccionar una orden en estado Draft
    const orderCell = page.getByRole('cell', { name: /Draft/ }).first();
    await expect(orderCell).toBeVisible();
    await orderCell.click();

    // 3. Descartar la orden
    await page.getByRole('button', { name: /more/i }).click(); // Ajusta el selector si el botón tiene otro nombre
    await page.getByText('Discard').click();
    await page.getByRole('button', { name: 'Discard' }).click();

    // 4. Validar mensaje "Order deleted" y opción "Undo"
    await expect(page.getByText(/Order deleted/i)).toBeVisible();
    const undoButton = page.getByRole('button', { name: 'Undo' });
    await expect(undoButton).toBeVisible();

    // 5. Restaurar la orden usando "Undo"
    await undoButton.click();

    // 6. Validar mensaje "Order restaured" y que la orden reaparece en Open orders
    await expect(page.getByText(/Order restaured/i)).toBeVisible();
    await page.getByRole('button', { name: /Open/i }).click();
    await expect(page.getByRole('cell', { name: /Draft/ })).toBeVisible();
  });
});
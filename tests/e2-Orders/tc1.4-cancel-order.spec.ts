import { test, expect } from '@playwright/test';

// TC1.4: Cancelar una orden (Draft, To manager, To finance manager)
test.describe('TC1.4 - Cancelar una orden', () => {
  // Utilidad para login
  async function login(page) {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/order\/open/);
  }

  // Helper para cancelar una orden y validar el flujo
  async function cancelarOrden(page, ordenSelector, estadoEsperado) {
    // Seleccionar la orden
    await page.getByText(ordenSelector, { exact: false }).click();
    // Abrir menú de acciones (ajustar si cambia el UI)
    await page.getByRole('group', { name: new RegExp(ordenSelector) }).getByRole('button').nth(3).click();
    await page.getByText('Discard').click();
    // Validar diálogo de confirmación
    await expect(page.getByText('Are you sure you want to discard this draft order? This action cannot be undone.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    // Confirmar descarte
    await page.getByRole('button', { name: 'Discard' }).click();
    // Validar mensaje de éxito y opción Undo
    await expect(page.getByText('Order deleted')).toBeVisible();
    await expect(page.getByText('Undo')).toBeVisible();
    // Validar que la orden ya no aparece en la lista
    await expect(page.getByText(ordenSelector, { exact: false })).not.toBeVisible();
  }

  // Helper para probar botón Cancelar
  async function cancelarDialogo(page, ordenSelector) {
    await page.getByText(ordenSelector, { exact: false }).click();
    await page.getByRole('group', { name: new RegExp(ordenSelector) }).getByRole('button').nth(3).click();
    await page.getByText('Discard').click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    // Validar que regresa a la vista de la orden
    await expect(page.getByText(ordenSelector, { exact: false })).toBeVisible();
  }

  test('Cancelar orden en estado Draft', async ({ page }) => {
    await login(page);
    await cancelarOrden(page, 'Draft', 'Draft');
  });

  test('Cancelar orden en estado To manager', async ({ page }) => {
    await login(page);
    await cancelarOrden(page, 'To manager', 'To manager');
  });

  test('Cancelar orden en estado To finance manager', async ({ page }) => {
    await login(page);
    await cancelarOrden(page, 'To finance manager', 'To finance manager');
  });

  test('Cancelar desde el diálogo de confirmación', async ({ page }) => {
    await login(page);
    await cancelarDialogo(page, 'Draft');
  });
});

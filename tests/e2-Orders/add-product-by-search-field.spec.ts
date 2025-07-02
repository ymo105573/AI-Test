import { test, expect } from '@playwright/test';

test.describe('TC1.7 – Añadir producto vía búsqueda', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  test('Draft: Agregar producto usando el buscador', async ({ page }) => {
    await page.getByRole('cell', { name: /Draft/ }).first().click();
    await addProductBySearch(page, 'tea');
  });

  test('Pending manager: Agregar producto usando el buscador', async ({ page }) => {
    await page.getByRole('button', { name: /To manager/i }).click();
    await page.getByRole('cell', { name: /To manager/ }).first().click();
    await addProductBySearch(page, 'bea');
  });

  test('Pending finance manager: Agregar producto usando el buscador', async ({ page }) => {
    await page.getByRole('button', { name: /To finance manager/i }).click();
    await page.getByRole('cell', { name: /To finance manager/ }).first().click();
    await addProductBySearch(page, 'tea');
  });
});

// Función auxiliar para agregar producto y validar controles
async function addProductBySearch(page, searchTerm: string) {
  const searchBox = page.getByRole('textbox', { name: /Search to add/i });
  await expect(searchBox).toBeVisible();
  await searchBox.fill(searchTerm);

  // Esperar y seleccionar el primer resultado
  const productOption = page.getByRole('group', { name: new RegExp(searchTerm, 'i') }).first();
  await expect(productOption).toBeVisible();
  await productOption.click();

  // Validar notificación y controles
  await expect(page.getByText(/Order line added/i)).toBeVisible();
  const orderLine = page.getByRole('cell', { name: new RegExp(searchTerm, 'i') });
  await expect(orderLine).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

  // Validar botón checkout habilitado
  const checkoutBtn = page.getByRole('button', { name: /Continue to checkout \(\d+ items?\)/i });
  await expect(checkoutBtn).toBeEnabled();
}
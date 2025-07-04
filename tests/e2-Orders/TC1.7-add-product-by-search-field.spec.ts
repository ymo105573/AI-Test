import { test, expect } from '@playwright/test';

test.describe('tc1.7 – Add product by search field (multi-status robust)', () => {
  const user = { email: 'yannia@businessone.cw', password: 'P@ssw0rd' };

  test.beforeEach(async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
    await page.getByRole('textbox', { name: 'Email address' }).fill(user.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(user.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  test('Draft: Add product by search', async ({ page }) => {
    await selectAnyOrder(page);
    await addProductBySearch(page, 'bea');
  });

  test('To manager: Add product by search', async ({ page }) => {
    await page.getByRole('button', { name: /To manager/i }).click();
    await selectAnyOrder(page);
    await addProductBySearch(page, 'bea');
  });

  test('To finance manager: Add product by search', async ({ page }) => {
    await page.getByRole('button', { name: /To finance manager/i }).click();
    await selectAnyOrder(page);
    await addProductBySearch(page, 'bea');
  });
});

// Selecciona la primera orden visible sin depender del número
async function selectAnyOrder(page) {
  const orderCell = page.locator('td.mud-table-cell', {
    has: page.locator('p.mud-typography-subtitle1')
  }).first();

  await expect(orderCell).toBeVisible({ timeout: 10000 });
  await orderCell.click();
}

// Busca y agrega el primer producto visible por término de búsqueda, fuerza el click con varias técnicas
async function addProductBySearch(page, searchTerm: string) {
  const searchBox = page.getByRole('textbox', { name: /Search to add/i });
  await expect(searchBox).toBeVisible();
  await searchBox.fill(searchTerm);

  const dropdownItems = page.locator('div.mud-list-item-clickable');
  await expect(dropdownItems.first()).toBeVisible({ timeout: 10000 });

  // Pausa para animaciones o carga
  await page.waitForTimeout(500);

  const firstItem = dropdownItems.first();

  await firstItem.scrollIntoViewIfNeeded();
  await firstItem.hover();

  try {
    // Intenta click normal
    await firstItem.click();
  } catch {
    // Si falla, fuerza click
    await firstItem.click({ force: true });
  }

  // Si sigue sin funcionar, intenta click absoluto con mouse
  try {
    const box = await firstItem.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
  } catch {
    // ignorar error si no funciona
  }

  // Validaciones
  const orderLine = page.getByRole('cell', { name: new RegExp(searchTerm, 'i') });
  await expect(orderLine).toBeVisible({ timeout: 10000 });

  await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

  const checkoutBtn = page.getByRole('button', { name: /Continue to checkout \(\d+ items?\)/i });
  await expect(checkoutBtn).toBeEnabled();
}

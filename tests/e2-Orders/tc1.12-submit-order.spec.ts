import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch } from '../utils/order-helpers';

test('tc1.12-submit-order', async ({ page }) => {
  // Paso 1: Login
  await login(page);
  await page.waitForSelector('td.mud-table-cell', { timeout: 5000 });

  const orders = page.locator('td.mud-table-cell');
  const total = await orders.count();
  console.log(`📦 Total de celdas de orden: ${total}`);

  let foundOrder = false;

  for (let i = 0; i < total; i++) {
    const orderCell = orders.nth(i);
    const itemsParagraph = orderCell.locator('p.mud-typography-subtitle2', { hasText: 'items' });

    if (!(await itemsParagraph.count())) {
      console.warn(`⚠️ No se encontró <p> con 'items' en celda ${i}`);
      continue;
    }

    const itemsText = await itemsParagraph.textContent();
    console.log(`🧾 Texto encontrado en celda ${i}: "${itemsText}"`);

    const match = itemsText?.match(/(\d+)\s*items?/i);

    if (match) {
      const itemCount = parseInt(match[1], 10);
      if (itemCount >= 1) {
        console.log(`✅ Orden válida encontrada con ${itemCount} productos en índice ${i}`);
        await orderCell.click();
        foundOrder = true;
        break;
      }
    } else {
      console.warn(`❌ No se pudo hacer match con el texto: "${itemsText}"`);
    }
  }

  // Validación crítica: debe haber encontrado una orden válida
  expect(foundOrder).toBe(true);

  // Paso 2: Click en Checkout y Submit
  await page.getByRole('button', { name: /checkout/i }).click();
  await page.getByRole('button', { name: /Submit order|Place order/i }).click();

  // Paso 3: Validación del resultado
  if (await page.getByText(/order submitted for review, thank you/i).isVisible()) {
    await page.getByRole('button', { name: /close/i }).click();
    console.log(`🎉 Orden enviada con éxito`);
  } else {
    // Validar alertas de campos requeridos
    const shippingMissing = await page.locator('.mud-alert-message', { hasText: 'Shipping address is required.' }).isVisible();
    const deliveryMissing = await page.locator('.mud-alert-message', { hasText: 'Delivery date is required.' }).isVisible();
    const billingMissing = await page.locator('.mud-error-text', { hasText: 'Billing address required.' }).isVisible();

    const atLeastOneEmpty = shippingMissing || deliveryMissing || billingMissing;

    if (atLeastOneEmpty) {
      await expect(page.getByText(/Please fill in all required fields before proceeding with checkout/i)).toBeVisible();
      console.log(`⚠️ Faltan datos requeridos`);
    } else {
      await expect(page.getByText(/Please fill in all required fields before proceeding with checkout/i)).not.toBeVisible();
    }
  }
});

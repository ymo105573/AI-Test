import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch } from '../utils/order-helpers';


test('tc1.12-submit-order', async ({ page }) => {
  
  // Paso 1: Login usando helper
  await login(page);
  await page.waitForSelector('td.mud-table-cell', { timeout: 5000 });
  const orders = page.locator('td.mud-table-cell'); // todas las celdas de orden

  let foundOrder = false;
  
for (let i = 0; i < await orders.count(); i++) {
  const orderCell = orders.nth(i);
  const itemsText = await orderCell.locator('p.mud-typography-subtitle2', { hasText: 'items' }).textContent();

  if (!itemsText) continue; // si no tiene ese texto, sigue

  const match = itemsText.match(/(\d+)\sitems?/); // extrae el número (items o item singular)
 
  if (match) {
    const itemCount = parseInt(match[1], 10);
    if (itemCount >= 1) {
      // Encontramos la primera orden con 1 o más productos
      console.log(`Encontrada orden con ${itemCount} productos en índice ${i}`);

      // Ahora puedes interactuar con orderCell, por ejemplo:
      await orderCell.click();
      foundOrder = true;
     
    }
  }

  expect(foundOrder).toBe(true);
  await page.getByRole('button', { name: /checkout/i }).click();

  await page.getByRole('button', { name: /Submit order|Place order/i }).click();


  if (await page.getByText(/order submitted for review, thank you/i).isVisible()) {
    await page.getByRole('button', { name: /close/i }).click();
  } else {
             // Validar campos requeridos
            const shippingMissing = await page.locator('.mud-alert-message', { hasText: 'Shipping address is required.' }).isVisible();
  
            const deliveryMissing = await page.locator('.mud-alert-message', { hasText: 'Delivery date is required.' }).isVisible();

            const billingMissing = await page.locator('.mud-error-text', { hasText: 'Billing address required.' }).isVisible();
            const atLeastOneEmpty = shippingMissing || deliveryMissing || billingMissing;
           // const allEmpty = shippingMissing && deliveryMissing && billingMissing;

            //console.log({ shippingMissing, deliveryMissing, billingMissing });

            if ((atLeastOneEmpty)) {
              await expect(page.getByText(/Please fill in all required fields before proceeding with checkout/i)).toBeVisible();
            } else {
              await expect(page.getByText(/Please fill in all required fields before proceeding with checkout/i)).not.toBeVisible();
            }

} 


} 
  
});

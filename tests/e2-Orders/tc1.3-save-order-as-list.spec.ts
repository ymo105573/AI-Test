import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

// TC1.3: Guardar la orden como lista
// Precondición: Usuario autenticado (rol comprador). Debe existir al menos una orden en estado Draft.
// Pasos:
// 1. Login
// 2. Seleccionar una orden en estado Draft desde Orders (Open, Sent, History o Browse)
// 3. Click en la opción "Save order as list"
// 4. Verificar mensaje "Saved list created" y que la lista queda disponible

test('tc1.3 - Save la orden como lista', async ({ page }) => {
  // Paso 1: Login
    await login(page);

      // Step 2: Select an order
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    const originalName = await firstDataRow.textContent();

    await firstDataRow.click();
    await openOrderOptions(page);

    const options = page.locator('p.mud-menu-item-text');
    const changeNameOption = options.nth(2); // segunda opción del menú
    await expect(changeNameOption).toBeVisible();
    await changeNameOption.click();


  // Paso 3: Verificar mensaje de éxito
  await expect(page.getByText('Saved list created')).toBeVisible();

  // (Opcional) Paso 5: Navegar a Saved lists y verificar que la lista aparece
  // await page.getByText('Saved lists', { exact: true }).click();
  // await expect(page.getByText(/Order \d+/)).toBeVisible();
});

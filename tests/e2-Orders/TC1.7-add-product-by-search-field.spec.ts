import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { addProductBySearch } from '../utils/order-helpers';


test('tc1.7 - Add product by search field', async ({ page }) => {
  // Paso 1: Login
  // Paso 1: Login usando helper
  await login(page);
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  // Paso 2: Click para seleccionar la orden (en toda la fila)
  await firstDataRow.click();
  // Paso 3: Agregar producto usando el campo de búsqueda
  await addProductBySearch(page, 'bea');
  
});

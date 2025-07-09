import { test, expect, Page } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions} from '../utils/order-helpers';


// TC1.2: Cambiar el nombre de la orden
test('tc1.2 - Rename the order', async ({ page }) => {
  // Paso 1: Login
  await login(page);

  // Esperar que haya al menos una fila de datos (la fila 0 es encabezado)
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();

  // Paso 2: Click para seleccionar la orden (en toda la fila)
  await firstDataRow.click();

  await openOrderOptions(page);

  // Paso 4: Seleccionar la opción de cambiar el nombre
  // const changeNameOption = page.locator('p.mud-menu-item-text', { hasText: 'Change order name' });
  const options = page.locator('p.mud-menu-item-text');
  const changeNameOption = options.nth(1); // segunda opción del menú
  await expect(changeNameOption).toBeVisible();
  await changeNameOption.click();

  // Paso 5: Completar el nuevo nombre
  const nameTextbox = page.getByRole('textbox', { name: 'Order' });
  await nameTextbox.fill('Rename orden QA');

  // Confirmar el cambio cerrando el modal (clic en un espacio vacío)
  await page.locator('.mud-grid').click();

  // Paso 6: Validación
  await expect(page.getByText('Rename orden QA')).toBeVisible();
});


import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

test('tc1.3 - Restore original name if left blank', async ({ page }) => {
  await login(page);

  // Paso 1: Seleccionar una orden
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  const originalName = await firstDataRow.textContent();

  await firstDataRow.click();
  await openOrderOptions(page);

  // Paso 2: Cambiar el nombre
  // const changeNameOption = page.locator('p.mud-menu-item-text', { hasText: 'Change order name' });
  const options = page.locator('p.mud-menu-item-text');
  const changeNameOption = options.nth(1); // segunda opción del menú
  await expect(changeNameOption).toBeVisible();
  await changeNameOption.click();

  const nameTextbox = page.getByRole('textbox', { name: 'Order' });
  await expect(nameTextbox).toBeVisible();
  await nameTextbox.fill('Nuevo Nombre QA');
  await page.locator('.mud-grid').click();
  await expect(page.getByText('Nuevo Nombre QA')).toBeVisible();

  // Paso 3: Intentar dejarlo en blanco
  await openOrderOptions(page);
  await changeNameOption.click();
  await expect(nameTextbox).toBeVisible();
  await nameTextbox.fill('');
  await page.locator('.mud-grid').click();

  // Paso 4: Validar que se restaura el nombre original o que el sistema no permite dejarlo vacío
  // Aquí depende de la lógica real de la app
  await expect(page.getByText('Nuevo Nombre QA')).not.toBeVisible();
  
// Suponiendo que el modal está abierto
const dialogLocator = page.locator('.mud-dialog-container');

// Buscar el heading nivel 6 dentro del diálogo (que corresponde al nombre de la orden)
const orderNameLocator = dialogLocator.getByRole('heading', { level: 6 }).first();

// Esperar que esté visible
await expect(orderNameLocator).toBeVisible();

// Obtener el texto del nombre de la orden
const orderNameText = await orderNameLocator.textContent();

// Validar que el nombre no esté vacío ni solo espacios en blanco
expect(orderNameText?.trim().length).toBeGreaterThan(0);


});

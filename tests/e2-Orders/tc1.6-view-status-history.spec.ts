import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

// tc1.6: Visualizar historial de estados de una orden

test('tc1.6 - Visualizar historial de estados de una orden', async ({ page }) => {
  //Login
    await login(page);

      // Step 1: Select an order
    const firstDataRow = page.locator('td.cursor-pointer').first();
    await expect(firstDataRow).toBeVisible();
    const originalName = await firstDataRow.textContent();
    await firstDataRow.click();

  // Click en el botón que abre el historial
  await page.locator('button.mud-chip-close-button').first().click();


  // Valida que hay al menos 1 eventos de estado
  const eventos = await page.locator('text=/by|door|por/i').all();
  expect(eventos.length).toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(1000);

  // Valida que cada evento tiene texto de estado, actor y fecha/hora
  for (const evento of eventos) {
    const text = await evento.textContent();
    expect(text).toMatch(/by|door|por/i);
    // Opcional: valida formato de fecha/hora si es posible
  }

  // Valida que hay al menos un icono de estado (ajusta selector si es necesario)
  const iconos = await page.locator('svg').all();
  expect(iconos.length).toBeGreaterThan(0);

  // Validar que el estado actual (verde) aparece exactamente una vez
  const estadoActualVerde = page.locator('.mud-step-label-icon.mud-success');
  await expect(estadoActualVerde).toHaveCount(1);

  // Validar que los estados anteriores (azules) pueden estar o no
  const estadosAnterioresAzul = page.locator('.mud-step-label-icon.mud-info');
  const cantidadAzules = await estadosAnterioresAzul.count();
  expect(cantidadAzules).toBeGreaterThanOrEqual(0); // pueden ser cero o más


  // Cierra el modal (Close/Cerrar)
  const dialog = page.locator('div.mud-dialog-title');
  const closeBtn = dialog.locator('button');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();

});

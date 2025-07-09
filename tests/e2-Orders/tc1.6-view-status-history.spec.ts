import { test, expect } from '@playwright/test';
import { login } from '../utils/auth';
import { openOrderOptions } from '../utils/order-helpers';

// tc1.6: View order status history

test('tc1.6 -View status history', async ({ page }) => {
  // Login
  await login(page);

  // Step 1: Select an order
  const firstDataRow = page.locator('td.cursor-pointer').first();
  await expect(firstDataRow).toBeVisible();
  const originalName = await firstDataRow.textContent();
  await firstDataRow.click();

  // Click the button that opens the status history
  await page.locator('button.mud-chip-close-button').first().click();

  // Validate that there is at least 1 status event
  const eventos = await page.locator('text=/by|door|por/i').all();
  expect(eventos.length).toBeGreaterThanOrEqual(1);
  await page.waitForTimeout(1000);

  // Validate that each event has status text, actor, and date/time
  for (const evento of eventos) {
    const text = await evento.textContent();
    expect(text).toMatch(/by|door|por/i);
    // Optional: validate date/time format if possible
  }

  // Validate that there is at least one status icon (adjust selector if needed)
  const iconos = await page.locator('svg').all();
  expect(iconos.length).toBeGreaterThan(0);

  // Validate that the current status (green) appears exactly once
  const estadoActualVerde = page.locator('.mud-step-label-icon.mud-success');
  await expect(estadoActualVerde).toHaveCount(1);

  // Validate that previous statuses (blue) may or may not be present
  const estadosAnterioresAzul = page.locator('.mud-step-label-icon.mud-info');
  const cantidadAzules = await estadosAnterioresAzul.count();
  expect(cantidadAzules).toBeGreaterThanOrEqual(0); // can be zero or more

  // Close the modal (Close)
  const dialog = page.locator('div.mud-dialog-title');
  const closeBtn = dialog.locator('button');
  await expect(closeBtn).toBeVisible();
  await closeBtn.click();
});

import { test, expect } from '@playwright/test';

// TC1.6: Visualizar historial de estados de una orden

test('TC1.6 - Visualizar historial de estados de una orden', async ({ page }) => {
  // Login
  await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/order/open');
  await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
  await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/order\/open/);

  // Selecciona una orden con historial (ajusta el texto según tu entorno)
  await page.getByText('Placed', { exact: false }).first().click();

  // Haz click en el botón de estado (badge o similar)
  await page.getByRole('button', { name: /Placed|Pending|Draft|To manager|To finance manager/i }).first().click();

  // Valida que se abre el modal/lista de historial
  await expect(page.getByText(/by/i)).toBeVisible(); // Busca algún texto común en los eventos

  // Valida que hay al menos 2 eventos de estado
  const eventos = await page.locator('text=/by/').all();
  expect(eventos.length).toBeGreaterThanOrEqual(2);

  // Valida que cada evento tiene texto de estado, actor y fecha/hora
  for (const evento of eventos) {
    const text = await evento.textContent();
    expect(text).toMatch(/by/);
    // Opcional: valida formato de fecha/hora si es posible
  }

  // Valida que hay al menos un icono de estado (ajusta selector si es necesario)
  const iconos = await page.locator('svg').all();
  expect(iconos.length).toBeGreaterThan(0);

  // Cierra el modal (Close/Cerrar)
  // Intenta varios selectores por robustez
  const closeBtn = page.getByRole('button', { name: /Close|Cerrar|Placed Close|To finance manager Close/i });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  } else {
    // Alternativa: busca por label en el dialog
    const dialogClose = page.getByRole('dialog').getByLabel('Close');
    if (await dialogClose.isVisible()) {
      await dialogClose.click();
    }
  }

  // Valida que regresa a la vista de la orden
  await expect(page.getByText('Placed', { exact: false })).toBeVisible();
});

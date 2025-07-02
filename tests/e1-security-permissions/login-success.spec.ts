import { test, expect } from '@playwright/test';
test.use({ video: 'on' });
test.describe('E1-HU1: Autenticación de usuario', () => {
  // CT1.1: Login exitoso
  test('CT1.1: Login exitoso con credenciales válidas', async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Validar que el login fue exitoso (botón con nombre de empresa visible)
    await expect(page.getByRole('button').filter({ hasText: 'YM Business One B.V.' })).toBeVisible();
    // Navegar a la página principal de órdenes abiertas
    await page.goto('https://in-order.test.nebulaplatform.app/order/open');
    // Esperar a que se cargue la tabla de órdenes abiertas y el encabezado
    const heading = page.locator('h1,h2,h3,h4,h5,h6', { hasText: 'Open orders' });
    await expect(heading).toBeVisible({ timeout: 10000 });
    const table = page.locator('table');
    await expect(table).toBeVisible();
    // Esperar a que aparezca al menos una orden (si no hay, igual mostrar la tabla)
    // Pausa visual extendida para que el video capture la pantalla principal y las órdenes
    await page.waitForTimeout(4000);
  });

  
});

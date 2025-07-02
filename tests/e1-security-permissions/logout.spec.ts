 import { test, expect } from '@playwright/test';
 test.use({ video: 'on' });
 test.describe('E1-HU1: Autenticación de usuario', () => {
 // CT1.4: Logout exitoso
  test('CT1.4: Logout exitoso', async ({ page }) => {
    // Login primero
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button').filter({ hasText: 'YM Business One B.V.' })).toBeVisible();
    // Logout
    await page.getByRole('button').filter({ hasText: 'YM Business One B.V.' }).click();
    await page.getByRole('paragraph').filter({ hasText: 'Sign out' }).click();
    // Pausa visual para que el video capture el click en Sign out
    await page.waitForTimeout(2000);
    // Validar regreso a login
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });
  
  });
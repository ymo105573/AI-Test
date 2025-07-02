import { test, expect } from '@playwright/test';
test.use({ video: 'on' });

test.describe('E1-HU1: Autenticación de usuario', () => {
  // CT1.2: Login fallido
  test('CT1.2: Login fallido con credenciales inválidas', async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('qwerrrr');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Validar mensaje de error exacto
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });


});

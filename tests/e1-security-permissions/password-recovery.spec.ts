import { test, expect } from '@playwright/test';
test.use({ video: 'on' });

test.describe('E1-HU1: Autenticación de usuario', () => {

  // CT1.3: Recuperar contraseña
     test('CT1.3: Recuperar contraseña', async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('link', { name: /forgot password/i }).click();

    // Email inválido
    await page.getByRole('textbox', { name: /email/i }).fill('ymo');
    await page.getByRole('button', { name: /request/i }).click();
    await expect(page.getByText(/valid email address|correo electr[oó]nico v[aá]lido/i)).toBeVisible();

    // Email válido
    await page.getByRole('textbox', { name: /email/i }).fill('yannia@businessone.cw');
    await page.getByRole('button', { name: /request/i }).click();
    await expect(page.getByText(/We have sent an email to yannia@businessone.cw with instructions on how to reset your password if we found an account associdated with this email address./i)).toBeVisible();

    // Volver a login
    await page.getByRole('link', { name: /back to sign in|volver/i }).click();
    await expect(page.getByRole('button', { name: /sign in|iniciar sesi[oó]n/i })).toBeVisible();
  });
});

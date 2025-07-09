import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
  
  await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
  await page.getByRole('textbox', { name: 'Password' }).fill('P@ssw0rd');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Esperar hasta que el botón con el nombre de empresa sea visible (login exitoso)
  await page.getByRole('button').filter({ hasText: 'YM Business One B.V.' }).waitFor({ state: 'visible' });
}

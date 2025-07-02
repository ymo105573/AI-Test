import { test, expect } from '@playwright/test';

// Épica: Seguridad y Permisos
// Historia de Usuario: Iniciar y cerrar sesión de usuario
//   Como usuario
//   Quiero iniciar y cerrar sesión de forma segura
//   Para acceder a las funcionalidades según mis permisos
//
// Criterios de Aceptación:
// CA1: Given que estoy en la pantalla de login
//      When ingreso credenciales válidas y hago clic en “Sign in”
//      Then accedo al sistema y veo la pantalla principal
// CA2: Given que estoy en la pantalla de login
//      When ingreso credenciales inválidas y hago clic en “Sign in”
//      Then veo el mensaje “Invalid email or password” y no accedo
// CA3: Given que olvidé mi contraseña
//      When hago clic en “Forgot password?” y solicito el reset
//      Then veo el mensaje “If the email address exists in our system, you will receive a password reset email shortly.”
// CA4: Given que estoy autenticado
//      When hago clic en “Sign out”
//      Then regreso a la pantalla de login
//

// Checklist de Pruebas:
// [ ] El usuario puede acceder a la pantalla de login
// [ ] El usuario puede ingresar credenciales válidas y acceder al sistema
// [ ] El usuario ve la pantalla principal de órdenes abiertas tras autenticarse
// [ ] El usuario recibe mensaje de error con credenciales inválidas
// [ ] El usuario puede solicitar recuperación de contraseña
// [ ] El usuario recibe mensaje de confirmación al solicitar recuperación
// [ ] El usuario puede cerrar sesión y regresa a la pantalla de login

// Casos de Prueba (cada uno asociado a su criterio):
//
// CT1.1: Login exitoso con credenciales válidas (CA1)
// Precondición: El usuario tiene una cuenta activa y conoce sus credenciales.
// Pasos y resultados esperados:
//   1. Navegar a la pantalla de login.
//      - Se muestra el formulario de login.
//   2. Ingresar un email válido (yannia@businessone.cw).
//      - El campo email contiene el valor ingresado.
//   3. Ingresar la contraseña correcta (P@ssw0rd).
//      - El campo password contiene el valor ingresado.
//   4. Hacer clic en "Sign in".
//      - El sistema permite el acceso y redirige a la pantalla principal de órdenes abiertas (https://in-order.test.nebulaplatform.app/order/open).
//   5. Visualizar la tabla de órdenes abiertas.
//      - Se muestra el encabezado "Open orders" y una tabla con las órdenes abiertas.
//
// CT1.2: Login fallido con credenciales inválidas (CA2)
// Precondición: El usuario tiene una cuenta activa.
// Pasos y resultados esperados:
//   1. Navegar a la pantalla de login.
//      - Se muestra el formulario de login.
//   2. Ingresar un email válido (yannia@businessone.cw).
//      - El campo email contiene el valor ingresado.
//   3. Ingresar una contraseña incorrecta (qwerrrr).
//      - El campo password contiene el valor ingresado.
//   4. Hacer clic en "Sign in".
//      - El sistema muestra el mensaje exacto "Invalid email or password" y no permite el acceso.
//
// CT1.3: Recuperar contraseña (CA3)
// Precondición: El usuario conoce su email registrado.
// Pasos y resultados esperados:
//   1. Navegar a la pantalla de login.
//      - Se muestra el formulario de login.
//   2. Hacer clic en "Forgot password?".
//      - Se muestra el formulario de recuperación de contraseña.
//   3. Ingresar un email con formato incorrecto (correo-invalido).
//      - El sistema muestra un mensaje de error indicando que el email debe tener formato válido.
//   4. Ingresar un email registrado y válido (yannia@business.sr).
//      - El campo email contiene el valor ingresado.
//   5. Hacer clic en "Request".
//      - El sistema muestra el mensaje exacto "If the email address exists in our system, you will receive a password reset email shortly.".
//   6. Hacer clic en "Back to sign in".
//      - Se regresa a la pantalla de inicio de sesión.
//

// CT1.4: Logout exitoso (CA4)
// Precondición: El usuario está autenticado y en la pantalla principal.
// Pasos y resultados esperados:
//   1. Hacer clic en el botón con el nombre de la empresa ("YM Business One B.V.").
//      - Se despliega el menú de usuario.
//   2. Seleccionar "Sign out".
//      - El sistema cierra la sesión y redirige al usuario a la pantalla de login (botón "Sign in" visible).


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

  // CT1.2: Login fallido
  test('CT1.2: Login fallido con credenciales inválidas', async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('textbox', { name: 'Email address' }).fill('yannia@businessone.cw');
    await page.getByRole('textbox', { name: 'Password' }).fill('qwerrrr');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Validar mensaje de error exacto
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  // CT1.3: Recuperar contraseña
  test('CT1.3: Recuperar contraseña', async ({ page }) => {
    await page.goto('https://in-order.test.nebulaplatform.app/security/sign-in?redirectUri=https://in-order.test.nebulaplatform.app/');
    await page.getByRole('link', { name: /forgot password/i }).click();

    // Email inválido
    await page.getByRole('textbox', { name: /email/i }).fill('ymo');
    await page.getByRole('button', { name: /request/i }).click();
    await expect(page.getByText(/valid email address|correo electr[oó]nico v[aá]lido/i)).toBeVisible();

    // Email válido
    await page.getByRole('textbox', { name: /email/i }).fill('test@test.com');
    await page.getByRole('button', { name: /request/i }).click();
    await expect(page.getByText(/you will receive a password reset email|recibir[aá]s un correo/i)).toBeVisible();

    // Volver a login
    await page.getByRole('link', { name: /back to sign in|volver/i }).click();
    await expect(page.getByRole('button', { name: /sign in|iniciar sesi[oó]n/i })).toBeVisible();
  });

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

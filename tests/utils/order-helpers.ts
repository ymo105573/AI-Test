import { Page, expect } from '@playwright/test';

/**
 * Crea una orden vacía desde la vista Orders y se queda en el modal abierto.
 * Retorna el número de la orden creada.
 */
export async function createEmptyOrder(page: Page): Promise<string> {
  await page.goto('https://in-order.test.nebulaplatform.app/order/open');

  const newOrderButton = page.getByRole('button', { name: 'New order' });
  await expect(newOrderButton).toBeVisible();
  await newOrderButton.click();

  // Esperar que aparezca el modal con el número de orden
  const orderHeading = page.getByRole('heading', { name: /Order \d+/i, level: 6 });
  await expect(orderHeading).toBeVisible();

  // Extraer el número de orden
  const orderText = await orderHeading.textContent();
  const orderNumberMatch = orderText?.match(/\d+/);
  const orderNumber = orderNumberMatch ? orderNumberMatch[0] : '';

  // Validar que el mensaje de orden vacía aparezca
  await expect(page.getByRole('heading', { name: 'Your order is empty', level: 4 })).toBeVisible();
  await expect(page.getByText('Add products to this draft order to get started.')).toBeVisible();

  // No se hace click en "Atrás", el modal queda abierto
  return orderNumber;
}


/**
 * Abre el modal de opciones (3 punticos) de la orden.
 */
export async function openOrderOptions(page: Page) {
  const dialogLocator = page.locator('.mud-dialog-container');
  await expect(dialogLocator).toBeVisible();

  // Navegar exactamente al botón de los tres punticos
  const optionsButton = dialogLocator.locator(
    'div.mud-dialog-content .mud-paper .mud-menu-activator button'
  );

  await expect(optionsButton).toBeVisible();
  await optionsButton.click();
}

/**
 * Agrega un producto a la orden usando el campo de búsqueda.
 * @param page 
 * @param searchTerm 
 */
export async function addProductBySearch(page, searchTerm: string) {
  const searchBox = page.getByRole('textbox', { name: /Search to add/i });
  await expect(searchBox).toBeVisible();
  await searchBox.fill(searchTerm);

  const dropdownItems = page.locator('div.mud-list-item-clickable');
  //await expect(dropdownItems.first()).toBeVisible({ timeout: 20000 });
  const visibleItem = dropdownItems.filter({ has: page.locator(':visible') }).first();
  await expect(visibleItem).toBeVisible({ timeout: 10000 });
  await visibleItem.click();
  // Pausa para animaciones o carga
  await page.waitForTimeout(500);

  // Si sigue sin funcionar, intenta click absoluto con mouse
  try {
    const box = await visibleItem.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }
  } catch {
    // ignorar error si no funciona
  }
// Validaciones
const matchingProduct = dropdownItems.filter({ hasText: searchTerm }).first();

  if (await matchingProduct.count() > 0) {
    // Si aparece en la lista, hacer click para agregar o aumentar cantidad
    await matchingProduct.click();
  } 
  
  
  const orderLine = page.getByRole('cell', { name: new RegExp(searchTerm, 'i') });

  //await expect(orderLine).toBeVisible({ timeout: 10000 });

  await expect(orderLine.getByRole('button', { name: /Remove/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Save/i })).toBeVisible();
  await expect(orderLine.getByRole('button', { name: /Add remark/i })).toBeVisible();

  const checkoutBtn = page.getByRole('button', { name: /Continue to checkout \(\d+ items?\)/i });
  await expect(checkoutBtn).toBeEnabled();
}
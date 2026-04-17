import { test, expect } from '@playwright/test';
import { timeStamp } from 'node:console';

test('test', async ({ page }) => {
  const now = new Date();
const uniqueName = `Auditorio Principal ${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}${String(now.getMilliseconds()).padStart(3,'0')}`;
// Resultado: "Auditorio Principal 20260416-143022123"

  await page.goto('https://admin.app.siges.lat/login');
  await page.getByRole('textbox', { name: 'Usuario / Correo electronico' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electronico' }).fill('20243ds158@utez.edu.mx');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123');
  await page.getByRole('textbox', { name: 'Usuario / Correo electronico' }).click();
  await page.getByRole('textbox', { name: 'Usuario / Correo electronico' }).fill('20243ds158@utez.edu.mx');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Test123#');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'Iniciar Sesión' }).click();
  await page.locator('a').filter({ hasText: 'Espacios' }).click();
  await page.getByRole('button', { name: 'Nuevo Espacio' }).click();
  await page.getByText('Nombre del espacio *Tipo *').click();
  await page.getByRole('textbox', { name: 'Ej. Auditorio Principal' }).click();
  await page.getByRole('textbox', { name: 'Ej. Auditorio Principal' }).fill(uniqueName); // 👈
  await page.getByRole('combobox').first().selectOption('5');
  await page.getByRole('combobox').nth(1).selectOption('1');
  await page.getByRole('textbox', { name: 'Ej. 200' }).click();
  await page.getByRole('textbox', { name: 'Ej. 200' }).fill('300');
  await page.getByPlaceholder('Cantidad').click();
  await page.getByPlaceholder('Cantidad').fill('1');
  await page.getByRole('combobox').nth(2).selectOption('HOURS');
  await page.getByRole('textbox', { name: 'Descripción del espacio...' }).click();
  await page.getByRole('textbox', { name: 'Descripción del espacio...' }).fill('Auditorio principal de docencia 1');
  await page.getByRole('textbox', { name: 'Ej. Proyector, Pizarrón' }).click();
  await page.getByRole('button', { name: 'Agregar' }).click();
  await page.getByRole('button', { name: 'L', exact: true }).click();
  await page.getByRole('button', { name: 'M' }).nth(1).click();
  await page.getByRole('button', { name: 'M' }).nth(2).click();
  await page.getByRole('button', { name: 'J' }).click();
  await page.getByRole('button', { name: 'J' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('12:12');
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('15:00');
  await page.getByRole('button', { name: '✓ Agregar' }).click();
  
  await expect(page.getByRole('heading', { name: 'Gestión' })).toBeVisible();
});
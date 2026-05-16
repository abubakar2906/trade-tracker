import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load the login page', async ({ page }) => {
    // Navigate to the local frontend server
    await page.goto('http://localhost:3000/login');
    
    // Check if the login form is present
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Fill in bad credentials
    await page.locator('input[type="email"]').fill('wrong@example.com');
    await page.locator('input[type="password"]').fill('badpass');
    
    // Click submit
    await page.locator('button[type="submit"]').click();
    
    // Wait for the Zod/Backend error to appear on the screen
    // We expect a toast or an error message text to pop up
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});

import { test, expect } from '@playwright/test'

test.describe('TreemapPulse Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Toggle dark mode', async ({ page }) => {
    const darkModeButton = page.locator('button[aria-label="Toggle dark mode"]')
    const htmlElement = page.locator('html')

    // Ensure initial state is not dark mode
    await expect(htmlElement).not.toHaveClass(/dark/, { timeout: 10000 })

    // Toggle dark mode
    await darkModeButton.click()
    await expect(htmlElement).toHaveClass(/dark/, { timeout: 10000 })

    // Toggle back to light mode
    await darkModeButton.click()
    await expect(htmlElement).not.toHaveClass(/dark/, { timeout: 10000 })
  })

  test('Load configuration from URL', async ({ page }) => {
    const urlInput = page.locator('input[placeholder="https://"]')
    const loadFromUrlButton = page.locator('button[aria-label="Load Configuration from URL"]')

    await expect(loadFromUrlButton).toBeVisible({ timeout: 10000 })

    // Set the URL input value
    await urlInput.fill('http://localhost:3000/configs/blank.json')

    // Intercept the network request to verify the request and response
    page.on('request', (request) => {
      console.log('Request:', request.url())
    })

    page.on('response', (response) => {
      console.log('Response:', response.url(), response.status())
    })

    // Click the button to load configuration from URL
    await loadFromUrlButton.click()

    // Wait for the configuration to load
    await page.waitForTimeout(5000)

    // Add assertions to verify the configuration is loaded
    await expect(page.locator('html')).toHaveText(/Root/, { timeout: 10000 })

    // Click the button to go back to home
    const resetButton = page.locator('button[aria-label="Go to home"]')
    await resetButton.click()
  })

  test('Upload configuration file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]')
    const uploadFileButton = page.locator('button[aria-label="Upload File"]')

    await expect(uploadFileButton).toBeVisible({ timeout: 10000 })

    // Upload a configuration file
    await fileInput.setInputFiles('public/configs/bug-tracking.json')

    // Click the button to trigger the file upload
    /* await uploadFileButton.click();

    // Wait for a reasonable amount of time to ensure the file is uploaded and configuration is loaded
    await page.waitForTimeout(5000);

    // Add assertions to verify the file is uploaded and configuration is loaded
    await expect(page.locator('text=File Config')).toBeVisible({ timeout: 10000 });

    const resetButton = page.locator('button[aria-label="Go to home"]')
    await resetButton.click() */
  })

  test('Load custom configuration from user input', async ({ page }) => {
    const loadConfigButton = page.locator('button[aria-label="Load Sample Data"]')

    // Click the button to load custom configuration from user input
    await loadConfigButton.click()

    // Add assertions to verify the custom configuration is loaded
    // This could include checking for specific text or elements that indicate the configuration has been loaded
    await expect(page.locator('text=Project 1')).toBeVisible()
  })
})

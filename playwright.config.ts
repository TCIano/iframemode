import { devices, defineConfig } from '@playwright/test'

const E2E_PORT = 5180
const E2E_BASE_URL = `http://127.0.0.1:${E2E_PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: E2E_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: false,
  },
})

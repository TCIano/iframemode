import { expect, test } from '@playwright/test'

test('应用挂载并渲染布局', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.app-layout')).toBeVisible()
})

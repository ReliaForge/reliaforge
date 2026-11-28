import { expect, test } from "@playwright/test"

test("English landing page switches interactive console views, action traces, and code tabs", async ({ page }) => {
  await page.goto("/?lang=en")

  await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
  await expect(
    page.getByRole("heading", { name: "One console for your servers, clusters, and scripts.", level: 1 }),
  ).toBeVisible()

  await expect(page.getByRole("link", { name: "Try live demo" })).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/",
  )
  await expect(page.getByRole("link", { name: "Read the docs" })).toHaveAttribute(
    "href",
    "https://docs.reliaforge.dev/",
  )

  // Switch interactive console workbench tab
  await page.getByRole("tab", { name: "Proxmox VE" }).click()
  await expect(page.getByRole("img", { name: /ReliaForge Proxmox VE workspace/ })).toBeVisible()

  // Switch interactive 2 a.m. safety trace scenario
  await page.getByRole("tab", { name: "Open LXC Shell" }).click()
  await expect(page.getByText(/WS \/api\/v1\/plugins\/proxmox/)).toBeVisible()

  // Switch BYO Python code tab
  await page.getByRole("tab", { name: "workspace.tsx" }).click()
  await expect(page.getByText(/usePluginApi/)).toBeVisible()
})

test("Chinese landing page renders localized copy and destinations cleanly", async ({ page }) => {
  await page.goto("/?lang=zh")

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
  await expect(
    page.getByRole("heading", { name: "一个控制台，管完集群和你的脚本。", level: 1 }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "在线体验" })).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/?lang=zh",
  )
  await expect(page.getByRole("link", { name: "阅读文档" })).toHaveAttribute(
    "href",
    "https://docs.reliaforge.dev/zh/",
  )
})

test("language switcher toggles between EN and ZH without overflow", async ({ page }) => {
  await page.goto("/?lang=en")
  await page.getByRole("radio", { name: "中文" }).click()
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
  await expect(
    page.getByRole("heading", { name: "一个控制台，管完集群和你的脚本。", level: 1 }),
  ).toBeVisible()

  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth)
})

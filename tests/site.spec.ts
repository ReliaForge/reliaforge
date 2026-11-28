import { expect, test } from "@playwright/test"

test("English landing page simulates live topology recovery, interconnected micro-widgets, and Python studio", async ({ page }) => {
  await page.goto("/?lang=en&theme=dark")

  await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(
    page.getByRole("heading", {
      name: "Self-hosted console for your infrastructure and Python ops tools.",
      level: 1,
    }),
  ).toBeVisible()

  await expect(page.getByRole("link", { name: "Full console demo", exact: true })).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/",
  )
  await expect(page.getByText("docker pull ghcr.io/reliaforge/reliaforge:latest")).toBeVisible()

  // Trigger incident simulation -> click allowlisted restart -> verify SQLite audit #4822
  await page.getByTestId("simulate-incident").click()
  const restartBtn = page.getByRole("button", { name: "Run allowlisted restart" })
  if (await restartBtn.isVisible()) {
    await restartBtn.click()
  }
  await expect(page.getByText(/#4822/)).toBeVisible({ timeout: 5000 })

  // Toggle theme to light mode
  await page.getByTestId("theme-toggle").click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)

  // Tap interconnected Argo CD sync & Alert silence micro-widgets -> verify shared ops_audit counter increments
  await page.getByTestId("widget-argo-sync").click()
  await expect(page.getByText("#4822").first()).toBeVisible()
  await page.getByTestId("widget-alert-silence").click()
  await expect(page.getByText("#4823")).toBeVisible()

  // Interact with live Python Plugin Studio
  await page.getByRole("tab", { name: "workspace.tsx" }).click()
  await expect(page.getByText(/DataTable/).first()).toBeVisible()
  await page.getByRole("button", { name: "Verify" }).first().click()
  await expect(page.getByText(/action=owner\.verify/)).toBeVisible()
})

test("Chinese landing page renders localized copy and light mode cleanly", async ({ page }) => {
  await page.goto("/?lang=zh&theme=light")

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(
    page.getByRole("heading", { name: "自托管的基础设施与运维工具台。", level: 1 }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "全屏控制台演示", exact: true })).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/?lang=zh",
  )
})

test("language and theme switchers work without horizontal overflow on desktop and mobile", async ({ page }) => {
  await page.goto("/?lang=en&theme=light")
  await page.getByRole("radio", { name: "中文" }).click()
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
  await expect(
    page.getByRole("heading", { name: "自托管的基础设施与运维工具台。", level: 1 }),
  ).toBeVisible()

  await page.getByTestId("theme-toggle").click()
  await expect(page.locator("html")).toHaveClass(/dark/)

  const sizes = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth)
})

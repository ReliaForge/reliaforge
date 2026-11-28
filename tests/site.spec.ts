import { expect, test } from "@playwright/test"

test("English landing page switches interactive console views, themes, action traces, and code tabs", async ({ page }) => {
  await page.goto("/?lang=en&theme=dark")

  await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expect(
    page.getByRole("heading", {
      name: "Self-hosted console for your infrastructure and Python ops tools.",
      level: 1,
    }),
  ).toBeVisible()

  await expect(page.getByRole("link", { name: "Live demo", exact: true })).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/",
  )
  await expect(page.getByRole("link", { name: "Documentation", exact: true })).toHaveAttribute(
    "href",
    "https://docs.reliaforge.dev/",
  )

  // Switch interactive console workbench tab in dark mode
  await page.getByRole("tab", { name: "Proxmox VE" }).click()
  const proxmoxImg = page.getByRole("img", { name: /ReliaForge Proxmox VE workspace/ })
  await expect(proxmoxImg).toBeVisible()
  await expect(proxmoxImg).toHaveAttribute("src", "/views/view-proxmox.png")

  // Toggle to light mode and verify screenshot + html class switch cleanly
  await page.getByTestId("theme-toggle").click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(proxmoxImg).toHaveAttribute("src", "/views/view-proxmox-light.png")

  // Switch interactive safety trace scenario and replay
  await page.getByRole("tab", { name: "LXC shell" }).click()
  await expect(page.getByText(/WS \/api\/v1\/plugins\/proxmox/)).toBeVisible()
  await page.getByRole("button", { name: "Replay" }).click()
  await expect(page.getByText(/ops_audit -> actor=oncall/)).toBeVisible()

  // Switch BYO Python code tab
  await page.getByRole("tab", { name: "workspace.tsx" }).click()
  await expect(page.getByText(/usePluginApi/).first()).toBeVisible()
})

test("Chinese landing page renders localized copy and light mode cleanly", async ({ page }) => {
  await page.goto("/?lang=zh&theme=light")

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN")
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(
    page.getByRole("heading", { name: "自托管的基础设施与运维工具台。", level: 1 }),
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "在线演示", exact: true }).first()).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/?lang=zh",
  )
  await expect(page.getByRole("link", { name: "阅读文档", exact: true })).toHaveAttribute(
    "href",
    "https://docs.reliaforge.dev/zh/",
  )
  await expect(page.getByRole("img", { name: /ReliaForge 总览界面/ })).toHaveAttribute(
    "src",
    "/views/view-overview-light.png",
  )
})

test("language and theme switchers work without horizontal overflow", async ({ page }) => {
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

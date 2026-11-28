import { expect, test } from "@playwright/test"

test("English landing page switches console views, themes, action traces, live plugin studio, and compose tabs", async ({ page }) => {
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
  await expect(page.getByRole("link", { name: "GitHub", exact: true }).first()).toHaveAttribute(
    "href",
    "https://github.com/ReliaForge",
  )
  await expect(page.getByText("docker pull ghcr.io/reliaforge/reliaforge:latest")).toBeVisible()

  // Switch interactive console workbench tab in dark mode
  await page.getByRole("tab", { name: "Proxmox VE" }).click()
  const proxmoxImg = page.getByRole("img", { name: /ReliaForge Proxmox VE workspace/ })
  await expect(proxmoxImg).toBeVisible()
  await expect(proxmoxImg).toHaveAttribute("src", "/views/view-proxmox.png")

  // Toggle to light mode and verify screenshot + html class switch cleanly
  await page.getByTestId("theme-toggle").click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(proxmoxImg).toHaveAttribute("src", "/views/view-proxmox-light.png")

  // Toggle interactive live iframe mode and back
  await page.getByTestId("live-console-toggle").click()
  await expect(page.locator('iframe[title*="Proxmox VE"]')).toBeVisible()
  await page.getByTestId("live-console-toggle").click()
  await expect(proxmoxImg).toBeVisible()

  // Switch interactive safety trace scenario and replay
  await page.getByRole("tab", { name: "LXC shell" }).click()
  await expect(page.getByText(/WS \/api\/v1\/plugins\/proxmox/)).toBeVisible()
  await page.getByRole("button", { name: "Replay" }).click()
  await expect(page.getByText(/ops_audit -> actor=oncall/)).toBeVisible()

  // Interact with live Python Plugin Studio (code tab + verify action)
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
  await expect(page.getByRole("link", { name: "在线演示", exact: true }).first()).toHaveAttribute(
    "href",
    "https://demo.reliaforge.dev/?lang=zh",
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

import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"
import { scanTree } from "./check-open-source-hygiene.mjs"

test("scanner reports sensitive content without returning values", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reliaforge-web-scan-"))
  const brand = ["op", "po"].join("")
  const privateAddress = ["192", "168", "8", "9"].join(".")
  const secretKey = ["api", "key"].join("_")
  fs.writeFileSync(path.join(root, "sample.txt"), `${brand}\n${privateAddress}\n${secretKey} = "not-a-placeholder"\n`)

  const findings = scanTree(root)
  assert.deepEqual(findings.map((item) => item.rule).sort(), ["forbidden-brand", "private-address", "secret-literal"])
  assert.equal(JSON.stringify(findings).includes("not-a-placeholder"), false)
})

test("scanner accepts public examples", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reliaforge-web-scan-"))
  fs.writeFileSync(path.join(root, "README.md"), "Visit https://example.com or contact contributor@example.com.\n")
  assert.deepEqual(scanTree(root), [])
})

test("scanner rejects binary and non-example environment files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reliaforge-web-scan-"))
  fs.writeFileSync(path.join(root, ".env.production"), "SITE_URL=https://example.com\n")
  fs.writeFileSync(path.join(root, "image.png"), Buffer.from([0x89, 0x50, 0x00, 0x47]))

  assert.deepEqual(scanTree(root), [
    { rule: "risk-path", path: ".env.production", line: 0 },
    { rule: "binary-file", path: "image.png", line: 0 },
  ])
})

test("scanner allows only the canonical public image assets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reliaforge-web-scan-"))
  fs.mkdirSync(path.join(root, "public", "views"), { recursive: true })
  fs.writeFileSync(path.join(root, "public", "mark.png"), Buffer.from([0x89, 0x50, 0x00, 0x47]))
  fs.writeFileSync(path.join(root, "public", "views", "view-overview.png"), Buffer.from([0x89, 0x50, 0x00, 0x47]))
  fs.writeFileSync(path.join(root, "public", "other.png"), Buffer.from([0x89, 0x50, 0x00, 0x47]))

  assert.deepEqual(scanTree(root), [
    { rule: "binary-file", path: "public/other.png", line: 0 },
  ])
})

import { Check, Copy, Play, Search } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import type { CodeTab, StudioCopy } from "../data/content"
import { SyntaxCode } from "./SyntaxCode"

interface OwnerRow {
  service: string
  team: string
  tier: string
  verifiedAt: string | null
}

const INITIAL_ROWS: OwnerRow[] = [
  { service: "payments-api", team: "payments-ops", tier: "tier-0", verifiedAt: null },
  { service: "checkout-worker", team: "edge-sre", tier: "tier-1", verifiedAt: null },
  { service: "ingress-gateway", team: "platform-net", tier: "tier-0", verifiedAt: null },
  { service: "ledger-sync", team: "payments-ops", tier: "tier-1", verifiedAt: null },
]

interface PluginLiveStudioProps {
  tabs: CodeTab[]
  studio: StudioCopy
  copyLabel: string
  copiedLabel: string
}

export function PluginLiveStudio({
  tabs,
  studio,
  copyLabel,
  copiedLabel,
}: PluginLiveStudioProps) {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const [copied, setCopied] = useState(false)
  const [previewMode, setPreviewMode] = useState<"ui" | "json">("ui")
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState<OwnerRow[]>(INITIAL_ROWS)
  const [pendingService, setPendingService] = useState<string | null>(null)
  const [auditLine, setAuditLine] = useState(
    "ops_audit · ready · actor=oncall@example.com",
  )

  const tabListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

  useLayoutEffect(() => {
    const updatePill = () => {
      const btn = tabRefs.current[active.id]
      if (!btn || !tabListRef.current) return
      setPill({ left: btn.offsetLeft, width: btn.offsetWidth, ready: true })
    }
    updatePill()
    window.addEventListener("resize", updatePill)
    return () => window.removeEventListener("resize", updatePill)
  }, [active.id, tabs])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const handleVerify = (service: string) => {
    setPendingService(service)
    window.setTimeout(() => {
      setRows((prev) =>
        prev.map((row) =>
          row.service === service ? { ...row, verifiedAt: "6ms" } : row,
        ),
      )
      setAuditLine(
        `ops_audit -> actor=oncall  action=owner.verify  target=${service}`,
      )
      setPendingService(null)
    }, 180)
  }

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return r.service.includes(q) || r.team.includes(q)
  })

  const jsonOutput = `{
  "plugin": "service_owner",
  "authenticated_as": "oncall@example.com",
  "items": [
    { "service": "payments-api", "team": "payments-ops", "tier": "tier-0" },
    { "service": "checkout-worker", "team": "edge-sre", "tier": "tier-1" }
  ]
}`

  return (
    <div className="min-w-0 overflow-hidden rounded-[12px] border border-hairline bg-panel shadow-[var(--frame-shadow)]">
      <div className="grid divide-y divide-hairline lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:divide-x lg:divide-y-0">
        {/* Left pane: Python / Manifest / TSX source */}
        <div className="min-w-0 flex flex-col bg-code-bg">
          <div className="flex items-center justify-between gap-3 border-b border-hairline bg-obsidian/75 px-3 py-2">
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Plugin source files"
              className="relative inline-flex max-w-full items-center gap-1 overflow-x-auto"
            >
              {pill.ready ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: `${pill.width}px`,
                    transform: `translateX(${pill.left}px)`,
                  }}
                  className="pointer-events-none absolute top-0 bottom-0 left-0 rounded-[5px] bg-surface shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                />
              ) : null}
              {tabs.map((tab) => {
                const selected = tab.id === active.id
                return (
                  <button
                    key={tab.id}
                    ref={(node) => {
                      tabRefs.current[tab.id] = node
                    }}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveId(tab.id)
                      setCopied(false)
                    }}
                    className={`relative z-10 shrink-0 rounded-[5px] px-3 py-1.5 font-mono text-[13px] font-medium transition-colors duration-200 ease-out ${
                      selected ? "text-signal" : "text-muted hover:text-ink"
                    }`}
                  >
                    {tab.filename}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[5px] border border-hairline bg-panel px-2.5 py-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {copied ? copiedLabel : copyLabel}
            </button>
          </div>

          <div key={active.id} className="stage-fade flex-1">
            <SyntaxCode code={active.code} language={active.language} />
          </div>
        </div>

        {/* Right pane: Live rendered plugin console workspace */}
        <div className="min-w-0 flex flex-col justify-between bg-panel">
          <div>
            <div className="flex items-center justify-between gap-2 border-b border-hairline bg-obsidian/75 px-3.5 py-2">
              <span className="inline-flex items-center gap-2 font-mono text-[13px] text-subtle">
                <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                /p/service_owner
              </span>

              <div className="inline-flex rounded-[6px] border border-hairline bg-obsidian p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode("ui")}
                  className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-200 ease-out ${
                    previewMode === "ui" ? "bg-surface text-signal" : "text-muted hover:text-ink"
                  }`}
                >
                  {studio.uiTab}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("json")}
                  className={`rounded-[4px] px-2.5 py-1 font-mono text-[12px] font-medium transition-colors duration-200 ease-out ${
                    previewMode === "json" ? "bg-surface text-signal" : "text-muted hover:text-ink"
                  }`}
                >
                  JSON
                </button>
              </div>
            </div>

            {previewMode === "ui" ? (
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[15px] font-semibold text-ink">{studio.panelTitle}</div>
                  <div className="flex items-center gap-1.5 rounded-[6px] border border-hairline bg-obsidian px-2.5 py-1">
                    <Search className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={studio.searchPlaceholder}
                      aria-label={studio.searchPlaceholder}
                      className="w-32 bg-transparent text-[13px] text-ink placeholder:text-subtle focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3.5 overflow-hidden rounded-[8px] border border-hairline">
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-hairline bg-obsidian/70 text-[12px] font-medium text-subtle">
                        <th className="px-3 py-2">{studio.colService}</th>
                        <th className="px-3 py-2">{studio.colTeam}</th>
                        <th className="px-3 py-2 text-right">{studio.colAction}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {filtered.map((row) => {
                        const busy = pendingService === row.service
                        return (
                          <tr key={row.service} className="transition-colors duration-150 hover:bg-obsidian/45">
                            <td className="px-3 py-2.5 font-mono font-medium text-ink">
                              {row.service}
                            </td>
                            <td className="px-3 py-2.5 font-mono text-muted">{row.team}</td>
                            <td className="px-3 py-2.5 text-right">
                              {row.verifiedAt ? (
                                <span className="inline-flex items-center gap-1 font-mono text-[12px] text-signal">
                                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                  {studio.verifiedLabel} · {row.verifiedAt}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handleVerify(row.service)}
                                  className="inline-flex items-center gap-1 rounded-[5px] border border-hairline bg-obsidian px-2.5 py-1 text-[12px] font-medium text-ink transition-colors duration-150 hover:border-signal/60 hover:text-signal"
                                >
                                  <Play className="h-3 w-3 text-signal" aria-hidden="true" />
                                  {studio.verifyAction}
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="stage-fade">
                <SyntaxCode code={jsonOutput} language="json" />
              </div>
            )}
          </div>

          <div className="border-t border-hairline bg-obsidian/65 px-4 py-2.5 font-mono text-[12px] text-signal/95 overflow-x-auto whitespace-nowrap">
            {auditLine}
          </div>
        </div>
      </div>
    </div>
  )
}

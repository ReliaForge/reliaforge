import { Check, Pause, Play, RefreshCw, Terminal, VolumeX } from "lucide-react"
import { useEffect, useState } from "react"
import type { WidgetsCopy } from "../data/content"

interface AuditItem {
  id: number
  action: string
  target: string
  age: string
}

const RRD_BY_RANGE = {
  "1h": [14, 16, 15, 19, 17, 18, 20, 18, 17, 18],
  "24h": [11, 13, 22, 28, 23, 16, 15, 19, 20, 18],
  "7d": [15, 18, 25, 19, 16, 23, 18, 17, 21, 18],
} as const

const SHELL_OUTPUTS: Record<string, string> = {
  uptime: "07:42:18 up 30 days, load average: 0.14, 0.18, 0.16",
  "df -h": "/dev/loop0   60G   17G   41G  29% /",
  "free -h": "Mem:  4.0Gi total,  1.0Gi used,  2.9Gi avail",
}

const K8S_LOG_POOL = [
  { level: "INFO", msg: "POST /v1/charges status=200 duration_ms=11.4" },
  { level: "INFO", msg: "GET /readyz status=200 pool=6/32" },
  { level: "INFO", msg: "ledger.checkpoint lag_ms=4 offset=1849201" },
  { level: "WARN", msg: "retry_queue depth=2 backoff_ms=120" },
  { level: "INFO", msg: "POST /v1/refunds status=200 duration_ms=8.2" },
]

function SparkCurve({ values }: { values: readonly number[] }) {
  const w = 220
  const h = 38
  const min = 8
  const max = 32
  const coords = values.map((v, idx) => {
    const x = (idx / (values.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * (h - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const area = `0,${h} ${coords.join(" ")} ${w},${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-10 w-full" aria-hidden="true">
      <polygon points={area} fill="rgb(var(--accent-signal) / 0.10)" />
      <polyline
        fill="none"
        stroke="rgb(var(--accent-signal))"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords.join(" ")}
      />
    </svg>
  )
}

export function DeconstructedWidgets({ copy }: { copy: WidgetsCopy }) {
  const [range, setRange] = useState<"1h" | "24h" | "7d">("1h")
  const [shellCmd, setShellCmd] = useState<string>("uptime")
  const [logsLive, setLogsLive] = useState(true)
  const [logLines, setLogLines] = useState(() => K8S_LOG_POOL.slice(0, 4))
  const [argoSynced, setArgoSynced] = useState(false)
  const [alertSilenced, setAlertSilenced] = useState(false)
  const [auditSeq, setAuditSeq] = useState(4821)
  const [audits, setAudits] = useState<AuditItem[]>([
    { id: 4821, action: "k8s.rollout_restart", target: "payments/payments-api", age: "2m" },
    { id: 4820, action: "proxmox.lxc_terminal", target: "pve-prod-01/lxc/201", age: "18m" },
    { id: 4819, action: "argocd.sync", target: "ingress-gateway@4b7f0d2", age: "45m" },
  ])

  const appendAudit = (action: string, target: string) => {
    setAuditSeq((prev) => {
      const next = prev + 1
      setAudits((items) => [
        { id: next, action, target, age: copy.justNow },
        ...items.slice(0, 2),
      ])
      return next
    })
  }

  // Live SSE log ticker for Kubernetes widget
  useEffect(() => {
    if (!logsLive) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    let idx = 4
    const timer = window.setInterval(() => {
      const nextItem = K8S_LOG_POOL[idx % K8S_LOG_POOL.length]
      idx += 1
      setLogLines((prev) => [...prev.slice(-3), nextItem])
    }, 2400)
    return () => window.clearInterval(timer)
  }, [logsLive])

  const runShellChip = (cmd: string) => {
    setShellCmd(cmd)
    appendAudit("proxmox.lxc_exec", `lxc/201 (${cmd})`)
  }

  const triggerPodRestart = () => {
    setLogLines((prev) => [
      ...prev.slice(-3),
      { level: "INFO", msg: "rollout.restart pod=payments-api-7f9b4c ready=3/3" },
    ])
    appendAudit("k8s.rollout_restart", "payments/payments-api")
  }

  const handleArgoSync = () => {
    const next = !argoSynced
    setArgoSynced(next)
    if (next) {
      appendAudit("argocd.sync", "checkout-worker@9c10e4b")
    }
  }

  const handleToggleSilence = () => {
    const next = !alertSilenced
    setAlertSilenced(next)
    appendAudit(
      next ? "observability.silence" : "observability.unsilence",
      "NodeDiskMaintenance",
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-12">
      {/* 1. Proxmox VE Micro-Widget (Span 7) */}
      <div className="min-w-0 flex flex-col justify-between rounded-[12px] border border-hairline bg-panel p-5 shadow-[var(--frame-shadow)] lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[15px] font-semibold text-ink">Proxmox VE</span>
              <span className="font-mono text-[12px] text-subtle">proxmox</span>
            </div>

            <div className="inline-flex rounded-[6px] border border-hairline bg-obsidian p-0.5">
              {(["1h", "24h", "7d"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-[4px] px-2 py-0.5 font-mono text-[12px] font-medium transition-colors duration-150 ${
                    range === r ? "bg-surface text-signal" : "text-muted hover:text-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 grid items-center gap-4 sm:grid-cols-[auto_1fr]">
            <div className="font-mono">
              <div className="text-[20px] font-semibold tracking-tight text-ink">18.0% CPU</div>
              <div className="text-[12px] text-muted">26.4 / 64.0 GiB · pve-prod-01</div>
            </div>
            <SparkCurve values={RRD_BY_RANGE[range]} />
          </div>
        </div>

        {/* Thumb-friendly LXC 201 Micro-Shell */}
        <div className="mt-4 overflow-hidden rounded-[8px] border border-hairline bg-[#0b0e14] font-mono text-[12px] text-[#d5deed]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#080a0f] px-3 py-1.5">
            <span className="inline-flex items-center gap-1.5 text-[#9aa5b8]">
              <Terminal className="h-3.5 w-3.5 text-[#34d399]" aria-hidden="true" />
              lxc/201 · artifact-cache
            </span>
            <div className="flex items-center gap-1">
              {Object.keys(SHELL_OUTPUTS).map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => runShellChip(cmd)}
                  className={`rounded px-2 py-0.5 text-[11px] transition-colors duration-150 ${
                    shellCmd === cmd
                      ? "bg-[#34d399]/20 text-[#34d399]"
                      : "bg-white/5 text-[#9aa5b8] hover:text-white"
                  }`}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1 px-3 py-2.5 overflow-x-auto whitespace-nowrap">
            <div className="text-[#34d399]">root@artifact-cache:~# {shellCmd}</div>
            <div className="text-[#d5deed]">{SHELL_OUTPUTS[shellCmd]}</div>
          </div>
        </div>
      </div>

      {/* 2. Kubernetes Live SSE Stream Micro-Widget (Span 5) */}
      <div className="min-w-0 flex flex-col justify-between rounded-[12px] border border-hairline bg-panel p-5 shadow-[var(--frame-shadow)] lg:col-span-5">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[15px] font-semibold text-ink">Kubernetes</span>
              <span className="font-mono text-[12px] text-subtle">kubernetes</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLogsLive((v) => !v)}
                className="inline-flex items-center gap-1 rounded-[5px] border border-hairline bg-obsidian px-2 py-1 text-[12px] font-medium text-muted transition-colors duration-150 hover:text-ink"
              >
                {logsLive ? (
                  <Pause className="h-3 w-3 text-signal" aria-hidden="true" />
                ) : (
                  <Play className="h-3 w-3 text-signal" aria-hidden="true" />
                )}
                <span>{logsLive ? copy.pauseLogs : copy.resumeLogs}</span>
              </button>
              <button
                type="button"
                onClick={triggerPodRestart}
                className="inline-flex items-center gap-1 rounded-[5px] border border-hairline bg-obsidian px-2 py-1 text-[12px] font-medium text-ink transition-colors duration-150 hover:border-signal/60 hover:text-signal"
              >
                <RefreshCw className="h-3 w-3 text-signal" aria-hidden="true" />
                <span>{copy.restartPod}</span>
              </button>
            </div>
          </div>

          <div className="mt-2 font-mono text-[12px] text-muted">
            payments/payments-api-7f9b4c · SSE stream
          </div>
        </div>

        <div className="mt-3.5 space-y-1.5 overflow-x-auto rounded-[8px] border border-hairline bg-code-bg p-3 font-mono text-[12px] leading-[1.55]">
          {logLines.map((line, i) => (
            <div key={`${i}-${line.msg}`} className="whitespace-nowrap">
              <span
                className={
                  line.level === "WARN" ? "mr-2 text-amber-500" : "mr-2 text-signal"
                }
              >
                {line.level}
              </span>
              <span className="text-code-ink">{line.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Argo CD GitOps Micro-Widget (Span 4) */}
      <div className="min-w-0 flex flex-col justify-between rounded-[12px] border border-hairline bg-panel p-5 shadow-[var(--frame-shadow)] lg:col-span-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-semibold text-ink">Argo CD</span>
            <span className="font-mono text-[12px] text-subtle">gitops_argocd</span>
          </div>

          <div className="mt-4 divide-y divide-hairline rounded-[8px] border border-hairline bg-obsidian/55 font-mono text-[12px]">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-ink">payments-api</span>
              <span className="text-signal">Synced · 8f4c2a1</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-ink">ingress-gateway</span>
              <span className="text-signal">Synced · 4b7f0d2</span>
            </div>
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <span className="text-ink">checkout-worker</span>
              {argoSynced ? (
                <span className="inline-flex items-center gap-1 text-signal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Synced · 9c10e4b
                </span>
              ) : (
                <button
                  type="button"
                  data-testid="widget-argo-sync"
                  onClick={handleArgoSync}
                  className="inline-flex items-center gap-1.5 rounded-[5px] border border-amber-500/50 bg-amber-500/10 px-2.5 py-1 text-[12px] font-medium text-amber-500 transition-colors duration-150 hover:border-signal hover:bg-signal/15 hover:text-signal"
                >
                  <span>OutOfSync · {copy.syncAction}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Observability & Alert Silence Micro-Widget (Span 4) */}
      <div className="min-w-0 flex flex-col justify-between rounded-[12px] border border-hairline bg-panel p-5 shadow-[var(--frame-shadow)] lg:col-span-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-semibold text-ink">{copy.obsTitle}</span>
            <span className="font-mono text-[12px] text-subtle">observability</span>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-[8px] border border-hairline bg-obsidian/55 px-3 py-2 font-mono text-[12px]">
              <span className="text-muted">Prometheus · Loki</span>
              <span className="text-signal">P95 14.2ms</span>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-[8px] border border-hairline bg-obsidian/55 px-3 py-2.5">
              <div className="min-w-0">
                <div className="truncate font-mono text-[12px] font-medium text-ink">
                  NodeDiskMaintenance
                </div>
                <div
                  className={`font-mono text-[11px] ${
                    alertSilenced ? "text-subtle" : "text-amber-500"
                  }`}
                >
                  {alertSilenced ? copy.silencedState : copy.firingState}
                </div>
              </div>

              <button
                type="button"
                data-testid="widget-alert-silence"
                onClick={handleToggleSilence}
                className={`inline-flex shrink-0 items-center gap-1 rounded-[5px] border px-2.5 py-1 text-[12px] font-medium transition-colors duration-150 ${
                  alertSilenced
                    ? "border-signal/50 bg-signal/10 text-signal"
                    : "border-hairline bg-panel text-ink hover:border-signal/60 hover:text-signal"
                }`}
              >
                <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{alertSilenced ? "2h ✓" : copy.silenceBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Shared SQLite Audit & Cockpit Micro-Widget (Span 4) */}
      <div className="min-w-0 flex flex-col justify-between rounded-[12px] border border-hairline bg-panel p-5 shadow-[var(--frame-shadow)] lg:col-span-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-semibold text-ink">{copy.auditTitle}</span>
            <span className="font-mono text-[12px] text-signal">#{auditSeq}</span>
          </div>

          <div className="mt-4 divide-y divide-hairline rounded-[8px] border border-hairline bg-obsidian/55 font-mono text-[12px]">
            {audits.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-2 px-3 py-2 ${
                  idx === 0 && item.id > 4821 ? "bg-signal/[0.08] text-signal" : ""
                }`}
              >
                <div className="min-w-0 truncate">
                  <span className="text-ink">{item.action}</span>
                  <span className="ml-1.5 text-subtle">{item.target}</span>
                </div>
                <span className="shrink-0 text-[11px] text-subtle">{item.age}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

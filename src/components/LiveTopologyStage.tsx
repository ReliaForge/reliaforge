import { AlertTriangle, Check, Play, RotateCcw, ShieldCheck, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { TopologyCopy } from "../data/content"

type SimPhase = "nominal" | "alert" | "guarding" | "healed"

const PVE_SPARK = [14, 16, 15, 19, 17, 18, 21, 18, 17, 18]

function MiniSpark({ values }: { values: number[] }) {
  const max = 35
  const min = 8
  const w = 88
  const h = 22
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / (max - min)) * (h - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="shrink-0">
      <polyline
        fill="none"
        stroke="rgb(var(--accent-signal))"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  )
}

export function LiveTopologyStage({ copy }: { copy: TopologyCopy }) {
  const [phase, setPhase] = useState<SimPhase>("nominal")
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const runGuardedRecovery = () => {
    clearTimers()
    setPhase("guarding")
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("healed")
      }, 1350),
    )
  }

  const triggerSimulation = () => {
    clearTimers()
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setPhase("healed")
      return
    }
    setPhase("alert")
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("guarding")
      }, 1600),
      window.setTimeout(() => {
        setPhase("healed")
      }, 3000),
    )
  }

  const isAlert = phase === "alert"
  const isGuarding = phase === "guarding"
  const isHealed = phase === "healed"

  return (
    <div id="console" className="scroll-mt-24 w-full">
      {/* Unboxed top telemetry control strip */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2.5 font-mono text-[13px]">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span
              className={`signal-ping absolute inline-flex h-full w-full rounded-full ${
                isAlert ? "bg-amber-500" : "bg-signal"
              }`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isAlert ? "bg-amber-500" : "bg-signal"
              }`}
            />
          </span>
          <span className={isAlert ? "font-medium text-amber-500" : "text-muted"}>
            {isAlert
              ? copy.statusAlert
              : isGuarding
                ? copy.statusGuarding
                : isHealed
                  ? copy.statusHealed
                  : copy.statusNominal}
          </span>
        </div>

        <button
          type="button"
          data-testid="simulate-incident"
          onClick={triggerSimulation}
          className={`inline-flex min-h-[36px] items-center gap-2 rounded-[8px] border px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-200 ease-out ${
            isAlert
              ? "border-amber-500/60 bg-amber-500/10 text-amber-500"
              : "border-signal/45 bg-panel/90 text-ink shadow-sm hover:border-signal hover:text-signal"
          }`}
        >
          {isHealed ? (
            <RotateCcw className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          ) : (
            <Zap className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          )}
          <span>{isHealed ? copy.replayBtn : copy.simulateBtn}</span>
        </button>
      </div>

      {/* Spatial unboxed topology graph */}
      <div className="relative">
        {/* Desktop SVG Bezier telemetry cables */}
        <svg
          viewBox="0 0 1200 330"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {/* Base structural hairlines */}
          <path
            id="rf-cable-pve"
            d="M 380 78 C 425 78, 425 148, 462 148"
            fill="none"
            stroke="rgb(var(--border-hairline-strong))"
            strokeWidth="1.5"
          />
          <path
            id="rf-cable-k8s"
            d="M 380 252 C 425 252, 425 182, 462 182"
            fill="none"
            stroke={isAlert ? "#f59e0b" : "rgb(var(--accent-signal))"}
            strokeOpacity={isAlert || isGuarding ? "0.75" : "0.35"}
            strokeWidth={isAlert || isGuarding ? "2" : "1.5"}
          />
          <path
            id="rf-cable-argo"
            d="M 738 148 C 775 148, 775 78, 820 78"
            fill="none"
            stroke={isAlert ? "#f59e0b" : "rgb(var(--border-hairline-strong))"}
            strokeOpacity={isAlert ? "0.75" : "1"}
            strokeWidth="1.5"
          />
          <path
            id="rf-cable-py"
            d="M 738 182 C 775 182, 775 252, 820 252"
            fill="none"
            stroke="rgb(var(--border-hairline-strong))"
            strokeWidth="1.5"
          />

          {/* Hardware-accelerated traveling telemetry pulses */}
          <g className="motion-reduce:hidden">
            <circle r="3" fill="rgb(var(--accent-signal))">
              <animateMotion dur="3.1s" repeatCount="indefinite" path="M 380 78 C 425 78, 425 148, 462 148" />
            </circle>
            <circle r={isAlert || isGuarding ? "4" : "3"} fill={isAlert ? "#f59e0b" : "rgb(var(--accent-signal))"}>
              <animateMotion
                dur={isAlert || isGuarding ? "1.1s" : "2.7s"}
                repeatCount="indefinite"
                path={
                  isGuarding
                    ? "M 462 182 C 425 182, 425 252, 380 252"
                    : "M 380 252 C 425 252, 425 182, 462 182"
                }
              />
            </circle>
            <circle r="3" fill={isAlert ? "#f59e0b" : "rgb(var(--accent-cyan))"}>
              <animateMotion dur="2.9s" repeatCount="indefinite" path="M 738 148 C 775 148, 775 78, 820 78" />
            </circle>
            <circle r="3" fill="rgb(var(--accent-signal))">
              <animateMotion dur="3.4s" repeatCount="indefinite" path="M 738 182 C 775 182, 775 252, 820 252" />
            </circle>
          </g>
        </svg>

        {/* Mobile vertical spine */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6 bottom-6 left-1/2 w-[2px] -translate-x-1/2 bg-hairline lg:hidden"
        />

        <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px_minmax(0,1fr)] lg:items-center lg:gap-16">
          {/* Left column: Infrastructure nodes */}
          <div className="min-w-0 space-y-4">
            {/* Node 1: Proxmox VE */}
            <div className="rounded-[10px] border border-hairline bg-panel/95 p-4 shadow-[var(--frame-shadow)] backdrop-blur-sm transition-colors duration-200 hover:border-hairline-strong">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                  <span className="text-[14px] font-semibold text-ink">Proxmox VE</span>
                  <span className="font-mono text-[12px] text-subtle">pve-prod-01</span>
                </div>
                <MiniSpark values={PVE_SPARK} />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-2.5 font-mono text-[12px] text-muted">
                <span>CPU 18% · Mem 41%</span>
                <span>3 QEMU · 2 LXC</span>
              </div>
            </div>

            {/* Node 2: Kubernetes (reactive to incident!) */}
            <div
              className={`rounded-[10px] border bg-panel/95 p-4 shadow-[var(--frame-shadow)] backdrop-blur-sm transition-colors duration-300 ${
                isAlert
                  ? "border-amber-500/80"
                  : isGuarding || isHealed
                    ? "border-signal/70"
                    : "border-hairline hover:border-hairline-strong"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${isAlert ? "bg-amber-500" : "bg-signal"}`}
                    aria-hidden="true"
                  />
                  <span className="text-[14px] font-semibold text-ink">Kubernetes</span>
                  <span className="font-mono text-[12px] text-subtle">prod-cluster</span>
                </div>
                <span
                  className={`font-mono text-[12px] font-medium ${
                    isAlert ? "text-amber-500" : "text-signal"
                  }`}
                >
                  {isAlert ? "1/3 CrashLoop" : "24/24 Ready"}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-2.5 font-mono text-[12px]">
                <span className="text-ink">payments/payments-api</span>
                <span className={isAlert ? "text-amber-500" : "text-muted"}>
                  {isAlert
                    ? "OOMKilled · exit 137"
                    : isGuarding
                      ? copy.k8sRestarting
                      : isHealed
                        ? copy.k8sRecovered
                        : "3/3 pods · v2.8.1"}
                </span>
              </div>
            </div>
          </div>

          {/* Center Core Hub: ReliaForge :8000 */}
          <div
            className={`rounded-[12px] border p-4 shadow-[var(--frame-shadow)] backdrop-blur-md transition-colors duration-300 ${
              isGuarding
                ? "border-signal bg-panel ring-2 ring-signal/25"
                : isAlert
                  ? "border-amber-500/70 bg-panel"
                  : "border-signal/45 bg-panel/95"
            }`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-signal" aria-hidden="true" />
                <span className="text-[14px] font-bold tracking-[-0.02em] text-ink">
                  ReliaForge
                </span>
              </div>
              <span className="font-mono text-[12px] text-signal">:8000</span>
            </div>

            <div className="mt-3 space-y-2 font-mono text-[12px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-subtle">auth</span>
                <span className="text-ink">X-ReliaForge-Identity</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-subtle">allowlist</span>
                <span className={isGuarding ? "font-semibold text-signal" : "text-ink"}>
                  ns=[payments]
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-subtle">confirm</span>
                <span className={isGuarding ? "font-semibold text-signal" : "text-muted"}>
                  {isGuarding || isHealed ? "token verified ✓" : "2-step token"}
                </span>
              </div>
            </div>

            {isAlert ? (
              <button
                type="button"
                onClick={runGuardedRecovery}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-signal px-3 py-1.5 text-[12px] font-semibold text-signal-ink transition-colors duration-150 hover:bg-signal-hover"
              >
                <Play className="h-3 w-3" aria-hidden="true" />
                <span>{copy.restartNowBtn}</span>
              </button>
            ) : null}
          </div>

          {/* Right column: GitOps/Alerts + Custom Python Plugin */}
          <div className="min-w-0 space-y-4">
            {/* Node 3: Argo CD & Alertmanager */}
            <div
              className={`rounded-[10px] border bg-panel/95 p-4 shadow-[var(--frame-shadow)] backdrop-blur-sm transition-colors duration-300 ${
                isAlert ? "border-amber-500/75" : "border-hairline hover:border-hairline-strong"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isAlert ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                  )}
                  <span className="text-[14px] font-semibold text-ink">Argo CD & Alerts</span>
                </div>
                <span
                  className={`font-mono text-[12px] ${
                    isAlert ? "font-medium text-amber-500" : "text-signal"
                  }`}
                >
                  {isAlert ? "1 Firing" : "8/8 Synced"}
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-2.5 font-mono text-[12px] text-muted">
                <span>rev 8f4c2a1</span>
                <span className={isAlert ? "text-amber-500" : "text-muted"}>
                  {isAlert ? "PodCrashLooping" : "Prom · Loki · 0 alerts"}
                </span>
              </div>
            </div>

            {/* Node 4: Custom Python Plugin */}
            <div className="rounded-[10px] border border-hairline bg-panel/95 p-4 shadow-[var(--frame-shadow)] backdrop-blur-sm transition-colors duration-200 hover:border-hairline-strong">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />
                  <span className="text-[14px] font-semibold text-ink">{copy.pythonNodeTitle}</span>
                </div>
                <span className="font-mono text-[12px] text-cyan">owner.py</span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-2.5 font-mono text-[12px] text-muted">
                <span>@router.get(&quot;/owner&quot;)</span>
                <span>FastAPI · 4ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live SQLite Audit Ticker bar anchored right below the graph */}
      <div
        className={`mt-5 flex flex-wrap items-center justify-between gap-2 rounded-[9px] border px-4 py-2.5 font-mono text-[12px] transition-colors duration-300 ${
          isHealed
            ? "border-signal/65 bg-signal/[0.07] text-signal"
            : "border-hairline bg-panel/80 text-muted"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap">
          {isHealed ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-signal" aria-hidden="true" />
          ) : (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
          )}
          <span>
            {isHealed
              ? "ops_audit.sqlite3 -> #4822  actor=oncall@example.com  action=k8s.rollout_restart  target=payments/payments-api  succeeded (14ms)"
              : "ops_audit.sqlite3 -> #4821  actor=oncall@example.com  action=proxmox.lxc_terminal  target=pve-prod-01/lxc/201  succeeded"}
          </span>
        </div>
        <span className="shrink-0 text-subtle">/data/audit.sqlite3</span>
      </div>
    </div>
  )
}

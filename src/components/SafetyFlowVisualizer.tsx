import { Check, RotateCcw, ShieldCheck } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { SafetyScenario } from "../data/content"

interface SafetyFlowVisualizerProps {
  scenarios: SafetyScenario[]
  replayLabel: string
}

export function SafetyFlowVisualizer({ scenarios, replayLabel }: SafetyFlowVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedId, setSelectedId] = useState(scenarios[0].id)
  const [runKey, setRunKey] = useState(0)
  const [inView, setInView] = useState(
    () => typeof window === "undefined" || typeof window.IntersectionObserver === "undefined",
  )

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const active = scenarios.find((s) => s.id === selectedId) ?? scenarios[0]
  const totalSteps = active.steps.length
  const [stepIndex, setStepIndex] = useState(() => (reducedMotion ? totalSteps : 0))

  useEffect(() => {
    if (inView) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  useEffect(() => {
    if (reducedMotion || !inView) return
    const timers: number[] = []
    for (let i = 1; i <= totalSteps; i += 1) {
      timers.push(window.setTimeout(() => setStepIndex(i), i * 440))
    }
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [active.id, inView, reducedMotion, runKey, totalSteps])

  const selectScenario = (id: string) => {
    setSelectedId(id)
    setStepIndex(reducedMotion ? totalSteps : 0)
  }

  const replay = () => {
    setStepIndex(reducedMotion ? totalSteps : 0)
    setRunKey((k) => k + 1)
  }

  const progressRatio = Math.min(1, Math.max(0.08, stepIndex / totalSteps))
  const totalLatencyMs = active.steps.reduce((acc, step) => acc + step.latencyMs, 0)
  const completedCount = Math.min(totalSteps, stepIndex)

  return (
    <div
      ref={containerRef}
      className="min-w-0 overflow-hidden rounded-[12px] border border-hairline bg-panel shadow-[var(--frame-shadow)]"
    >
      <div className="border-b border-hairline bg-obsidian/70 p-2">
        <div
          role="tablist"
          aria-label="Operational action trace"
          className="grid grid-cols-2 gap-1 sm:grid-cols-4"
        >
          {scenarios.map((scenario) => {
            const selected = scenario.id === active.id
            return (
              <button
                key={scenario.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectScenario(scenario.id)}
                className={`whitespace-nowrap rounded-[6px] px-2 py-2 text-center text-[13px] font-medium transition-colors duration-200 ease-out ${
                  selected
                    ? "bg-surface text-signal shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>

      <div key={`${active.id}-${runKey}`} className="relative p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[34px] top-10 bottom-10 z-0 w-[2px] overflow-hidden rounded-full bg-hairline"
        >
          <div
            style={{ transform: `scaleY(${progressRatio})`, transformOrigin: "top" }}
            className="h-full w-full bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>

        <ol className="relative z-10 m-0 list-none space-y-5 p-0">
          {active.steps.map((step, idx) => {
            const isFinal = idx === totalSteps - 1
            const completed = stepIndex > idx
            const current = stepIndex === idx
            const reached = completed || current

            return (
              <li
                key={step.stage}
                onClick={() => setStepIndex(idx + 1)}
                className={`relative cursor-pointer pl-9 transition-opacity duration-300 ease-out ${
                  reached ? "opacity-100" : "opacity-55 hover:opacity-85"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border bg-panel transition-colors duration-300 ease-out ${
                    completed
                      ? "border-signal text-signal"
                      : current
                        ? "border-signal text-signal"
                        : "border-hairline-strong text-subtle"
                  }`}
                >
                  {current ? (
                    <span className="signal-ping absolute inset-0 rounded-full border border-signal" />
                  ) : null}
                  {completed ? (
                    <span className="absolute inset-0 rounded-full bg-signal/15" />
                  ) : null}
                  {isFinal && completed ? (
                    <ShieldCheck className="relative h-3.5 w-3.5" />
                  ) : completed ? (
                    <Check className="relative h-3 w-3" />
                  ) : (
                    <span
                      className={`relative h-1.5 w-1.5 rounded-full ${
                        current ? "bg-signal" : "bg-subtle"
                      }`}
                    />
                  )}
                </span>

                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[14px] font-semibold leading-[1.4] text-ink">
                    {step.stage}
                  </div>
                  <span
                    className={`font-mono text-[12px] transition-opacity duration-300 ease-out ${
                      reached ? "text-signal opacity-100" : "text-subtle opacity-0"
                    }`}
                  >
                    {step.latencyMs}ms
                  </span>
                </div>
                <div
                  className={`mt-1.5 overflow-x-auto rounded-[7px] border bg-code-bg px-3 py-2 font-mono text-[13px] leading-[1.5] transition-colors duration-300 ease-out ${
                    current
                      ? "border-signal/70 text-signal"
                      : completed
                        ? "border-hairline text-signal/95"
                        : "border-hairline text-muted"
                  }`}
                >
                  {step.code}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-hairline bg-obsidian/55 px-5 py-2.5">
        <span className="font-mono text-[12px] text-subtle">
          {completedCount}/{totalSteps} gates · {totalLatencyMs}ms
        </span>
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-1.5 rounded-[6px] border border-hairline bg-panel px-2.5 py-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{replayLabel}</span>
        </button>
      </div>
    </div>
  )
}

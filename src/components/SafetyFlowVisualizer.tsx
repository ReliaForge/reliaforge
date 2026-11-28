import { ShieldCheck } from "lucide-react"
import { useState } from "react"
import type { SafetyScenario } from "../data/content"

interface SafetyFlowVisualizerProps {
  scenarios: SafetyScenario[]
}

export function SafetyFlowVisualizer({ scenarios }: SafetyFlowVisualizerProps) {
  const [selectedId, setSelectedId] = useState(scenarios[0].id)
  const active = scenarios.find((s) => s.id === selectedId) ?? scenarios[0]

  return (
    <div className="overflow-hidden rounded-[10px] border border-hairline bg-panel">
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
                onClick={() => setSelectedId(scenario.id)}
                className={`rounded-[6px] px-2.5 py-2 text-center text-[13px] font-medium transition-colors duration-200 ease-out ${
                  selected
                    ? "bg-surface text-signal"
                    : "text-muted hover:text-ink"
                }`}
              >
                {scenario.label}
              </button>
            )
          })}
        </div>
      </div>

      <div key={active.id} className="stage-fade relative p-6">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-[35px] top-10 bottom-10 w-[2px]"
          viewBox="0 0 2 320"
          preserveAspectRatio="none"
        >
          <line x1="1" y1="0" x2="1" y2="320" stroke="#202634" strokeWidth="2" />
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="320"
            stroke="#34d399"
            strokeWidth="2"
            className="trace-line"
          />
        </svg>

        <ol className="m-0 list-none space-y-5 p-0">
          {active.steps.map((step, idx) => {
            const isFinal = idx === active.steps.length - 1
            return (
              <li key={step.stage} className="relative pl-9">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border ${
                    isFinal
                      ? "border-signal bg-signal/15 text-signal"
                      : "border-hairline-strong bg-obsidian text-cyan"
                  }`}
                >
                  {isFinal ? (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  )}
                </span>

                <div className="text-[15px] font-semibold leading-[1.4] text-ink">
                  {step.stage}
                </div>
                <p className="mt-1 text-[15px] leading-[1.6] text-muted">{step.detail}</p>
                <div className="mt-2 overflow-x-auto rounded-[6px] border border-hairline bg-obsidian px-3 py-2 font-mono text-[13px] leading-[1.5] text-signal/95">
                  {step.code}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

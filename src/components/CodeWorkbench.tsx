import { Check, Copy } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"
import type { CodeTab, DeployTab } from "../data/content"
import { SyntaxCode, type SnippetLanguage } from "./SyntaxCode"

interface TabbedSnippetProps {
  ariaLabel: string
  tabs: Array<{ id: string; label: string; language: SnippetLanguage; code: string }>
  copyLabel: string
  copiedLabel: string
}

export function TabbedSnippet({
  ariaLabel,
  tabs,
  copyLabel,
  copiedLabel,
}: TabbedSnippetProps) {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const [copied, setCopied] = useState(false)
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

  return (
    <div className="min-w-0 overflow-hidden rounded-[12px] border border-hairline bg-panel shadow-[var(--frame-shadow)]">
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-obsidian/75 px-3 py-2">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label={ariaLabel}
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
                className={`relative z-10 rounded-[5px] px-3 py-1.5 font-mono text-[13px] font-medium transition-colors duration-200 ease-out ${
                  selected ? "text-signal" : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          className="inline-flex items-center gap-1.5 rounded-[5px] border border-hairline bg-panel px-2.5 py-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <div key={active.id} className="stage-fade">
        <SyntaxCode code={active.code} language={active.language} />
      </div>
    </div>
  )
}

export function CodeWorkbench({
  tabs,
  copyLabel,
  copiedLabel,
}: {
  tabs: CodeTab[]
  copyLabel: string
  copiedLabel: string
}) {
  return (
    <TabbedSnippet
      ariaLabel="Plugin source files"
      tabs={tabs.map((t) => ({ id: t.id, label: t.filename, language: t.language, code: t.code }))}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
    />
  )
}

export function DeployWorkbench({
  tabs,
  copyLabel,
  copiedLabel,
}: {
  tabs: DeployTab[]
  copyLabel: string
  copiedLabel: string
}) {
  return (
    <TabbedSnippet
      ariaLabel="Deployment commands"
      tabs={tabs}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
    />
  )
}

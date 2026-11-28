import { Check, Copy } from "lucide-react"
import { useState } from "react"
import type { CodeTab, DeployTab } from "../data/content"

interface TabbedSnippetProps {
  ariaLabel: string
  tabs: Array<{ id: string; label: string; code: string }>
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
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]

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
    <div className="overflow-hidden rounded-[10px] border border-hairline bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-obsidian/80 px-3 py-2">
        <div role="tablist" aria-label={ariaLabel} className="inline-flex items-center gap-1">
          {tabs.map((tab) => {
            const selected = tab.id === active.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActiveId(tab.id)
                  setCopied(false)
                }}
                className={`rounded-[5px] px-3 py-1.5 font-mono text-[13px] font-medium transition-colors duration-200 ease-out ${
                  selected ? "bg-surface text-signal" : "text-muted hover:text-ink"
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
          className="inline-flex items-center gap-1.5 rounded-[5px] border border-hairline px-2.5 py-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <pre className="m-0 overflow-x-auto bg-[#0b0e14] p-5 font-mono text-[13px] leading-[1.7] text-[#d5deed]">
        <code>{active.code}</code>
      </pre>
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
      tabs={tabs.map((t) => ({ id: t.id, label: t.filename, code: t.code }))}
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

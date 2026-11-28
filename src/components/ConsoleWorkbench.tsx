import { ArrowUpRight } from "lucide-react"
import type { KeyboardEvent, PointerEvent } from "react"
import { useRef } from "react"
import type { WorkspaceView, WorkspaceViewId } from "../data/content"

interface ConsoleWorkbenchProps {
  views: WorkspaceView[]
  activeId: WorkspaceViewId
  onSelect: (id: WorkspaceViewId) => void
  demoUrl: string
  openDemoHint: string
}

export function ConsoleWorkbench({
  views,
  activeId,
  onSelect,
  demoUrl,
  openDemoHint,
}: ConsoleWorkbenchProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const active = views.find((v) => v.id === activeId) ?? views[0]

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`)
    el.style.setProperty("--my", `${event.clientY - rect.top}px`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      onSelect(views[(index + 1) % views.length].id)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      onSelect(views[(index - 1 + views.length) % views.length].id)
    }
  }

  return (
    <div id="console" className="scroll-mt-24 w-full">
      <div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        className="workbench-frame overflow-hidden rounded-[10px]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-hairline bg-panel px-3 py-2.5 sm:px-4 sm:py-3">
          <div
            role="tablist"
            aria-label="Console workspaces"
            className="inline-flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-[7px] border border-hairline bg-obsidian p-1"
          >
            {views.map((view, index) => {
              const selected = view.id === active.id
              return (
                <button
                  key={view.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${view.id}`}
                  id={`tab-${view.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onSelect(view.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`shrink-0 whitespace-nowrap rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ease-out ${
                    selected
                      ? "bg-surface text-signal"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {view.label}
                </button>
              )
            })}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <span className="font-mono text-[13px] text-subtle">
              ops.example.com{active.route}
            </span>
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:text-signal"
            >
              {openDemoHint}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="bg-obsidian"
        >
          <img
            key={active.id}
            src={active.src}
            alt={active.alt}
            width={2280}
            height={1380}
            className="stage-fade block h-auto w-full"
          />
        </div>

        <div className="border-t border-hairline bg-panel px-5 py-3.5">
          <p className="m-0 text-[15px] leading-[1.6] text-muted">{active.caption}</p>
        </div>
      </div>
    </div>
  )
}

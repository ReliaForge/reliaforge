import { ArrowUpRight, Image as ImageIcon, Play } from "lucide-react"
import type { KeyboardEvent, PointerEvent } from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { Locale, ThemeMode, WorkspaceView, WorkspaceViewId } from "../data/content"

interface ConsoleWorkbenchProps {
  views: WorkspaceView[]
  activeId: WorkspaceViewId
  onSelect: (id: WorkspaceViewId) => void
  theme: ThemeMode
  locale: Locale
  demoUrl: string
  openDemoHint: string
  liveToggleLabel: string
  snapshotToggleLabel: string
  clickToInteractLabel: string
}

export function ConsoleWorkbench({
  views,
  activeId,
  onSelect,
  theme,
  locale,
  demoUrl,
  openDemoHint,
  liveToggleLabel,
  snapshotToggleLabel,
  clickToInteractLabel,
}: ConsoleWorkbenchProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })
  const [liveMode, setLiveMode] = useState(false)

  const active = views.find((v) => v.id === activeId) ?? views[0]
  const imgSrc = theme === "light" ? active.srcLight : active.srcDark
  const iframeSrc = `https://demo.reliaforge.dev/#${active.route}?lang=${locale}`

  // Smooth sliding indicator pill inside tablist
  useLayoutEffect(() => {
    const updatePill = () => {
      const container = tabListRef.current
      const btn = tabRefs.current[active.id]
      if (!container || !btn) return
      setPill({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
      })
    }
    updatePill()
    window.addEventListener("resize", updatePill)
    return () => window.removeEventListener("resize", updatePill)
  }, [active.id, views])

  // Subtle 60fps scroll-linked 3D hardware stage leveling (disabled on reduced motion or live iframe)
  useEffect(() => {
    const stage = stageRef.current
    const frame = frameRef.current
    if (!stage || !frame) return
    if (liveMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.style.transform = ""
      return
    }

    let rafId = 0
    const updateTilt = () => {
      rafId = 0
      const rect = stage.getBoundingClientRect()
      const viewportH = window.innerHeight || 900
      const raw = (rect.top - viewportH * 0.14) / (viewportH * 0.65)
      const clamped = Math.max(0, Math.min(1, raw))
      const deg = clamped * 3.4
      if (deg > 0.05) {
        const scale = (1 - deg * 0.0028).toFixed(4)
        frame.style.transform = `rotateX(${deg.toFixed(2)}deg) scale(${scale})`
        frame.style.transformOrigin = "center top"
      } else {
        frame.style.transform = ""
      }
    }

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updateTilt)
    }

    rafId = window.requestAnimationFrame(updateTilt)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      frame.style.transform = ""
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [liveMode])

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
    <div id="console" ref={stageRef} className="scroll-mt-24 w-full [perspective:1600px]">
      <div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        className="workbench-frame overflow-hidden rounded-[12px] will-change-transform"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-panel px-3 py-2.5 sm:px-4 sm:py-3">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Console workspaces"
            className="relative inline-flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-[8px] border border-hairline bg-obsidian p-1"
          >
            {pill.ready ? (
              <span
                aria-hidden="true"
                style={{
                  width: `${pill.width}px`,
                  transform: `translateX(${pill.left - 4}px)`,
                }}
                className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-[5px] bg-surface shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            ) : null}
            {views.map((view, index) => {
              const selected = view.id === active.id
              return (
                <button
                  key={view.id}
                  ref={(node) => {
                    tabRefs.current[view.id] = node
                  }}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${view.id}`}
                  id={`tab-${view.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onSelect(view.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`relative z-10 shrink-0 whitespace-nowrap rounded-[5px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ease-out ${
                    selected ? "text-signal" : "text-muted hover:text-ink"
                  }`}
                >
                  {view.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[13px] text-subtle lg:inline-flex">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="signal-ping absolute inline-flex h-full w-full rounded-full bg-signal" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              ops.example.com{active.route}
            </span>

            <button
              type="button"
              data-testid="live-console-toggle"
              onClick={() => setLiveMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 ease-out ${
                liveMode
                  ? "border-signal/60 bg-signal/15 text-signal"
                  : "border-hairline bg-obsidian text-ink hover:border-signal/50 hover:text-signal"
              }`}
            >
              {liveMode ? (
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
              )}
              <span>{liveMode ? snapshotToggleLabel : liveToggleLabel}</span>
            </button>

            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="group hidden items-center gap-1 text-[13px] font-medium text-muted transition-colors duration-200 ease-out hover:text-signal sm:inline-flex"
            >
              {openDemoHint}
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="group/stage relative aspect-[16/7.6] w-full overflow-hidden bg-obsidian"
        >
          {liveMode ? (
            <iframe
              key={`${active.id}-${locale}`}
              src={iframeSrc}
              title={`ReliaForge interactive demo - ${active.label}`}
              className="h-full w-full border-0 bg-obsidian"
            />
          ) : (
            <>
              <img
                key={`${active.id}-${theme}`}
                src={imgSrc}
                alt={active.alt}
                width={2280}
                height={1380}
                className="stage-fade block h-full w-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setLiveMode(true)}
                className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-[8px] border border-hairline-strong bg-panel/92 px-3.5 py-2 text-[13px] font-medium text-ink opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 ease-out hover:border-signal hover:text-signal focus-visible:opacity-100 group-hover/stage:opacity-100"
              >
                <Play className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                <span>{clickToInteractLabel}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

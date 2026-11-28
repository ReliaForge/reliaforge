import { ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { CodeWorkbench, DeployWorkbench } from "./components/CodeWorkbench"
import { ConsoleWorkbench } from "./components/ConsoleWorkbench"
import { SafetyFlowVisualizer } from "./components/SafetyFlowVisualizer"
import { COPY, type Locale, type WorkspaceViewId } from "./data/content"

const STORAGE_KEY = "rf.web.locale"

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const param = new URLSearchParams(window.location.search).get("lang")
  if (param === "zh" || param === "en") return param
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "zh" || stored === "en") return stored
  } catch {
    // ignore restricted storage
  }
  const primary = navigator.languages?.[0] || navigator.language || "en"
  return /^zh/i.test(primary) ? "zh" : "en"
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => detectInitialLocale())
  const [activeView, setActiveView] = useState<WorkspaceViewId>("overview")
  const [scrolled, setScrolled] = useState(false)

  const t = COPY[locale]

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en-US"
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignore restricted storage
    }
  }, [locale])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const jumpToWorkspace = (viewId: WorkspaceViewId) => {
    setActiveView(viewId)
    const el = document.getElementById("console")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ease-out ${
          scrolled
            ? "border-b border-hairline bg-obsidian/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
          <a
            href="#"
            className="inline-flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.025em] text-ink"
          >
            <img
              src="/mark.png"
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px] object-contain brightness-0 invert"
            />
            <span>ReliaForge</span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
            <a
              href="#console"
              className="text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.console}
            </a>
            <a
              href="#plugins"
              className="text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.plugins}
            </a>
            <a
              href="#build"
              className="text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.build}
            </a>
            <a
              href="#deploy"
              className="text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.deploy}
            </a>
            <a
              href={t.nav.docsUrl}
              className="inline-flex items-center gap-1 text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.docs}
              <ArrowUpRight className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/ReliaForge"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.nav.github}
              <ArrowUpRight className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
            </a>
          </nav>

          <div
            role="radiogroup"
            aria-label="Language"
            className="inline-flex items-center rounded-[7px] border border-hairline bg-panel p-0.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={locale === "en"}
              onClick={() => setLocale("en")}
              className={`rounded-[5px] px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 ease-out ${
                locale === "en" ? "bg-surface text-ink" : "text-muted hover:text-ink"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={locale === "zh"}
              onClick={() => setLocale("zh")}
              className={`rounded-[5px] px-2.5 py-1 text-[13px] font-medium transition-colors duration-200 ease-out ${
                locale === "zh" ? "bg-surface text-ink" : "text-muted hover:text-ink"
              }`}
            >
              中文
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Monumental Hero + Interactive 5-Workspace Console Stage */}
        <section className="hero-blueprint -mt-16 border-b border-hairline pt-24 pb-16 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="mx-auto max-w-[980px] text-center">
              <h1
                className={`m-0 font-bold text-ink [text-wrap:balance] ${
                  locale === "zh"
                    ? "text-[clamp(2rem,4.1vw,3.5rem)] leading-[1.15] tracking-[-0.03em]"
                    : "text-[clamp(2.25rem,4.9vw,4.1rem)] leading-[1.05] tracking-[-0.04em]"
                }`}
              >
                {t.hero.title}
              </h1>

              <p className="mx-auto mt-5 max-w-[650px] text-[16px] leading-[1.7] text-muted">
                {t.hero.tagline}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={t.nav.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-[7px] bg-signal px-6 text-[14px] font-semibold text-[#04150e] transition-colors duration-200 ease-out hover:bg-signal-hover"
                >
                  {t.hero.primaryCta}
                </a>
                <a
                  href={t.nav.docsUrl}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[7px] border border-hairline-strong bg-panel px-6 text-[14px] font-medium text-ink transition-colors duration-200 ease-out hover:border-muted hover:bg-surface"
                >
                  {t.hero.secondaryCta}
                  <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="mt-11 sm:mt-14">
              <ConsoleWorkbench
                views={t.workspaces}
                activeId={activeView}
                onSelect={setActiveView}
                demoUrl={t.nav.demoUrl}
                openDemoHint={t.hero.openDemoHint}
              />
            </div>
          </div>
        </section>

        {/* Section 1: 2 a.m. Ops Story + Interactive Request-to-Audit Visualizer */}
        <section className="border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16">
            <div>
              <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.opsStory.heading}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-muted">
                {t.opsStory.lead}
              </p>

              <div className="mt-8 border-b border-hairline">
                {t.opsStory.rails.map((rail) => (
                  <div key={rail.title} className="border-t border-hairline py-5">
                    <div className="text-[15px] font-semibold leading-[1.5] text-ink">
                      {rail.title}
                    </div>
                    <p className="mt-1.5 text-[15px] leading-[1.7] text-muted">{rail.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <SafetyFlowVisualizer scenarios={t.opsStory.scenarios} />
          </div>
        </section>

        {/* Section 2: Official 6-Plugin Hairline Suite Matrix */}
        <section id="plugins" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[680px]">
                <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                  {t.suite.heading}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.7] text-muted">{t.suite.lead}</p>
              </div>
              <a
                href="https://github.com/ReliaForge/reliaforge-plugins"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:text-signal"
              >
                {t.suite.repoLabel}
                <ArrowUpRight className="h-4 w-4 text-signal" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-10 grid border-t border-l border-hairline sm:grid-cols-2 lg:grid-cols-3">
              {t.suite.plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex flex-col justify-between border-r border-b border-hairline bg-obsidian p-6 transition-colors duration-200 ease-out hover:bg-panel"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-semibold leading-[1.4] text-ink">
                        {plugin.title}
                      </span>
                      <span className="font-mono text-[13px] text-subtle">{plugin.id}</span>
                    </div>
                    <p className="mt-3 text-[15px] leading-[1.7] text-muted">{plugin.summary}</p>
                  </div>

                  {plugin.viewId ? (
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => jumpToWorkspace(plugin.viewId!)}
                        className="text-[13px] font-medium text-signal transition-colors duration-200 ease-out hover:text-signal-hover"
                      >
                        {t.suite.inspectView} ↑
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Bring Your Own Python Tool */}
        <section id="build" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16">
            <div>
              <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.byo.heading}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-muted">
                {t.byo.lead}
              </p>

              <div className="mt-8 border-b border-hairline">
                {t.byo.points.map((point) => (
                  <div key={point.title} className="border-t border-hairline py-5">
                    <div className="text-[15px] font-semibold leading-[1.5] text-ink">
                      {point.title}
                    </div>
                    <p className="mt-1.5 text-[15px] leading-[1.7] text-muted">{point.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <a
                  href={`${t.nav.docsUrl}guide/plugin-development.html`}
                  className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:text-signal"
                >
                  {t.byo.docsCta}
                  <ArrowUpRight className="h-4 w-4 text-signal" aria-hidden="true" />
                </a>
              </div>
            </div>

            <CodeWorkbench
              tabs={t.byo.tabs}
              copyLabel={t.copyButton.copy}
              copiedLabel={t.copyButton.copied}
            />
          </div>
        </section>

        {/* Section 4: Single-Container Deployment */}
        <section id="deploy" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16">
            <div>
              <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.deploy.heading}
              </h2>
              <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-muted">
                {t.deploy.lead}
              </p>

              <div className="mt-8 border-b border-hairline">
                {t.deploy.facts.map((fact) => (
                  <div key={fact.title} className="border-t border-hairline py-5">
                    <div className="text-[15px] font-semibold leading-[1.5] text-ink">
                      {fact.title}
                    </div>
                    <p className="mt-1.5 text-[15px] leading-[1.7] text-muted">{fact.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <DeployWorkbench
              tabs={t.deploy.tabs}
              copyLabel={t.copyButton.copy}
              copiedLabel={t.copyButton.copied}
            />
          </div>
        </section>

        {/* Closing Action Stage */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-center">
            <div className="max-w-[640px]">
              <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.closing.heading}
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-muted">{t.closing.lead}</p>
            </div>
            <a
              href={t.nav.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-[7px] bg-signal px-6 text-[15px] font-semibold text-[#04150e] transition-colors duration-200 ease-out hover:bg-signal-hover"
            >
              {t.closing.cta}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-5 text-[13px] text-subtle sm:flex-row sm:items-center sm:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={t.nav.docsUrl}
              className="text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.footer.docs}
            </a>
            <a
              href={t.nav.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.footer.demo}
            </a>
            <a
              href="https://github.com/ReliaForge"
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {t.footer.org}
            </a>
          </div>
          <div>{t.footer.license}</div>
        </div>
      </footer>
    </div>
  )
}

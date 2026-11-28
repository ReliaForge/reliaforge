import { ArrowUpRight, Check, Copy, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { ConsoleWorkbench } from "./components/ConsoleWorkbench"
import { DeployStage } from "./components/DeployStage"
import { HeroMeshCanvas } from "./components/HeroMeshCanvas"
import { PluginLiveStudio } from "./components/PluginLiveStudio"
import { Reveal } from "./components/Reveal"
import { SafetyFlowVisualizer } from "./components/SafetyFlowVisualizer"
import { COPY, type Locale, type ThemeMode, type WorkspaceViewId } from "./data/content"

const LOCALE_STORAGE_KEY = "rf.web.locale"
const THEME_STORAGE_KEY = "rf.web.theme"

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return "en"
  const param = new URLSearchParams(window.location.search).get("lang")
  if (param === "zh" || param === "en") return param
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === "zh" || stored === "en") return stored
  } catch {
    // ignore restricted storage
  }
  const primary = navigator.languages?.[0] || navigator.language || "en"
  return /^zh/i.test(primary) ? "zh" : "en"
}

function detectInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark"
  const param = new URLSearchParams(window.location.search).get("theme")
  if (param === "light" || param === "dark") return param
  if (document.documentElement.classList.contains("dark")) return "dark"
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "light" || stored === "dark") return stored
  } catch {
    // ignore restricted storage
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function App() {
  const [locale, setLocale] = useState<Locale>(() => detectInitialLocale())
  const [theme, setTheme] = useState<ThemeMode>(() => detectInitialTheme())
  const [activeView, setActiveView] = useState<WorkspaceViewId>("overview")
  const [scrolled, setScrolled] = useState(false)
  const [copiedPull, setCopiedPull] = useState(false)

  const t = COPY[locale]

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en-US"
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      // ignore restricted storage
    }
  }, [locale])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute("content", theme === "dark" ? "#090b0f" : "#f6f8fb")
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // ignore restricted storage
    }
  }, [theme])

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

  const copyPullCommand = async () => {
    try {
      await navigator.clipboard.writeText(t.hero.pullCommand)
      setCopiedPull(true)
      window.setTimeout(() => setCopiedPull(false), 1600)
    } catch {
      setCopiedPull(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ease-out ${
          scrolled
            ? "border-b border-hairline bg-obsidian/88 backdrop-blur-md"
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
              className="h-[26px] w-[26px] object-contain brightness-0 dark:invert"
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="theme-toggle"
              aria-label={theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark}
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[7px] border border-hairline bg-panel text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 transition-transform duration-300 ease-out" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4 transition-transform duration-300 ease-out" aria-hidden="true" />
              )}
            </button>

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
        </div>
      </header>

      <main>
        {/* Act 1: Self-Hosted OSS Hero + Quick Docker Pull + Live Interactive Workbench */}
        <section className="hero-blueprint relative -mt-16 overflow-x-clip border-b border-hairline pt-24 pb-16 sm:pt-28 sm:pb-24">
          <HeroMeshCanvas theme={theme} />

          <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="mx-auto max-w-[980px] text-center">
              <h1
                className={`hero-stagger-1 m-0 font-bold text-ink [text-wrap:balance] ${
                  locale === "zh"
                    ? "text-[clamp(2rem,4.1vw,3.5rem)] leading-[1.15] tracking-[-0.03em]"
                    : "text-[clamp(2.25rem,4.9vw,4.1rem)] leading-[1.05] tracking-[-0.04em]"
                }`}
              >
                {t.hero.title}
              </h1>

              <p className="hero-stagger-2 mx-auto mt-5 max-w-[650px] text-[16px] leading-[1.7] text-muted">
                {t.hero.tagline}
              </p>

              <div className="hero-stagger-3 mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={t.nav.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-primary inline-flex h-11 items-center justify-center rounded-[7px] bg-signal px-6 text-[14px] font-semibold text-signal-ink hover:bg-signal-hover"
                >
                  {t.hero.primaryCta}
                </a>
                <a
                  href="https://github.com/ReliaForge"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-hairline-strong bg-panel px-5 text-[14px] font-medium text-ink transition-colors duration-200 ease-out hover:border-muted hover:bg-surface"
                >
                  <GitHubIcon />
                  <span>{t.hero.githubCta}</span>
                </a>
                <a
                  href={t.nav.docsUrl}
                  className="group inline-flex h-11 items-center justify-center gap-1.5 rounded-[7px] border border-hairline bg-panel/70 px-5 text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:border-hairline-strong hover:text-ink"
                >
                  {t.nav.docs}
                  <ArrowUpRight
                    className="h-4 w-4 text-subtle transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>

              <div className="hero-stagger-3 mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => void copyPullCommand()}
                  className="group inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-[7px] border border-hairline bg-panel/90 px-3.5 py-2 font-mono text-[13px] text-muted transition-colors duration-200 ease-out hover:border-signal/55 hover:text-ink"
                >
                  <span className="select-none text-signal">$</span>
                  <span className="whitespace-nowrap">{t.hero.pullCommand}</span>
                  {copiedPull ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-signal" aria-hidden="true" />
                  ) : (
                    <Copy
                      className="h-3.5 w-3.5 shrink-0 text-subtle transition-colors duration-150 group-hover:text-signal"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="hero-stagger-4 mt-10 sm:mt-12">
              <ConsoleWorkbench
                views={t.workspaces}
                activeId={activeView}
                onSelect={setActiveView}
                theme={theme}
                locale={locale}
                demoUrl={t.nav.demoUrl}
                openDemoHint={t.hero.openDemoHint}
                liveToggleLabel={t.hero.liveToggle}
                snapshotToggleLabel={t.hero.snapshotToggle}
                clickToInteractLabel={t.hero.clickToInteract}
              />
            </div>
          </div>
        </section>

        {/* Act 2: Asymmetric Split — Guarded Writes + Request-to-Audit Visualizer */}
        <section className="border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16">
            <Reveal>
              <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.opsStory.heading}
              </h2>
              <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-muted">
                {t.opsStory.lead}
              </p>

              <ul className="mt-8 list-none border-b border-hairline p-0">
                {t.opsStory.rails.map((rail) => (
                  <li
                    key={rail}
                    className="flex items-start gap-3 border-t border-hairline py-4 text-[15px] leading-[1.65] text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                    />
                    <span>{rail}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delayMs={90}>
              <SafetyFlowVisualizer
                scenarios={t.opsStory.scenarios}
                replayLabel={t.opsStory.replayTrace}
              />
            </Reveal>
          </div>
        </section>

        {/* Act 3: 6-Plugin Architectural Hairline Matrix */}
        <section id="plugins" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-6">
                <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                  {t.suite.heading}
                </h2>
                <a
                  href="https://github.com/ReliaForge/reliaforge-plugins"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:text-signal"
                >
                  {t.suite.repoLabel}
                  <ArrowUpRight
                    className="h-4 w-4 text-signal transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delayMs={80}>
              <div className="mt-10 grid border-t border-l border-hairline sm:grid-cols-2 lg:grid-cols-3">
                {t.suite.plugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="plugin-tile group flex flex-col justify-between border-r border-b border-hairline bg-obsidian p-6 hover:bg-panel"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] font-semibold leading-[1.4] text-ink">
                          {plugin.title}
                        </span>
                        <span className="font-mono text-[13px] text-subtle">{plugin.id}</span>
                      </div>
                      <p className="mt-2.5 text-[15px] leading-[1.65] text-muted">{plugin.summary}</p>
                    </div>

                    {plugin.viewId ? (
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => jumpToWorkspace(plugin.viewId!)}
                          className="inline-flex items-center gap-1 text-[13px] font-medium text-signal transition-colors duration-200 ease-out hover:text-signal-hover"
                        >
                          <span>{t.suite.inspectView}</span>
                          <span
                            aria-hidden="true"
                            className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                          >
                            ↑
                          </span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Act 4: Full-Width Dual-Pane Python -> Live Rendered Plugin Studio */}
        <section id="build" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-[680px]">
                  <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                    {t.byo.heading}
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.7] text-muted">{t.byo.lead}</p>
                </div>

                <a
                  href={`${t.nav.docsUrl}guide/plugin-development.html`}
                  className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:text-signal"
                >
                  {t.byo.docsCta}
                  <ArrowUpRight
                    className="h-4 w-4 text-signal transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delayMs={80} className="mt-10">
              <PluginLiveStudio
                tabs={t.byo.tabs}
                studio={t.byo.studio}
                copyLabel={t.copyButton.copy}
                copiedLabel={t.copyButton.copied}
              />
            </Reveal>
          </div>
        </section>

        {/* Act 5: Full-Width Topology Rail + Ready-to-Run compose.yaml Deck */}
        <section id="deploy" className="scroll-mt-20 border-b border-hairline py-20 sm:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <Reveal>
              <div className="max-w-[680px]">
                <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.035em] text-ink [text-wrap:balance]">
                  {t.deploy.heading}
                </h2>
                <p className="mt-4 text-[15px] leading-[1.7] text-muted">{t.deploy.lead}</p>
              </div>
            </Reveal>

            <Reveal delayMs={80} className="mt-10">
              <DeployStage
                deploy={t.deploy}
                docsUrl={t.nav.docsUrl}
                copyLabel={t.copyButton.copy}
                copiedLabel={t.copyButton.copied}
              />
            </Reveal>
          </div>
        </section>

        {/* Closing Action Stage */}
        <section className="py-16 sm:py-20">
          <Reveal>
            <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center">
              <h2 className="m-0 text-[clamp(1.5rem,2.6vw,2.2rem)] font-bold leading-[1.16] tracking-[-0.035em] text-ink [text-wrap:balance]">
                {t.closing.heading}
              </h2>
              <a
                href={t.nav.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="cta-primary inline-flex h-11 shrink-0 items-center justify-center rounded-[7px] bg-signal px-6 text-[15px] font-semibold text-signal-ink hover:bg-signal-hover"
              >
                {t.closing.cta}
              </a>
            </div>
          </Reveal>
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

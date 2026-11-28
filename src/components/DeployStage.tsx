import { ArrowRight, ArrowUpRight } from "lucide-react"
import type { DeploySectionCopy } from "../data/content"
import { TabbedSnippet } from "./CodeWorkbench"

interface DeployStageProps {
  deploy: DeploySectionCopy
  docsUrl: string
  copyLabel: string
  copiedLabel: string
}

export function DeployStage({
  deploy,
  docsUrl,
  copyLabel,
  copiedLabel,
}: DeployStageProps) {
  return (
    <div className="space-y-8">
      {/* Full-width 3-stage self-hosted runtime architecture bar */}
      <div className="grid items-center gap-3 rounded-[12px] border border-hairline bg-panel p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)_auto_minmax(0,1fr)]">
        <div className="min-w-0 rounded-[8px] border border-hairline bg-obsidian px-4 py-3">
          <div className="text-[14px] font-semibold text-ink">{deploy.archProxyTitle}</div>
          <div className="mt-1 font-mono text-[12px] text-subtle">
            Caddy · Nginx · Envoy · Cloudflare Access
          </div>
        </div>

        <div className="hidden flex-col items-center gap-0.5 text-signal md:flex" aria-hidden="true">
          <span className="font-mono text-[11px] text-subtle">X-ReliaForge-Identity</span>
          <ArrowRight className="h-4 w-4 text-signal" />
        </div>

        <div className="rounded-[8px] border border-signal/45 bg-signal/[0.06] px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[13px] font-semibold text-signal">
              ghcr.io/reliaforge/reliaforge
            </span>
            <span className="font-mono text-[12px] text-subtle">:8000</span>
          </div>
          <div className="mt-1 text-[13px] text-ink">{deploy.archContainerSub}</div>
        </div>

        <div className="hidden flex-col items-center gap-0.5 text-signal md:flex" aria-hidden="true">
          <span className="font-mono text-[11px] text-subtle">API / SQLite</span>
          <ArrowRight className="h-4 w-4 text-signal" />
        </div>

        <div className="rounded-[8px] border border-hairline bg-obsidian px-4 py-3">
          <div className="text-[14px] font-semibold text-ink">{deploy.archTargetsTitle}</div>
          <div className="mt-1 font-mono text-[12px] text-subtle">
            PVE · K8s · Argo CD · /data/audit.sqlite3
          </div>
        </div>
      </div>

      {/* Compose file + compact container spec card */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:items-start">
        <TabbedSnippet
          ariaLabel="Deployment configuration"
          tabs={deploy.tabs}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />

        <div className="rounded-[12px] border border-hairline bg-panel p-6">
          <dl className="m-0 divide-y divide-hairline">
            {deploy.specs.map((spec) => (
              <div key={spec.label} className="py-3.5 first:pt-0 last:pb-0">
                <dt className="text-[13px] font-medium text-subtle">{spec.label}</dt>
                <dd className="m-0 mt-1 font-mono text-[13px] text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-hairline pt-5">
            <a
              href="https://github.com/ReliaForge/reliaforge-plugins/blob/main/deploy/compose.yaml"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-signal decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:text-signal"
            >
              {deploy.composeLink}
              <ArrowUpRight
                className="h-4 w-4 text-signal transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href={`${docsUrl}guide/deploying-console.html`}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-muted transition-colors duration-200 ease-out hover:text-ink"
            >
              {deploy.prodGuideLink}
              <ArrowUpRight
                className="h-4 w-4 text-subtle transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

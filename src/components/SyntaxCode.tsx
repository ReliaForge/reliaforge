import type { ReactNode } from "react"

export type SnippetLanguage = "python" | "json" | "tsx" | "bash" | "yaml"

const KEYWORDS: Record<SnippetLanguage, Set<string>> = {
  python: new Set(["from", "import", "async", "def", "if", "not", "raise", "return", "dict", "str", "True", "False", "None"]),
  json: new Set(["true", "false", "null"]),
  tsx: new Set(["import", "from", "export", "default", "function", "const", "return", "null"]),
  bash: new Set(["git", "clone", "cd", "docker", "compose", "pull", "up", "python", "source", "reliaforge-scaffold", "reliaforge"]),
  yaml: new Set(["services", "image", "container_name", "restart", "ports", "environment", "volumes", "true", "false", "production", "proxy"]),
}

const TOKEN_RE =
  /(#.*$|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_][A-Za-z0-9_.]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_-]*\b)/gm

function classifyYamlToken(token: string, line: string, endIdx: number): string {
  if (line[endIdx] === ":") {
    return /^[A-Z][A-Z0-9_]+$/.test(token) ? "syn-prop" : "syn-kw"
  }
  return KEYWORDS.yaml.has(token) ? "syn-kw" : ""
}

function classifyCodeToken(token: string, language: SnippetLanguage, line: string, endIdx: number): string {
  if (token.startsWith("#") || token.startsWith("//")) return "syn-comment"
  if (token.startsWith('"') || token.startsWith("'")) {
    const rest = line.slice(endIdx).trimStart()
    return language === "json" && rest.startsWith(":") ? "syn-prop" : "syn-str"
  }
  if (token.startsWith("@")) return "syn-fn"
  if (/^\d/.test(token)) return "syn-num"
  if (language === "yaml") return classifyYamlToken(token, line, endIdx)
  if (KEYWORDS[language].has(token)) return "syn-kw"
  if (language === "bash" && /^[A-Z][A-Z0-9_]+$/.test(token) && line[endIdx] === "=") return "syn-prop"
  if ((language === "python" || language === "tsx") && line[endIdx] === "(") return "syn-fn"
  return ""
}

function highlightLine(line: string, language: SnippetLanguage): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  TOKEN_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index))
    }
    const token = match[0]
    const className = classifyCodeToken(token, language, line, match.index + token.length)
    nodes.push(
      className ? (
        <span key={key} className={className}>
          {token}
        </span>
      ) : (
        token
      ),
    )
    key += 1
    lastIndex = match.index + token.length
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex))
  }
  return nodes.length > 0 ? nodes : [" "]
}

export function SyntaxCode({ code, language }: { code: string; language: SnippetLanguage }) {
  const lines = code.split("\n")
  return (
    <pre className="m-0 overflow-x-auto bg-code-bg p-5 font-mono text-[13px] leading-[1.7] text-code-ink">
      <code>
        {lines.map((line, idx) => (
          <div key={idx} className="table-row">
            <span
              aria-hidden="true"
              className="table-cell select-none pr-4 text-right text-[12px] text-subtle/60"
            >
              {idx + 1}
            </span>
            <span className="table-cell whitespace-pre">{highlightLine(line, language)}</span>
          </div>
        ))}
      </code>
    </pre>
  )
}

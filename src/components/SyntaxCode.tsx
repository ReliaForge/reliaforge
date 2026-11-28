import type { ReactNode } from "react"

export type SnippetLanguage = "python" | "json" | "tsx" | "bash"

const KEYWORDS: Record<SnippetLanguage, Set<string>> = {
  python: new Set(["from", "import", "async", "def", "if", "not", "raise", "return", "dict", "str", "True", "False", "None"]),
  json: new Set(["true", "false", "null"]),
  tsx: new Set(["import", "from", "export", "default", "function", "const", "return", "null"]),
  bash: new Set(["git", "clone", "cd", "docker", "build", "run", "python", "source", "reliaforge-scaffold", "reliaforge"]),
}

const TOKEN_RE =
  /(#.*$|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_][A-Za-z0-9_.]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_-]*\b)/gm

function highlightLine(line: string, language: SnippetLanguage): ReactNode[] {
  const nodes: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  const kw = KEYWORDS[language]

  TOKEN_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index))
    }
    const token = match[0]
    let className = ""
    if (token.startsWith("#") || token.startsWith("//")) {
      className = "syn-comment"
    } else if (token.startsWith('"') || token.startsWith("'")) {
      const rest = line.slice(match.index + token.length).trimStart()
      className = language === "json" && rest.startsWith(":") ? "syn-prop" : "syn-str"
    } else if (token.startsWith("@")) {
      className = "syn-fn"
    } else if (/^\d/.test(token)) {
      className = "syn-num"
    } else if (kw.has(token)) {
      className = "syn-kw"
    } else if (
      language === "bash" &&
      /^[A-Z][A-Z0-9_]+$/.test(token) &&
      line[match.index + token.length] === "="
    ) {
      className = "syn-prop"
    } else if (
      (language === "python" || language === "tsx") &&
      line[match.index + token.length] === "("
    ) {
      className = "syn-fn"
    }

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
    <pre className="m-0 overflow-x-auto bg-code-bg p-5 font-mono text-[13px] leading-[1.72] text-code-ink">
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

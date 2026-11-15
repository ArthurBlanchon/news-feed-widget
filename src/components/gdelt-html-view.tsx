import { ExternalLink } from "lucide-react"

import { httpUrl } from "@/app/safe-url"

type GdeltHtmlViewProps = {
  url: string
  query: string
}

export function GdeltHtmlView({ url: raw, query }: GdeltHtmlViewProps) {
  const url = httpUrl(raw)
  if (!url) return null
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex shrink-0 flex-col gap-2 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="line-clamp-2 text-xs text-muted-foreground">{query}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Open GDELT page
            <ExternalLink className="size-3.5" />
          </a>
        </div>
        <p className="truncate font-mono text-[10px] text-muted-foreground">
          {url}
        </p>
        <p className="text-[10px] text-muted-foreground">
          GDELT HTML view with Google Translate on titles (browser language).
        </p>
      </header>
      <iframe
        title="GDELT ArtList"
        src={url}
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  )
}

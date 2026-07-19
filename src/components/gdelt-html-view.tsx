import { ExternalLink } from "lucide-react"

type GdeltHtmlViewProps = {
  url: string
  query: string
}

export function GdeltHtmlView({ url, query }: GdeltHtmlViewProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border flex shrink-0 flex-col gap-2 border-b px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground line-clamp-2 text-xs">{query}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex shrink-0 items-center gap-1 text-xs"
          >
            Open GDELT page
            <ExternalLink className="size-3.5" />
          </a>
        </div>
        <p className="text-muted-foreground truncate font-mono text-[10px]">
          {url}
        </p>
        <p className="text-muted-foreground text-[10px]">
          GDELT HTML view with Google Translate on titles (browser language).
        </p>
      </header>
      <iframe
        title="GDELT ArtList"
        src={url}
        className="min-h-0 flex-1 w-full border-0"
      />
    </div>
  )
}

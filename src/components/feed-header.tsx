import { Newspaper } from "lucide-react"

type FeedHeaderProps = {
  query: string
  requestUrl?: string | null
  subtitle?: string
}

export function FeedHeader({ query, requestUrl, subtitle }: FeedHeaderProps) {
  return (
    <header className="border-border flex shrink-0 flex-col gap-1 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <Newspaper className="size-4 text-muted-foreground" />
        <h1 className="font-medium">News feed</h1>
      </div>
      {subtitle ? (
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      ) : null}
      <p className="text-muted-foreground line-clamp-2 text-xs">{query}</p>
      {requestUrl ? (
        <p className="text-muted-foreground truncate font-mono text-[10px]">
          {requestUrl}
        </p>
      ) : null}
    </header>
  )
}

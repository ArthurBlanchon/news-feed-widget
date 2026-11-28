import { useMemo, type ReactNode } from "react"
import { Loader2, Newspaper } from "lucide-react"

import { ArticleCard } from "@/components/article-card"
import { FeedHeader } from "@/components/feed-header"
import { GdeltHtmlView } from "@/components/gdelt-html-view"
import { useGdeltFeed } from "@/hooks/use-gdelt-feed"
import {
  buildGdeltHtmlArtListUrl,
  mappedRecordToFilters,
  parseDisplayMode,
} from "@/lib/gdelt"
import { GRIST_OPTIONS, WIDGET_METADATA } from "@/grist-options"
import type { GdeltMappedRow } from "@/types"

import { useGrist, useWidgetMetadata } from "grist-widget-sdk"

export { GRIST_OPTIONS }

function App() {
  useWidgetMetadata(WIDGET_METADATA)
  const w = useGrist<Record<string, unknown>, GdeltMappedRow>()

  const filters = useMemo(
    () => mappedRecordToFilters(w.mappedRecord),
    [w.mappedRecord],
  )

  const displayMode = useMemo(
    () => parseDisplayMode(w.mappedRecord?.Display),
    [w.mappedRecord?.Display],
  )

  const canFetch =
    w.columnMappingStatus.ok &&
    w.mode === "row" &&
    filters != null &&
    (filters.mode ?? "ArtList") === "ArtList"

  const feed = useGdeltFeed(filters, canFetch && displayMode === "shadcn")

  if (w.status === "booting") {
    return <StatusPanel title="Connecting to Grist…" />
  }

  if (!w.columnMappingStatus.ok && !w.columnMappingStatus.pending) {
    return (
      <StatusPanel
        title="Map columns in the widget panel"
        body={`Required: Query (Text). Missing: ${w.columnMappingStatus.missing.join(", ")}`}
      />
    )
  }

  if (w.mode === "empty") {
    return (
      <StatusPanel
        title="Select a configuration row"
        body="Link this widget to a table of GDELT search parameters and pick a row."
        icon={<Newspaper className="size-8 opacity-40" />}
      />
    )
  }

  if (w.mode === "new-row") {
    return (
      <StatusPanel
        title="Add a query on this row"
        body='Fill the mapped Query column (e.g. "climate change") to load articles.'
      />
    )
  }

  if (!filters?.query) {
    return (
      <StatusPanel
        title="Query required"
        body="The selected row needs a non-empty Query value."
      />
    )
  }

  const activeMode = filters.mode ?? "ArtList"
  if (activeMode !== "ArtList") {
    return (
      <StatusPanel
        title="ArtList mode required"
        body={`Article cards use GDELT ArtList. Current mode: ${activeMode}.`}
      />
    )
  }

  if (displayMode === "html") {
    const htmlUrl = buildGdeltHtmlArtListUrl(filters)
    return <GdeltHtmlView url={htmlUrl} query={filters.query} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <FeedHeader query={filters.query} requestUrl={feed.requestUrl} />

      <main className="min-h-0 flex-1 overflow-y-auto p-4">
        {feed.loading ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-16 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Loading articles from GDELT…
          </div>
        ) : null}

        {!feed.loading && feed.error ? (
          <StatusPanel title="Could not load articles" body={feed.error} />
        ) : null}

        {!feed.loading && !feed.error && feed.articles.length === 0 ? (
          <StatusPanel
            title="No articles found"
            body="Try widening the timespan or simplifying the query."
          />
        ) : null}

        {!feed.loading && !feed.error && feed.articles.length > 0 ? (
          <ul className="mx-auto grid max-w-6xl list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {feed.articles.map((article) => (
              <li key={article.url}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        ) : null}
      </main>

      {!feed.loading && !feed.error && feed.articles.length > 0 ? (
        <footer className="border-border text-muted-foreground shrink-0 border-t px-4 py-2 text-center text-xs">
          {feed.articles.length} article
          {feed.articles.length === 1 ? "" : "s"} from GDELT
        </footer>
      ) : null}
    </div>
  )
}

function StatusPanel({
  title,
  body,
  icon,
}: {
  title: string
  body?: string
  icon?: ReactNode
}) {
  return (
    <div className="text-muted-foreground flex min-h-svh items-center justify-center p-6 text-sm">
      <div className="max-w-md space-y-3 text-center">
        {icon ? <div className="flex justify-center">{icon}</div> : null}
        <p className="text-foreground font-medium">{title}</p>
        {body ? <p className="text-xs leading-relaxed">{body}</p> : null}
      </div>
    </div>
  )
}

export default App

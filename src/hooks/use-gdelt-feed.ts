import { useEffect, useState } from "react"

import {
  buildGdeltUrl,
  fetchGdeltArtList,
  type GdeltFilters,
  type GdeltMode,
} from "@/lib/gdelt"
import type { GdeltArticle } from "@/types"

export type UseGdeltFeedResult = {
  articles: GdeltArticle[]
  loading: boolean
  error: string | null
  requestUrl: string | null
  mode: GdeltMode | null
}

type FeedSnapshot = {
  key: string
  articles: GdeltArticle[]
  error: string | null
  mode: GdeltMode | null
}

export function useGdeltFeed(
  filters: GdeltFilters | null,
  enabled: boolean,
): UseGdeltFeedResult {
  const url = enabled && filters ? buildGdeltUrl(filters) : null
  const requestKey = url ?? ""
  const [snapshot, setSnapshot] = useState<FeedSnapshot | null>(null)

  useEffect(() => {
    if (!url) return

    let cancelled = false

    void (async () => {
      try {
        const result = await fetchGdeltArtList(url)
        if (cancelled) return
        setSnapshot({
          key: requestKey,
          articles: result.articles,
          error: null,
          mode: result.rawMode,
        })
      } catch (err) {
        if (cancelled) return
        setSnapshot({
          key: requestKey,
          articles: [],
          error: err instanceof Error ? err.message : String(err),
          mode: filters?.mode ?? "ArtList",
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [url, requestKey, filters?.mode])

  if (!enabled || !filters || !url) {
    return {
      articles: [],
      loading: false,
      error: null,
      requestUrl: null,
      mode: null,
    }
  }

  const settled = snapshot?.key === requestKey
  return {
    articles: settled ? snapshot.articles : [],
    loading: !settled,
    error: settled ? snapshot.error : null,
    requestUrl: url,
    mode: settled ? snapshot.mode : (filters.mode ?? "ArtList"),
  }
}

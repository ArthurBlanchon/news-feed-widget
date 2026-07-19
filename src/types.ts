import type { GdeltMode } from "@/lib/gdelt"

export type GdeltMappedRow = {
  Query?: unknown
  Mode?: unknown
  MaxRecords?: unknown
  Timespan?: unknown
  StartDateTime?: unknown
  EndDateTime?: unknown
  SourceLang?: unknown
  SourceCountry?: unknown
  Theme?: unknown
  Domain?: unknown
  Display?: unknown
}

export type GdeltDisplayMode = "shadcn" | "html"

export type GdeltArticle = {
  url: string
  url_mobile?: string
  title: string
  seendate?: string
  socialimage?: string
  domain?: string
  language?: string
  sourcecountry?: string
}

export type GdeltFeedState = {
  articles: GdeltArticle[]
  loading: boolean
  error: string | null
  requestUrl: string | null
  mode: GdeltMode | null
}

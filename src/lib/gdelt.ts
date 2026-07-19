import type { GdeltArticle, GdeltDisplayMode, GdeltMappedRow } from "@/types"

export const GDELT_DOC_BASE = "https://api.gdeltproject.org/api/v2/doc/doc"

export const GDELT_MODES = [
  "ArtList",
  "TimelineVol",
  "TimelineTone",
  "TimelineLang",
  "TimelineSourceCountry",
] as const

export type GdeltMode = (typeof GDELT_MODES)[number]

export type GdeltFilters = {
  query: string
  mode?: GdeltMode
  maxrecords?: number
  timespan?: string
  startdatetime?: string
  enddatetime?: string
  sourcelang?: string
  sourcecountry?: string
  theme?: string
  domain?: string
  format?: "json" | "csv" | "rss" | "html"
  /** GDELT `trans` param; use `googtrans` for embedded Google Translate (HTML ArtList only). */
  trans?: string
}

export function parseDisplayMode(value: unknown): GdeltDisplayMode {
  const text = cellString(value)?.toLowerCase()
  if (text === "html") return "html"
  return "shadcn"
}

function cellString(value: unknown): string | undefined {
  if (value == null || value === "") return undefined
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function cellNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const text = cellString(value)
  if (!text) return undefined
  const parsed = Number(text)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseMode(value: unknown): GdeltMode | undefined {
  const text = cellString(value)
  if (!text) return undefined
  const match = GDELT_MODES.find(
    (mode) => mode.toLowerCase() === text.toLowerCase(),
  )
  return match
}

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

function formatGdeltDateTime(date: Date): string {
  return (
    `${date.getUTCFullYear()}` +
    `${pad2(date.getUTCMonth() + 1)}` +
    `${pad2(date.getUTCDate())}` +
    `${pad2(date.getUTCHours())}` +
    `${pad2(date.getUTCMinutes())}` +
    `${pad2(date.getUTCSeconds())}`
  )
}

function toGdeltDateTime(value: unknown): string | undefined {
  if (value == null || value === "") return undefined
  if (typeof value === "number" && Number.isFinite(value)) {
    return formatGdeltDateTime(new Date(value))
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatGdeltDateTime(value)
  }
  const text = cellString(value)
  if (!text) return undefined
  if (/^\d{14}$/.test(text)) return text
  const parsed = new Date(text)
  if (!Number.isNaN(parsed.getTime())) return formatGdeltDateTime(parsed)
  return text
}

export function mappedRecordToFilters(
  mapped: GdeltMappedRow | null | undefined,
): GdeltFilters | null {
  if (!mapped) return null
  const query = cellString(mapped.Query)
  if (!query) return null

  const maxrecordsRaw = cellNumber(mapped.MaxRecords)
  const maxrecords =
    maxrecordsRaw == null
      ? undefined
      : Math.min(250, Math.max(1, Math.round(maxrecordsRaw)))

  return {
    query,
    mode: parseMode(mapped.Mode),
    maxrecords,
    timespan: cellString(mapped.Timespan),
    startdatetime: toGdeltDateTime(mapped.StartDateTime),
    enddatetime: toGdeltDateTime(mapped.EndDateTime),
    sourcelang: cellString(mapped.SourceLang),
    sourcecountry: cellString(mapped.SourceCountry),
    theme: cellString(mapped.Theme),
    domain: cellString(mapped.Domain),
  }
}

export function buildGdeltHtmlArtListUrl(filters: GdeltFilters): string {
  return buildGdeltUrl({
    ...filters,
    mode: filters.mode ?? "ArtList",
    format: "html",
    trans: "googtrans",
  })
}

export function buildGdeltUrl(filters: GdeltFilters): string {
  const params = new URLSearchParams({
    query: filters.query,
    mode: filters.mode ?? "ArtList",
    maxrecords: String(filters.maxrecords ?? 75),
    format: filters.format ?? "json",
    ...(filters.timespan && { timespan: filters.timespan }),
    ...(filters.startdatetime && { startdatetime: filters.startdatetime }),
    ...(filters.enddatetime && { enddatetime: filters.enddatetime }),
    ...(filters.sourcelang && { sourcelang: filters.sourcelang }),
    ...(filters.sourcecountry && { sourcecountry: filters.sourcecountry }),
    ...(filters.theme && { theme: filters.theme }),
    ...(filters.domain && { domain: filters.domain }),
    ...(filters.trans && { trans: filters.trans }),
  })
  return `${GDELT_DOC_BASE}?${params}`
}

export function formatSeenDate(seendate: string | undefined): string | null {
  if (!seendate) return null
  const match = seendate.match(
    /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
  )
  if (!match) return seendate
  const [, y, mo, d, h, mi, s] = match
  const date = new Date(
    Date.UTC(
      Number(y),
      Number(mo) - 1,
      Number(d),
      Number(h),
      Number(mi),
      Number(s),
    ),
  )
  if (Number.isNaN(date.getTime())) return seendate
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export async function fetchGdeltArtList(url: string): Promise<{
  articles: GdeltArticle[]
  rawMode: GdeltMode | null
}> {
  const response = await fetch(url)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(
      text.trim() || `GDELT request failed (${response.status})`,
    )
  }

  let payload: unknown
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error(text.trim() || "GDELT returned a non-JSON response")
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected GDELT response shape")
  }

  const record = payload as Record<string, unknown>
  const modeParam = new URL(url).searchParams.get("mode")
  const rawMode =
    GDELT_MODES.find(
      (mode) => mode.toLowerCase() === (modeParam ?? "ArtList").toLowerCase(),
    ) ?? null

  if (Array.isArray(record.articles)) {
    return {
      articles: record.articles.filter(isGdeltArticle),
      rawMode,
    }
  }

  if (Array.isArray(payload)) {
    return {
      articles: payload.filter(isGdeltArticle),
      rawMode,
    }
  }

  throw new Error(
    rawMode && rawMode !== "ArtList"
      ? `Mode "${rawMode}" does not return article lists. Use ArtList for the news feed.`
      : "No articles field in GDELT response",
  )
}

function isGdeltArticle(value: unknown): value is GdeltArticle {
  if (!value || typeof value !== "object") return false
  const row = value as Record<string, unknown>
  return typeof row.url === "string" && typeof row.title === "string"
}

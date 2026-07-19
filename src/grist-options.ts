import type { UseGristOptions } from "grist-widget-sdk"

export const GRIST_OPTIONS: UseGristOptions = {
  requiredAccess: "read table",
  columns: [
    {
      name: "Query",
      type: "Text",
      description:
        'GDELT search query (required). Example: "influence operations" OR "information warfare".',
    },
    {
      name: "Mode",
      type: "Text",
      optional: true,
      description:
        "ArtList (default), TimelineVol, TimelineTone, TimelineLang, or TimelineSourceCountry.",
    },
    {
      name: "MaxRecords",
      type: "Numeric",
      optional: true,
      description: "Maximum articles to fetch (1–250, default 75).",
    },
    {
      name: "Timespan",
      type: "Text",
      optional: true,
      description: 'Relative window, e.g. "7d", "4h", "3m".',
    },
    {
      name: "StartDateTime",
      type: "Text,DateTime",
      optional: true,
      description: "Start bound as YYYYMMDDHHMMSS or a Grist datetime.",
    },
    {
      name: "EndDateTime",
      type: "Text,DateTime",
      optional: true,
      description: "End bound as YYYYMMDDHHMMSS or a Grist datetime.",
    },
    {
      name: "SourceLang",
      type: "Text",
      optional: true,
      description: 'Source language, e.g. "French".',
    },
    {
      name: "SourceCountry",
      type: "Text",
      optional: true,
      description: "FIPS 2-letter source country code.",
    },
    {
      name: "Theme",
      type: "Text",
      optional: true,
      description: "GKG theme filter.",
    },
    {
      name: "Domain",
      type: "Text",
      optional: true,
      description: "Restrict to a news domain.",
    },
    {
      name: "Display",
      type: "Text",
      optional: true,
      description:
        'View: "shadcn" (default, article cards) or "html" (embedded GDELT page with Google Translate on titles).',
    },
  ],
  suppressAlerts: ["section-not-linked"],
}

export const WIDGET_METADATA = {
  title: "News feed",
  description:
    "GDELT Doc 2.0 article list driven by mapped columns on the linked Grist row.",
} as const

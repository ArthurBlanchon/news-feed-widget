# news-feed-widget

A Grist custom widget: a live news feed from the [GDELT](https://www.gdeltproject.org/)
Doc 2.0 API, driven by the selected row. Each row of your table is a saved
search (a query, and optionally a time window, a source language or
country, a theme or a domain); select one and the widget lists the matching
articles, or embeds GDELT's own HTML view (`Display` = `html`).

<!-- install-url:start -->
**Install URL**, to paste into a Grist custom widget's URL field: <https://arthurblanchon.github.io/news-feed-widget/latest/>
<!-- install-url:end -->

**Try it:** <https://arthurblanchon.github.io/news-feed-widget/latest/demo/>, Grist running in your browser with sample data (nothing is saved).

## In Grist

Add a custom widget, paste the install URL, and set its access level to
**Read selected table**.

Then map its columns:

| Column | Type | What it is |
| --- | --- | --- |
| `Query` | Text | the GDELT search, required |
| `Mode` | Text, optional | `ArtList` (default) or a timeline mode |
| `MaxRecords` | Numeric, optional | 1 to 250, default 75 |
| `Timespan` | Text, optional | `7d`, `4h`, `3m`… |
| `StartDateTime`, `EndDateTime` | Text or DateTime, optional | bounds |
| `SourceLang`, `SourceCountry`, `Theme`, `Domain` | Text, optional | filters |
| `Display` | Text, optional | `shadcn` (cards, default) or `html` |

## Code

The widget's own code is in `src/`:

- `src/app/App.tsx` turns the selected row's mapped cells into GDELT filters
  and renders the feed (`src/components/article-card.tsx`,
  `src/components/feed-header.tsx`) or GDELT's HTML view
  (`src/components/gdelt-html-view.tsx`).
- `src/hooks/use-gdelt-feed.ts` fetches it, through `src/lib/gdelt.ts`.
- `GRIST_OPTIONS` is in `src/grist-options.ts`.

## Develop

Develop on the `dev` branch; every push deploys `/dev/`
(<https://arthurblanchon.github.io/news-feed-widget/dev/>), which reloads itself in an
open Grist document a few seconds later.

| | |
| --- | --- |
| Install | `pnpm install` |
| Test (emulated Grist, no browser) | `pnpm test` |
| Lint, type-check, build | `pnpm lint`, `pnpm typecheck`, `pnpm build` |
| The widget in a real local Grist (Docker) | `pnpm demo` |
| Regenerate the demo page | `pnpm demo --save` |

`src/main.tsx` is one `mountGristWidget()` call from `grist-widget-sdk/app`:
inside Grist it renders the widget behind the SDK's connection and
column-mapping screens, with its alerts, in Grist's light or dark theme.
Opened anywhere else, it shows which build this is and the URL to paste into
Grist. The widget's code reads Grist only through `grist-widget-sdk`
([docs](https://gristwidgets.com/docs)), never the `grist` global.

`src/main.tsx`, the workflows and the build config are the template's: they
come from `create-grist-widget`, and `pnpm exec create-grist-widget upgrade`
(run on `dev` after Dependabot updates it) rewrites them
([Upgrading a widget](https://gristwidgets.com/docs/cli/upgrading)).
`AGENTS.md` says which files are which.

## Release

1. On `dev`, bump `package.json`'s `version`.
2. Open a pull request from `dev` into `main`, and merge it once its checks
   are green.

Merging builds `/v<version>/` and updates `/latest/` and their demo pages.
Without a version bump, nothing is published. The deploy workflow and its
one-time repository settings are described in the
[template's README](https://github.com/ArthurBlanchon/grist-widget-template#deployment).

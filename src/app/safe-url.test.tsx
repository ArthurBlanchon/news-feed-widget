import "@testing-library/jest-dom/vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { ArticleCard } from "@/components/article-card"
import { GdeltHtmlView } from "@/components/gdelt-html-view"
import type { GdeltArticle } from "@/types"

import { httpUrl } from "./safe-url"

afterEach(cleanup)

const article = (over: Partial<GdeltArticle>): GdeltArticle =>
  ({
    url: "https://example.org/a",
    url_mobile: "",
    title: "A title",
    seendate: "",
    socialimage: "",
    domain: "example.org",
    language: "",
    sourcecountry: "",
    ...over,
  }) as GdeltArticle

describe("links from the feed", () => {
  it("keeps http(s) addresses only", () => {
    expect(httpUrl("https://example.org/x?y=1")).toBe(
      "https://example.org/x?y=1"
    )
    expect(httpUrl("http://example.org")).toBe("http://example.org/")
    for (const bad of [
      "javascript:alert(1)",
      " JavaScript:alert(1)",
      "data:text/html,<script>",
      "vbscript:x",
      "/relative",
      "",
      null,
      42,
    ])
      expect(httpUrl(bad)).toBeUndefined()
  })

  it("renders an article with a javascript: address as text, without a link or its image", () => {
    render(
      <ArticleCard
        article={article({
          url: "javascript:alert(1)",
          socialimage: "javascript:alert(2)",
        })}
      />
    )
    expect(screen.getByText("A title")).toBeInTheDocument()
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
    expect(document.querySelector("img")).toBeNull()
  })

  it("links an article with an https address", () => {
    render(<ArticleCard article={article({})} />)
    for (const a of screen.getAllByRole("link"))
      expect(a).toHaveAttribute("href", "https://example.org/a")
  })

  it("shows no GDELT page for an address that isn't http(s)", () => {
    const { container } = render(
      <GdeltHtmlView url="javascript:alert(1)" query="q" />
    )
    expect(container).toBeEmptyDOMElement()
  })
})

import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { httpUrl } from "@/app/safe-url"
import { formatSeenDate } from "@/lib/gdelt"
import type { GdeltArticle } from "@/types"

type ArticleCardProps = {
  article: GdeltArticle
}

export function ArticleCard({ article }: ArticleCardProps) {
  const seen = formatSeenDate(article.seendate)
  // Links and images from the feed: http(s) only.
  const href = httpUrl(article.url_mobile) ?? httpUrl(article.url)
  const image = httpUrl(article.socialimage)

  return (
    <Card className="h-full">
      {image && href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden"
        >
          <img
            src={image}
            alt=""
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </a>
      ) : null}
      <CardHeader className="gap-2">
        <CardTitle className="line-clamp-3">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline"
            >
              {article.title}
            </a>
          ) : (
            article.title
          )}
        </CardTitle>
        {seen ? <CardDescription>{seen}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        {article.domain ? (
          <Badge variant="secondary">{article.domain}</Badge>
        ) : null}
        {article.language ? (
          <Badge variant="outline">{article.language}</Badge>
        ) : null}
        {article.sourcecountry ? (
          <Badge variant="outline">{article.sourcecountry}</Badge>
        ) : null}
      </CardContent>
      {href ? (
        <CardFooter className="mt-auto justify-end gap-2 text-xs">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            Open article
            <ExternalLink className="size-3.5" />
          </a>
        </CardFooter>
      ) : null}
    </Card>
  )
}

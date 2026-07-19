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
import { formatSeenDate } from "@/lib/gdelt"
import type { GdeltArticle } from "@/types"

type ArticleCardProps = {
  article: GdeltArticle
}

export function ArticleCard({ article }: ArticleCardProps) {
  const seen = formatSeenDate(article.seendate)
  const href = article.url_mobile || article.url

  return (
    <Card className="h-full">
      {article.socialimage ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden"
        >
          <img
            src={article.socialimage}
            alt=""
            className="aspect-[16/9] w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </a>
      ) : null}
      <CardHeader className="gap-2">
        <CardTitle className="line-clamp-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline"
          >
            {article.title}
          </a>
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
      <CardFooter className="mt-auto justify-end gap-2 text-xs">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          Open article
          <ExternalLink className="size-3.5" />
        </a>
      </CardFooter>
    </Card>
  )
}

/**
 * A link or image address from data, kept only when it is http(s): a
 * `javascript:` or `data:` address from a feed never reaches an href or a src.
 */
export function httpUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

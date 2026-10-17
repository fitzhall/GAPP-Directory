// Server-side guess at whether a tracking call came from automation. Views
// are counted by page code, which search and AI crawlers also run, so a
// crawl day used to look like a hundred families. Crawlers are skipped at
// the counter; the page itself is never blocked here.

const CRAWLER_PATTERN =
  /bot|crawl|spider|slurp|headless|phantom|selenium|puppeteer|playwright|python-requests|python-urllib|curl\/|wget\/|go-http-client|java\/|okhttp|axios\/|node-fetch|libwww|httpclient|scrapy|facebookexternalhit|embedly|quora link preview|outbrain|pinterest\/|vkshare|w3c_validator|lighthouse|pagespeed|gtmetrix|dataprovider|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic|perplexity|ccbot|applebot|amazonbot|yandex|baidu|duckduck|vercel/i

export function isCrawlerUserAgent(ua: string | null | undefined): boolean {
  if (!ua || ua.trim() === '') return true
  return CRAWLER_PATTERN.test(ua)
}

const MAX = 200

export function eventClientMeta(ua: string | null | undefined, ref: string | null | undefined): { ua?: string; ref?: string } {
  const out: { ua?: string; ref?: string } = {}
  if (ua && ua.trim()) out.ua = ua.slice(0, MAX)
  if (ref && ref.trim()) out.ref = ref.slice(0, MAX)
  return out
}

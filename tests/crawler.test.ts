import { describe, it, expect } from 'vitest'
import { isCrawlerUserAgent, eventClientMeta } from '@/lib/crawler'

describe('isCrawlerUserAgent', () => {
  it('flags search, AI and headless crawlers', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0)',
      'Mozilla/5.0 (compatible; GPTBot/1.0)',
      'Mozilla/5.0 (compatible; ClaudeBot/1.0)',
      'Mozilla/5.0 (compatible; PerplexityBot/1.0)',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0)',
      'Mozilla/5.0 (compatible; SemrushBot/7)',
      'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/120.0',
      'python-requests/2.31',
      'curl/8.4.0',
      'Vercelbot/1.0',
    ]) expect(isCrawlerUserAgent(ua), ua).toBe(true)
  })
  it('passes real phones and desktops', () => {
    for (const ua of [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
    ]) expect(isCrawlerUserAgent(ua), ua).toBe(false)
  })
  it('treats a missing user agent as a crawler', () => {
    expect(isCrawlerUserAgent(null)).toBe(true)
    expect(isCrawlerUserAgent('')).toBe(true)
  })
})

describe('eventClientMeta', () => {
  it('keeps a short user agent and referrer for later filtering', () => {
    const m = eventClientMeta('Mozilla/5.0 (iPhone) Safari', 'https://www.google.com/')
    expect(m).toEqual({ ua: 'Mozilla/5.0 (iPhone) Safari', ref: 'https://www.google.com/' })
  })
  it('truncates long values and drops empty ones', () => {
    const m = eventClientMeta('x'.repeat(500), null)
    expect(m.ua).toHaveLength(200)
    expect(m).not.toHaveProperty('ref')
  })
})

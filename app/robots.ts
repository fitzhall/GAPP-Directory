import { MetadataRoute } from 'next'

// AI search crawlers are named on purpose: families now ask ChatGPT,
// Claude, Perplexity and Google's AI answers about GAPP, and these bots
// can only quote pages they are let in to read.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/admin/', '/api/', '/report/', '/claim/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/report/', '/claim/'],
      },
    ],
    sitemap: 'https://www.georgiagapp.com/sitemap.xml',
    host: 'https://www.georgiagapp.com',
  }
}

// Note: llms.txt is served from /public/llms.txt at https://www.georgiagapp.com/llms.txt

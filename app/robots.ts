import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://www.georgiagapp.com/sitemap.xml',
    // AI/LLM crawler info file
    host: 'https://www.georgiagapp.com',
  }
}

// Note: llms.txt is served from /public/llms.txt at https://www.georgiagapp.com/llms.txt

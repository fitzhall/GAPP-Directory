/**
 * Blog post registry and helpers
 * Central data model for all blog posts — Phase 8 populates the BLOG_POSTS array
 */

export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  publishedAt: string       // ISO date string
  updatedAt?: string        // ISO date string
  readingTime: string       // e.g. "6 min read"
  category: string          // e.g. "GAPP Guide", "Family Resources"
  keywords: string[]
}

// Phase 8 will add posts here
export const BLOG_POSTS: BlogPost[] = []

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

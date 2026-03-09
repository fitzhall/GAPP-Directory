/**
 * Blog post registry and helpers
 * Central data model for all blog posts
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

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'childcare-medically-fragile-children-georgia',
    title: 'Childcare options for medically fragile children in Georgia',
    description: 'Regular daycares say no to kids with trachs and feeding tubes. Here are the actual childcare options Georgia families have, from GAPP home nursing to medical daycares.',
    author: 'GeorgiaGAPP.com',
    publishedAt: '2026-03-09',
    readingTime: '5 min read',
    category: 'Family Resources',
    keywords: [
      'daycare medically fragile children',
      'medically fragile daycare near me',
      'sick child care Georgia',
      'childcare medical needs',
      'medically fragile daycare',
      'GAPP childcare alternative',
      'PPEC Georgia',
      'daycare for special needs children Georgia',
    ],
  },
  {
    slug: 'what-does-gapp-stand-for',
    title: 'What does GAPP stand for? A plain-English guide to Georgia\'s pediatric program',
    description: 'GAPP stands for Georgia Pediatric Program. Here\'s what it does, who qualifies, how it\'s different from Katie Beckett and other waivers, and how to get started.',
    author: 'GeorgiaGAPP.com',
    publishedAt: '2026-03-09',
    readingTime: '5 min read',
    category: 'GAPP Guide',
    keywords: [
      'what does GAPP stand for',
      'GAPP program Georgia',
      'Georgia pediatric program',
      'GAPP meaning',
      'GAPP vs Katie Beckett',
      'GAPP eligibility',
    ],
  },
  {
    slug: 'home-health-aides-vs-gapp-nursing',
    title: 'Home health aides vs. GAPP nursing: what\'s the difference?',
    description: 'Home health aides and GAPP nurses are not the same thing. Here\'s what each one does, who qualifies, and how to figure out which your child needs.',
    author: 'GeorgiaGAPP.com',
    publishedAt: '2026-03-09',
    readingTime: '5 min read',
    category: 'GAPP Guide',
    keywords: [
      'home health aides medically fragile children',
      'GAPP nursing vs home health aide',
      'medically fragile children homecare',
      'home care medically fragile children',
      'PCS vs nursing GAPP',
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

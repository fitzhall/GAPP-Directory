import Link from 'next/link'
import { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/blog-data'
import { BreadcrumbSchema } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'GAPP blog — tips for Georgia families navigating home care',
  description: 'Practical guides, parent tips, and GAPP program updates for Georgia families with medically fragile children. Written by people who actually get it.',
  keywords: 'GAPP blog, Georgia pediatric program tips, GAPP parent resources, medically fragile children blog, home nursing Georgia',
  openGraph: {
    title: 'GAPP blog — tips for Georgia families',
    description: 'Practical guides and GAPP program updates for Georgia families with medically fragile children.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.georgiagapp.com/blog',
  },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Blog', url: 'https://www.georgiagapp.com/blog' },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-12 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Blog</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            GAPP blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Straight talk about the Georgia Pediatric Program, finding providers, and getting your kid the care they need at home.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <span className="bg-accent/10 text-accent px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {post.description}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog posts coming soon</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We're working on guides and tips to help Georgia families navigate the GAPP program. Check back soon.
              </p>
              <Link
                href="/gapp-approval-guide"
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                Read our GAPP approval guide
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-data'
import { ArticleSchema, BreadcrumbSchema } from '@/components/JsonLd'
import ChildcareMedicallyFragileContent from '@/lib/blog-posts/childcare-medically-fragile-children-georgia'
import WhatDoesGappStandForContent from '@/lib/blog-posts/what-does-gapp-stand-for'
import HomeHealthAidesVsGappContent from '@/lib/blog-posts/home-health-aides-vs-gapp-nursing'

const POST_CONTENT: Record<string, React.ComponentType> = {
  'childcare-medically-fragile-children-georgia': ChildcareMedicallyFragileContent,
  'what-does-gapp-stand-for': WhatDoesGappStandForContent,
  'home-health-aides-vs-gapp-nursing': HomeHealthAidesVsGappContent,
}

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: [post.author],
    },
    alternates: {
      canonical: `https://www.georgiagapp.com/blog/${post.slug}`,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const ContentComponent = POST_CONTENT[params.slug]

  return (
    <div className="min-h-screen bg-white">
      <ArticleSchema
        headline={post.title}
        description={post.description}
        url={`https://www.georgiagapp.com/blog/${post.slug}`}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        author={post.author}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.georgiagapp.com' },
          { name: 'Blog', url: 'https://www.georgiagapp.com/blog' },
          { name: post.title, url: `https://www.georgiagapp.com/blog/${post.slug}` },
        ]}
      />

      <article className="pt-12 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>

          {/* Post header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600">
              {post.description}
            </p>
          </header>

          {/* Post body */}
          <div className="max-w-none">
            {ContentComponent ? <ContentComponent /> : (
              <p className="text-gray-500 italic">Full article content coming soon.</p>
            )}
          </div>

          {/* Bottom CTA */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to blog
              </Link>
              <Link
                href="/directory"
                className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Find a provider
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  )
}

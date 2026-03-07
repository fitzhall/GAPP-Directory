import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getProviderSession } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getProviderSession()

  if (!session) {
    redirect('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-lg font-bold text-gray-900">
              Provider Dashboard
            </Link>
            <p className="text-sm text-gray-500">{session.provider.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/provider/${session.provider.slug}`}
              className="text-sm text-primary hover:underline"
            >
              View My Listing
            </Link>
            <form action="/dashboard/auth/signout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}

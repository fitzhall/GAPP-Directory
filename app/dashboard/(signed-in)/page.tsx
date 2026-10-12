import { getProviderSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { DashboardCharts } from '@/components/DashboardCharts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getDashboardData(providerId: string) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const since = thirtyDaysAgo.toISOString()

  const { data: events } = await supabase
    .from('provider_events')
    .select('event_type, created_at')
    .eq('provider_id', providerId)
    .gte('created_at', since)

  const counts = { view: 0, click_phone: 0, click_website: 0, click_callback: 0, impression: 0 }
  const dailyViews: Record<string, number> = {}

  for (const event of events || []) {
    const type = event.event_type as keyof typeof counts
    if (type in counts) counts[type]++

    if (type === 'view') {
      const day = new Date(event.created_at).toISOString().split('T')[0]
      dailyViews[day] = (dailyViews[day] || 0) + 1
    }
  }

  const chartData = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    chartData.push({
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: dailyViews[key] || 0,
    })
  }

  const { data: callbacks } = await supabase
    .from('callback_requests')
    .select('id, parent_name, county, urgency, service_needed, created_at')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
    .limit(10)

  const { count: callbackCount } = await supabase
    .from('callback_requests')
    .select('id', { count: 'exact', head: true })
    .eq('provider_id', providerId)
    .gte('created_at', since)

  return {
    views: counts.view,
    clicks: counts.click_phone + counts.click_website,
    impressions: counts.impression,
    callbacks: callbackCount || 0,
    chartData,
    recentCallbacks: (callbacks || []).map(cb => ({
      id: cb.id,
      parentName: cb.parent_name,
      county: cb.county,
      urgency: cb.urgency,
      serviceNeeded: cb.service_needed,
      createdAt: cb.created_at,
    })),
  }
}

export default async function DashboardPage() {
  const session = await getProviderSession()
  if (!session) redirect('/dashboard/login')

  const data = await getDashboardData(session.provider.id)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Last 30 Days</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Profile Views" value={data.views} />
        <StatCard label="Phone & Web Clicks" value={data.clicks} />
        <StatCard label="Callback Requests" value={data.callbacks} />
        <StatCard label="Search Impressions" value={data.impressions} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Profile Views</h2>
        <DashboardCharts data={data.chartData} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Callback Requests</h2>
        {data.recentCallbacks.length === 0 ? (
          <p className="text-gray-500">No callback requests yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recentCallbacks.map((cb) => (
              <div key={cb.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{cb.parentName}</p>
                  <p className="text-sm text-gray-500">
                    {cb.county} County &middot; {cb.serviceNeeded} &middot;{' '}
                    <span className={cb.urgency === 'asap' ? 'text-red-600 font-medium' : ''}>
                      {cb.urgency === 'asap' ? 'ASAP' : cb.urgency === 'this_month' ? 'This month' : 'Researching'}
                    </span>
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(cb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  label: string
  views: number
}

export function DashboardCharts({ data }: { data: ChartData[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="views" fill="#FF8A80" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

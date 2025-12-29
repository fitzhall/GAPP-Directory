import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { providerId, issueType, notes, reportedBy } = body

    if (!providerId || !issueType) {
      return NextResponse.json(
        { error: 'Provider ID and issue type are required' },
        { status: 400 }
      )
    }

    const validIssueTypes = ['no_answer', 'not_taking_cases', 'wrong_number', 'other']
    if (!validIssueTypes.includes(issueType)) {
      return NextResponse.json(
        { error: 'Invalid issue type' },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    // Insert the issue report
    const { data, error } = await supabase
      .from('provider_issues')
      .insert({
        provider_id: providerId,
        issue_type: issueType,
        notes: notes || null,
        reported_by: reportedBy || 'case_manager',
      })
      .select()
      .single()

    if (error) {
      console.error('Error reporting issue:', error)
      return NextResponse.json(
        { error: 'Failed to report issue' },
        { status: 500 }
      )
    }

    // If there are multiple reports of the same type, maybe flag the provider
    const { count } = await supabase
      .from('provider_issues')
      .select('*', { count: 'exact', head: true })
      .eq('provider_id', providerId)
      .is('resolved_at', null)

    return NextResponse.json({
      success: true,
      issueId: data.id,
      totalUnresolvedIssues: count,
    })
  } catch (error) {
    console.error('Report issue error:', error)
    return NextResponse.json(
      { error: 'Failed to report issue' },
      { status: 500 }
    )
  }
}

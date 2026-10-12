// Browser-side helper for the admin pages: every admin read and write goes
// through /api/admin/data, which checks the admin session and runs the query
// on the server. Returns the same { data, error } shape supabase-js does.
export async function adminData<T = any>(
  op: string,
  args: Record<string, unknown> = {}
): Promise<{ data: T | null; error: { message: string } | null }> {
  try {
    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ op, args }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.error) {
      return { data: null, error: { message: json.error || `Request failed (${res.status})` } }
    }
    return { data: (json.data ?? null) as T | null, error: null }
  } catch (err) {
    return { data: null, error: { message: err instanceof Error ? err.message : 'Network error' } }
  }
}

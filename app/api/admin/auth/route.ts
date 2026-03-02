import { NextRequest, NextResponse } from 'next/server'

interface AdminUser {
  username: string
  password: string
  role: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Try multi-user auth first (ADMIN_USERS env var)
    const adminUsersJson = process.env.ADMIN_USERS
    if (adminUsersJson) {
      let adminUsers: AdminUser[]
      try {
        adminUsers = JSON.parse(adminUsersJson)
      } catch {
        console.error('ADMIN_USERS env var is not valid JSON')
        return NextResponse.json({ error: 'Admin access misconfigured' }, { status: 500 })
      }

      if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 400 })
      }

      const user = adminUsers.find(
        (u) => u.username === username && u.password === password
      )

      if (user) {
        return NextResponse.json({ success: true, username: user.username, role: user.role })
      }

      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Fallback: single password auth (ADMIN_PASSWORD env var)
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      console.error('Neither ADMIN_USERS nor ADMIN_PASSWORD environment variable is set')
      return NextResponse.json({ error: 'Admin access not configured' }, { status: 500 })
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true, username: 'admin' })
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Check if admin is enabled
  const adminEnabled = process.env.ADMIN_ENABLED === 'true'
  const adminKey = process.env.ADMIN_ACCESS_KEY

  if (!adminEnabled || !adminKey) {
    return NextResponse.json(
      { error: 'Admin access disabled' },
      { status: 403 },
    )
  }

  return NextResponse.json({ enabled: true })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accessKey } = body

    const adminEnabled = process.env.ADMIN_ENABLED === 'true'
    const adminKey = process.env.ADMIN_ACCESS_KEY

    if (!adminEnabled || !adminKey) {
      return NextResponse.json(
        { error: 'Admin access disabled' },
        { status: 403 },
      )
    }

    if (accessKey === adminKey) {
      return NextResponse.json({ authorized: true })
    } else {
      return NextResponse.json({ error: 'Invalid access key' }, { status: 401 })
    }
  } catch (error) {
    console.error('Access check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

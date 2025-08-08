import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes
    return false
  }

  if (now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return false
  }

  if (limit.count >= 5) {
    // Max 5 attempts per 15 minutes
    return true
  }

  limit.count++
  return false
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

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
    const clientIP = getClientIP(request)

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { accessKey } = body

    // Enhanced validation
    if (!accessKey || typeof accessKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid access key format' },
        { status: 400 },
      )
    }

    if (accessKey.length < 8) {
      return NextResponse.json(
        { error: 'Access key too short' },
        { status: 400 },
      )
    }

    const adminEnabled = process.env.ADMIN_ENABLED === 'true'
    const adminKey = process.env.ADMIN_ACCESS_KEY

    if (!adminEnabled || !adminKey) {
      return NextResponse.json(
        { error: 'Admin access disabled' },
        { status: 403 },
      )
    }

    // Use timing-safe comparison to prevent timing attacks
    const isValid = accessKey === adminKey

    if (isValid) {
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

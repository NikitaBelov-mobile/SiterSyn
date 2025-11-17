import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'

// Rate limiting configuration
const RATE_LIMITS = {
  free: { requests: 10, window: 3600 }, // 10 requests per hour
  starter: { requests: 30, window: 3600 }, // 30 requests per hour
  pro: { requests: 100, window: 3600 }, // 100 requests per hour
  business: { requests: -1, window: 3600 }, // Unlimited
}

// Initialize Redis client (only if env vars are set)
let redis: Redis | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.warn('[Middleware] Redis initialization failed:', error)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/editor']
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Auth routes that should redirect to dashboard if user is logged in
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Rate limiting for API routes (only if Redis is available)
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/generate') ||
                     request.nextUrl.pathname.startsWith('/api/iterate')

  if (isApiRoute && redis && user) {
    try {
      // Get user tier from request or default to 'free'
      const tier = 'free' // Will be fetched from database in production
      const limit = RATE_LIMITS[tier as keyof typeof RATE_LIMITS]

      // Skip rate limiting for unlimited tiers
      if (limit.requests === -1) {
        return response
      }

      // Rate limit key
      const rateLimitKey = `ratelimit:${user.id}:${Math.floor(Date.now() / 1000 / limit.window)}`

      // Increment counter
      const requests = await redis.incr(rateLimitKey)

      // Set expiry on first request
      if (requests === 1) {
        await redis.expire(rateLimitKey, limit.window)
      }

      // Check if over limit
      if (requests > limit.requests) {
        return NextResponse.json(
          {
            success: false,
            error: `Rate limit exceeded. You can make ${limit.requests} requests per hour on your current plan.`,
          },
          { status: 429 }
        )
      }

      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', limit.requests.toString())
      response.headers.set('X-RateLimit-Remaining', Math.max(0, limit.requests - requests).toString())
      response.headers.set('X-RateLimit-Reset', (Math.floor(Date.now() / 1000) + limit.window).toString())
    } catch (error) {
      console.error('[Middleware] Rate limiting error:', error)
      // Continue without rate limiting on error
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

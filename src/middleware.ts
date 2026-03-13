import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Initialize a simple in-memory rate limiter for demo purposes.
// In true production matching the architecture, this would use @upstash/redis
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max 100 requests per 15 minutes per IP

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply Rate Limiting to sensitive routes specifically
  if (pathname.startsWith('/api/auth/register') || pathname.startsWith('/api/auth/callback/credentials')) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || 'unknown';
    
    if (ip !== 'unknown') {
      const currentTime = Date.now();
      const record = rateLimitMap.get(ip);
      
      if (!record || currentTime > record.resetTime) {
         rateLimitMap.set(ip, { count: 1, resetTime: currentTime + RATE_LIMIT_WINDOW });
      } else {
         if (record.count >= MAX_REQUESTS) {
            return new NextResponse('Too Many Requests', { status: 429 });
         }
         record.count += 1;
      }
    }
  }

  // Admin Route Protection
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_dev" });
    
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Custom NextAuth typing exposes this
    if ((token as any).role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // Security Headers
  const response = NextResponse.next();
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ]
};

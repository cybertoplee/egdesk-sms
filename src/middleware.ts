import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'egdesk-super-secret-key');

// 로그인 없이 접근 가능한 공개 경로 설정
const publicPaths = ['/login', '/api/auth/login', '/api/setup', '/api/setup-admin', '/favicon.ico'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Check if public path
  if (publicPaths.some(p => pathname.startsWith(p)) || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // 2. Check for auth token
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    // API 라우트인 경우 401 반환
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    // 일반 페이지인 경우 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // 3. Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // 4. Role-based Access Control
    if (pathname.startsWith('/operators') && payload.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', req.url)); // 부운영자는 운영자 관리 페이지 접근 불가
    }

    // 5. Pass user info to headers so server components can read it if needed
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.id as string);
    requestHeaders.set('x-user-username', payload.username as string);
    requestHeaders.set('x-user-name', encodeURIComponent(payload.name as string));
    requestHeaders.set('x-user-role', payload.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Invalid Token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('auth_token'); // clear invalid token
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

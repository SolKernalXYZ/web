import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const host = hostname.split(':')[0];

  if (host === 'docs.solkernal.xyz') {
    const { pathname, search } = request.nextUrl;
    const dest = pathname === '/' ? '/docs' : `/docs${pathname}`;
    return NextResponse.redirect(new URL(dest + search, 'https://solkernal.xyz'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)'],
};

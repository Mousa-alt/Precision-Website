import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_TOKEN = 'precision-admin-session';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /dashboard sub-routes (admin panel), but NOT /dashboard itself (login page)
    if (pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
        const sessionCookie = request.cookies.get(SESSION_TOKEN);

        // No session cookie → redirect to login
        if (!sessionCookie?.value) {
            const loginUrl = new URL('/dashboard', request.url);
            loginUrl.searchParams.set('auth', 'required');
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};

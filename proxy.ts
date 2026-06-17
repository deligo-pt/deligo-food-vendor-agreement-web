import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './utils/verifyJwt';

const protectedRoutes = [
    '/agreement-form',
    '/verify-otp',
    '/agreement',
];

const authRoutes = ['/login'];

export async function proxy(request: NextRequest) {
    const { nextUrl } = request;
    const { pathname } = nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    let isAuthenticated = false;

    // VERIFY TOKEN
    if (accessToken) {
        try {
            const decoded = await verifyJWT(accessToken);

            if (decoded?.success) {
                isAuthenticated = true;
            }
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    /**
     * PROTECTED ROUTES
     * Must have a valid token
     */
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);

        const response = NextResponse.redirect(loginUrl);

        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');

        return response;
    }

    /**
     * AUTH ROUTES
     * Redirect already logged-in users
     */
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(
            new URL('/agreement-form', request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
    ],
};
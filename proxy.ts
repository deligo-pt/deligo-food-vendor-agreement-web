import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that require a valid accessToken
const protectedRoutes = [
    '/agreement-form',
    '/verify-otp',
    '/agreement',
];

// Define the auth routes (where users go to log in)
const authRoutes = ['/login'];

export function proxy(request: NextRequest) {
    const { nextUrl, cookies } = request;

    // 1. Retrieve the accessToken from cookies
    const token = cookies.get('accessToken')?.value;

    const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
    );

    // 2. If trying to access a protected route without a token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // Store the original destination to redirect back after login
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. If the user is already logged in and tries to access login/register, 
    // redirect them to the agreement form (or dashboard)
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/agreement-form', request.url));
    }

    return NextResponse.next();
}

// 4. Matcher configuration to optimize middleware performance
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
    ],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './utils/verifyJwt';
import { USER_ROLE } from './consts/user.const';

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

    let isAdmin = false;

    if (accessToken) {
        try {
            const decoded = await verifyJWT(accessToken);
            const role = decoded?.data?.role;

            if (
                decoded?.success &&
                (role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN)
            ) {
                isAdmin = true;
            }
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

    /**
     * PROTECT ROUTES
     * Only ADMIN / SUPER_ADMIN can access
     */
    if (isProtectedRoute && !isAdmin) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);

        const response = NextResponse.redirect(loginUrl);

        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');

        return response;
    }

    /**
     * Prevent logged-in admins from seeing login page
     */
    if (isAuthRoute && isAdmin) {
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
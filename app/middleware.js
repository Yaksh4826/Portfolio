import { NextResponse } from 'next/server';


export function middleware(request) {
    // 1. Identify if the request is trying to hit an admin route
    if (request.nextUrl.pathname.startsWith('/api/admin')) {

        // 2. Exclude the login/verify route itself (otherwise you can't log in!)
        if (request.nextUrl.pathname === '/api/admin/verify') {
            return NextResponse.next();
        }

        // 3. Check for the admin cookie
        const session = request.cookies.get('admin_session');

        if (!session || session.value !== 'active') {
            // 4. If no cookie, block the request immediately
            return NextResponse.json(
                { message: 'Unauthorized: You are not Yaksh.' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

// 5. Optimization: Only run middleware on API routes to save performance
export const config = {
    matcher: '/api/admin/:path*',
}; 
import { PagesUrls } from '@/enums';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const protectedRoutes = [PagesUrls.PROFILE, PagesUrls.REVIEW_CREATE, PagesUrls.REAL_ESTATE_CREATE];

    const protectedDynamicRoutes = [
        PagesUrls.EDIT_REVIEW,
        PagesUrls.REAL_ESTATE_CREATE_REVIEW.replace(':id', '[^/]+'),
        PagesUrls.REAL_ESTATE_UPDATE_REVIEW.replace(':id', '[^/]+').replace(':reviewId', '[^/]+'),
        PagesUrls.REAL_ESTATE_UPDATE.replace('[id]', '[^/]+'),
    ];

    const isProtectedRoute =
        protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) ||
        protectedDynamicRoutes.some(route => new RegExp(route).test(request.nextUrl.pathname));

    if (isProtectedRoute && !user) {
        const redirectUrl = new URL(PagesUrls.LOGIN, request.url);
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }
    const authRoutes = [PagesUrls.LOGIN, '/authentication'];
    if (user && authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL(PagesUrls.HOME, request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Coincidir con todas las rutas de request excepto aquellas que empiecen con:
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo favicon)
         * Siéntete libre de modificar este patrón para incluir más rutas.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

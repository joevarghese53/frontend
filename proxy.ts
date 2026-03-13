import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value
  const { pathname } = request.nextUrl

  // If logged in user tries to access login page
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Protect authenticated routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const { payload } = await jwtVerify(token, secret)

    // Admin route protection
    if (pathname.startsWith("/admin") && !payload.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/login"],
}

// "/customs/:path*"

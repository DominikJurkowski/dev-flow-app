export { auth as proxy } from "@/auth";

// import { NextRequest, NextResponse } from 'next/server';

// export function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   console.log(pathname);

//   if (pathname === '/api/_test') {
//     return NextResponse.rewrite(new URL('/api/test_', req.url));
//   }

//   return NextResponse.next();
// }

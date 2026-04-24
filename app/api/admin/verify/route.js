import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST (request){

    const password = await request.json()

    if(password == process.env.ADMIN_PASS){
        const cookieStore = await cookies();
      
      cookieStore.set('admin_session', 'active', {
        httpOnly: true, // Security: JS cannot touch this cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // Valid for 24 hours
        path: '/',
      });

      return NextResponse.json({ authenticated: true });
    }


    return NextResponse.json({ authenticated: false }, { status: 401 });



}
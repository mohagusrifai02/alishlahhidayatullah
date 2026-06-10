import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' }, { status: 200 });
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: 'lax',
  });
  return response;
}

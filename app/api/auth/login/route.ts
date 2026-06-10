import dbConnect from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { verifyPassword, signToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 });
    }

    const valid = verifyPassword(password, admin.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 });
    }

    const token = signToken({ id: admin._id?.toString(), email: admin.email, name: admin.name });
    const response = NextResponse.json({ success: true, data: { name: admin.name, email: admin.email } }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Server error' }, { status: 500 });
  }
}

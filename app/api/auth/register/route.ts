import connectDB from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { hashPassword, signToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Nama, email, dan password wajib diisi' }, { status: 400 });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json({ success: false, message: 'Admin dengan email tersebut sudah terdaftar' }, { status: 400 });
    }

    const admin = await Admin.create({
      name,
      email,
      password: hashPassword(password),
    });

    const token = signToken({ id: admin._id?.toString(), email: admin.email, name: admin.name });
    const response = NextResponse.json({ success: true, data: { name: admin.name, email: admin.email } }, { status: 201 });
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
